import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, User, Mail, Phone, Lock, Shield, KeyRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import './DashboardEngineering.css'

export function AccountPage() {
  const { user, userProfile, refreshUserProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '')
      setPhone(userProfile.phone || '')
    }
  }, [userProfile])

  const handleSaveProfile = async () => {
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      const phoneDigits = phone.replace(/\D/g, '')

      let normalizedPhone = phoneDigits
      if (phoneDigits.length === 13 && phoneDigits.startsWith('55')) {
        normalizedPhone = phoneDigits.slice(0, 4) + phoneDigits.slice(5)
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName || null,
          phone: normalizedPhone || null,
        })

      if (error) throw error

      await refreshUserProfile()
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao atualizar perfil',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user) return

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setNewPassword('')
      setConfirmPassword('')
      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' })
    } catch (error: any) {
      console.error('Error changing password:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Erro ao atualizar senha',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto dashboard-animate-fade-in">
        {/* Page Title */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className={cn(
              "h-7 w-7",
              "text-amber-500 dark:text-amber-400"
            )} strokeWidth={2.5} />
            <h1 className={cn(
              "text-3xl lg:text-4xl font-bold tracking-tight",
              "text-foreground"
            )}>
              Configurações
            </h1>
          </div>
          <p className={cn(
            "text-base lg:text-lg text-muted-foreground ml-10",
            "font-medium"
          )}>
            Gerencie suas informações pessoais e segurança
          </p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <Card className={cn(
              "dashboard-card border-2",
              message.type === 'success'
                ? "border-green-500/30 bg-green-500/10"
                : "border-red-500/30 bg-red-500/10"
            )}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  {message.type === 'success' ? (
                    <Shield className="h-5 w-5 text-green-400" />
                  ) : (
                    <KeyRound className="h-5 w-5 text-red-400" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    message.type === 'success' ? "text-green-300" : "text-red-300"
                  )}>{message.text}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-section-title flex items-center gap-3">
                  <div className="dashboard-summary-icon bg-blue-500/20 border border-blue-500/30">
                    <User className="h-5 w-5 text-blue-400" strokeWidth={2.5} />
                  </div>
                  <span>Informações do Perfil</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>E-mail</span>
                    </label>
                    <Input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="dashboard-filter-input"
                    />
                    <p className="text-xs text-muted-foreground">
                      O e-mail não pode ser alterado
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Nome Completo</span>
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="dashboard-filter-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>Telefone</span>
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                      placeholder="(31) 99999-9999"
                      className="dashboard-filter-input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Formato: 55 + DDD + número (ex: 553199766846)
                    </p>
                  </div>
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={saving}
                    className="dashboard-btn-primary w-full"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-section-title flex items-center gap-3">
                  <div className="dashboard-summary-icon bg-amber-500/20 border border-amber-500/30">
                    <Lock className="h-5 w-5 text-amber-400" strokeWidth={2.5} />
                  </div>
                  <span>Alterar Senha</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Atualize sua senha de acesso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Nova Senha</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      className="dashboard-filter-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Confirmar Nova Senha</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      className="dashboard-filter-input"
                    />
                  </div>
                  <Button 
                    onClick={handleChangePassword} 
                    disabled={saving} 
                    className="dashboard-btn-primary w-full"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Alterar Senha
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
