import * as React from 'react'
import '@/components/minimal-tiptap/styles/index.css'

import { EditorContent } from '@tiptap/react'
import { Content, Editor } from '@tiptap/react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { SectionOne } from '@/components/minimal-tiptap/components/section/one'
import { SectionTwo } from '@/components/minimal-tiptap/components/section/two'
import { SectionThree } from '@/components/minimal-tiptap/components/section/three'
import { SectionFour } from '@/components/minimal-tiptap/components/section/four'
import { SectionFive } from '@/components/minimal-tiptap/components/section/five'
import { LinkBubbleMenu } from '@/components/minimal-tiptap/components/bubble-menu/link-bubble-menu'
import { ImageBubbleMenu } from '@/components/minimal-tiptap/components/bubble-menu/image-bubble-menu'
import {
  useMinimalTiptapEditor,
  UseMinimalTiptapEditorProps
} from '@/components/minimal-tiptap/hooks/use-minimal-tiptap'

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3]} variant="outline" />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={['italic', 'bold', 'code', 'strikethrough', 'clearFormatting']}
        mainActionCount={5}
        variant="outline"
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} variant="outline" />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={['bulletList', 'orderedList']}
        mainActionCount={2}
        variant="outline"
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={['blockquote', 'codeBlock', 'horizontalRule']}
        mainActionCount={3}
        variant="outline"
      />
    </div>
  </div>
)

export const MinimalTiptapThree = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props
    })

    if (!editor) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary',
          className
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent editor={editor} className={cn('minimal-tiptap-editor', editorContentClassName)} />
        <LinkBubbleMenu editor={editor} />
        <ImageBubbleMenu editor={editor} />
      </div>
    )
  }
)

MinimalTiptapThree.displayName = 'MinimalTiptapThree'

export default MinimalTiptapThree
