import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import logoDark from '@/assets/Logo 2.png'
import logoLight from '@/assets/Logo1.png'
import { useTheme } from '@/contexts/ThemeContext'

interface AuthTransitionProps {
  children: ReactNode
  isTransitioning: boolean
}

export function AuthTransition({ children, isTransitioning }: AuthTransitionProps) {
  const { theme } = useTheme()
  const logo = theme === 'dark' ? logoDark : logoLight

  return (
    <>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950"
          >
            {/* Animated Background Pattern */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -20 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center relative z-10"
            >
              {/* Logo Animation with Pulse */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: [0, 1.1, 1],
                  rotate: 0,
                }}
                transition={{
                  duration: 1,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="mb-10"
              >
                <motion.img 
                  src={logo} 
                  alt="Thess+" 
                  className="h-28 w-auto mx-auto"
                  animate={{
                    filter: [
                      'drop-shadow(0 0 0px rgba(245,158,11,0))',
                      'drop-shadow(0 0 20px rgba(245,158,11,0.5))',
                      'drop-shadow(0 0 0px rgba(245,158,11,0))',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              {/* Loading Spinner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center justify-center mb-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="relative"
                >
                  <div className="h-16 w-16 border-4 border-white/20 border-t-amber-400 rounded-full" />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute inset-0 h-16 w-16 border-4 border-transparent border-r-blue-400 rounded-full"
                  />
                </motion.div>
              </motion.div>

              {/* Status Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="space-y-2"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    delay: 1,
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-lg font-medium text-white/90"
                >
                  Carregando seu dashboard...
                </motion.p>
              </motion.div>

              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.3, 1],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  delay: 1.8,
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="mt-8"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <motion.div
                    initial={{ scale: 0, pathLength: 0 }}
                    animate={{ scale: 1, pathLength: 1 }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                  >
                    <CheckCircle2 className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4 }}
                    className="text-2xl font-bold text-white"
                  >
                    Bem-vindo ao Thess+
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.6 }}
                    className="text-sm text-white/80 mt-2"
                  >
                    Redirecionando...
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isTransitioning && children}
    </>
  )
}

