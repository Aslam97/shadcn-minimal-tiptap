import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <div className="text-center">
      <h1 className="mb-4 text-5xl font-extrabold tracking-tight">Minimal Tiptap</h1>
      <p className="mb-6 text-xl">A minimal Tiptap editor with a focus on simplicity and extensibility.</p>
      <div className="flex flex-col justify-center gap-x-2 space-y-4 sm:flex-row sm:space-y-0">
        <a
          href="https://github.com/Aslam97/shadcn-tiptap"
          className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full font-semibold text-primary')}
        >
          View on Github <span>→</span>
        </a>
      </div>
    </div>
  )
}
