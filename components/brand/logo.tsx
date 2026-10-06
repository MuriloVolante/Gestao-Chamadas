import { cn } from '@/lib/utils'
import { Mark } from './mark'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <Mark animate />
      <span className="font-display text-[17px] font-semibold tracking-[-0.02em]">
        Central de <span className="text-brand">Chamadas</span>
      </span>
    </span>
  )
}
