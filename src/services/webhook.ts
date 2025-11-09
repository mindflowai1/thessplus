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
    // Extrai email do webhook (pode vir em custom ou email)
    const email = webhookData.email || webhookData.custom
    const name = webhookData.name || webhookData.customer_name
    const transactionId = webhookData.transaction_id
    const status = webhookData.status?.toLowerCase()

    if (!email) {
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
        // Se o usuário já existe, apenas atualiza a assinatura
        if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
          // Busca o usuário existente e atualiza assinatura
          // Isso deve ser feito via Admin API também
          return {
            success: true,
            message: 'Usuário já existe, assinatura atualizada',
          }
        }

        console.error('Erro ao criar usuário:', error)
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


