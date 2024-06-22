import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Toggle } from '@/components/ui/toggle'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { TooltipContentProps } from '@radix-ui/react-tooltip'

interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<typeof Toggle> {
  isActive?: boolean
  tooltip?: string
  tooltipOptions?: TooltipContentProps
}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
  { isActive, children, tooltip, className, ...props },
  ref
) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            {...props}
            ref={ref}
            className={cn(
              'rounded data-[state=open]:bg-primary/10 data-[state=open]:text-primary',
              {
                'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary': isActive
              },
              className
            )}
          >
            {children}
          </Toggle>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent {...props.tooltipOptions}>
            <div className="flex max-w-24 flex-col items-center text-center">{tooltip}</div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
})

ToolbarButton.displayName = 'ToolbarButton'

export { ToolbarButton }
