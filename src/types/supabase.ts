export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
          subscription_status?: 'free' | 'trial' | 'active' | 'canceled' | 'expired' | 'past_due' | null
          subscription_plan?: 'free' | 'basic' | 'premium' | 'enterprise' | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          subscription_renewal_date?: string | null
          payment_provider?: 'stripe' | 'mercadopago' | 'asaas' | 'pagar_me' | null
          payment_customer_id?: string | null
          payment_subscription_id?: string | null
          trial_end_date?: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          subscription_status?: 'free' | 'trial' | 'active' | 'canceled' | 'expired' | 'past_due' | null
          subscription_plan?: 'free' | 'basic' | 'premium' | 'enterprise' | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          subscription_renewal_date?: string | null
          payment_provider?: 'stripe' | 'mercadopago' | 'asaas' | 'pagar_me' | null
          payment_customer_id?: string | null
          payment_subscription_id?: string | null
          trial_end_date?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          subscription_status?: 'free' | 'trial' | 'active' | 'canceled' | 'expired' | 'past_due' | null
          subscription_plan?: 'free' | 'basic' | 'premium' | 'enterprise' | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          subscription_renewal_date?: string | null
          payment_provider?: 'stripe' | 'mercadopago' | 'asaas' | 'pagar_me' | null
          payment_customer_id?: string | null
          payment_subscription_id?: string | null
          trial_end_date?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          descricao: string
          tipo: 'Entrada' | 'Saída'
          categoria: string
          valor: number
          data: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          descricao: string
          tipo: 'Entrada' | 'Saída'
          categoria: string
          valor: number
          data: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          descricao?: string
          tipo?: 'Entrada' | 'Saída'
          categoria?: string
          valor?: number
          data?: string
          created_at?: string
          updated_at?: string
        }
      }
      limites_gastos: {
        Row: {
          id: string
          user_id: string
          alimentacao: number
          lazer: number
          impostos: number
          saude: number
          transporte: number
          moradia: number
          educacao: number
          outros: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          alimentacao?: number
          lazer?: number
          impostos?: number
          saude?: number
          transporte?: number
          moradia?: number
          educacao?: number
          outros?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          alimentacao?: number
          lazer?: number
          impostos?: number
          saude?: number
          transporte?: number
          moradia?: number
          educacao?: number
          outros?: number
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          date: string
          time: string | null
          google_event_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          date: string
          time?: string | null
          google_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string | null
          google_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

