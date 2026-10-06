import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('font-display text-[17px] font-semibold tracking-[-0.02em]', className)}>
      Central de <span className="text-brand">Chamadas</span>
    </span>
  )
}
