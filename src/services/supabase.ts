import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `Missing Supabase environment variables. 
  VITE_SUPABASE_URL: ${supabaseUrl ? 'set' : 'NOT SET'}
  VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'set' : 'NOT SET'}
  Please check your environment variables configuration.`
  console.error(errorMsg)
  throw new Error(errorMsg)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

