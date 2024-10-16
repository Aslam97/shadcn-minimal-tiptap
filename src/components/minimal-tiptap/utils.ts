import type { Editor } from '@tiptap/core'
import type { MinimalTiptapProps } from './minimal-tiptap'

let isMac: boolean | undefined

interface Navigator {
  userAgentData?: {
    brands: { brand: string; version: string }[]
    mobile: boolean
    platform: string
    getHighEntropyValues: (hints: string[]) => Promise<{
      platform: string
      platformVersion: string
      uaFullVersion: string
    }>
  }
}

/**
 * Determines the platform of the current device.
 * @returns {string} The platform string.
 */
function getPlatform(): string {
  const nav = navigator as Navigator

  if (nav.userAgentData) {
    if (nav.userAgentData.platform) {
      return nav.userAgentData.platform
    }

    nav.userAgentData.getHighEntropyValues(['platform']).then(highEntropyValues => {
      if (highEntropyValues.platform) {
        return highEntropyValues.platform
      }
    })
  }

  if (typeof navigator.platform === 'string') {
    return navigator.platform
  }

  return ''
}

/**
 * Checks if the current operating system is macOS.
 * @returns {boolean} True if macOS, false otherwise.
 */
export function isMacOS() {
  if (isMac === undefined) {
    isMac = getPlatform().toLowerCase().includes('mac')
  }

  return isMac
}

interface ShortcutKeyResult {
  symbol: string
  readable: string
}

/**
 * Gets the shortcut key symbol and readable name for a given key.
 * @param {string} key - The key to get the shortcut for.
 * @returns {ShortcutKeyResult} An object containing the symbol and readable name of the key.
 */
export function getShortcutKey(key: string): ShortcutKeyResult {
  const lowercaseKey = key.toLowerCase()
  if (lowercaseKey === 'mod') {
    return isMacOS() ? { symbol: '⌘', readable: 'Command' } : { symbol: 'Ctrl', readable: 'Control' }
  } else if (lowercaseKey === 'alt') {
    return isMacOS() ? { symbol: '⌥', readable: 'Option' } : { symbol: 'Alt', readable: 'Alt' }
  } else if (lowercaseKey === 'shift') {
    return isMacOS() ? { symbol: '⇧', readable: 'Shift' } : { symbol: 'Shift', readable: 'Shift' }
  } else {
    return { symbol: key, readable: key }
  }
}

/**
 * Gets the shortcut key symbols and readable names for an array of keys.
 * @param {string[]} keys - An array of keys to get shortcuts for.
 * @returns {ShortcutKeyResult[]} An array of shortcut key results.
 */
export function getShortcutKeys(keys: string[]): ShortcutKeyResult[] {
  return keys.map(key => getShortcutKey(key))
}

/**
 * Gets the output of the editor in the specified format.
 * @param {Editor} editor - The editor instance.
 * @param {MinimalTiptapProps['output']} format - The desired output format.
 * @returns The editor's content in the specified format.
 */
export function getOutput(editor: Editor, format: MinimalTiptapProps['output']) {
  if (format === 'json') {
    return editor.getJSON()
  }

  if (format === 'html') {
    return editor.getText() ? editor.getHTML() : ''
  }

  return editor.getText()
}

/**
 * Checks if the given string is a valid URL.
 * @param {string} text - The text to check.
 * @param {Object} [options] - Additional options for URL validation.
 * @param {boolean} [options.requireHostname] - Whether to require a hostname in the URL.
 * @param {boolean} [options.allowBase64] - Whether to allow base64 data URLs.
 * @returns {boolean} True if the text is a valid URL, false otherwise.
 */
export function isUrl(text: string, options?: { requireHostname: boolean; allowBase64?: boolean }) {
  if (text.match(/\n/)) {
    return false
  }

  try {
    const url = new URL(text)
    const blockedProtocols = ['javascript:', 'file:', 'vbscript:']

    // Only block 'data:' protocol if allowBase64 is false
    if (!options?.allowBase64) {
      blockedProtocols.push('data:')
    }

    if (blockedProtocols.includes(url.protocol)) {
      return false
    }

    // Special handling for base64 data URLs
    if (options?.allowBase64 && url.protocol === 'data:') {
      return /^data:image\/[a-z]+;base64,/.test(text)
    }

    if (url.hostname) {
      return true
    }

    return (
      url.protocol !== '' &&
      (url.pathname.startsWith('//') || url.pathname.startsWith('http')) &&
      !options?.requireHostname
    )
  } catch (err) {
    return false
  }
}

