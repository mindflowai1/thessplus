import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  anchor?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#10b981',
  colorTo = '#059669',
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': duration,
          '--anchor': anchor,
          '--border-width': borderWidth,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          border: `calc(var(--border-width) * 1px) solid transparent`,
          background: `linear-gradient(transparent, transparent), linear-gradient(to right, var(--color-from), var(--color-to))`,
          backgroundClip: 'padding-box, border-box',
          backgroundOrigin: 'border-box',
          maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'subtract',
          WebkitMaskComposite: 'xor',
        }}
      />
      <div
        className="absolute aspect-square w-[calc(var(--size)*1px)] animate-border-beam"
        style={{
          animationDelay: `var(--delay)`,
          background: `linear-gradient(to right, var(--color-from), transparent, var(--color-to))`,
          offsetAnchor: `calc(var(--anchor) * 1%) 50%`,
          offsetPath: `rect(0 auto auto 0 round calc(var(--size) * 1px))`,
        }}
      />
    </div>
  )
}

