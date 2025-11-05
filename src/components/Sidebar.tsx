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
import logoLight from '@/assets/Logo1.png'
import logoDark from '@/assets/Logo 2.png'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { theme } = useTheme()
  
  const logo = theme === 'dark' ? logoDark : logoLight

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/calendar', label: 'Agenda', icon: Calendar },
    { path: '/limits', label: 'Limites', icon: TrendingUp },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="flex flex-col w-64 border-r bg-background h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <Link 
        to="/" 
        className="flex items-center space-x-2 px-6 py-5 border-b hover:opacity-80 transition-opacity cursor-pointer"
      >
        <img src={logo} alt="Thess+" className="h-12 w-auto" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-4 px-5 py-4 rounded-xl text-base font-semibold transition-all active:scale-[0.98] group',
                active
                  ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <div className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 relative',
                active
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
              )}>
                <Icon className="h-5 w-5 relative z-10" strokeWidth={2.5} />
              </div>
              <span className="text-base">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="px-4 py-6 border-t space-y-3">
        <Link to="/account" className="block">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start h-12 text-base font-semibold gap-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98]",
              location.pathname === '/account' && 'bg-primary/10 text-primary border-primary'
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
              location.pathname === '/account'
                ? 'bg-primary/20 text-primary'
                : 'bg-muted/50 text-muted-foreground'
            )}>
              <Settings className="h-5 w-5" />
            </div>
            <span>Configurações</span>
          </Button>
        </Link>
        <Button
          variant="destructive"
          className="w-full justify-start h-12 text-base font-semibold gap-3 rounded-xl hover:bg-destructive/90 transition-all active:scale-[0.98]"
          onClick={handleSignOut}
        >
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
            <LogOut className="h-5 w-5" />
          </div>
          <span>Sair</span>
        </Button>
      </div>
    </aside>
  )
}
