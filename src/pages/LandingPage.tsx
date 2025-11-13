import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DottedPattern } from '@/components/magic-ui/dotted-pattern'
import { LightRays } from '@/components/magic-ui/light-rays'
import { AnimatedGridPattern } from '@/components/magic-ui/animated-grid-pattern'
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
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import logoLight from '@/assets/Logo1.png'
import logoDark from '@/assets/Logo 2.png'
import './LandingPage.css'

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
    <div className="landing-page-wrapper min-h-screen relative overflow-hidden" style={{ colorScheme: 'light' }}>
      {/* Advanced Background Patterns */}
      <div className="fixed inset-0 -z-10">
        <AnimatedGridPattern
          width={60}
          height={60}
          className="opacity-[0.03] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"
          squares={[[1, 1], [5, 3], [3, 7], [8, 2], [10, 8], [15, 5], [20, 12]]}
        />
        <DottedPattern className="opacity-[0.15]" />
        <LightRays className="opacity-30" />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-amber-500/5" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/50 to-transparent" />
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

      {/* Hero Section - Premium Design */}
      <section className="container relative pt-24 pb-12 sm:pt-20 sm:pb-16 md:py-20 lg:py-32 overflow-hidden">
        <div className="mx-auto max-w-6xl text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Título Principal com Gradiente Animado */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 sm:mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="relative inline-block">
                <span className="landing-hero-title">
                  Controle seus Gastos
                </span>
                <div className="landing-hero-glow" />
              </span>
              <br />
              <span className="landing-hero-title-accent">
                e Agende Compromissos
              </span>
            </motion.h1>

            {/* Subtítulo Melhorado */}
            <motion.p 
              className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl leading-7 sm:leading-8 md:leading-9 text-gray-700 max-w-3xl mx-auto px-2 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              A plataforma completa para gerenciar suas finanças e compromissos. 
              <span className="text-blue-600 font-semibold"> Integração com Google Calendar</span>, 
              controle de gastos inteligente e muito mais.
            </motion.p>

            {/* CTAs com Animações Avançadas */}
            <motion.div 
              className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to="/auth" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Button
                    size="lg"
                    className="landing-cta-primary w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="#features" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="landing-cta-secondary w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7"
                  >
                    Saiba Mais
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats com Design Moderno */}
            <motion.div 
              className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative group w-full"
                >
                  <div className="landing-stats-card">
                    <div className="landing-stats-value">
                      {stat.value}
                    </div>
                    <div className="landing-stats-label">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Ultra Premium */}
      <section id="features" className="container py-16 sm:py-20 md:py-28 relative px-4 sm:px-6">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent" />
        
        <div className="relative">
          <motion.div 
            className="mx-auto max-w-3xl text-center mb-12 sm:mb-16 md:mb-20 px-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="landing-badge landing-badge-blue mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="h-4 w-4" />
              <span>RECURSOS PODEROSOS</span>
            </motion.div>
            <h2 className="landing-section-title landing-text-gradient-blue mb-5 sm:mb-6">
              Tudo que você precisa
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Ferramentas profissionais para gerenciar suas finanças e compromissos com <span className="text-blue-600 font-semibold">máxima eficiência</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="relative h-full">
                    <Card className="landing-feature-card h-full">
                      <CardHeader className="relative">
                        <motion.div
                          className={`landing-feature-icon mb-5 flex items-center justify-center ${feature.color} p-3`}
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </motion.div>
                        <CardTitle className="landing-feature-title text-xl md:text-2xl">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <CardDescription className="text-sm md:text-base text-gray-700 leading-relaxed">
                          {feature.description}
                        </CardDescription>
                        
                        {/* Indicador de hover */}
                        <motion.div 
                          className="mt-4 flex items-center text-amber-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          <span>Saiba mais</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Premium Redesign */}
      <section id="benefits" className="container py-16 sm:py-20 md:py-28 relative px-4 sm:px-6">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-blue-50/20" />
        
        <div className="relative mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-12 sm:mb-16 md:mb-20 px-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="landing-badge landing-badge-amber mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="h-4 w-4" />
              <span>BENEFÍCIOS EXCLUSIVOS</span>
            </motion.div>
            <h2 className="landing-section-title mb-5 sm:mb-6">
              <span className="landing-text-gradient-blue">
                Descubra por que milhares
              </span>
              <br />
              <span className="landing-text-gradient-amber">
                escolhem o Thess+
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Uma plataforma completa desenvolvida para <span className="text-amber-600 font-semibold">transformar sua gestão financeira</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="group"
                >
                  <div className="relative h-full">
                    <div className="landing-benefit-card">
                      <div className="relative flex flex-col h-full">
                        {/* Ícone com animação */}
                        <motion.div
                          className={`landing-benefit-icon mb-6 flex items-center justify-center ${benefit.gradient} p-4`}
                          whileHover={{ 
                            rotate: [0, -5, 5, -5, 0],
                            scale: 1.15
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        {/* Título com gradiente no hover */}
                        <h3 className="landing-benefit-title text-xl md:text-2xl mb-4">
                          {benefit.title}
                        </h3>
                        
                        {/* Descrição */}
                        <p className="text-gray-700 leading-relaxed flex-grow text-sm md:text-base">
                          {benefit.description}
                        </p>
                        
                        {/* Badge de inclusão com animação */}
                        <motion.div 
                          className="mt-6 flex items-center gap-2 text-amber-600 font-bold text-sm"
                          initial={{ opacity: 0.7 }}
                          whileHover={{ opacity: 1, x: 5 }}
                        >
                          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                          <span>Incluído no plano</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Seção extra de confiança */}
          <motion.div 
            className="landing-trust-section mt-16 sm:mt-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <Shield className="h-12 w-12 mb-4 text-amber-300" />
                <h4 className="text-2xl sm:text-3xl font-bold mb-2">100%</h4>
                <p className="text-blue-100">Seguro e Confiável</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <Users className="h-12 w-12 mb-4 text-amber-300" />
                <h4 className="text-2xl sm:text-3xl font-bold mb-2">5.000+</h4>
                <p className="text-blue-100">Usuários Satisfeitos</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <TrendingUp className="h-12 w-12 mb-4 text-amber-300" />
                <h4 className="text-2xl sm:text-3xl font-bold mb-2">98%</h4>
                <p className="text-blue-100">Taxa de Satisfação</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section - Ultra Premium */}
      <section id="pricing" className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50/30" />
        <div className="absolute inset-0">
          <AnimatedGridPattern
            width={80}
            height={80}
            className="opacity-[0.02]"
          />
        </div>

        <div className="container px-4 sm:px-6 relative">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-16 px-2"
            >
            <motion.div 
              className="landing-badge landing-badge-blue mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <DollarSign className="h-4 w-4" />
              <span>INVESTIMENTO INTELIGENTE</span>
            </motion.div>
            <h2 className="landing-section-title landing-text-gradient-blue mb-5">
              O Plano Completo
            </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Tudo que você precisa para <span className="text-blue-600 font-semibold">dominar suas finanças</span> em um único plano
              </p>
            </motion.div>

            {/* Pricing Card - Ultra Premium */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative"
            >
              <div className="landing-pricing-card">
                {/* Floating orbs */}
                <div className="landing-orb-amber top-0 right-0" />
                <div className="landing-orb-blue bottom-0 left-0" />

                <div className="relative p-8 sm:p-10 md:p-14">
                  {/* Badge Premium */}
                  <motion.div 
                    className="landing-badge landing-badge-gradient mb-8"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>PLANO PREMIUM</span>
                    <Sparkles className="h-4 w-4" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                    Plano Thess+
                  </h3>
                  <p className="text-gray-600 text-lg mb-10">
                    Acesso total a todas as funcionalidades avançadas
                  </p>

                  {/* Price Display - Destaque */}
                  <div className="text-center mb-10 pb-10 border-b-2 border-gray-200">
                    <motion.div 
                      className="inline-block"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-baseline justify-center gap-3 mb-4">
                        <span className="landing-pricing-value">
                          R$ 45
                        </span>
                        <span className="text-xl sm:text-2xl text-gray-600 font-bold">/mês</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Sem taxas ocultas</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Cancele quando quiser</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Features List - Melhorado */}
                  <div className="mb-10">
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-amber-500" />
                      Recursos Incluídos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {planFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                          className="landing-pricing-feature flex items-start gap-3"
                        >
                          <CheckCircle2 className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800 text-sm md:text-base font-medium leading-relaxed">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button - Ultra Premium */}
                  <div className="text-center pt-8 border-t-2 border-gray-200">
                    <Link to="/checkout" className="inline-block w-full sm:w-auto">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative"
                      >
                        <Button
                          size="lg"
                          className="landing-pricing-cta w-full sm:w-auto text-lg sm:text-xl px-12 sm:px-16 py-6 sm:py-8"
                        >
                          <Zap className="mr-2 h-6 w-6" />
                          <span>Assinar Agora</span>
                          <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                      </motion.div>
                    </Link>
                    <motion.p 
                      className="mt-5 text-sm text-gray-600 flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Garantia de 7 dias • 100% seguro</span>
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Premium */}
      <section className="container py-16 sm:py-20 md:py-28 relative px-4 sm:px-6 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring" }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="landing-cta-section relative overflow-hidden">
            {/* Floating orbs */}
            <div className="landing-orb-amber top-0 right-0" />
            <div className="landing-orb-blue bottom-0 left-0" />

            <CardContent className="relative p-8 sm:p-12 md:p-16 lg:p-20 text-center">
              {/* Badge */}
              <motion.div 
                className="landing-badge landing-badge-white mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-4 w-4" />
                <span>COMECE HOJE MESMO</span>
              </motion.div>

              {/* Título */}
              <motion.h2 
                className="landing-cta-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Pronto para transformar
                <br />
                <span className="landing-cta-title-accent">
                  suas finanças?
                </span>
              </motion.h2>

              {/* Descrição */}
              <motion.p 
                className="text-base sm:text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Junte-se a <span className="text-amber-300 font-bold">milhares de usuários</span> que já estão organizando suas finanças e
                compromissos com o Thess+
              </motion.p>

              {/* CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="/auth" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <Button
                      size="lg"
                      className="landing-cta-white-button w-full sm:w-auto text-lg sm:text-xl px-10 sm:px-14 py-6 sm:py-8"
                    >
                      <Zap className="mr-2 h-6 w-6 text-amber-500" />
                      <span>Começar Agora</span>
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="#pricing" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="landing-cta-outline-button w-full sm:w-auto text-lg sm:text-xl px-10 sm:px-14 py-6 sm:py-8"
                    >
                      Ver Preços
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div 
                className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white/90"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-300" />
                  <span className="text-sm font-semibold">Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-300" />
                  <span className="text-sm font-semibold">Cancele a qualquer momento</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-300" />
                  <span className="text-sm font-semibold">Suporte 24/7</span>
                </div>
              </motion.div>
            </CardContent>
          </div>
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
