import { cn } from '@/lib/utils'
import { MeshMark } from './mesh-mark'

export function Logo({ size = 30, className, textClassName }: { size?: number; className?: string; textClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <MeshMark size={size} />
      <span className={cn('font-display text-[15.5px] font-semibold tracking-[-0.02em]', textClassName)}>
        Central de <span className="text-primary">Chamadas</span>
      </span>
    </span>
  )
}
