// =============================================
// EDGE FUNCTION: check-email
// Deploy via Supabase CLI or Dashboard
// =============================================
// 
// This function checks if an email exists in auth.users
// Call before sending magic link to prevent unauthorized access
//
// Deployment:
// 1. supabase functions new check-email
// 2. Copy this code to supabase/functions/check-email/index.ts
// 3. supabase functions deploy check-email
//
// Usage from client:
// const { data, error } = await supabase.functions.invoke('check-email', {
//   body: { email: 'user@example.com' }
// })

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if user exists
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      throw error
    }

    const userExists = users.users.some(user => user.email === email)

    return new Response(
      JSON.stringify({ authorized: userExists }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
