import type { ImageOptions } from '@tiptap/extension-image'
import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageViewBlock } from './components/image-view-block'
import { filterFiles, sanitizeUrl, type FileError, type FileValidationOptions } from '../../utils'

/**
 * Props for the downloadImage command
 */
interface DownloadImageCommandProps {
  src: string
  alt?: string
}

/**
 * Props for image-related actions
 */
interface ImageActionProps {
  src: string
  alt?: string
  action: 'download' | 'copyImage' | 'copyLink'
}

/**
 * Extended options for the custom image extension
 */
interface CustomImageOptions extends ImageOptions, Omit<FileValidationOptions, 'allowBase64'> {
  /**
   * Callback function called when an image action is successful
   * @param props - The props related to the action
   */
  onActionSuccess?: (props: ImageActionProps) => void

  /**
   * Callback function called when an image action fails
   * @param error - The error that occurred
   * @param props - The props related to the action
   */
  onActionError?: (error: Error, props: ImageActionProps) => void

  /**
   * Custom function to handle image download
   * @param props - The props passed to the downloadImage command
   */
  customDownloadImage?: (props: ImageActionProps, options: CustomImageOptions) => void

  /**
   * Custom function to handle image copying
   * @param props - The props passed to the copyImage command
   */
  customCopyImage?: (props: ImageActionProps, options: CustomImageOptions) => void

  /**
   * Custom function to handle link copying
   * @param props - The props passed to the copyLink command
   */
  customCopyLink?: (props: ImageActionProps, options: CustomImageOptions) => void

  /**
   * Callback function called when file validation fails
   * @param errors - The errors that occurred
   */
  onValidationError?: (errors: FileError[]) => void
}

/**
 * Extend the Tiptap commands interface with custom image commands
 */
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setImages: {
      /**
       * Set multiple images at once
       * @param images - The images to set
       */
      setImages: (attrs: { src: string | File; alt?: string; title?: string }[]) => ReturnType
    }

    downloadImage: {
      /**
       * Download an image
       */
      downloadImage: (attrs: DownloadImageCommandProps) => ReturnType
    }
    copyImage: {
      /**
       * Copy an image
       */
      copyImage: (attrs: DownloadImageCommandProps) => ReturnType
    }
    copyLink: {
      /**
       * Copy an image link
       */
      copyLink: (attrs: DownloadImageCommandProps) => ReturnType
    }
  }
}

/**
 * Handle errors for image operations
 */
const handleError = (
  error: unknown,
  props: ImageActionProps,
  errorHandler?: (error: Error, props: ImageActionProps) => void
) => {
  const typedError = error instanceof Error ? error : new Error('Unknown error')
  errorHandler?.(typedError, props)
}

/**
 * Handle data URL for image operations
 */
const handleDataUrl = (src: string): { blob: Blob; extension: string } => {
  const [header, base64Data] = src.split(',')
  const mimeType = header.split(':')[1].split(';')[0]
  const extension = mimeType.split('/')[1]
  const byteCharacters = atob(base64Data)
  const byteArray = new Uint8Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i)
  }
  const blob = new Blob([byteArray], { type: mimeType })
  return { blob, extension }
}

/**
 * Handle image URL for image operations
 */
const handleImageUrl = async (src: string): Promise<{ blob: Blob; extension: string }> => {
  const response = await fetch(src)
  if (!response.ok) throw new Error('Failed to fetch image')
  const blob = await response.blob()
  const extension = blob.type.split(/\/|\+/)[1]
  return { blob, extension }
}

/**
 * Fetch image blob from either data URL or image URL
 */
const fetchImageBlob = async (src: string): Promise<{ blob: Blob; extension: string }> => {
  if (src.startsWith('data:')) {
    return handleDataUrl(src)
  } else {
    return handleImageUrl(src)
  }
}

/**
 * Save image to user's device
 */
const saveImage = async (blob: Blob, name: string, extension: string): Promise<void> => {
  const imageURL = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = imageURL
  link.download = `${name}.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(imageURL)
}

/**
 * Default implementation for downloading an image
 */
const defaultDownloadImage = async (props: ImageActionProps, options: CustomImageOptions): Promise<void> => {
  const { src, alt } = props
  const potentialName = alt || 'image'

  try {
    const { blob, extension } = await fetchImageBlob(src)
    await saveImage(blob, potentialName, extension)
    options.onActionSuccess?.({ ...props, action: 'download' })
  } catch (error) {
    handleError(error, { ...props, action: 'download' }, options.onActionError)
  }
}

/**
 * Default implementation for copying an image
 */
const defaultCopyImage = async (props: ImageActionProps, options: CustomImageOptions) => {
  const { src } = props
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    options.onActionSuccess?.({ ...props, action: 'copyImage' })
  } catch (error) {
    handleError(error, { ...props, action: 'copyImage' }, options.onActionError)
  }
}

/**
 * Default implementation for copying an image link
 */
const defaultCopyLink = async (props: ImageActionProps, options: CustomImageOptions) => {
  const { src } = props
  try {
    await navigator.clipboard.writeText(src)
    options.onActionSuccess?.({ ...props, action: 'copyLink' })
  } catch (error) {
    handleError(error, { ...props, action: 'copyLink' }, options.onActionError)
  }
}

/**
 * Custom Image extension that extends Tiptap's Image extension
 */
export const Image = TiptapImage.extend<CustomImageOptions>({
  atom: true,

  addOptions() {
    return {
      ...this.parent?.(),
      allowedMimeTypes: [],
      maxFileSize: 0
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: undefined
      },
      height: {
        default: undefined
      }
    }
  },

  addCommands() {
    return {
      setImages:
        attrs =>
        ({ commands }) => {
          const [validImages, errors] = filterFiles(attrs, {
            allowedMimeTypes: this.options.allowedMimeTypes,
            maxFileSize: this.options.maxFileSize,
            allowBase64: this.options.allowBase64
          })

          if (errors.length > 0 && this.options.onValidationError) {
            this.options.onValidationError(errors)
          }

          if (validImages.length > 0) {
            return commands.insertContent(
              validImages.map(image => {
                return {
                  type: 'image',
                  attrs: {
                    src:
                      image.src instanceof File
                        ? sanitizeUrl(URL.createObjectURL(image.src), {
                            allowBase64: this.options.allowBase64
                          })
                        : image.src,
                    alt: image.alt,
                    title: image.title
                  }
                }
              })
            )
          }

          return false
        },
      downloadImage: attrs => () => {
        const downloadFunc = this.options.customDownloadImage || defaultDownloadImage
        void downloadFunc({ ...attrs, action: 'download' }, this.options)
        return true
      },
      copyImage: attrs => () => {
        const copyImageFunc = this.options.customCopyImage || defaultCopyImage
        void copyImageFunc({ ...attrs, action: 'copyImage' }, this.options)
        return true
      },
      copyLink: attrs => () => {
        const copyLinkFunc = this.options.customCopyLink || defaultCopyLink
        void copyLinkFunc({ ...attrs, action: 'copyLink' }, this.options)
        return true
      }
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageViewBlock, {
      className: 'block-node'
    })
  }
})
