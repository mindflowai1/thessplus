/**
 * Serviço para processar webhooks de pagamento
 * 
 * Este serviço processa webhooks recebidos da PerfectPay
 * e cria a conta do usuário no Supabase após pagamento aprovado
 * 
 * IMPORTANTE: Este serviço deve ser usado em Edge Functions do Supabase
 * com Service Role Key para criar usuários
 */

import { createUserInSupabase, sendWelcomeEmail } from './userCreation'

export interface WebhookData {
  status: string
  transaction_id: string
  custom?: string // email do usuário (não mais userId)
  email?: string // email do cliente
  name?: string // nome do cliente
  amount?: string | number
  payment_date?: string
  [key: string]: any
}

/**
 * Processa o webhook da PerfectPay e cria conta após pagamento aprovado
 * 
 * Esta função deve ser chamada por um endpoint do backend (Edge Function do Supabase)
 * que recebe o webhook da PerfectPay
 * 
 * IMPORTANTE: Requer Service Role Key do Supabase para criar usuários
 * 
 * @param webhookData - Dados do webhook da PerfectPay
 * @param supabaseUrl - URL do projeto Supabase
 * @param serviceRoleKey - Service Role Key do Supabase (NUNCA exponha no frontend!)
 * @returns Resultado do processamento
 */
export async function handlePerfectPayWebhook(
  webhookData: WebhookData,
  supabaseUrl: string,
  serviceRoleKey: string,
  appUrl?: string
): Promise<{
  success: boolean
  message: string
  userId?: string
  email?: string
}> {
  try {
    // Log dos dados recebidos para debug
    console.log('Webhook data received:', JSON.stringify(webhookData, null, 2))
    
    // Extrai email do webhook (pode vir em vários campos diferentes)
    const email = webhookData.email || 
                  webhookData.custom || 
                  webhookData.customer_email ||
                  webhookData.buyer_email
    
    const name = webhookData.name || 
                 webhookData.customer_name || 
                 webhookData.buyer_name ||
                 webhookData.full_name
    
    const transactionId = webhookData.transaction_id || 
                         webhookData.id || 
                         webhookData.payment_id
    
    const status = webhookData.status?.toLowerCase()

    console.log('Extracted data:', { email, name, transactionId, status })

    if (!email) {
      console.error('Email not found in webhook data. Available fields:', Object.keys(webhookData))
      return {
        success: false,
        message: 'Email não encontrado nos dados do webhook',
      }
    }

    // Se o pagamento foi aprovado, cria a conta
    if (status === 'approved' || status === 'aprovado' || status === 'paid') {
      try {
        // Cria usuário no Supabase
        const userResult = await createUserInSupabase(
          {
            email: email,
            fullName: name,
            metadata: {
              transaction_id: transactionId,
              payment_provider: 'perfectpay',
            },
          },
          serviceRoleKey,
          supabaseUrl
        )

        // Envia email de boas-vindas com credenciais
        if (userResult.temporaryPassword) {
          // appUrl pode ser passado como parâmetro ou obtido de variável de ambiente
          // Nota: Deno está disponível apenas em Edge Functions do Supabase
          const finalAppUrl = appUrl || import.meta.env.VITE_APP_URL || 'https://seu-dominio.com'
          await sendWelcomeEmail(
            userResult.email,
            userResult.temporaryPassword,
            name,
            finalAppUrl
          )
        }

        return {
          success: true,
          message: 'Conta criada com sucesso',
          userId: userResult.userId,
          email: userResult.email,
        }
      } catch (error: any) {
        console.error('Erro ao criar usuário:', error)
        
        // Se o usuário já existe, tenta atualizar apenas a assinatura
        if (error.message?.includes('already registered') || 
            error.message?.includes('already exists') ||
            error.message?.includes('duplicate') ||
            error.message?.includes('User already registered')) {
          
          console.log('Usuário já existe, tentando atualizar assinatura...')
          
          try {
            // Busca o usuário existente pelo email
            const getUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
              },
            })
            
            if (getUserResponse.ok) {
              const users = await getUserResponse.json()
              const existingUser = users.users?.find((u: any) => u.email === email)
              
              if (existingUser) {
                // Atualiza o perfil com a assinatura ativa
                const updateProfileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${existingUser.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Prefer': 'return=representation',
                  },
                  body: JSON.stringify({
                    subscription_status: 'active',
                    subscription_plan: 'premium',
                    subscription_start_date: new Date().toISOString(),
                    subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    subscription_renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    payment_provider: 'perfectpay',
                  }),
                })
                
                if (updateProfileResponse.ok) {
                  return {
                    success: true,
                    message: 'Usuário já existe, assinatura atualizada com sucesso',
                    userId: existingUser.id,
                    email: existingUser.email,
                  }
                }
              }
            }
          } catch (updateError) {
            console.error('Erro ao atualizar assinatura do usuário existente:', updateError)
          }
          
          return {
            success: true,
            message: 'Usuário já existe. Se não recebeu o email, entre em contato com o suporte.',
          }
        }

        return {
          success: false,
          message: `Erro ao criar conta: ${error.message}`,
        }
      }
    }

    // Se o pagamento foi cancelado ou reembolsado
    if (status === 'cancelled' || status === 'cancelado' || status === 'refunded' || status === 'reembolsado') {
      // Marca como cancelado na tabela pending_users (se existir)
      return {
        success: true,
        message: 'Pagamento cancelado ou reembolsado',
      }
    }

    // Para outros status (pending, etc), apenas registra
    return {
      success: true,
      message: `Status do pagamento: ${status}. Aguardando confirmação.`,
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return {
      success: false,
      message: 'Erro ao processar webhook',
    }
  }
}


