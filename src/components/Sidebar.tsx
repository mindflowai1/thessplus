import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import logoDark from '@/assets/Logo 2.png'
import logoLight from '@/assets/Logo1.png'

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, user, userProfile } = useAuth()
  const { theme } = useTheme()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    { 
      path: '/calendar', 
      label: 'Agenda', 
      icon: Calendar,
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    { 
      path: '/limits', 
      label: 'Limites', 
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
    },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside 
      className="flex flex-col w-72 h-screen sticky top-0 flex-shrink-0 relative z-10"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(180deg, #011c3a 0%, #0a2540 50%, #0f3459 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        borderRight: theme === 'dark'
          ? '1px solid rgba(245, 158, 11, 0.2)'
          : '1px solid rgba(100, 116, 139, 0.2)',
      }}
    >
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: theme === 'dark'
            ? `linear-gradient(rgba(245, 158, 11, 0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(245, 158, 11, 0.05) 1px, transparent 1px)`
            : `linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          animation: 'grid-move 20s linear infinite',
        }}
      />

      {/* Logo Section */}
      <Link 
        to="/" 
        className="relative px-6 py-6 group flex items-center justify-center"
        style={{
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
        }}
      >
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <img 
              src={theme === 'dark' ? logoDark : logoLight} 
              alt="Thess+" 
              className="h-14 w-auto relative z-10 filter drop-shadow-lg" 
            />
          </motion.div>
        </div>
      </Link>

      {/* User Info */}
      {user && (
        <motion.div 
          className="px-6 py-4 relative overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'linear',
            }}
          />

          <div className="flex flex-col items-center gap-3 relative z-10 text-center">
            <div className="flex-1 min-w-0 w-full">
              <p className={cn(
                "text-sm font-bold mb-2",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {userProfile?.full_name || user?.email?.split('@')[0] || 'Usuário'}
              </p>
              
              {/* Plan Badge with Animation */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg relative overflow-hidden mx-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={{
                  background: theme === 'dark' 
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
                  border: theme === 'dark'
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : '1px solid rgba(245, 158, 11, 0.25)',
                  boxShadow: theme === 'dark'
                    ? '0 4px 12px rgba(245, 158, 11, 0.15), 0 0 0 1px rgba(245, 158, 11, 0.1) inset'
                    : '0 2px 8px rgba(245, 158, 11, 0.1), 0 0 0 1px rgba(245, 158, 11, 0.05) inset',
                }}
              >
                {/* Pulse indicator */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Active status dot */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.6), 0 0 16px rgba(16, 185, 129, 0.3)',
                    }}
                  />
                </motion.div>

                {/* Plan text */}
                <div className="relative z-10 flex items-center gap-1.5">
                  <span className={cn(
                    "text-xs font-bold",
                    theme === 'dark' ? "text-amber-300" : "text-amber-700"
                  )}>
                    Plano
                  </span>
                  <span className={cn(
                    "text-xs font-black tracking-wide",
                    theme === 'dark' ? "text-white" : "text-gray-900"
                  )}>
                    Thess<span className="text-amber-500">+</span>
                  </span>
                </div>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-20">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.3 }}
              className="relative z-30"
            >
              <Link
                to={item.path}
                onClick={() => {
                  // Fechar menu mobile ao navegar
                  if (onNavigate) {
                    onNavigate()
                  }
                }}
                className={cn(
                  'flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold transition-all duration-300 group relative overflow-hidden cursor-pointer',
                  active
                    ? theme === 'dark' ? 'text-white shadow-lg' : 'text-gray-900 shadow-lg'
                    : theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                )}
                style={active ? {
                  background: `linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0.15) 100%)`,
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                  position: 'relative',
                  zIndex: 30,
                } : {
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative',
                  zIndex: 30,
                }}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-r"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover gradient */}
                {!active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                <div 
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 relative z-10 flex-shrink-0',
                    active ? item.bgColor : 'bg-white/5 group-hover:bg-white/10'
                  )}
                  style={active ? {
                    border: `1px solid ${item.borderColor}`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  } : {}}
                >
                  <Icon 
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      active 
                        ? item.textColor 
                        : theme === 'dark' 
                          ? 'text-white/70 group-hover:text-white' 
                          : 'text-gray-600 group-hover:text-gray-900'
                    )}
                    strokeWidth={2.5}
                  />
                  
                  {/* Icon glow on hover */}
                  {active && (
                    <div className={cn(
                      "absolute inset-0 rounded-xl blur-md opacity-50",
                      item.bgColor
                    )} />
                  )}
                </div>
                
                <span className={cn(
                  "relative z-10 text-base font-semibold",
                  theme === 'dark' ? "text-white" : "text-gray-900"
                )}>
                  {item.label}
                </span>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div 
        className="px-4 py-5 space-y-2.5 relative"
        style={{
          borderTop: '1px solid rgba(245, 158, 11, 0.2)',
        }}
      >
        <Link 
          to="/account" 
          className="block"
          onClick={() => {
            // Fechar menu mobile ao navegar
            if (onNavigate) {
              onNavigate()
            }
          }}
        >
          <Button
            className={cn(
              "w-full justify-start h-12 text-base font-semibold gap-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              location.pathname === '/account' 
                ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                : theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            )}
            style={location.pathname === '/account' ? {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
            } : {
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                location.pathname === '/account'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white'
              )}
              style={location.pathname === '/account' ? {
                border: '1px solid rgba(99, 102, 241, 0.3)',
              } : {}}
            >
              <Settings className={cn(
                "h-5 w-5",
                location.pathname === '/account'
                  ? theme === 'dark' ? "text-indigo-400" : "text-indigo-600"
                  : theme === 'dark' ? "text-white/70" : "text-gray-600"
              )} strokeWidth={2.5} />
            </div>
            <span className={cn(
              "relative z-10",
              theme === 'dark' ? "text-white" : "text-gray-900"
            )}>Configurações</span>

            {/* Hover effect */}
            {location.pathname !== '/account' && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </Button>
        </Link>

        <Button
          className={cn(
            "w-full justify-start h-12 text-base font-semibold gap-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
            theme === 'dark' ? "text-red-300 hover:text-white" : "text-red-600 hover:text-red-700"
          )}
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
          onClick={handleSignOut}
        >
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30 transition-all duration-300 group-hover:bg-red-500/30 group-hover:scale-110">
            <LogOut className={cn(
              "h-5 w-5",
              theme === 'dark' ? "text-red-300" : "text-red-600"
            )} strokeWidth={2.5} />
          </div>
          <span className={cn(
            "relative z-10",
            theme === 'dark' ? "text-red-300" : "text-red-600"
          )}>Sair</span>

          {/* Hover glow */}
          <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-colors duration-300" />
        </Button>
      </div>
    </aside>
  )
}
