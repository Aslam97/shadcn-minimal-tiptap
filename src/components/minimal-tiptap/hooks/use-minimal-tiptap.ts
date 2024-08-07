import * as React from 'react'
import { StarterKit } from '@tiptap/starter-kit'
import { Content, useEditor, UseEditorOptions } from '@tiptap/react'
import { Editor } from '@tiptap/core'
import { Typography } from '@tiptap/extension-typography'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'

import { Link, Image, HorizontalRule, CodeBlockLowlight, Selection, TaskList, TaskItem, Color } from '../extensions'
import { cn } from '@/lib/utils'
import { getOutput } from '../utils'
import { useThrottle } from '../hooks/use-throttle'

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content
  initialContent?: Content
  output?: 'html' | 'json' | 'text'
  placeholder?: string
  editorClassName?: string
  throttleDelay?: number
  onUpdate?: (content: Content) => void
  onBlur?: (content: Content) => void
}

const createExtensions = (placeholder: string) => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false,
    paragraph: { HTMLAttributes: { class: 'text-node' } },
    heading: { HTMLAttributes: { class: 'heading-node' } },
    blockquote: { HTMLAttributes: { class: 'block-node' } },
    bulletList: { HTMLAttributes: { class: 'list-node' } },
    orderedList: { HTMLAttributes: { class: 'list-node' } },
    code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
    dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' }
  }),
  Link,
  Image,
  TextStyle,
  Color,
  Selection,
  Typography,
  TaskList,
  TaskItem,
  HorizontalRule,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder })
]

export const useMinimalTiptapEditor = ({
  value,
  initialContent,
  output = 'html',
  placeholder = '',
  editorClassName,
  throttleDelay = 1000,
  onUpdate,
  onBlur,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const [content, setContent] = React.useState<Content>(value!)
  const throttledContent = useThrottle(content, throttleDelay)
  const [lastThrottledContent, setLastThrottledContent] = React.useState(throttledContent)

  const handleUpdate = React.useCallback((editor: Editor) => setContent(getOutput(editor, output)), [output])

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value)
      }
    },
    [value]
  )

  const handleBlur = React.useCallback((editor: Editor) => onBlur?.(getOutput(editor, output)), [output, onBlur])

  const editor = useEditor({
    extensions: createExtensions(placeholder!),
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: cn('focus:outline-none', editorClassName)
      }
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props
  })

  React.useEffect(() => {
    if (lastThrottledContent !== throttledContent) {
      setLastThrottledContent(throttledContent)
      onUpdate?.(throttledContent!)
    }
  }, [throttledContent, lastThrottledContent, onUpdate])

  React.useEffect(() => {
    if (initialContent) {
      setTimeout(() => editor?.commands.setContent(initialContent))
    }
  }, [editor, initialContent])

  return editor
}

export default useMinimalTiptapEditor
