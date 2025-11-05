import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MagicCardProps {
  children: ReactNode
  className?: string
}

export function MagicCard({ children, className }: MagicCardProps) {
  return (
    <div
      className={cn(
        'group relative flex size-full overflow-hidden rounded-xl border border-neutral-100 bg-gradient-to-br from-white to-neutral-50 dark:border-neutral-900 dark:from-neutral-900 dark:to-neutral-800',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 [--purple:rgba(88,28,135,0.3)] group-hover:opacity-100">
        <div className="absolute inset-0 rounded-xl [background:radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),var(--purple),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  )
}


