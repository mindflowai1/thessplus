import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, User, Mail, Phone, Lock } from 'lucide-react'

export function AccountPage() {
  const { user, userProfile, refreshUserProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  // const [currentPassword, setCurrentPassword] = useState('') // Not used
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
      // Normaliza telefone (remove caracteres não numéricos)
      const phoneDigits = phone.replace(/\D/g, '')

      // Remove o 9 extra se presente (formato: 55 + DDD(2) + número(8) = 12 dígitos)
      let normalizedPhone = phoneDigits
      if (phoneDigits.length === 13 && phoneDigits.startsWith('55')) {
        // Remove o 9 extra: 55 + DDD + 9 + número
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
      // Atualiza senha via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      // setCurrentPassword('') // Not used
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minha Conta</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 dark:text-gray-200" />
            <span>Informações do Perfil</span>
          </CardTitle>
          <CardDescription>Atualize suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center space-x-2">
                <Mail className="h-4 w-4 dark:text-gray-300" />
                <span>E-mail</span>
              </label>
              <Input type="email" value={user?.email || ''} disabled />
              <p className="text-xs text-muted-foreground">
                O e-mail não pode ser alterado
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center space-x-2">
                <User className="h-4 w-4 dark:text-gray-300" />
                <span>Nome Completo</span>
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center space-x-2">
                <Phone className="h-4 w-4 dark:text-gray-300" />
                <span>Telefone</span>
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                placeholder="(31) 99999-9999"
              />
              <p className="text-xs text-muted-foreground">
                Formato: 55 + DDD + número (ex: 553199766846)
              </p>
            </div>
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                    : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2 dark:text-gray-200" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 dark:text-gray-200" />
            <span>Alterar Senha</span>
          </CardTitle>
          <CardDescription>Atualize sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nova Senha</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmar Nova Senha</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <Button onClick={handleChangePassword} disabled={saving} variant="outline">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Atualizando...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2 dark:text-gray-300" />
                  Alterar Senha
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

