import { cn } from '@/lib/utils'
import { getShortcutKeys } from '../utils'

interface ShortcutKeyProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys: string[]
}

export const ShortcutKey = ({ className, keys, ...props }: ShortcutKeyProps) => {
  return (
    <span className={cn('text-xs tracking-widest opacity-60', className)} {...props}>
      <span className={cn('ml-4')}>{getShortcutKeys(keys)}</span>
    </span>
  )
}

ShortcutKey.displayName = 'ShortcutKey'

export default ShortcutKey
