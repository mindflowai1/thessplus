import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/services/supabase'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { AuthTransition } from '@/components/AuthTransition'
// Importar logos - usar caminhos absolutos para garantir funcionamento em produção
import logoLight from '@/assets/Logo1.png'
import logoDark from '@/assets/Logo 2.png'

// Fallback: usar logo do public se os imports falharem
const FALLBACK_LOGO = '/logo.png'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const { user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Garantir que o logo seja atualizado quando o tema mudar
  // Usar fallback se os imports não funcionarem
  const logo = theme === 'dark' 
    ? (logoDark || FALLBACK_LOGO) 
    : (logoLight || FALLBACK_LOGO)
  
  // Debug: verificar tema e logo atual
  useEffect(() => {
    console.log('Theme changed:', theme)
    console.log('Logo URL:', logo)
    console.log('Logo Light:', logoLight)
    console.log('Logo Dark:', logoDark)
  }, [theme, logo])

  // Verificar se voltou após pagamento
  useEffect(() => {
    const paymentParam = searchParams.get('payment')
    if (paymentParam === 'success') {
      setPaymentSuccess(true)
      // Remover o parâmetro da URL sem recarregar a página
      navigate('/auth', { replace: true })
    }
  }, [searchParams, navigate])

  useEffect(() => {
    if (user) {
      setIsTransitioning(true)
      // Delay para mostrar a animação antes de navegar
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }
  }, [user, navigate])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Apenas login - cadastro é feito após pagamento
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      setIsTransitioning(true)
      // Delay para mostrar a animação antes de navegar
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }


  return (
    <AuthTransition isTransitioning={isTransitioning}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Voltar</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <Link to="/" className="flex items-center justify-center space-x-2 group">
            <img 
              src={logo} 
              alt="Thess+" 
              key={`${theme}-${logo}`} // Forçar re-render quando o tema ou logo mudar
              className="h-12 w-auto group-hover:scale-105 transition-transform" 
              onError={(e) => {
                console.error('Erro ao carregar logo:', logo)
                console.error('Tema atual:', theme)
                console.error('Logo Light:', logoLight)
                console.error('Logo Dark:', logoDark)
                // Fallback para logo do public
                if (e.currentTarget.src !== FALLBACK_LOGO) {
                  e.currentTarget.src = FALLBACK_LOGO
                }
              }}
              onLoad={() => {
                console.log('Logo carregado com sucesso:', logo)
              }}
            />
          </Link>
          <CardDescription className="text-center">
            Entre na sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentSuccess && (
            <div className="mb-4 p-3 text-sm bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-200">
                  Pagamento realizado com sucesso!
                </p>
                <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                  Sua conta foi criada automaticamente. Faça login com o email usado no pagamento.
                  A senha foi enviada por email.
                </p>
              </div>
            </div>
          )}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <p className="text-muted-foreground">
              Não tem uma conta?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/checkout')}
              className="w-full"
            >
              Assinar agora
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Sua conta será criada automaticamente após o pagamento ser aprovado
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </AuthTransition>
  )
}

