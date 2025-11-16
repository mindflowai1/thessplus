import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../pages/DashboardEngineering.css'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showMenuButton, setShowMenuButton] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const mainElement = document.getElementById('main-content')
    
    const handleScroll = () => {
      let current = 0
      
      if (mainElement) {
        current = mainElement.scrollTop
      } else {
        current = window.scrollY || document.documentElement.scrollTop
      }
      
      const previous = lastScrollY.current
      
      if (current < previous) {
        // Scrolling up
        setShowMenuButton(true)
      } else if (current > previous && current > 100) {
        // Scrolling down and past 100px
        setShowMenuButton(false)
      }
      
      lastScrollY.current = current
    }

    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Always visible on desktop */}
      <div className="hidden md:block flex-shrink-0 relative z-10" style={{ width: '288px' }}>
        <Sidebar onNavigate={undefined} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 300,
          mass: 0.8
        }}
        className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-background border-r shadow-2xl md:hidden overflow-y-auto"
        style={{ 
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        {/* Mobile Menu Button - Fixed with Scroll Behavior */}
        <AnimatePresence>
          {showMenuButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed top-4 right-4 z-[60]"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 dashboard-mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <AnimatePresence mode="wait">
                  {sidebarOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto relative" id="main-content">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
