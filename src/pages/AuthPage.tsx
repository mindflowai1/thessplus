import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/services/supabase'
import { Loader2, ArrowLeft } from 'lucide-react'
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
  const { signInWithGoogle, user } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  
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

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
      setIsTransitioning(true)
    } catch (error: any) {
      setError(error.message || 'Erro ao autenticar com Google')
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar com Google
          </Button>

          <div className="mt-4 text-center text-sm space-y-2">
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

