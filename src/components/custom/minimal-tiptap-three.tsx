import "@/components/minimal-tiptap/styles/index.css"

import type { Content, Editor } from "@tiptap/react"
import type { UseMinimalTiptapEditorProps } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap"
import { EditorContent } from "@tiptap/react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SectionOne } from "@/components/minimal-tiptap/components/section/one"
import { SectionTwo } from "@/components/minimal-tiptap/components/section/two"
import { SectionThree } from "@/components/minimal-tiptap/components/section/three"
import { SectionFour } from "@/components/minimal-tiptap/components/section/four"
import { SectionFive } from "@/components/minimal-tiptap/components/section/five"
import { LinkBubbleMenu } from "@/components/minimal-tiptap/components/bubble-menu/link-bubble-menu"
import { useMinimalTiptapEditor } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap"
import { MeasuredContainer } from "../minimal-tiptap/components/measured-container"

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="border-border flex h-12 shrink-0 overflow-x-auto border-b p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3]} variant="outline" />

      <Separator orientation="vertical" className="mx-2" />

      <SectionTwo
        editor={editor}
        activeActions={[
          "italic",
          "bold",
          "underline",
          "code",
          "strikethrough",
          "clearFormatting",
        ]}
        mainActionCount={5}
        variant="outline"
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionThree editor={editor} variant="outline" />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFour
        editor={editor}
        activeActions={["bulletList", "orderedList"]}
        mainActionCount={2}
        variant="outline"
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFive
        editor={editor}
        activeActions={["blockquote", "codeBlock", "horizontalRule"]}
        mainActionCount={3}
        variant="outline"
      />
    </div>
  </div>
)

export const MinimalTiptapThree = ({
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: MinimalTiptapProps) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  })

  if (!editor) {
    return null
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      className={cn(
        "border-input min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor", editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  )
}

MinimalTiptapThree.displayName = "MinimalTiptapThree"

export default MinimalTiptapThree
