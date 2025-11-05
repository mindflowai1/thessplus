import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ShineBorderProps {
  children: ReactNode
  className?: string
  borderRadius?: number
  duration?: number
  color?: string
}

export function ShineBorder({
  children,
  className,
  borderRadius = 8,
  duration = 14,
  color = '#10b981',
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          '--border-radius': `${borderRadius}px`,
          '--duration': `${duration}s`,
          '--color': color,
        } as React.CSSProperties
      }
      className={cn(
        'relative grid size-full place-items-center bg-white p-[1px] dark:bg-neutral-900',
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-[var(--border-radius)] p-[1px] opacity-0 transition-opacity duration-500 hover:opacity-100"
        style={{
          background: `linear-gradient(var(--color), var(--color)) padding-box, linear-gradient(to right, transparent, var(--color), transparent) border-box`,
          borderRadius: `var(--border-radius)`,
        }}
      />
      <div
        className="absolute inset-0 rounded-[var(--border-radius)] opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          animation: `spin calc(var(--duration) * 1s) linear infinite`,
          background: `conic-gradient(from 270deg, transparent, transparent, var(--color))`,
          borderRadius: `var(--border-radius)`,
        }}
      />
      <div
        className="relative z-10 size-full rounded-[calc(var(--border-radius)-1px)] bg-white dark:bg-neutral-900"
        style={{ borderRadius: `calc(var(--border-radius) - 1px)` }}
      >
        {children}
      </div>
    </div>
  )
}

