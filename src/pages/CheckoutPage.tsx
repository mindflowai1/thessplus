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
  const [phone, setPhone] = useState('')
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
        fullName || undefined, // customerName (opcional)
        phone || undefined // customerPhone (opcional)
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

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => {
                    // Remove tudo que não é número
                    const numbers = e.target.value.replace(/\D/g, '')
                    // Formata como (XX) XXXXX-XXXX
                    let formatted = numbers
                    if (numbers.length > 0) {
                      formatted = `(${numbers.slice(0, 2)}`
                      if (numbers.length > 2) {
                        formatted += `) ${numbers.slice(2, 7)}`
                        if (numbers.length > 7) {
                          formatted += `-${numbers.slice(7, 11)}`
                        }
                      }
                    }
                    setPhone(formatted)
                  }}
                  disabled={isRedirecting}
                  maxLength={15}
                />
                <p className="text-xs text-muted-foreground">
                  Opcional - Ajuda na identificação da conta
                </p>
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


