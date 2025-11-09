import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { redirectToCheckout } from '@/services/perfectPay'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, CreditCard, Mail, User } from 'lucide-react'
import { motion } from 'framer-motion'

export function CheckoutPage() {
  const navigate = useNavigate()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Validação
    if (!email || !email.includes('@')) {
      setError('Por favor, informe um email válido')
      return
    }

    setIsRedirecting(true)
    setError(null)

    try {
      // Usar email como userId temporário (será usado no webhook para identificar o usuário)
      redirectToCheckout(
        email, // userId (usando email como identificador temporário)
        email, // customerEmail
        fullName || undefined // customerName (opcional)
      )
    } catch (error: any) {
      console.error('Erro ao redirecionar para checkout:', error)
      setError(error.message || 'Erro ao redirecionar para checkout')
      setIsRedirecting(false)
    }
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Redirecionando para o checkout...
          </h2>
          <p className="text-sm text-muted-foreground">
            Aguarde enquanto preparamos seu pagamento
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Finalizar Assinatura</CardTitle>
                <CardDescription>
                  Preencha seus dados para continuar com o pagamento
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isRedirecting}
                />
                <p className="text-xs text-muted-foreground">
                  Sua conta será criada após o pagamento ser aprovado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isRedirecting}
                />
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plano:</span>
                  <span className="font-medium">Plano Thess+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-medium text-primary">R$ 45,00/mês</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                  disabled={isRedirecting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isRedirecting || !email}
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Redirecionando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Ir para Pagamento
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Pagamento seguro processado pela PerfectPay. 
                Sua conta será criada automaticamente após o pagamento ser aprovado.
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


