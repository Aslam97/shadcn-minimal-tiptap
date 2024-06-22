import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import SectionFour from './sectoin-4'
import SectionThree from './section-3'
import SectionOne from './section-1'
import SectionTwo from './section-2'

interface TiptapProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  outputValue?: 'html' | 'json' | 'text'
  disabled?: boolean
  contentClass?: string
  onValueChange: React.Dispatch<React.SetStateAction<string>>
}

function getOutput(editor: TiptapEditor, format: TiptapProps['outputValue']) {
  if (format === 'json') {
    return JSON.stringify(editor.getJSON())
  }

  if (format === 'text') {
    return editor.getHTML()
  }

  return editor.getHTML()
}

const MinimalTiptapEditor = ({
  value,
  outputValue = 'html',
  disabled,
  contentClass,
  onValueChange,
  className,
  ...props
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false
      }),
      Image,
      Link.configure({
        openOnClick: false
      })
    ],
    editorProps: {
      attributes: {
        class:
          'prose mx-auto focus:outline-none max-w-none prose-stone dark:prose-invert'
      }
    },
    onUpdate: (props) => {
      onValueChange(getOutput(props.editor, outputValue))
    },
    content: value,
    editable: !disabled
  })

  return (
    <div
      className={cn(
        'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
        className
      )}
      {...props}
    >
      {editor && <Toolbar editor={editor} />}
      <div className="h-full" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} className={cn('p-5', contentClass)} />
      </div>
    </div>
  )
}

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor'

const Toolbar = ({ editor }: { editor: TiptapEditor }) => {
  return (
    <div className="p-2 border-b border-border">
      <div className="flex w-full items-center flex-wrap">
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
}

export { MinimalTiptapEditor }
