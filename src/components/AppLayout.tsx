import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun, Menu, X, Settings, LogOut, LayoutDashboard, Calendar, TrendingUp } from 'lucide-react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AppLayout() {
  const { user, userProfile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Mapeamento de rotas para nomes e ícones
  const pageInfo = useMemo(() => {
    const routeMap: Record<string, { name: string; icon: typeof LayoutDashboard }> = {
      '/dashboard': { name: 'Dashboard', icon: LayoutDashboard },
      '/calendar': { name: 'Agenda', icon: Calendar },
      '/limits': { name: 'Limites', icon: TrendingUp },
      '/account': { name: 'Configurações', icon: Settings },
    }
    return routeMap[location.pathname] || { name: 'Dashboard', icon: LayoutDashboard }
  }, [location.pathname])
  
  const PageIcon = pageInfo.icon

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getUserInitials = () => {
    if (userProfile?.full_name) {
      const names = userProfile.full_name.split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return userProfile.full_name.substring(0, 2).toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Always visible on desktop */}
      <div className="hidden md:block flex-shrink-0" style={{ width: '256px' }}>
        <Sidebar />
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
        <Sidebar />
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Always visible */}
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Page Title - Always visible on desktop */}
            <div className="flex items-center space-x-2">
              <PageIcon className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">{pageInfo.name}</h1>
            </div>

            <div className="flex items-center space-x-3 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="h-9 w-9"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 px-2 rounded-full hover:bg-muted"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-semibold">
                        {getUserInitials()}
                      </div>
                      <span className="hidden sm:inline-block text-sm font-medium max-w-[150px] truncate">
                        {userProfile?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userProfile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
