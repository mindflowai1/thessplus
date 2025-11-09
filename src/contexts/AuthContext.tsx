import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'
import { hasDashboardAccess, hasPremiumAccess as checkPremiumAccess, getSubscriptionInfo as getSubInfo, SubscriptionInfo } from '@/lib/subscription'

interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
  subscription_status?: 'free' | 'trial' | 'active' | 'canceled' | 'expired' | 'past_due'
  subscription_plan?: 'free' | 'basic' | 'premium' | 'enterprise'
  subscription_start_date?: string | null
  subscription_end_date?: string | null
  subscription_renewal_date?: string | null
  payment_provider?: 'stripe' | 'mercadopago' | 'asaas' | 'pagar_me' | 'perfectpay' | null
  payment_customer_id?: string | null
  payment_subscription_id?: string | null
  trial_end_date?: string | null
}

interface AuthContextType {
  session: Session | null
  user: User | null
  userProfile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshUserProfile: () => Promise<void>
  hasAccess: () => boolean
  hasPremiumAccess: () => boolean
  getSubscriptionInfo: () => SubscriptionInfo | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFetchingProfile, setIsFetchingProfile] = useState(false)

  const fetchUserProfile = async (userId: string, currentUser?: User) => {
    // Evita múltiplas chamadas simultâneas
    if (isFetchingProfile) {
      return
    }

    setIsFetchingProfile(true)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        setIsFetchingProfile(false)
        return
      }

      if (data) {
        setUserProfile(data)
      } else {
        // Cria perfil se não existir
        const userToUse = currentUser || user
        const fullName = userToUse?.user_metadata?.full_name || userToUse?.email?.split('@')[0] || null
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: fullName,
          })
          .select()
          .single()

        if (!createError && newProfile) {
          setUserProfile(newProfile)
        } else if (createError) {
          console.error('Error creating profile:', createError)
          // Se já existe (erro de chave duplicada), busca novamente
          if (createError.code === '23505') {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single()
            if (existingProfile) {
              setUserProfile(existingProfile)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    } finally {
      setIsFetchingProfile(false)
    }
  }

  const refreshUserProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id, user)
    }
  }

  // Funções de verificação de acesso
  const hasAccess = () => {
    if (!userProfile) return false
    return hasDashboardAccess(
      userProfile.subscription_status,
      userProfile.subscription_plan,
      userProfile.subscription_end_date
    )
  }

  const hasPremiumAccess = () => {
    if (!userProfile) return false
    return checkPremiumAccess(
      userProfile.subscription_status,
      userProfile.subscription_plan,
      userProfile.subscription_end_date
    )
  }

  const getSubscriptionInfo = () => {
    if (!userProfile) return null
    return getSubInfo(
      userProfile.subscription_status,
      userProfile.subscription_plan,
      userProfile.subscription_end_date,
      userProfile.trial_end_date
    )
  }

  const signInWithGoogle = async () => {
    try {
      // Verifica se já existe um refresh token salvo
      const savedGoogleRefreshToken = localStorage.getItem('google_refresh_token')
      
      // Se já tem refresh token, usa 'select_account' para manter sessão ativa
      // Se não tem, usa 'consent' para solicitar permissão
      const prompt = savedGoogleRefreshToken ? 'select_account' : 'consent'
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline', // Garante que recebemos refresh token
            prompt: prompt, // 'select_account' mantém sessão, 'consent' solicita nova permissão
          },
          scopes: 'https://www.googleapis.com/auth/calendar',
        },
      })

      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Salva o refresh token do Google antes de fazer logout
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.provider_refresh_token) {
        localStorage.setItem('google_refresh_token', session.provider_refresh_token)
      }
      
      setUserProfile(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  useEffect(() => {
    // Verifica sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Salva refresh token do Google se existir
      if (session?.provider_refresh_token) {
        localStorage.setItem('google_refresh_token', session.provider_refresh_token)
      }
      
      // Busca perfil em background (não bloqueia o loading)
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user)
      }
    })

    // Escuta mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Salva o refresh token do Google quando autenticar
        if (session.provider_refresh_token) {
          localStorage.setItem('google_refresh_token', session.provider_refresh_token)
        }
        
        // Busca perfil em background
        fetchUserProfile(session.user.id, session.user)
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signOut,
        refreshUserProfile,
        hasAccess,
        hasPremiumAccess,
        getSubscriptionInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

