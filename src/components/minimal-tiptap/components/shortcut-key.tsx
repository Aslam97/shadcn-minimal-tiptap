import { cn } from '@/lib/utils'
import { getShortcutKeys } from '../utils'

interface ShortcutKeyProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys: string[]
  withBg?: boolean
}

const ShortcutKey = ({
  className,
  keys,
  withBg,
  ...props
}: ShortcutKeyProps) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    >
      <span
        className={cn('ml-4', {
          'bg-accent rounded p-1 leading-3 self-end': withBg
        })}
      >
        {getShortcutKeys(keys)}
      </span>
    </span>
  )
}

ShortcutKey.displayName = 'ShortcutKey'

export { ShortcutKey }
