/**
 * Serviço para criar usuários no Supabase após pagamento aprovado
 * 
 * IMPORTANTE: Este serviço deve ser usado apenas em Edge Functions do Supabase
 * com Service Role Key, nunca no frontend!
 */

export interface CreateUserData {
  email: string
  password?: string // Se não fornecido, gera senha temporária
  fullName?: string
  phone?: string
  metadata?: Record<string, any>
}

/**
 * Cria um usuário no Supabase Auth
 * 
 * Esta função deve ser chamada apenas em Edge Functions com Service Role Key
 * 
 * @param userData - Dados do usuário a ser criado
 * @param serviceRoleKey - Service Role Key do Supabase (NUNCA exponha no frontend!)
 * @returns Dados do usuário criado
 */
export async function createUserInSupabase(
  userData: CreateUserData,
  serviceRoleKey: string,
  supabaseUrl: string
): Promise<{
  userId: string
  email: string
  temporaryPassword?: string
}> {
  // Gera senha temporária se não fornecida
  const password = userData.password || generateTemporaryPassword()
  
  try {
    // Cria usuário via Admin API
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({
        email: userData.email,
        password: password,
        email_confirm: true, // Confirma email automaticamente
        user_metadata: {
          full_name: userData.fullName || null,
          phone: userData.phone || null,
          ...userData.metadata,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao criar usuário')
    }

    const user = await response.json()

    // Cria perfil na tabela profiles
    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        id: user.id,
        full_name: userData.fullName || null,
        phone: userData.phone || null,
        subscription_status: 'active',
        subscription_plan: 'premium',
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +1 mês
        subscription_renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        payment_provider: 'perfectpay',
      }),
    })

    if (!profileResponse.ok) {
      console.error('Erro ao criar perfil:', await profileResponse.text())
      // Não falha se o perfil não for criado, pode ser criado depois
    }

    return {
      userId: user.id,
      email: user.email,
      temporaryPassword: userData.password ? undefined : password,
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    throw error
  }
}

/**
 * Gera uma senha temporária segura
 */
function generateTemporaryPassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Garante pelo menos uma letra maiúscula, minúscula, número e caractere especial
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
  
  // Preenche o resto
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Embaralha a senha
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Envia email com credenciais para o usuário
 * 
 * Esta função deve ser chamada em Edge Function ou backend
 * 
 * @param email - Email do usuário
 * @param password - Senha temporária
 * @param fullName - Nome completo do usuário
 * @param appUrl - URL da aplicação (para links no email)
 */
export async function sendWelcomeEmail(
  email: string,
  password: string,
  fullName?: string,
  appUrl?: string
): Promise<void> {
  // Implementar envio de email via serviço de email (SendGrid, Resend, etc.)
  // Por enquanto, apenas loga (em produção, usar serviço real)
  const url = appUrl || 'https://seu-dominio.com'
  
  console.log('Enviando email de boas-vindas:', {
    to: email,
    subject: 'Bem-vindo ao Thess+ - Suas credenciais de acesso',
    body: `
      Olá ${fullName || 'Usuário'},

      Sua conta foi criada com sucesso!

      Email: ${email}
      Senha temporária: ${password}

      Por favor, altere sua senha após o primeiro login.

      Acesse: ${url}/auth

      Atenciosamente,
      Equipe Thess+
    `,
  })
  
  // TODO: Implementar envio real de email
  // Exemplo com Resend:
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${RESEND_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     from: 'noreply@seu-dominio.com',
  //     to: email,
  //     subject: 'Bem-vindo ao Thess+ - Suas credenciais de acesso',
  //     html: `...`,
  //   }),
  // })
}

