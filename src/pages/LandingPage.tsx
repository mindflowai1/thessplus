import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedGradientText } from '@/components/magic-ui/animated-gradient-text'
import { MagicCard } from '@/components/magic-ui/magic-card'
import { AnimatedList } from '@/components/magic-ui/animated-list'
import { ShineBorder } from '@/components/magic-ui/shine-border'
import { DottedPattern } from '@/components/magic-ui/dotted-pattern'
import { LightRays } from '@/components/magic-ui/light-rays'
import {
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Clock,
  Wallet,
  Bell,
  Star,
  Infinity,
  Lock,
  Smartphone,
  Cloud,
  TrendingDown,
  PieChart,
  Target,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function LandingPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navbarVisible, setNavbarVisible] = useState(true)

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
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Calendar,
      title: 'Agendamento Inteligente',
      description: 'Integração com Google Calendar para nunca perder um compromisso',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Completo',
      description: 'Visualize seus gastos e receitas com gráficos e relatórios detalhados',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Bell,
      title: 'Lembretes Automáticos',
      description: 'Configure lembretes para pagamentos e compromissos importantes',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const benefits = [
    {
      icon: PieChart,
      title: 'Análise Financeira Completa',
      description:
        'Visualize seus gastos por categoria com gráficos interativos e relatórios detalhados para tomar decisões mais inteligentes',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: Calendar,
      title: 'Sincronização com Google Calendar',
      description:
        'Integre seus compromissos e agendamentos diretamente com o Google Calendar. Nunca perca um evento importante novamente',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Target,
      title: 'Limites de Gastos Inteligentes',
      description:
        'Defina limites personalizados por categoria e receba alertas automáticos quando estiver próximo do limite',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: TrendingDown,
      title: 'Economia Automática',
      description:
        'Identifique padrões de gastos e receba recomendações personalizadas para economizar mais dinheiro',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Smartphone,
      title: 'Acesso Multiplataforma',
      description:
        'Acesse de qualquer dispositivo - desktop, tablet ou smartphone. Seus dados sincronizam automaticamente',
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      icon: Lock,
      title: 'Segurança Máxima',
      description:
        'Seus dados financeiros estão protegidos com criptografia de ponta e seguimos os mais altos padrões de segurança',
      gradient: 'from-teal-500 to-green-600',
    },
  ]

  const pricingPlans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar',
      features: [
        'Até 50 transações por mês',
        'Dashboard básico',
        '3 categorias de gastos',
        'Integração com Google Calendar',
        'Lembretes básicos',
        'Suporte por email',
      ],
      popular: false,
      gradient: 'from-gray-400 to-gray-600',
    },
    {
      name: 'Básico',
      price: 'R$ 29',
      period: '/mês',
      description: 'Para usuários individuais',
      features: [
        'Transações ilimitadas',
        'Dashboard completo',
        'Todas as categorias',
        'Integração Google Calendar',
        'Lembretes ilimitados',
        'Análise de gastos avançada',
        'Suporte prioritário',
        'Exportação de relatórios',
      ],
      popular: true,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Premium',
      price: 'R$ 79',
      period: '/mês',
      description: 'Para profissionais',
      features: [
        'Tudo do plano Básico',
        'Múltiplos perfis',
        'Relatórios personalizados',
        'Integrações avançadas',
        'API de integração',
        'Suporte 24/7',
        'Backup automático',
        'Histórico ilimitado',
      ],
      popular: false,
      gradient: 'from-purple-500 to-pink-600',
    },
  ]

  const stats = [
    { value: '100%', label: 'Gratuito para começar' },
    { value: '∞', label: 'Sem limite de transações' },
    { value: '24/7', label: 'Disponível sempre' },
    { value: '100%', label: 'Seus dados seguros' },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Patterns */}
      <div className="fixed inset-0 -z-10">
        <DottedPattern className="opacity-10 dark:opacity-5" />
        <LightRays className="opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 via-transparent to-emerald-50/30 dark:from-green-950/10 dark:via-transparent dark:to-emerald-950/10" />
      </div>

      {/* Header */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out",
          navbarVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <button 
            onClick={handleScrollToTop}
            className="flex items-center space-x-2 group cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Thess+
            </span>
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container py-4 flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={(e) => {
                  handleSmoothScroll(e, 'features')
                  setMobileMenuOpen(false)
                }}
              >
                Recursos
              </a>
              <a 
                href="#benefits" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={(e) => {
                  handleSmoothScroll(e, 'benefits')
                  setMobileMenuOpen(false)
                }}
              >
                Benefícios
              </a>
              <a 
                href="#pricing" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={(e) => {
                  handleSmoothScroll(e, 'pricing')
                  setMobileMenuOpen(false)
                }}
              >
                Preços
              </a>
              <div className="pt-4 border-t space-y-2">
                {user ? (
                  <>
                    <Link to="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Entrar</Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container relative py-20 md:py-32 overflow-hidden">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl mb-6">
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                Controle seus Gastos
              </span>
              <br />
              <span className="text-foreground">e Agende Compromissos</span>
            </h1>

            <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
              A plataforma completa para gerenciar suas finanças e compromissos. Integração com
              Google Calendar, controle de gastos inteligente e muito mais.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="#features">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Saiba Mais
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20 relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Recursos Poderosos
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa para gerenciar suas finanças e compromissos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                <ShineBorder className="h-full" color="#10b981" borderRadius={12}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} p-2`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
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

      {/* Benefits Section - Melhorada */}
      <section id="benefits" className="container py-20 relative">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Benefícios Exclusivos
            </h2>
            <p className="text-lg text-muted-foreground">
              Descubra por que milhares de usuários escolhem o Thess+
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient} p-3 shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-3 text-foreground">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed flex-grow">
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

      {/* Pricing Section */}
      <section id="pricing" className="container py-20 relative">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Planos que Cabe no seu Bolso
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha o plano ideal para suas necessidades. Sem compromisso, cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <AnimatedGradientText>
                      <span className="text-xs font-semibold">⭐ Mais Popular</span>
                    </AnimatedGradientText>
                  </div>
                )}
                <Card
                  className={`relative h-full border-2 transition-all duration-300 ${
                    plan.popular
                      ? 'border-green-500 shadow-2xl scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-lg`}
                  />
                  <CardHeader className="relative">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-base mb-4">{plan.description}</CardDescription>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/auth" className="block">
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.name === 'Gratuito' ? 'Começar Grátis' : 'Assinar Agora'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className="relative overflow-hidden border-2 border-green-500/50">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-500/10 to-green-600/10"></div>
            <CardContent className="relative p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de usuários que já estão organizando suas finanças e
                compromissos com o Thess+
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="text-lg px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 relative">
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Thess+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                A plataforma completa para gerenciar suas finanças e compromissos
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-foreground">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="text-muted-foreground hover:text-foreground">
                    Benefícios
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-muted-foreground hover:text-foreground">
                    Preços
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Carreiras
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Termos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Thess+. Todos os direitos reservados.</p>
            <p className="mt-2">CNPJ: 46.934.858/0001-24</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
