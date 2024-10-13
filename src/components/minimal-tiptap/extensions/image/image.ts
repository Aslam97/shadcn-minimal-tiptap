import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageViewBlock } from './components/image-view-block'

export const Image = TiptapImage.extend({
  group: 'block',
  atom: true,
  draggable: true,

  addNodeView() {
    return ReactNodeViewRenderer(ImageViewBlock)
  }
})
