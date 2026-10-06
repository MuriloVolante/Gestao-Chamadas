import { cn } from '@/lib/utils'

export const fieldClass =
  'h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/25 disabled:opacity-50'

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input data-slot="input" className={cn(fieldClass, className)} {...props} />
}
