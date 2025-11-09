/**
 * Serviço de integração com PerfectPay
 * 
 * A PerfectPay funciona através de:
 * 1. Criação de produto na plataforma PerfectPay
 * 2. Geração de link de checkout
 * 3. Redirecionamento do usuário para o checkout
 * 4. Webhook para receber notificações de pagamento
 */

export interface PerfectPayConfig {
  productId: string // ID do produto criado na PerfectPay
  apiUrl?: string // URL da API da PerfectPay (opcional, se usar API)
}

// Configuração padrão - deve ser definida via variáveis de ambiente
const PERFECTPAY_PRODUCT_ID = import.meta.env.VITE_PERFECTPAY_PRODUCT_ID || ''
const PERFECTPAY_API_URL = import.meta.env.VITE_PERFECTPAY_API_URL || 'https://app.perfectpay.com.br'

/**
 * Gera o link de checkout da PerfectPay
 * 
 * @param userId - ID do usuário (para rastreamento)
 * @param customerEmail - Email do cliente
 * @param customerName - Nome do cliente
 * @returns URL de checkout da PerfectPay
 */
export function generateCheckoutUrl(
  userId: string,
  customerEmail: string,
  customerName?: string
): string {
  if (!PERFECTPAY_PRODUCT_ID) {
    throw new Error('PERFECTPAY_PRODUCT_ID não configurado')
  }

  // URL base do checkout da PerfectPay
  const baseUrl = `${PERFECTPAY_API_URL}/checkout`
  
  // Parâmetros do checkout
  const params = new URLSearchParams({
    product: PERFECTPAY_PRODUCT_ID,
    email: customerEmail,
    ...(customerName && { name: customerName }),
    // Custom field para rastrear o usuário (usado no webhook)
    custom: userId,
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * Redireciona o usuário para o checkout da PerfectPay
 */
export function redirectToCheckout(
  userId: string,
  customerEmail: string,
  customerName?: string
): void {
  const checkoutUrl = generateCheckoutUrl(userId, customerEmail, customerName)
  window.location.href = checkoutUrl
}

/**
 * Valida os dados do webhook da PerfectPay
 * 
 * @param webhookData - Dados recebidos do webhook
 * @returns true se os dados são válidos
 */
export function validateWebhook(webhookData: any): boolean {
  // Implementar validação conforme documentação da PerfectPay
  // Geralmente envolve verificar assinatura/token
  return (
    webhookData &&
    webhookData.status &&
    webhookData.transaction_id &&
    webhookData.custom // userId
  )
}

/**
 * Processa o webhook da PerfectPay e retorna dados formatados
 */
export function processWebhook(webhookData: any): {
  userId: string
  transactionId: string
  status: 'approved' | 'pending' | 'cancelled' | 'refunded'
  amount: number
  paymentDate: string
} | null {
  if (!validateWebhook(webhookData)) {
    return null
  }

  return {
    userId: webhookData.custom || webhookData.user_id,
    transactionId: webhookData.transaction_id || webhookData.id,
    status: mapPerfectPayStatus(webhookData.status),
    amount: parseFloat(webhookData.amount || webhookData.value || '0'),
    paymentDate: webhookData.payment_date || webhookData.date || new Date().toISOString(),
  }
}

/**
 * Mapeia o status da PerfectPay para status interno
 */
function mapPerfectPayStatus(status: string): 'approved' | 'pending' | 'cancelled' | 'refunded' {
  const statusLower = status.toLowerCase()
  
  if (statusLower.includes('aprovado') || statusLower.includes('approved') || statusLower === 'paid') {
    return 'approved'
  }
  if (statusLower.includes('pendente') || statusLower.includes('pending') || statusLower === 'waiting') {
    return 'pending'
  }
  if (statusLower.includes('cancelado') || statusLower.includes('cancelled') || statusLower === 'canceled') {
    return 'cancelled'
  }
  if (statusLower.includes('reembolsado') || statusLower.includes('refunded') || statusLower === 'refund') {
    return 'refunded'
  }
  
  return 'pending'
}


