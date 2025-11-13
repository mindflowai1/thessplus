import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function AdvancedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particles configuration
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`
        ctx.fill()

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-amber-50/30" />
      
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute top-40 right-20 w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-1/3 w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      {/* Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Grid Pattern with Perspective */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #2563eb 1px, transparent 1px),
            linear-gradient(to bottom, #2563eb 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: 'perspective(1000px) rotateX(60deg) scale(2)',
          transformOrigin: 'center center',
        }}
      />

      {/* Radial Gradients for Depth */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
        }}
      />
      
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(245, 158, 11, 0.06) 0%, transparent 50%)',
        }}
      />

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated Light Rays */}
      <motion.div
        className="absolute top-0 left-1/4 w-1 h-full origin-top"
        style={{
          background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          filter: 'blur(2px)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scaleY: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-0 right-1/3 w-1 h-full origin-top"
        style={{
          background: 'linear-gradient(to bottom, rgba(245, 158, 11, 0.08) 0%, transparent 50%)',
          filter: 'blur(2px)',
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scaleY: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Gradient Overlay for Smooth Blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/30" />
    </div>
  )
}
