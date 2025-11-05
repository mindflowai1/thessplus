/**
 * Utilitários para verificação de assinatura e controle de acesso
 */

export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'canceled' | 'expired' | 'past_due'
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise'

export interface SubscriptionInfo {
  status: SubscriptionStatus
  plan: SubscriptionPlan
  endDate?: string | null
  trialEndDate?: string | null
  isActive: boolean
  hasAccess: boolean
}

/**
 * Verifica se a assinatura está ativa (considerando trial e active)
 */
export function isSubscriptionActive(status?: SubscriptionStatus): boolean {
  if (!status) return false
  return status === 'active' || status === 'trial'
}

/**
 * Verifica se a assinatura não expirou
 */
export function isSubscriptionNotExpired(
  status?: SubscriptionStatus,
  endDate?: string | null
): boolean {
  if (!status || status === 'free') return true
  if (status === 'expired') return false
  
  if (!endDate) return isSubscriptionActive(status)
  
  const end = new Date(endDate)
  const now = new Date()
  return end > now
}

/**
 * Verifica se o trial ainda está válido
 */
export function isTrialValid(trialEndDate?: string | null): boolean {
  if (!trialEndDate) return false
  
  const trialEnd = new Date(trialEndDate)
  const now = new Date()
  return trialEnd > now
}

/**
 * Verifica se o usuário tem acesso ao Dashboard
 */
export function hasDashboardAccess(
  status?: SubscriptionStatus,
  plan?: SubscriptionPlan,
  endDate?: string | null
): boolean {
  // Plano free sempre tem acesso básico
  if (plan === 'free' || !plan) return true
  
  // Verifica se está ativo e não expirou
  if (isSubscriptionActive(status) && isSubscriptionNotExpired(status, endDate)) {
    return true
  }
  
  // Se é trial, verifica se ainda está válido
  if (status === 'trial') {
    return true // Assumindo que trial_end_date é verificado separadamente
  }
  
  return false
}

/**
 * Verifica se o usuário tem acesso a funcionalidades premium
 */
export function hasPremiumAccess(
  status?: SubscriptionStatus,
  plan?: SubscriptionPlan,
  endDate?: string | null
): boolean {
  // Apenas plans basic, premium ou enterprise têm acesso premium
  if (!plan || plan === 'free') return false
  
  return hasDashboardAccess(status, plan, endDate)
}

/**
 * Retorna informações completas da assinatura
 */
export function getSubscriptionInfo(
  status?: SubscriptionStatus,
  plan?: SubscriptionPlan,
  endDate?: string | null,
  trialEndDate?: string | null
): SubscriptionInfo {
  const finalStatus = status || 'free'
  const finalPlan = plan || 'free'
  
  const isActive = isSubscriptionActive(finalStatus)
  const notExpired = isSubscriptionNotExpired(finalStatus, endDate)
  const trialValid = isTrialValid(trialEndDate)
  
  // Tem acesso se:
  // - É free (sempre tem acesso básico)
  // - Está ativo e não expirou
  // - Está em trial e ainda é válido
  const hasAccess = finalPlan === 'free' || 
                   (isActive && notExpired) || 
                   (finalStatus === 'trial' && trialValid)
  
  return {
    status: finalStatus,
    plan: finalPlan,
    endDate: endDate || null,
    trialEndDate: trialEndDate || null,
    isActive: isActive && notExpired,
    hasAccess,
  }
}

/**
 * Retorna o nome do plano em português
 */
export function getPlanName(plan?: SubscriptionPlan): string {
  const names: Record<SubscriptionPlan, string> = {
    free: 'Gratuito',
    basic: 'Básico',
    premium: 'Premium',
    enterprise: 'Enterprise',
  }
  return names[plan || 'free']
}

/**
 * Retorna o status da assinatura em português
 */
export function getStatusName(status?: SubscriptionStatus): string {
  const names: Record<SubscriptionStatus, string> = {
    free: 'Gratuito',
    trial: 'Período de Teste',
    active: 'Ativa',
    canceled: 'Cancelada',
    expired: 'Expirada',
    past_due: 'Pagamento Pendente',
  }
  return names[status || 'free']
}

