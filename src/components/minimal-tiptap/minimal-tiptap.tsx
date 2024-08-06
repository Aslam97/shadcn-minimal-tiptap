import * as React from 'react'
import './styles/index.css'
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { SectionOne } from './components/section/one'
import { SectionTwo } from './components/section/two'
import { SectionThree } from './components/section/three'
import { SectionFour } from './components/section/four'
import { SectionFive } from './components/section/five'
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu'
import { ImageBubbleMenu } from './components/bubble-menu/image-bubble-menu'
import { Link } from './extensions/link'
import { getOutput } from './utils'
import { Image } from './extensions/image'
import { HorizontalRule } from './extensions/horizontal-rule'
import { CodeBlockLowlight } from './extensions/code-block-lowlight'
import { Typography } from '@tiptap/extension-typography'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Selection } from './extensions/selection'
import { TaskList } from './extensions/task-list'
import { TaskItem } from './extensions/task-item'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from './extensions/color'

export interface MinimalTiptapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string | null
  outputValue?: 'html' | 'json' | 'text'
  placeholder?: string
  disabled?: boolean
  contentClass?: string
  onValueChange: (value: string) => void
}

const useMinimalTiptapEditor = (props: MinimalTiptapProps) => {
  const { value, outputValue = 'html', placeholder, disabled, onValueChange } = props

  return useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
        paragraph: {
          HTMLAttributes: {
            class: 'text-node'
          }
        },
        heading: {
          HTMLAttributes: {
            class: 'heading-node'
          }
        },
        blockquote: {
          HTMLAttributes: {
            class: 'block-node'
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-node'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-node'
          }
        },
        code: {
          HTMLAttributes: {
            class: 'inline',
            spellCheck: 'false'
          }
        },
        dropcursor: {
          width: 2,
          class: 'ProseMirror-dropcursor border'
        }
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
      Placeholder.configure({
        placeholder: () => placeholder || ''
      })
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      onValueChange(getOutput(editor, outputValue))
    },
    content: value,
    editable: !disabled,
    onCreate: ({ editor }) => {
      if (value) {
        editor.chain().setContent(value).run()
      }
    }
  })
}

const Toolbar = ({ editor }: { editor: TiptapEditor }) => (
  <div className="border-b border-border p-2">
    <div className="flex w-full flex-wrap items-center">
      <SectionOne editor={editor} />
      <Separator orientation="vertical" className="mx-2 h-7" />
      <SectionTwo editor={editor} />
      <Separator orientation="vertical" className="mx-2 h-7" />
      <SectionThree editor={editor} />
      <Separator orientation="vertical" className="mx-2 h-7" />
      <SectionFour editor={editor} />
      <Separator orientation="vertical" className="mx-2 h-7" />
      <SectionFive editor={editor} />
    </div>
  </div>
)

export const MinimalTiptapEditor = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, outputValue, disabled, contentClass, onValueChange, placeholder, className, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({ value, outputValue, placeholder, disabled, onValueChange })

    return (
      <div
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
          className
        )}
        {...props}
        ref={ref}
      >
        {editor && (
          <>
            <LinkBubbleMenu editor={editor} />
            <ImageBubbleMenu editor={editor} />
            <Toolbar editor={editor} />
          </>
        )}
        <div className="h-full grow" onClick={() => editor?.chain().focus().run()}>
          <EditorContent editor={editor} className={cn('minimal-tiptap-editor p-5', contentClass)} />
        </div>
      </div>
    )
  }
)

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor'

export default MinimalTiptapEditor
