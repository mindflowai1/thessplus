/**
 * Edge Function do Supabase para processar webhooks da PerfectPay
 * 
 * Como usar:
 * 1. Instale o Supabase CLI: npm install -g supabase
 * 2. Faça login: supabase login
 * 3. Link seu projeto: supabase link --project-ref seu-project-ref
 * 4. Deploy: supabase functions deploy perfectpay-webhook
 * 
 * Configure as variáveis de ambiente no Supabase Dashboard:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - APP_URL (URL da sua aplicação)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handlePerfectPayWebhook } from '../../../src/services/webhook.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Obter variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const appUrl = Deno.env.get('APP_URL') || 'https://seu-dominio.com'

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Variáveis de ambiente não configuradas' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Obter dados do webhook
    const webhookData = await req.json()

    // Processar webhook
    const result = await handlePerfectPayWebhook(
      webhookData,
      supabaseUrl,
      serviceRoleKey,
      appUrl
    )

    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erro ao processar webhook',
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

