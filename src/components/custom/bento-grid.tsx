import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const BentoGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn('grid w-full auto-rows-auto grid-cols-3 gap-4', className)}>{children}</div>
}

const BentoCard = ({ name, className, background }: { name: string; className: string; background: ReactNode }) => (
  <div
    key={name}
    className={cn(
      'group relative col-span-3 flex flex-col justify-between rounded-xl',
      // light styles
      'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      // dark styles
      'transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      className
    )}
  >
    {background}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300" />
  </div>
)

export { BentoCard, BentoGrid }
