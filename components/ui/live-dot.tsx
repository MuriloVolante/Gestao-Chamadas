import { cn } from '@/lib/utils'

export function LiveDot({ className }: { className?: string }) {
  return <span aria-hidden className={cn('inline-block size-2 rounded-full bg-primary animate-pulse-dot', className)} />
}
