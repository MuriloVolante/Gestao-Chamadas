import { cn } from '@/lib/utils'

export function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return <label data-slot="label" className={cn('grid gap-2 text-[13px] font-medium text-muted-foreground', className)} {...props} />
}
