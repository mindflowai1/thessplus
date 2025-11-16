import { ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedListProps {
  className?: string
  children: ReactNode
  delay?: number
}

export function AnimatedList({ className, children, delay = 100 }: AnimatedListProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div ref={ref} className={cn('space-y-4', className)}>
      {Array.isArray(children) &&
        children.map((child, index) => (
          <div
            key={index}
            className={cn(
              'transition-all duration-500',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'
            )}
            style={{ transitionDelay: `${index * delay}ms` }}
          >
            {child}
          </div>
        ))}
      {!Array.isArray(children) && children}
    </div>
  )
}