/**
 * Sanitizes a URL for use in the editor, ensuring it's potentially valid and filtering out unsupported and malicious protocols.
 * @param {string | null | undefined} url - The URL to sanitize.
 * @param {Object} [options] - Additional options for URL sanitization.
 * @param {boolean} [options.allowBase64] - Whether to allow base64 data URLs.
 * @returns {string | undefined} The sanitized URL or undefined if the input is invalid.
 */
export function sanitizeUrl(url: string | null | undefined, options?: { allowBase64?: boolean }) {
  if (!url) {
    return undefined
  }

  if (options?.allowBase64 && url.startsWith('data:image')) {
    return isUrl(url, { requireHostname: false, allowBase64: true }) ? url : undefined
  }

  if (
    !isUrl(url, { requireHostname: false, allowBase64: options?.allowBase64 }) &&
    !url.startsWith('/') &&
    !url.startsWith('#') &&
    !url.startsWith('mailto:') &&
    !url.startsWith('sms:') &&
    !url.startsWith('fax:') &&
    !url.startsWith('tel:')
  ) {
    return `https://${url}`
  }
  return url
}

export type FileError = {
  file: File | string
  reason: 'type' | 'size' | 'invalidBase64' | 'base64NotAllowed'
}

export type FileValidationOptions = {
  allowedMimeTypes: string[]
  maxFileSize?: number // in bytes
  allowBase64: boolean
}

type FileInput = File | { src: string | File; alt?: string; title?: string }

export const filterFiles = <T extends FileInput>(files: T[], options: FileValidationOptions): [T[], FileError[]] => {
  const validFiles: T[] = []
  const errors: FileError[] = []

  files.forEach(file => {
    const actualFile = 'src' in file ? file.src : file

    if (actualFile instanceof File) {
      validateFileOrBase64(actualFile, options, file, validFiles, errors)
    } else if (typeof actualFile === 'string') {
      if (isBase64(actualFile)) {
        if (options.allowBase64) {
          validateFileOrBase64(actualFile, options, file, validFiles, errors)
        } else {
          errors.push({ file: actualFile, reason: 'base64NotAllowed' })
        }
      } else {
        validFiles.push(file)
      }
    }
  })

  return [validFiles, errors]
}

const validateFileOrBase64 = <T extends FileInput>(
  input: File | string,
  options: FileValidationOptions,
  originalFile: T,
  validFiles: T[],
  errors: FileError[]
) => {
  const { isValidType, isValidSize } = checkTypeAndSize(input, options)

  if (isValidType && isValidSize) {
    validFiles.push(originalFile)
  } else {
    if (!isValidType) errors.push({ file: input, reason: 'type' })
    if (!isValidSize) errors.push({ file: input, reason: 'size' })
  }
}

const checkTypeAndSize = (input: File | string, { allowedMimeTypes, maxFileSize }: FileValidationOptions) => {
  const mimeType = input instanceof File ? input.type : base64MimeType(input)
  const size = input instanceof File ? input.size : atob(input.split(',')[1]).length

  const isValidType =
    allowedMimeTypes.length === 0 ||
    allowedMimeTypes.includes(mimeType) ||
    allowedMimeTypes.includes(`${mimeType.split('/')[0]}/*`)

  const isValidSize = !maxFileSize || size <= maxFileSize

  return { isValidType, isValidSize }
}

const base64MimeType = (encoded: string): string => {
  const result = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  if (result && result.length) {
    return result[1]
  }
  return 'unknown'
}

const isBase64 = (str: string): boolean => {
  if (str.startsWith('data:')) {
    const matches = str.match(/^data:[^;]+;base64,(.+)$/)
    if (matches && matches[1]) {
      str = matches[1]
    } else {
      return false
    }
  }

  try {
    atob(str)
    return true
  } catch (e) {
    return false
  }
}
