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
  { isActive, children, tooltip, className, tooltipOptions, ...props },
  ref
) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            ref={ref}
            className={cn(
              'rounded disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent data-[state=open]:bg-primary/10 data-[state=open]:text-primary',
              {
                'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary': isActive
              },
              className
            )}
            {...props}
          >
            {children}
          </Toggle>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent {...tooltipOptions}>
            <div className="flex flex-col items-center text-center">{tooltip}</div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
})

ToolbarButton.displayName = 'ToolbarButton'

export { ToolbarButton }
