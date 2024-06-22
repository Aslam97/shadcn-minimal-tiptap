import { isNumber, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useMemo } from 'react'
import { useImageLoad } from '../../hooks/use-image-load'
import { cn } from '@/lib/utils'

const ImageViewBlock = ({ editor, node, getPos }: NodeViewProps) => {
  const imgSize = useImageLoad(node.attrs.src)

  const focusImage = () => {
    editor.commands.setNodeSelection(getPos())
  }

  const paddingBottom = useMemo(() => {
    if (!imgSize.width || !imgSize.height) {
      return 0
    }

    return (imgSize.height / imgSize.width) * 100
  }, [imgSize.width, imgSize.height])

  return (
    <NodeViewWrapper apper="true" className="image" style={{ textAlign: node.attrs.textAlign }}>
      <div draggable="true" data-drag-handle>
        <figure>
          <div className="relative w-full" style={{ paddingBottom: `${isNumber(paddingBottom) ? paddingBottom : 0}%` }}>
            <div className="absolute h-full w-full">
              <div
                className={cn('relative h-full max-h-full w-full max-w-full rounded transition-all')}
                style={{
                  boxShadow: editor.state.selection.from === getPos() ? '0 0 0 1px hsl(var(--primary))' : 'none'
                }}
              >
                <div className="relative flex h-full max-h-full w-full max-w-full overflow-hidden">
                  <img
                    alt={node.attrs.alt}
                    src={node.attrs.src}
                    onClick={focusImage}
                    className="m-0 max-w-full"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      objectFit: 'contain',
                      imageOrientation: 'none',
                      transform: 'translate(-50%, -50%)',
                      height: '100%'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </NodeViewWrapper>
  )
}

export { ImageViewBlock }
