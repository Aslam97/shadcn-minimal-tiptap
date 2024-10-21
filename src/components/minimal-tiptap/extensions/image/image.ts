import type { ImageOptions } from '@tiptap/extension-image'
import { Image as TiptapImage } from '@tiptap/extension-image'
import type { Editor } from '@tiptap/react'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageViewBlock } from './components/image-view-block'
import { filterFiles, type FileError, type FileValidationOptions } from '../../utils'

type ImageAction = 'download' | 'copyImage' | 'copyLink'

interface DownloadImageCommandProps {
  src: string
  alt?: string
}

interface ImageActionProps extends DownloadImageCommandProps {
  action: ImageAction
}

interface CustomImageOptions extends ImageOptions, Omit<FileValidationOptions, 'allowBase64'> {
  uploadFn?: (file: File, editor: Editor) => Promise<string>
  onActionSuccess?: (props: ImageActionProps) => void
  onActionError?: (error: Error, props: ImageActionProps) => void
  customDownloadImage?: (props: ImageActionProps, options: CustomImageOptions) => Promise<void>
  customCopyImage?: (props: ImageActionProps, options: CustomImageOptions) => Promise<void>
  customCopyLink?: (props: ImageActionProps, options: CustomImageOptions) => Promise<void>
  onValidationError?: (errors: FileError[]) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setImages: {
      setImages: (attrs: { src: string | File; alt?: string; title?: string }[]) => ReturnType
    }
    downloadImage: {
      downloadImage: (attrs: DownloadImageCommandProps) => ReturnType
    }
    copyImage: {
      copyImage: (attrs: DownloadImageCommandProps) => ReturnType
    }
    copyLink: {
      copyLink: (attrs: DownloadImageCommandProps) => ReturnType
    }
  }
}

const handleError = (
  error: unknown,
  props: ImageActionProps,
  errorHandler?: (error: Error, props: ImageActionProps) => void
): void => {
  const typedError = error instanceof Error ? error : new Error('Unknown error')
  errorHandler?.(typedError, props)
}

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

const handleImageUrl = async (src: string): Promise<{ blob: Blob; extension: string }> => {
  const response = await fetch(src)
  if (!response.ok) throw new Error('Failed to fetch image')
  const blob = await response.blob()
  const extension = blob.type.split(/\/|\+/)[1]
  return { blob, extension }
}

const fetchImageBlob = async (src: string): Promise<{ blob: Blob; extension: string }> => {
  return src.startsWith('data:') ? handleDataUrl(src) : handleImageUrl(src)
}

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

const defaultCopyImage = async (props: ImageActionProps, options: CustomImageOptions): Promise<void> => {
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

const defaultCopyLink = async (props: ImageActionProps, options: CustomImageOptions): Promise<void> => {
  const { src } = props
  try {
    await navigator.clipboard.writeText(src)
    options.onActionSuccess?.({ ...props, action: 'copyLink' })
  } catch (error) {
    handleError(error, { ...props, action: 'copyLink' }, options.onActionError)
  }
}

export const Image = TiptapImage.extend<CustomImageOptions>({
  atom: true,

  addOptions() {
    return {
      ...this.parent?.(),
      allowedMimeTypes: [],
      maxFileSize: 0,
      uploadFn: undefined
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
      },
      fileName: {
        default: undefined
      },
      fileType: {
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
                if (image.src instanceof File) {
                  const blobUrl = URL.createObjectURL(image.src)
                  return {
                    type: this.type.name,
                    attrs: {
                      src: blobUrl,
                      alt: image.alt,
                      title: image.title,
                      fileName: image.src.name,
                      fileType: image.src.type
                    }
                  }
                } else {
                  return {
                    type: this.type.name,
                    attrs: {
                      src: image.src,
                      alt: image.alt,
                      title: image.title,
                      fileName: null,
                      fileType: null
                    }
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
