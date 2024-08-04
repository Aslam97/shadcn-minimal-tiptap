import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { SectionOne } from './components/section/one'
import { SectionTwo } from './components/section/two'
import { SectionThree } from './components/section/three'
import { SectionFour } from './components/section/four'
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu'
import { ImageBubbleMenu } from './components/bubble-menu/image-bubble-menu'
import { Link } from './extensions/link'
import { getOutput } from './utils'
import { Image } from './extensions/image'
import { HorizontalRule } from './extensions/horizontal-rule'

export interface MinimalTiptapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string | null
  outputValue?: 'html' | 'json' | 'text'
  disabled?: boolean
  contentClass?: string
  onValueChange: (value: string) => void
}

const useMinimalTiptapEditor = (props: MinimalTiptapProps) => {
  const { value, outputValue = 'html', disabled, onValueChange } = props

  return useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false
      }),
      Link,
      Image,
      HorizontalRule
    ],
    editorProps: {
      attributes: {
        class: 'prose mx-auto focus:outline-none max-w-none prose-stone dark:prose-invert'
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
    </div>
  </div>
)

export const MinimalTiptapEditor = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, outputValue, disabled, contentClass, onValueChange, className, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({ value, outputValue, disabled, onValueChange })

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
          <EditorContent editor={editor} className={cn('p-5', contentClass)} />
        </div>
      </div>
    )
  }
)

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor'

export default MinimalTiptapEditor
