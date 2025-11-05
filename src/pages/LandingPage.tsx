import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DottedPattern } from '@/components/magic-ui/dotted-pattern'
import { LightRays } from '@/components/magic-ui/light-rays'
import { ShineBorder } from '@/components/magic-ui/shine-border'
import { MagicCard } from '@/components/magic-ui/magic-card'
import {
  Calendar,
  DollarSign,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Bell,
  Star,
  Lock,
  Smartphone,
  TrendingDown,
  PieChart,
  Target,
  LogOut,
  LayoutDashboard,
  Phone,
  Mail,
  Linkedin,
  Instagram,
  MessageCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import logoLight from '@/assets/Logo1.png'
import logoDark from '@/assets/Logo 2.png'

export function LandingPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navbarVisible, setNavbarVisible] = useState(true)
  
  const logo = logoLight // Landing Page sempre usa logo claro

  // Force light mode ONLY for Landing Page, without breaking dashboard
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    
    // Save current theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const currentTheme = savedTheme || 'dark'
    
    // Remove dark mode class only temporarily
    const wasDark = root.classList.contains('dark')
    root.classList.remove('dark')
    body.classList.remove('dark')
    
    return () => {
      // Restore theme when leaving Landing Page
      if (wasDark || currentTheme === 'dark') {
        root.classList.add('dark')
        body.classList.add('dark')
      }
    }
  }, [])

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    try {
      await signOut()
      setMobileMenuOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Handle smooth scroll navigation
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 80 // Height of navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setMobileMenuOpen(false)
  }

  // Handle scroll to top
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Handle navbar visibility on scroll
  useEffect(() => {
    let lastScroll = window.scrollY
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY
          const scrollDifference = currentScroll - lastScroll
          
          // Always show navbar at the top
          if (currentScroll < 100) {
            setNavbarVisible(true)
          }
          // Show navbar when scrolling up (any upward movement)
          else if (scrollDifference < 0) {
            setNavbarVisible(true)
          }
          // Hide navbar when scrolling down (only if past 100px)
          else if (scrollDifference > 0 && currentScroll > 100) {
            setNavbarVisible(false)
          }
          
          lastScroll = currentScroll
          ticking = false
        })
        ticking = true
      }
    }

    // Initial check
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const features = [
    {
      icon: DollarSign,
      title: 'Controle de Gastos',
      description: 'Registre e acompanhe todos os seus gastos de forma simples e organizada',
      color: 'bg-blue-600',
    },
    {
      icon: Calendar,
      title: 'Agendamento Inteligente',
      description: 'Integração com Google Calendar para nunca perder um compromisso',
      color: 'bg-amber-500',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Completo',
      description: 'Visualize seus gastos e receitas com gráficos e relatórios detalhados',
      color: 'bg-blue-600',
    },
    {
      icon: Bell,
      title: 'Lembretes Automáticos',
      description: 'Configure lembretes para pagamentos e compromissos importantes',
      color: 'bg-orange-500',
    },
  ]

  const benefits = [
    {
      icon: PieChart,
      title: 'Análise Financeira Completa',
      description:
        'Visualize seus gastos por categoria com gráficos interativos e relatórios detalhados para tomar decisões mais inteligentes',
      gradient: 'bg-blue-600',
    },
    {
      icon: Calendar,
      title: 'Sincronização com Google Calendar',
      description:
        'Integre seus compromissos e agendamentos diretamente com o Google Calendar. Nunca perca um evento importante novamente',
      gradient: 'bg-amber-500',
    },
    {
      icon: Target,
      title: 'Limites de Gastos Inteligentes',
      description:
        'Defina limites personalizados por categoria e receba alertas automáticos quando estiver próximo do limite',
      gradient: 'bg-blue-600',
    },
    {
      icon: TrendingDown,
      title: 'Economia Automática',
      description:
        'Identifique padrões de gastos e receba recomendações personalizadas para economizar mais dinheiro',
      gradient: 'bg-orange-500',
    },
    {
      icon: Smartphone,
      title: 'Acesso Multiplataforma',
      description:
        'Acesse de qualquer dispositivo - desktop, tablet ou smartphone. Seus dados sincronizam automaticamente',
      gradient: 'bg-blue-600',
    },
    {
      icon: Lock,
      title: 'Segurança Máxima',
      description:
        'Seus dados financeiros estão protegidos com criptografia de ponta e seguimos os mais altos padrões de segurança',
      gradient: 'bg-blue-700',
    },
  ]

  const planFeatures = [
    'Transações ilimitadas',
    'Dashboard completo com gráficos',
    'Todas as categorias de gastos',
    'Integração com Google Calendar',
    'Lembretes e notificações ilimitados',
    'Análise de gastos avançada',
    'Exportação de relatórios em PDF',
    'Suporte prioritário',
    'Backup automático dos seus dados',
    'Histórico completo de transações',
  ]

  const stats = [
    { value: '100%', label: 'Gratuito para começar' },
    { value: '∞', label: 'Sem limite de transações' },
    { value: '24/7', label: 'Disponível sempre' },
    { value: '100%', label: 'Seus dados seguros' },
  ]

  return (
    <div className="min-h-screen bg-white relative overflow-hidden light" style={{ colorScheme: 'light' }}>
      {/* Background Patterns */}
      <div className="fixed inset-0 -z-10">
        <DottedPattern className="opacity-10" />
        <LightRays className="opacity-20" />
        <div className="absolute inset-0 bg-blue-50/20" />
      </div>

      {/* Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 transition-transform duration-300 ease-in-out",
          navbarVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <button 
            onClick={handleScrollToTop}
            className="flex items-center space-x-2 group cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Thess+" className="h-12 w-auto group-hover:scale-105 transition-transform" />
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#features" 
              onClick={(e) => handleSmoothScroll(e, 'features')}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Recursos
            </a>
            <a 
              href="#benefits" 
              onClick={(e) => handleSmoothScroll(e, 'benefits')}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Benefícios
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleSmoothScroll(e, 'pricing')}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Preços
            </a>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost">Entrar</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Animated */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors z-[55] relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              initial={false}
              animate={mobileMenuOpen ? 'open' : 'closed'}
              className="relative w-6 h-6"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0, opacity: 1 },
                  open: { rotate: 45, y: 6, opacity: 1 }
                }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 w-6 h-0.5 bg-gray-900 rounded-full"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
                transition={{ duration: 0.2 }}
                className="absolute top-2.5 left-0 w-6 h-0.5 bg-gray-900 rounded-full"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0, opacity: 1 },
                  open: { rotate: -45, y: -6, opacity: 1 }
                }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 w-6 h-0.5 bg-gray-900 rounded-full"
              />
            </motion.div>
          </button>
        </div>
      </header>

      {/* Mobile Menu - Professional Redesign */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel - Professional Design */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'spring', 
                damping: 30, 
                stiffness: 300,
                mass: 0.8
              }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-[110] md:hidden overflow-y-auto"
              style={{ 
                boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Header do Menu */}
              <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={logo} alt="Thess+" className="h-10 w-auto" />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                  aria-label="Fechar menu"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 relative"
                  >
                    <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-900 rounded-full transform -translate-y-1/2 rotate-45"></span>
                    <span className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-900 rounded-full transform -translate-y-1/2 -rotate-45"></span>
                  </motion.div>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="px-6 py-6 space-y-3">
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  href="#features" 
                  className="flex items-center gap-5 px-5 py-4 rounded-2xl text-base font-semibold text-gray-900 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] transition-all duration-200 group"
                  onClick={(e) => {
                    handleSmoothScroll(e, 'features')
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200 shadow-sm group-hover:shadow-md">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-lg">Recursos</span>
                </motion.a>
                
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  href="#benefits" 
                  className="flex items-center gap-5 px-5 py-4 rounded-2xl text-base font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-600 active:scale-[0.98] transition-all duration-200 group"
                  onClick={(e) => {
                    handleSmoothScroll(e, 'benefits')
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-200 shadow-sm group-hover:shadow-md">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <span className="text-lg">Benefícios</span>
                </motion.a>
                
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  href="#pricing" 
                  className="flex items-center gap-5 px-5 py-4 rounded-2xl text-base font-semibold text-gray-900 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] transition-all duration-200 group"
                  onClick={(e) => {
                    handleSmoothScroll(e, 'pricing')
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200 shadow-sm group-hover:shadow-md">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-lg">Preços</span>
                </motion.a>
              </nav>

              {/* User Actions Section */}
              <div className="px-6 pt-8 pb-8 border-t-2 border-gray-200 space-y-4">
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <Link to="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>
                        <div className="flex items-center gap-5 px-5 py-4 rounded-2xl text-base font-semibold text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 active:scale-[0.98] transition-all duration-200 cursor-pointer group">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-200">
                            <LayoutDashboard 
                              className="h-6 w-6 text-white" 
                              strokeWidth={2.5}
                              fill="none"
                              stroke="currentColor"
                              style={{ color: 'white' }}
                            />
                          </div>
                          <span className="text-lg">Dashboard</span>
                        </div>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <button
                        onClick={() => {
                          handleSignOut()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-base font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200 shadow-sm group-hover:shadow-md">
                          <LogOut className="h-6 w-6 text-red-600" />
                        </div>
                        <span className="text-lg">Sair</span>
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    <Link to="/auth" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                        <span>Entrar</span>
                        <ArrowRight className="h-6 w-6" />
                      </div>
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Footer do Menu */}
              <div className="px-6 pb-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  © 2025 Thess+.<br />
                  Todos os direitos reservados.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section - Mobile Optimized */}
      <section className="container relative pt-24 pb-12 sm:pt-20 sm:pb-16 md:py-20 lg:py-32 overflow-hidden bg-white">
        <div className="mx-auto max-w-5xl text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6">
              <span className="text-blue-600 block sm:inline">
                Controle seus Gastos
              </span>
              <br className="hidden sm:block" />
              <span className="text-gray-900 block sm:inline">e Agende Compromissos</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-7 sm:leading-8 text-gray-700 max-w-2xl mx-auto px-2">
              A plataforma completa para gerenciar suas finanças e compromissos. Integração com
              Google Calendar, controle de gastos inteligente e muito mais.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                  Saiba Mais
                </Button>
              </Link>
            </div>

            {/* Stats - Mobile Optimized */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-700 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section id="features" className="container py-12 sm:py-16 md:py-20 relative border-t-2 border-gray-200 bg-gray-50/50 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12 md:mb-16 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-gray-900">
            Recursos Poderosos
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            Tudo que você precisa para gerenciar suas finanças e compromissos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ShineBorder className="h-full" color="#f59e0b" borderRadius={12}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.color} p-2`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-gray-700">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ShineBorder>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Benefits Section - Mobile Optimized */}
      <section id="benefits" className="container py-12 sm:py-16 md:py-20 relative border-t-2 border-gray-200 bg-white px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-gray-900">
              Benefícios Exclusivos
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700">
              Descubra por que milhares de usuários escolhem o Thess+
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MagicCard className="h-full p-6 hover:scale-105 transition-transform duration-300">
                    <div className="flex flex-col h-full">
                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${benefit.gradient} p-3 shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-700 leading-relaxed flex-grow">
                        {benefit.description}
                      </p>
                      <div className="mt-4 flex items-center text-primary text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span>Incluído</span>
                      </div>
                    </div>
                  </MagicCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - Mobile Optimized */}
      <section id="pricing" className="relative py-12 sm:py-16 md:py-24 border-t-2 border-gray-200 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-12 md:mb-16 px-2"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                O Plano Completo
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Tudo que você precisa para dominar suas finanças em um único plano
              </p>
            </motion.div>

            {/* Pricing Card - Clean Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden"
            >
              <div className="p-6 sm:p-8 md:p-12">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-600">Plano Premium</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Plano Thess+
                </h3>
                <p className="text-gray-600 mb-8">
                  Acesso total a todas as funcionalidades avançadas
                </p>

                {/* Price */}
                <div className="text-center mb-6 sm:mb-10 pb-6 sm:pb-10 border-b border-gray-200">
                  <div className="flex items-baseline justify-center gap-2 mb-2 sm:mb-3">
                    <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-blue-600">
                      R$ 45
                    </span>
                    <span className="text-lg sm:text-xl text-gray-600">/mês</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Sem taxas ocultas • Cancele quando quiser
                  </p>
                </div>

                {/* Features List */}
                <div className="mb-6 sm:mb-10">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                    Recursos Incluídos
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {planFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 sm:gap-3 py-1.5 sm:py-2"
                      >
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center pt-4 sm:pt-6 border-t border-gray-200">
                  <Link to="/auth" className="inline-block w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Assinar Agora
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  <p className="mt-3 sm:mt-4 text-xs text-gray-500">
                    Sem compromisso • Cancele a qualquer momento
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="container py-12 sm:py-16 md:py-20 relative border-t-2 border-gray-200 bg-white px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className="relative overflow-hidden border-2 border-amber-500/50">
            <div className="absolute inset-0 bg-amber-500/10"></div>
            <CardContent className="relative p-6 sm:p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">Pronto para começar?</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                Junte-se a milhares de usuários que já estão organizando suas finanças e
                compromissos com o Thess+
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="border-t bg-blue-950 text-white relative">
        <div className="container py-8 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
            {/* Left Section - Logo and Contact */}
            <div>
              <div className="mb-6">
                <img src={logoDark} alt="Thess+" className="h-14 w-auto mb-4" />
              </div>
              <h4 className="text-lg font-semibold mb-4 text-white">Entre em contato:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <a href="tel:+5531994340753" className="text-white/80 hover:text-amber-400 transition-colors">
                    (31) 99434-0753
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <a href="mailto:contato@thessplus.com.br" className="text-white/80 hover:text-amber-400 transition-colors">
                    contato@thessplus.com.br
                  </a>
                </div>
              </div>
            </div>

            {/* Middle Section - Navigation */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white text-center md:text-left">
                Navegação
                <div className="w-12 h-0.5 bg-amber-400 mt-2"></div>
              </h4>
              <nav className="space-y-2">
                <a href="#features" className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors">
                  <span className="text-amber-400">&gt;</span>
                  <span>Recursos</span>
                </a>
                <a href="#benefits" className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors">
                  <span className="text-amber-400">&gt;</span>
                  <span>Benefícios</span>
                </a>
                <a href="#pricing" className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors">
                  <span className="text-amber-400">&gt;</span>
                  <span>Preços</span>
                </a>
                <Link to="/auth" className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors">
                  <span className="text-amber-400">&gt;</span>
                  <span>Entrar</span>
                </Link>
              </nav>
            </div>

            {/* Right Section - Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white text-center md:text-left">
                Redes Sociais
                <div className="w-12 h-0.5 bg-amber-400 mt-2"></div>
              </h4>
              <p className="text-sm text-white/80 mb-6">
                Siga-nos em nossas redes sociais para ficar por dentro das novidades.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/fernandathees/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-amber-400/20 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="https://www.instagram.com/theesengenharia/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-amber-400/20 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-white" />
                </a>
                <a 
                  href="https://api.whatsapp.com/send/?phone=5531994340753&text&type=phone_number&app_absent=0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-amber-400/20 flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/80">
              <p>© 2025 Thess+. Todos os direitos reservados.</p>
              <p>CNPJ: 46.934.858/0001-24</p>
              <p>
                Desenvolvido por <span className="text-amber-400 font-semibold">Mindflow Digital</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
