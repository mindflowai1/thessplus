import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Star,
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
  CreditCard,
  Brain,
  Send,
  RefreshCw,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import logoDark from '@/assets/Logo 2.png'
import './LandingPage.css'
import './HeroEngineering.css'
import './LandingSections.css'

// Função helper para destacar o "+" em "Thess+"
function highlightThessPlus(text: string) {
  return text.split('Thess+').map((part, index, array) => {
    if (index < array.length - 1) {
      return (
        <span key={index}>
          {part}Thess<span className="text-amber-500">+</span>
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })
}

// Componente para animação de contagem
function CountUpAnimation({ 
  end, 
  duration = 2000, 
  className,
  style
}: { 
  end: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function para suavizar a animação
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * end)
      
      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end) // Garantir que termine exatamente no valor final
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [inView, end, duration])

  return (
    <span ref={ref} className={className} style={style}>
      R$ {count}
    </span>
  )
}

export function LandingPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navbarVisible, setNavbarVisible] = useState(true)
  
  // Logo não usado - usando logoDark diretamente

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
      icon: MessageCircle,
      title: 'WhatsApp Inteligente',
      description: 'Gerencie suas finanças direto do WhatsApp. Registre gastos, consulte saldos e receba relatórios - tudo por mensagem, sem apps complicados.',
      color: 'bg-blue-600',
    },
    {
      icon: Calendar,
      title: 'Agenda Sincronizada',
      description: 'Integração nativa com Google Calendar. Seus compromissos financeiros e reuniões sempre organizados em um só lugar.',
      color: 'bg-amber-500',
    },
    {
      icon: BarChart3,
      title: 'Relatórios Automáticos',
      description: 'Visualize seus gastos em gráficos intuitivos. Entenda para onde vai seu dinheiro e tome decisões mais inteligentes.',
      color: 'bg-blue-600',
    },
    {
      icon: Sparkles,
      title: 'IA que Aprende com Você',
      description: 'Nossa inteligência artificial aprende seus padrões e sugere economias personalizadas. Quanto mais você usa, mais inteligente fica.',
      color: 'bg-orange-500',
    },
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Economize até 30% por Mês',
      description:
        'Empresas que usam o Thess+ economizam em média R$ 3.500/mês. Nossa IA identifica gastos desnecessários e sugere cortes inteligentes automaticamente.',
      gradient: 'bg-blue-600',
    },
    {
      icon: Calendar,
      title: 'Zero Compromissos Perdidos',
      description:
        'Sincronize tudo com Google Calendar e receba lembretes via WhatsApp. Seus clientes vão agradecer pela pontualidade impecável.',
      gradient: 'bg-amber-500',
    },
    {
      icon: Shield,
      title: 'Segurança de Banco',
      description:
        'Seus dados financeiros protegidos com criptografia militar. Certificações PCI-DSS e conformidade total com LGPD. Seu dinheiro, suas regras.',
      gradient: 'bg-orange-500',
    },
    {
      icon: Users,
      title: 'Suporte Humano 24/7',
      description:
        'Dúvidas? Nossa equipe responde em minutos, não horas. Chat ao vivo, WhatsApp e telefone. Pessoas reais ajudando pessoas reais.',
      gradient: 'bg-blue-600',
    },
  ]

  const planFeatures = [
    '✓ WhatsApp Ilimitado - Sem limite de mensagens ou transações',
    '✓ Google Calendar Sincronizado - Todos os seus compromissos em um só lugar',
    '✓ Dashboard com IA - Insights automáticos sobre seus gastos',
    '✓ Relatórios Personalizados - Exportação em PDF com marca d\'água removível',
    '✓ Alertas Inteligentes - Receba avisos antes de estourar o orçamento',
    '✓ Análise Preditiva - Previsão de gastos dos próximos 3 meses',
    '✓ Suporte Prioritário - Chat e WhatsApp com resposta em até 5min',
    '✓ Backup Automático - Seus dados seguros na nuvem',
    '✓ Multi-usuário - Até 5 membros da equipe incluídos',
    '✓ Garantia de 07 dias - Satisfação garantida ou seu dinheiro de volta',
  ]

  return (
    <div className="landing-page-wrapper min-h-screen relative overflow-hidden" style={{ colorScheme: 'light' }}>

      {/* Header - Engineering Style */}
      <motion.header 
        className={cn(
          "engineering-navbar",
          window.scrollY > 100 && "scrolled"
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: navbarVisible ? 0 : -100, opacity: navbarVisible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="engineering-navbar-container">
          <motion.button 
            onClick={handleScrollToTop}
            className="engineering-logo-wrapper"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={logoDark} alt="Thess+" />
          </motion.button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex engineering-nav-menu">
            <a 
              href="#features" 
              onClick={(e) => handleSmoothScroll(e, 'features')}
              className="engineering-nav-link"
            >
              Recursos
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              className="engineering-nav-link"
            >
              Como Funciona
            </a>
            <a 
              href="#benefits" 
              onClick={(e) => handleSmoothScroll(e, 'benefits')}
              className="engineering-nav-link"
            >
              Benefícios
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleSmoothScroll(e, 'pricing')}
              className="engineering-nav-link"
            >
              Preços
            </a>
            
            {/* Desktop Actions */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <button className="engineering-cta-button-secondary flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </button>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="engineering-cta-button-logout flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/auth">
                <button className="engineering-cta-button-secondary flex items-center gap-2">
                  Entrar
                </button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors z-[55] relative"
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
                className="absolute top-0 left-0 w-6 h-0.5 bg-white rounded-full"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
                transition={{ duration: 0.2 }}
                className="absolute top-2.5 left-0 w-6 h-0.5 bg-white rounded-full"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0, opacity: 1 },
                  open: { rotate: -45, y: -6, opacity: 1 }
                }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 w-6 h-0.5 bg-white rounded-full"
              />
            </motion.div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu - Engineering Professional */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop com blur escuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-[#011c3a]/90 backdrop-blur-md z-[100] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel - Engineering Premium */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'spring', 
                damping: 28, 
                stiffness: 280,
                mass: 0.7
              }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-[110] md:hidden overflow-y-auto"
              style={{ 
                background: 'linear-gradient(180deg, #011c3a 0%, #0a2540 40%, #0f3459 100%)',
                boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.6), inset 1px 0 0 rgba(245, 158, 11, 0.1)'
              }}
            >
              {/* Header Premium */}
              <motion.div 
                className="relative bg-gradient-to-r from-[#011c3a] to-[#0a2540] border-b border-amber-500/20 px-6 py-5 backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {/* Decorative line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={logoDark} alt="Thess+" className="h-11 w-auto" />
                  </div>
                  
                  <motion.button
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative p-3 rounded-xl bg-white/10 hover:bg-white/15 border-2 border-white/20 hover:border-amber-400/50 transition-all duration-300 group shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-6 h-6 relative"
                    >
                      <span className="absolute top-1/2 left-1/2 w-5 h-0.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:bg-amber-400 group-hover:rotate-[135deg] transition-all duration-300" />
                      <span className="absolute top-1/2 left-1/2 w-5 h-0.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 group-hover:bg-amber-400 group-hover:-rotate-[135deg] transition-all duration-300" />
                    </motion.div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/20 rounded-xl blur-md transition-all duration-300 -z-10" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Navigation Items Premium */}
              <nav className="px-5 py-6 space-y-2">
                {[
                  { 
                    href: '#features', 
                    label: 'Recursos', 
                    icon: BarChart3, 
                    delay: 0.15,
                    color: '#2563eb',
                    hoverColor: '#3b82f6',
                    bgGradient: 'from-blue-500/20 to-blue-600/10',
                    borderColor: 'blue-500/30'
                  },
                  { 
                    href: '#how-it-works', 
                    label: 'Como Funciona', 
                    icon: Zap, 
                    delay: 0.16,
                    color: '#8b5cf6',
                    hoverColor: '#a78bfa',
                    bgGradient: 'from-purple-500/20 to-purple-600/10',
                    borderColor: 'purple-500/30'
                  },
                  { 
                    href: '#benefits', 
                    label: 'Benefícios', 
                    icon: Star, 
                    delay: 0.18,
                    color: '#f59e0b',
                    hoverColor: '#fbbf24',
                    bgGradient: 'from-amber-500/20 to-amber-600/10',
                    borderColor: 'amber-500/30'
                  },
                  { 
                    href: '#pricing', 
                    label: 'Preços', 
                    icon: CreditCard, 
                    delay: 0.21,
                    color: '#10b981',
                    hoverColor: '#34d399',
                    bgGradient: 'from-green-500/20 to-green-600/10',
                    borderColor: 'green-500/30'
                  }
                ].map((item) => (
                  <motion.a
                    key={item.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: item.delay, duration: 0.3, ease: 'easeOut' }}
                    href={item.href}
                    className="group mobile-nav-item-group relative flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] transition-all duration-300 overflow-hidden"
                    data-item-color={item.color}
                    style={{
                      '--item-color': item.color,
                      '--item-hover-color': item.hoverColor,
                    } as React.CSSProperties}
                    onClick={(e) => {
                      handleSmoothScroll(e, item.href.replace('#', ''))
                      setMobileMenuOpen(false)
                    }}
                  >
                    {/* Background gradient on hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to right, ${item.color}00, ${item.color}15, ${item.color}00)`
                      }}
                    />
                    
                    {/* Icon container */}
                    <div className="relative z-10 flex-shrink-0">
                      <div 
                        className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl"
                        style={{
                          background: `linear-gradient(to bottom right, ${item.color}33, ${item.color}1a)`,
                          borderColor: `rgba(255, 255, 255, 0.1)`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${item.color}4d`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <item.icon 
                          className="h-5 w-5 transition-colors duration-300" 
                          style={{ color: item.color }}
                        />
                      </div>
                    </div>
                    
                    {/* Label */}
                    <span className="relative z-10 text-base font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
                      {item.label}
                    </span>
                    
                    {/* Arrow indicator */}
                    <ArrowRight 
                      className="mobile-nav-arrow relative z-10 ml-auto h-5 w-5 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1" 
                      style={{ 
                        color: `rgba(255, 255, 255, 0.3)`,
                      } as React.CSSProperties}
                    />
                  </motion.a>
                ))}
              </nav>

              {/* Divider decorativo */}
              <div className="px-5">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              </div>

              {/* User Actions Premium */}
              <div className="px-5 py-5 space-y-3">
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24, duration: 0.3 }}
                    >
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <motion.button
                          className="w-full relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-white font-bold text-base overflow-hidden group mobile-entrar-button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                          
                          <LayoutDashboard className="relative h-5 w-5" strokeWidth={2.5} />
                          <span className="relative">Dashboard</span>
                        </motion.button>
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.27, duration: 0.3 }}
                    >
                      <motion.button
                        onClick={() => {
                          handleSignOut()
                          setMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-red-500/10 text-white/90 hover:text-white font-semibold text-base border border-white/10 hover:border-red-500/30 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LogOut className="h-5 w-5 text-red-400" />
                        <span>Sair</span>
                      </motion.button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.3 }}
                  >
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <motion.button
                        className="w-full relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-white font-bold text-base overflow-hidden group mobile-entrar-button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        
                        <span className="relative">Entrar</span>
                        <ArrowRight className="relative h-5 w-5" />
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Footer Premium */}
              <motion.div 
                className="px-5 pb-6 pt-5 mt-auto border-t border-amber-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <p className="text-xs text-center text-white/50 leading-relaxed">
                  © 2025 Thess<span className="text-amber-500 font-semibold">+</span>
                  <br />
                  <span className="text-white/40">Todos os direitos reservados</span>
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section - Engineering Style */}
      <section className="engineering-hero-section">
        {/* Background Elements */}
        <div className="engineering-hero-bg" />
        <div className="engineering-blueprint-grid" />
        <div className="engineering-gradient-overlay" />
        
        {/* Building Silhouettes */}
        <div className="engineering-buildings">
          <div className="engineering-building engineering-building-1" />
          <div className="engineering-building engineering-building-2" />
          <div className="engineering-building engineering-building-3" />
          <div className="engineering-building engineering-building-4" />
          <div className="engineering-building engineering-building-5" />
          <div className="engineering-building engineering-building-6" />
        </div>
        
        {/* Construction Crane */}
        <div className="engineering-crane">
          <div className="engineering-crane-base" />
          <div className="engineering-crane-arm" />
        </div>
        
        {/* Floating Particles */}
        <div className="engineering-particles">
          <div className="engineering-particle" />
          <div className="engineering-particle" />
          <div className="engineering-particle" />
          <div className="engineering-particle" />
          <div className="engineering-particle" />
        </div>
        
        {/* Hero Content */}
        <div className="engineering-hero-content">
          {/* Title */}
          <h1 className="engineering-hero-title">
            <span className="engineering-hero-title-main">
              Sistema Inteligente de
            </span>
            <span className="engineering-hero-title-highlight">
              Agendamento e Finanças
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="engineering-hero-subtitle">
            Construa o futuro financeiro da sua empresa com <strong>tecnologia de ponta</strong>.
            Integração com Google Calendar, controle de gastos via WhatsApp e assistência por IA.
          </p>
          
          {/* CTAs */}
          <div className="engineering-hero-ctas">
            <Link to="/auth">
              <motion.button
                className="engineering-hero-cta-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="h-6 w-6" />
                <span>Começar Agora</span>
                <ArrowRight className="h-6 w-6" />
              </motion.button>
            </Link>
          </div>
          
          {/* Stats Cards */}
          <div className="engineering-stats-container">
            <motion.div
              className="engineering-stat-card"
              whileHover={{ y: -8 }}
            >
              <div className="engineering-stat-icon">
                <Shield />
              </div>
              <div className="engineering-stat-value">100%</div>
              <div className="engineering-stat-label">Seguro</div>
            </motion.div>
            
            <motion.div
              className="engineering-stat-card"
              whileHover={{ y: -8 }}
            >
              <div className="engineering-stat-icon">
                <Users />
              </div>
              <div className="engineering-stat-value">5k+</div>
              <div className="engineering-stat-label">Usuários</div>
            </motion.div>
            
            <motion.div
              className="engineering-stat-card"
              whileHover={{ y: -8 }}
            >
              <div className="engineering-stat-icon">
                <TrendingUp />
              </div>
              <div className="engineering-stat-value">98%</div>
              <div className="engineering-stat-label">Satisfação</div>
            </motion.div>
            
            <motion.div
              className="engineering-stat-card"
              whileHover={{ y: -8 }}
            >
              <div className="engineering-stat-icon">
                <Zap />
              </div>
              <div className="engineering-stat-value">24/7</div>
              <div className="engineering-stat-label">Disponível</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Light */}
      <section id="features" className="engineering-section-light">
        <div className="engineering-section-container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="engineering-section-title-light mb-4">
              Tudo que você <span className="engineering-section-highlight">precisa</span>
            </h2>
            <div className="engineering-section-divider" />
            <p className="engineering-section-subtitle-light">
              Ferramentas profissionais para gerenciar suas finanças e compromissos com <strong>máxima eficiência</strong>
            </p>
          </motion.div>

          <div className="engineering-cards-grid engineering-cards-grid-features">
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
                >
                  <div className="engineering-card-light">
                    <div className="engineering-card-icon-light">
                      <Icon />
                    </div>
                    <h3 className="engineering-card-title-light">
                      {feature.title}
                    </h3>
                    <p className="engineering-card-description-light">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section - Light with Animations */}
      <section id="how-it-works" className="engineering-section-light">
        <div className="engineering-section-container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="engineering-section-title-light mb-4">
              Como <span className="engineering-section-highlight">Funciona</span>
            </h2>
            <div className="engineering-section-divider" />
            <p className="engineering-section-subtitle-light">
              Gestão financeira e agendamento de compromissos em <strong>4 passos simples</strong>. Use pelo WhatsApp ou Dashboard - você escolhe!
            </p>
          </motion.div>

          {/* Animated Flow */}
          <div className="engineering-how-it-works-flow">
            {[
              {
                step: 1,
                icon: Send,
                title: 'Use WhatsApp ou Dashboard',
                description: 'Registre gastos, consulte saldos e gerencie suas finanças pelo WhatsApp. Ou use o Dashboard completo para controle total. Você escolhe como prefere trabalhar.',
                color: '#10b981',
                delay: 0,
              },
              {
                step: 2,
                icon: Brain,
                title: 'IA Organiza Automaticamente',
                description: 'Nossa inteligência artificial categoriza seus gastos, identifica padrões e sugere economias. Para finanças e agendamentos, tudo é processado automaticamente.',
                color: '#f59e0b',
                delay: 0.2,
              },
              {
                step: 3,
                icon: RefreshCw,
                title: 'Sincronização Inteligente',
                description: 'Seus compromissos e reuniões são sincronizados automaticamente com o Google Calendar. Agende pelo WhatsApp ou Dashboard e tudo fica organizado.',
                color: '#2563eb',
                delay: 0.4,
              },
              {
                step: 4,
                icon: FileText,
                title: 'Insights e Relatórios',
                description: 'Visualize gráficos detalhados, receba alertas antes de estourar o orçamento e exporte relatórios em PDF. Tudo disponível no Dashboard ou via WhatsApp.',
                color: '#8b5cf6',
                delay: 0.6,
              },
            ].map((item, index) => {
              const Icon = item.icon
              const isLast = index === 3
              
              return (
                <div key={item.step} className="engineering-flow-item-wrapper">
                  <motion.div
                    className="engineering-flow-item"
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 0.8, 
                      delay: item.delay,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {/* Step Number Badge */}
                    <motion.div
                      className="engineering-flow-step-badge"
                      style={{ 
                        '--step-color': item.color
                      } as React.CSSProperties}
                      initial={{ scale: 0, rotate: -180, x: '-50%' }}
                      whileInView={{ scale: 1, rotate: 0, x: '-50%' }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.6, 
                        delay: item.delay + 0.2,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <span className="engineering-flow-step-number">{item.step}</span>
                    </motion.div>

                    {/* Icon Container */}
                    <motion.div
                      className={cn(
                        "engineering-flow-icon-container",
                        item.step === 3 && "engineering-flow-icon-sync"
                      )}
                      style={{ '--icon-color': item.color } as React.CSSProperties}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: item.delay + 0.3,
                        type: "spring",
                        stiffness: 150
                      }}
                      whileHover={{ 
                        scale: 1.15, 
                        rotate: item.step === 3 ? 0 : 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Icon className={cn(
                        "engineering-flow-icon",
                        item.step === 3 && "engineering-flow-icon-rotating"
                      )} />
                      
                      {/* Pulsing Ring Animation */}
                      <motion.div
                        className="engineering-flow-icon-ring"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: item.delay,
                        }}
                      />
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      className="engineering-flow-content"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: item.delay + 0.4 }}
                    >
                      <h3 className="engineering-flow-title">{item.title}</h3>
                      <p className="engineering-flow-description">{item.description}</p>
                    </motion.div>

                    {/* Animated Connection Line */}
                    {!isLast && (
                      <motion.div
                        className="engineering-flow-connector"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.8, 
                          delay: item.delay + 0.6,
                          ease: "easeInOut"
                        }}
                      >
                        <ChevronRight className="engineering-flow-arrow" />
                        <div className="engineering-flow-line"></div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* Animated Data Flow Visualization */}
          <motion.div
            className="engineering-data-flow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="engineering-data-flow-container">
              {/* WhatsApp Icon */}
              <motion.div
                className="engineering-data-node engineering-data-node-whatsapp"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MessageCircle className="engineering-data-icon" />
                <span className="engineering-data-label">WhatsApp</span>
              </motion.div>

              {/* Animated Connection Lines */}
              <motion.div
                className="engineering-data-connection"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <motion.div
                  className="engineering-data-pulse"
                  animate={{
                    x: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>

              {/* AI Brain Icon */}
              <motion.div
                className="engineering-data-node engineering-data-node-ai"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Brain className="engineering-data-icon" />
                <span className="engineering-data-label">IA Thess+</span>
              </motion.div>

              {/* Connection to Calendar */}
              <motion.div
                className="engineering-data-connection"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                <motion.div
                  className="engineering-data-pulse"
                  animate={{
                    x: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.5,
                  }}
                />
              </motion.div>

              {/* Calendar Icon */}
              <motion.div
                className="engineering-data-node engineering-data-node-calendar"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <Calendar className="engineering-data-icon" />
                <span className="engineering-data-label">Google Calendar</span>
              </motion.div>

              {/* Connection to Dashboard */}
              <motion.div
                className="engineering-data-connection"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.6 }}
              >
                <motion.div
                  className="engineering-data-pulse"
                  animate={{
                    x: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1,
                  }}
                />
              </motion.div>

              {/* Dashboard Icon */}
              <motion.div
                className="engineering-data-node engineering-data-node-dashboard"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <LayoutDashboard className="engineering-data-icon" />
                <span className="engineering-data-label">Dashboard</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - Dark */}
      <section id="benefits" className="engineering-section-dark">
        {/* Animated Background Elements */}
        <div className="engineering-benefits-animated-bg">
          {/* Animated Lines - Horizontal */}
          <div className="engineering-benefits-line engineering-benefits-line-1"></div>
          <div className="engineering-benefits-line engineering-benefits-line-2"></div>
          <div className="engineering-benefits-line engineering-benefits-line-3"></div>
          
          {/* Animated Lines - Vertical */}
          <div className="engineering-benefits-line-vertical engineering-benefits-line-v1"></div>
          <div className="engineering-benefits-line-vertical engineering-benefits-line-v2"></div>
          
          {/* Floating Particles */}
          <div className="engineering-benefits-particles">
            <div className="engineering-benefits-particle engineering-benefits-particle-1"></div>
            <div className="engineering-benefits-particle engineering-benefits-particle-2"></div>
            <div className="engineering-benefits-particle engineering-benefits-particle-3"></div>
            <div className="engineering-benefits-particle engineering-benefits-particle-4"></div>
            <div className="engineering-benefits-particle engineering-benefits-particle-5"></div>
          </div>
          
          {/* Gradient Glows */}
          <div className="engineering-benefits-glow engineering-benefits-glow-top"></div>
          <div className="engineering-benefits-glow engineering-benefits-glow-bottom"></div>
        </div>
        
        <div className="engineering-section-container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="engineering-section-title-dark mb-4">
              Por que <span className="engineering-section-highlight">milhares</span> escolhem o Thess<span className="text-amber-500">+</span>
            </h2>
            <div className="engineering-section-divider" />
            <p className="engineering-section-subtitle-dark">
              Uma plataforma completa desenvolvida para <strong>transformar sua gestão financeira</strong>
            </p>
          </motion.div>

          <div className="engineering-cards-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="engineering-card-dark">
                    <div className="engineering-card-icon-dark">
                      <Icon />
                    </div>
                    <h3 className="engineering-card-title-dark">
                      {benefit.title}
                    </h3>
                    <p className="engineering-card-description-dark">
                      {highlightThessPlus(benefit.description)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section - Light */}
      <section id="pricing" className="engineering-section-light">
        <div className="engineering-section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="engineering-section-title-light mb-4">
              O <span className="engineering-section-highlight">Plano Completo</span>
            </h2>
            <div className="engineering-section-divider" />
            <p className="engineering-section-subtitle-light">
              Tudo que você precisa para <strong>dominar suas finanças</strong> em um único plano
            </p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="max-w-4xl mx-auto"
          >
            <div className="engineering-card-light p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="engineering-section-title-light text-3xl mb-2">
                  Plano Thess<span className="text-amber-500">+</span>
                </h3>
                <p className="engineering-section-subtitle-light text-lg mb-8">
                  Acesso total a todas as funcionalidades avançadas
                </p>

                {/* Price */}
                <div className="mb-8 pb-8 border-b-2 border-gray-200">
                  <div className="flex items-baseline justify-center gap-3 mb-4">
                    <CountUpAnimation 
                      end={45}
                      duration={2000}
                      className="text-4xl md:text-6xl font-900 engineering-section-highlight"
                      style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900 }}
                    />
                    <span className="text-xl text-gray-600 font-bold">/mês</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Cancele quando quiser</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Recursos Incluídos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {planFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                          <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />
                        </div>
                      </div>
                      <span className="text-gray-800 font-medium leading-relaxed text-base group-hover:text-gray-900 transition-colors">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-6 border-t-2 border-gray-200">
                <Link to="/checkout" className="inline-block">
                  <motion.button
                    className="engineering-cta-light"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="h-5 w-5" />
                    <span>Assinar Agora</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
                <p className="mt-4 text-sm text-gray-600 flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Garantia de 07 dias • 100% seguro</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Engineering Style */}
      <footer className="engineering-section-dark border-t-2 border-amber-500/30">
        <div className="engineering-section-container py-3 md:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-4">
            {/* Left Section - Logo and Contact */}
            <div>
              <div className="mb-4">
                <img src={logoDark} alt="Thess+" className="h-12 w-auto mb-3 filter drop-shadow-lg" />
              </div>
              <h4 className="text-base font-bold mb-3 text-white">Entre em contato</h4>
              <div className="space-y-2">
                <a href="tel:+5531994340753" className="flex items-center gap-3 text-white/80 hover:text-amber-400 transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-amber-500/20 transition-colors">
                    <Phone className="h-4 w-4 text-amber-400" />
                  </div>
                  <span>(31) 99434-0753</span>
                </a>
                <a href="mailto:contato@thessplus.com.br" className="flex items-center gap-3 text-white/80 hover:text-amber-400 transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-amber-500/20 transition-colors">
                    <Mail className="h-4 w-4 text-amber-400" />
                  </div>
                  <span>contato@thessplus.com.br</span>
                </a>
              </div>
            </div>

            {/* Middle Section - Navigation */}
            <div>
              <h4 className="text-base font-bold mb-3 text-white">
                Navegação
                <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-transparent mt-2"></div>
              </h4>
              <nav className="space-y-1.5">
                <a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')} className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors group">
                  <ArrowRight className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Recursos</span>
                </a>
                <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')} className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors group">
                  <ArrowRight className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Como Funciona</span>
                </a>
                <a href="#benefits" onClick={(e) => handleSmoothScroll(e, 'benefits')} className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors group">
                  <ArrowRight className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Benefícios</span>
                </a>
                <a href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors group">
                  <ArrowRight className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Preços</span>
                </a>
                <Link to="/auth" className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors group">
                  <ArrowRight className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Entrar</span>
                </Link>
              </nav>
            </div>

            {/* Right Section - Social Media */}
            <div>
              <h4 className="text-base font-bold mb-3 text-white">
                Redes Sociais
                <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-transparent mt-2"></div>
              </h4>
              <p className="text-sm text-white/70 mb-4">
                Siga-nos para ficar por dentro das novidades.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.linkedin.com/in/fernandathees/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/30 flex items-center justify-center transition-all group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-white group-hover:text-amber-400 transition-colors" />
                </a>
                <a 
                  href="https://www.instagram.com/theesengenharia/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/30 flex items-center justify-center transition-all group"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-white group-hover:text-amber-400 transition-colors" />
                </a>
                <a 
                  href="https://api.whatsapp.com/send/?phone=5531994340753&text&type=phone_number&app_absent=0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/30 flex items-center justify-center transition-all group"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4 text-white group-hover:text-amber-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="border-t border-white/10 pt-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs md:text-sm text-white/70">
              <p>© 2025 Thess<span className="text-amber-500">+</span>. Todos os direitos reservados.</p>
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
