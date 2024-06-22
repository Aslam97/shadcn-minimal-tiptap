import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/react'
import { EditorView } from '@tiptap/pm/view'
import { EditorState } from '@tiptap/pm/state'
import { ImagePopoverBlock } from '../image/image-popover-block'

type ShouldShowProps = {
  editor: Editor
  view: EditorView
  state: EditorState
  oldState?: EditorState
  from: number
  to: number
}

const ImageBubbleMenu = ({ editor }: { editor: Editor }) => {
  const shouldShow = ({ editor, from, to }: ShouldShowProps) => {
    if (from === to) {
      return false
    }

    const img = editor.getAttributes('image')

    if (img.src) {
      return true
    }

    return false
  }

  const unSetImage = () => {
    editor.commands.deleteSelection()
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: 'bottom',
        offset: [0, 8]
      }}
    >
      <ImagePopoverBlock onRemove={unSetImage} />
    </BubbleMenu>
  )
}

export { ImageBubbleMenu }
