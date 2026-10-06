import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.ComponentProps<'section'>) {
  return <section data-slot="card" className={cn('rounded-xl border border-border bg-card p-5 sm:p-6', className)} {...props} />
}

export function CardHeader({ label, title, description, icon, action }: { label?: string; title: string; description?: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {icon && <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary [&_svg]:size-[18px]">{icon}</span>}
        <div className="grid gap-1.5">
          {label && <p className="section-label">{label}</p>}
          <h2 className="font-display text-base leading-none font-semibold">{title}</h2>
          {description && <p className="text-[13px] text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
