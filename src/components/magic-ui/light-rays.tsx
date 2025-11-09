import { cn } from '@/lib/utils'

interface LightRaysProps {
  className?: string
}

export function LightRays({ className }: LightRaysProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 h-full w-full [background:radial-gradient(ellipse_at_center,hsl(var(--primary))_0%,transparent_70%)] opacity-20',
        className
      )}
    />
  )
}








