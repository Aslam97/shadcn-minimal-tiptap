import { type Editor, Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

type FileHandlePluginOptions = {
  key?: PluginKey
  editor: Editor
  allowedMimeTypes: string[]
  onPaste?: (editor: Editor, files: File[], pasteContent?: string) => void
  onDrop?: (editor: Editor, files: File[], pos: number) => void
}

const filterAllowedFiles = (files: File[], allowedMimeTypes: string[]) => {
  if (allowedMimeTypes.length === 0) return files
  return files.filter(
    item => allowedMimeTypes.includes(item.type) || allowedMimeTypes.includes(`${item.type.split('/')[0]}/*`)
  )
}

const FileHandlePlugin = (option: FileHandlePluginOptions) => {
  const { key, editor, onPaste, onDrop, allowedMimeTypes } = option

  return new Plugin({
    key: key || new PluginKey('fileHandler'),

    props: {
      handleDrop(view, event) {
        event.preventDefault()
        event.stopPropagation()

        const { dataTransfer } = event

        if (!onDrop || !dataTransfer?.files.length) {
          return
        }

        const pos = view.posAtCoords({
          left: event.clientX,
          top: event.clientY
        })

        const files = filterAllowedFiles(Array.from(dataTransfer.files), allowedMimeTypes)

        if (files.length !== 0) {
          onDrop(editor, files, pos?.pos ?? 0)
        }
      },

      handlePaste(_, event) {
        event.preventDefault()
        event.stopPropagation()

        const { clipboardData } = event

        if (!onPaste || !clipboardData?.files.length) {
          return
        }

        const files = filterAllowedFiles(Array.from(clipboardData.files), allowedMimeTypes)
        const html = clipboardData.getData('text/html')

        if (files.length !== 0) {
          onPaste(editor, files, html)
        }
      }
    }
  })
}

export const FileHandler = Extension.create<Omit<FileHandlePluginOptions, 'key' | 'editor'>>({
  name: 'fileHandler',

  addOptions: () => ({
    onPaste: () => {},
    onDrop: () => {},
    allowedMimeTypes: []
  }),

  addProseMirrorPlugins() {
    return [
      FileHandlePlugin({
        key: new PluginKey(this.name),
        editor: this.editor,
        allowedMimeTypes: this.options.allowedMimeTypes,
        onDrop: this.options.onDrop,
        onPaste: this.options.onPaste
      })
    ]
  }
})
