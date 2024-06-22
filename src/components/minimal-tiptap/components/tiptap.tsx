import type { Editor as TiptapEditor } from '@tiptap/core'
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import SectionFour from './sectoin-4'
import SectionThree from './section-3'
import SectionOne from './section-1'
import SectionTwo from './section-2'
import ImageView from './image-view'
import { LinkBubbleMenu } from './bubble-menu/link-bubble-menu'
import { Plugin, TextSelection } from '@tiptap/pm/state'
import { getMarkRange } from '@tiptap/core'

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
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageView)
        }
      }),
      Link.configure({
        openOnClick: false
      }).extend({
        inclusive: false,

        addProseMirrorPlugins() {
          return [
            new Plugin({
              // make the link
              props: {
                handleClick(view, pos) {
                  const { schema, doc, tr } = view.state
                  const range = getMarkRange(doc.resolve(pos), schema.marks.link)

                  if (!range) {
                    return
                  }

                  const { from, to } = range
                  const start = Math.min(from, to)
                  const end = Math.max(from, to)

                  if (pos < start || pos > end) {
                    return
                  }

                  const $start = doc.resolve(start)
                  const $end = doc.resolve(end)
                  const transaction = tr.setSelection(new TextSelection($start, $end))

                  view.dispatch(transaction)
                }
              }
            })
          ]
        }
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose mx-auto focus:outline-none max-w-none prose-stone dark:prose-invert'
      }
    },
    onUpdate: props => {
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
      {editor && (
        <>
          <LinkBubbleMenu editor={editor} />
          <Toolbar editor={editor} />
        </>
      )}
      <div className="h-full" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} className={cn('p-5', contentClass)} />
      </div>
    </div>
  )
}

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor'

const Toolbar = ({ editor }: { editor: TiptapEditor }) => {
  return (
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
}

export { MinimalTiptapEditor }
