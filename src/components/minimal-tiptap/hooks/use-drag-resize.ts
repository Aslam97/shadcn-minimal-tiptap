import { useState, useCallback, useEffect } from 'react'

type ResizeDirection = 'left' | 'right'
export type ElementDimensions = { width: number; height: number }

type HookParams = {
  onDimensionsChange?: (dimensions: ElementDimensions) => void
  initialWidth: number
  initialHeight: number
  contentWidth: number
  contentHeight: number
  gridInterval: number
  minWidth: number
  maxWidth: number
}

export function useDragResize({
  onDimensionsChange,
  initialWidth,
  initialHeight,
  contentWidth,
  contentHeight,
  gridInterval,
  minWidth,
  maxWidth
}: HookParams) {
  const [dimensions, updateDimensions] = useState<ElementDimensions>({ width: initialWidth, height: initialHeight })
  const [boundaryWidth, setBoundaryWidth] = useState(Infinity)
  const [resizeOrigin, setResizeOrigin] = useState(0)
  const [initialDimensions, setInitialDimensions] = useState(dimensions)
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection | undefined>()

  const widthConstraint = useCallback(
    (proposedWidth: number, maxAllowedWidth: number) => {
      const effectiveMinWidth = Math.max(minWidth, Math.min(contentWidth, (gridInterval / 100) * maxAllowedWidth))
      return Math.min(maxAllowedWidth, Math.max(proposedWidth, effectiveMinWidth))
    },
    [gridInterval, contentWidth, minWidth]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      event.preventDefault()
      const movementDelta = (resizeDirection === 'left' ? resizeOrigin - event.pageX : event.pageX - resizeOrigin) * 2
      const gridUnitWidth = (gridInterval / 100) * boundaryWidth
      const proposedWidth = initialDimensions.width + movementDelta
      const alignedWidth = Math.round(proposedWidth / gridUnitWidth) * gridUnitWidth
      const finalWidth = widthConstraint(alignedWidth, boundaryWidth)
      const aspectRatio = contentHeight / contentWidth

      updateDimensions({
        width: finalWidth,
        height: contentWidth ? finalWidth * aspectRatio : contentHeight
      })
    },
    [
      widthConstraint,
      resizeDirection,
      boundaryWidth,
      resizeOrigin,
      gridInterval,
      contentHeight,
      contentWidth,
      initialDimensions.width
    ]
  )

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      event.preventDefault()
      event.stopPropagation()

      setResizeOrigin(0)
      setResizeDirection(undefined)
      onDimensionsChange?.(dimensions)
    },
    [onDimensionsChange, dimensions]
  )

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        updateDimensions(initialDimensions)
        setResizeDirection(undefined)
      }
    },
    [initialDimensions]
  )

  const initiateResize = useCallback(
    (direction: ResizeDirection) => (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()

      setBoundaryWidth(maxWidth)
      setInitialDimensions({
        width: widthConstraint(dimensions.width, maxWidth),
        height: dimensions.height
      })
      setResizeOrigin(event.pageX)
      setResizeDirection(direction)
    },
    [maxWidth, widthConstraint, dimensions.width, dimensions.height]
  )

  useEffect(() => {
    if (resizeDirection) {
      document.addEventListener('keydown', handleKeydown)
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)

      return () => {
        document.removeEventListener('keydown', handleKeydown)
        document.removeEventListener('pointermove', handlePointerMove)
        document.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, [resizeDirection, handleKeydown, handlePointerMove, handlePointerUp])

  return {
    initiateResize,
    isResizing: !!resizeDirection,
    updateDimensions,
    currentWidth: dimensions.width,
    currentHeight: dimensions.height
  }
}
