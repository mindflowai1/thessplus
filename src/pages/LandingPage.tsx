import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, ArrowRight, TrendingUp, Shield, Zap, Calendar, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export function LandingPage() {
  const services = [
    {
      title: 'Projeto Elétrico',
      description: 'Soluções completas em projetos elétricos com BIM 3D',
    },
    {
      title: 'Projeto Hidrossanitário',
      description: 'Projetos de água e esgoto com tecnologia avançada',
    },
    {
      title: 'Projeto de Incêndio',
      description: 'Segurança e prevenção com projetos de incêndio',
    },
    {
      title: 'Emissão de AVCB',
      description: 'Emissão de AVCB no Corpo de Bombeiros',
    },
    {
      title: 'Projeto Terraplenagem',
      description: 'Projetos de terraplenagem e movimentação de terra',
    },
    {
      title: 'Projeto Drenagem',
      description: 'Soluções em drenagem e sistemas de águas pluviais',
    },
    {
      title: 'Projeto de Gás',
      description: 'Projetos de instalações de gás com segurança',
    },
    {
      title: 'Projeto Estrutural',
      description: 'Projetos estruturais com análise e dimensionamento',
    },
    {
      title: 'Cabeamento Estrutural',
      description: 'Projetos de cabeamento estruturado de rede',
    },
    {
      title: 'Projeto de CFTV',
      description: 'Projetos de circuitos fechados de TV',
    },
    {
      title: 'Projeto de SPDA',
      description: 'Projetos de sistemas de proteção contra descargas atmosféricas',
    },
    {
      title: 'Projeto de Telecomunicações',
      description: 'Projetos de sistemas de telecomunicações',
    },
    {
      title: 'Projeto de Ar Condicionado',
      description: 'Projetos de climatização e ar condicionado',
    },
    {
      title: 'Projeto de Muro de Arrimo',
      description: 'Projetos de contenção e muros de arrimo',
    },
  ]

  const features = [
    {
      icon: TrendingUp,
      title: '+350 Projetos',
      description: 'Entregues com excelência',
    },
    {
      icon: Zap,
      title: 'Tecnologia BIM',
      description: 'Soluções em 3D avançadas',
    },
    {
      icon: Shield,
      title: 'Atendimento',
      description: 'Personalizado e dedicado',
    },
    {
      icon: BarChart3,
      title: 'Qualidade',
      description: 'Garantida em cada projeto',
    },
  ]

  const projects = [
    {
      title: 'Projeto Vertical Contemporâneo',
      description:
        'Edifício de uso misto com fachada verde, iluminação em LED e soluções sustentáveis para centros urbanos. Uma combinação de estética moderna e eficiência construtiva.',
      image: '/api/placeholder/400/300',
    },
    {
      title: 'Residencial de Alto Padrão',
      description:
        'Torre elegante com soluções inteligentes de ventilação e integração paisagística. Projeto que une arquitetura contemporânea, conforto urbano e excelência construtiva.',
      image: '/api/placeholder/400/300',
    },
    {
      title: 'Design de Interiores com Sofisticação',
      description:
        'Ambientes amplos, elegantes e integrados à natureza. Projetos residenciais pensados para oferecer bem-estar, luminosidade e conforto em cada detalhe.',
      image: '/api/placeholder/400/300',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Thess+</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#inicio" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Início
            </a>
            <a href="#servicos" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Serviços
            </a>
            <a href="#sobre" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Sobre
            </a>
            <a href="#projetos" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Projetos
            </a>
            <a href="#contato" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Contato
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button>Quero solicitar um orçamento</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="container py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              ESPECIALISTAS EM{' '}
              <span className="text-primary">BIM 3D</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Projetos Complementares em <strong>BIM 3D</strong> com foco em precisão, inovação e
              responsabilidade.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8">
                  Quero solicitar um orçamento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="container py-20 bg-muted/50">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nossos Serviços</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Projetos Complementares em <strong>BIM 3D</strong> com foco em precisão, inovação e
            responsabilidade.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="container py-20">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sobre a Thess+</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A Thess+ surgiu da necessidade de atender a um mercado cada vez mais escasso na área
            de projetos, principalmente em BIM 3D, pois é uma tecnologia nova no ramo e poucas
            empresas oferecem esse serviço. Em pouco tempo, já nos tornamos destaque na área e
            comercializamos mais de 350 projetos, tanto em Belo Horizonte quanto em outras cidades.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">Fernanda Thees - Fundadora e Diretora Executiva</h3>
            <p className="text-muted-foreground">
              Liderando a equipe com expertise e dedicação para entregar projetos de excelência.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="container py-20 bg-muted/50">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Nossos Projetos</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Conheça alguns dos nossos trabalhos mais recentes e destaque-se com projetos de
            excelência.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <Calendar className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{project.description}</CardDescription>
                  <Button variant="ghost" className="mt-4 w-full">
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="container py-20">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Entre em Contato</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tem alguma dúvida ou gostaria de um orçamento? Preencha o formulário ou entre em
            contato por um dos canais abaixo.
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Envie uma mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário e entraremos em contato em breve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Telefone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="(31) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Assunto
                  </label>
                  <select
                    id="subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option>Solicitar Orçamento</option>
                    <option>Tirar Dúvidas</option>
                    <option>Trabalhe Conosco</option>
                    <option>Outro Assunto</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Sua mensagem aqui..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
          <div>
            <h3 className="font-semibold mb-2">Telefone</h3>
            <p className="text-muted-foreground">(31) 99434-0753</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">E-mail</h3>
            <p className="text-muted-foreground">contato@thessplus.com</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Endereço</h3>
            <p className="text-muted-foreground">Belo Horizonte, MG</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold mb-4">Thess+</h3>
              <p className="text-sm text-muted-foreground">
                Entre em contato: (31) 99434-0753
                <br />
                contato@thessplus.com
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#inicio" className="text-muted-foreground hover:text-foreground">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#servicos" className="text-muted-foreground hover:text-foreground">
                    Serviços
                  </a>
                </li>
                <li>
                  <a href="#sobre" className="text-muted-foreground hover:text-foreground">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#projetos" className="text-muted-foreground hover:text-foreground">
                    Projetos
                  </a>
                </li>
                <li>
                  <a href="#contato" className="text-muted-foreground hover:text-foreground">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Redes Sociais</h4>
              <p className="text-sm text-muted-foreground">
                Siga-nos em nossas redes sociais para ficar por dentro das novidades.
              </p>
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

