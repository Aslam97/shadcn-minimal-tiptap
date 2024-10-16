import * as React from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import type { ElementDimensions } from '@/components/minimal-tiptap/hooks/use-drag-resize'
import { useDragResize } from '@/components/minimal-tiptap/hooks/use-drag-resize'
import { sanitizeUrl } from '@/components/minimal-tiptap/utils'
import { ResizeHandle } from './resize-handle'
import { cn } from '@/lib/utils'
import { Loader2, AlertCircle } from 'lucide-react'
import { NodeSelection } from '@tiptap/pm/state'
import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import { ImageActions } from './image-actions'
import { useImageActions } from '../hooks/use-image-actions'

const MAX_HEIGHT = 600
const MIN_WIDTH = 120

const ImageViewBlock = ({ editor, node, getPos, selected, updateAttributes }: NodeViewProps) => {
  const { src, width: initialWidth, height: initialHeight } = node.attrs
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [isZoomed, setIsZoomed] = React.useState(false)
  const [error, setError] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [naturalSize, setNaturalSize] = React.useState<ElementDimensions>({
    width: initialWidth,
    height: initialHeight
  })
  const [activeResizeHandle, setActiveResizeHandle] = React.useState<'left' | 'right' | null>(null)

  const focus = React.useCallback(() => {
    const { view } = editor
    const $pos = view.state.doc.resolve(getPos())
    const transaction = view.state.tr.setSelection(new NodeSelection($pos))
    view.dispatch(transaction)
  }, [editor, getPos])

  const onDimensionsChange = React.useCallback(
    ({ width, height }: ElementDimensions) => {
      focus()
      updateAttributes({ width, height })
    },
    [focus, updateAttributes]
  )

  const aspectRatio = naturalSize.width / naturalSize.height
  const maxWidth = MAX_HEIGHT * aspectRatio

  const { isLink, onView, onDownload, onCopy, onCopyLink } = useImageActions({
    editor,
    node,
    src,
    onViewClick: setIsZoomed
  })
  const { currentWidth, currentHeight, updateDimensions, initiateResize, isResizing } = useDragResize({
    initialWidth: initialWidth ?? naturalSize.width,
    initialHeight: initialHeight ?? naturalSize.height,
    contentWidth: naturalSize.width,
    contentHeight: naturalSize.height,
    gridInterval: 0.1,
    onDimensionsChange,
    minWidth: MIN_WIDTH,
    maxWidth
  })

  const shouldMerge = React.useMemo(() => currentWidth <= 180, [currentWidth])

  const handleImageLoad = React.useCallback(
    (ev: React.SyntheticEvent<HTMLImageElement>) => {
      const img = ev.target as HTMLImageElement
      const newNaturalSize = {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
      setNaturalSize(newNaturalSize)
      setImageLoaded(true)

      if (!initialWidth) {
        updateDimensions(state => ({ ...state, width: newNaturalSize.width }))
      }
    },
    [initialWidth, updateDimensions]
  )

  const handleImageError = React.useCallback(() => {
    setError(true)
    setImageLoaded(true)
  }, [])

  const handleResizeStart = React.useCallback(
    (direction: 'left' | 'right') => {
      return (event: React.PointerEvent<HTMLDivElement>) => {
        setActiveResizeHandle(direction)
        initiateResize(direction)(event)
      }
    },
    [initiateResize]
  )

  const handleResizeEnd = React.useCallback(() => {
    setActiveResizeHandle(null)
  }, [])

  React.useEffect(() => {
    if (!isResizing) {
      handleResizeEnd()
    }
  }, [isResizing, handleResizeEnd])

  const handleZoomChange = React.useCallback((isZoomed: boolean) => {
    if (!isZoomed) setIsZoomed(false)
  }, [])

  return (
    <NodeViewWrapper ref={containerRef} data-drag-handle className="relative text-center leading-none">
      <div
        className="group/node-image relative mx-auto rounded-md object-contain"
        style={{
          maxWidth: `min(${maxWidth}px, 100%)`,
          width: currentWidth,
          maxHeight: MAX_HEIGHT,
          aspectRatio: `${naturalSize.width} / ${naturalSize.height}`
        }}
      >
        <div
          className={cn('relative flex cursor-default flex-col items-center gap-2 rounded', {
            'outline outline-2 outline-offset-1 outline-primary': selected || isResizing
          })}
        >
          <div className="contain-paint">
            <div className="relative">
              {!imageLoaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="size-8 animate-spin" />
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <AlertCircle className="size-8 text-destructive" />
                  <p className="mt-2 text-sm text-gray-500">Failed to load image</p>
                </div>
              )}

              <ControlledZoom isZoomed={isZoomed} onZoomChange={handleZoomChange}>
                <img
                  className={cn('h-auto rounded object-contain transition-shadow', {
                    'opacity-0': !imageLoaded || error
                  })}
                  style={{
                    maxWidth: `min(100%, ${maxWidth}px)`,
                    minWidth: `${MIN_WIDTH}px`,
                    maxHeight: MAX_HEIGHT
                  }}
                  width={currentWidth}
                  height={currentHeight}
                  src={sanitizeUrl(src, {
                    allowBase64: editor.extensionManager.extensions.find(ext => ext.name === 'image')?.options
                      .allowBase64
                  })}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </ControlledZoom>
            </div>

            {editor.isEditable && imageLoaded && !error && (
              <>
                <ResizeHandle
                  onPointerDown={handleResizeStart('left')}
                  className={cn('left-1', { hidden: isResizing && activeResizeHandle === 'right' })}
                  isResizing={isResizing && activeResizeHandle === 'left'}
                />
                <ResizeHandle
                  onPointerDown={handleResizeStart('right')}
                  className={cn('right-1', { hidden: isResizing && activeResizeHandle === 'left' })}
                  isResizing={isResizing && activeResizeHandle === 'right'}
                />
              </>
            )}
          </div>

          {!isResizing && (
            <ImageActions
              shouldMerge={shouldMerge}
              isLink={isLink}
              onView={onView}
              onDownload={onDownload}
              onCopy={onCopy}
              onCopyLink={onCopyLink}
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export { ImageViewBlock }
