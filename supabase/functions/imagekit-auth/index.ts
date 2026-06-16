import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const jsonResponse = (body: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const toHex = (buffer: ArrayBuffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const createSignature = async (privateKey: string, token: string, expire: number) => {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(privateKey),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  )

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${token}${expire}`))
  return toHex(signature)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const imagekitPrivateKey = Deno.env.get('IMAGEKIT_PRIVATE_KEY')
  const imagekitPublicKey = Deno.env.get('IMAGEKIT_PUBLIC_KEY')

  if (!imagekitPrivateKey || !imagekitPublicKey) {
    return jsonResponse({ error: 'ImageKit server secrets are not configured' }, 500)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const authHeader = req.headers.get('Authorization')

  if (!supabaseUrl || !supabaseAnonKey || !authHeader) {
    return jsonResponse({ error: 'Sesi login tidak ditemukan. Silakan login ulang.' }, 401)
  }

  const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (!accessToken || accessToken === supabaseAnonKey) {
    return jsonResponse({ error: 'Sesi login tidak valid. Silakan login ulang.' }, 401)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey)

  const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)

  if (userError || !user) {
    return jsonResponse({ error: 'Sesi login tidak valid. Silakan login ulang.' }, 401)
  }

  const dataClient = supabaseServiceRoleKey
    ? supabase
    : createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    })

  const { data: merchant, error: merchantError } = await dataClient
    .from('merchant_details')
    .select('status')
    .eq('id', user.id)
    .maybeSingle()

  if (merchantError) {
    return jsonResponse({ error: 'Gagal memeriksa status merchant.' }, 500)
  }

  if (!merchant || !['active', 'aktif'].includes(String(merchant.status).toLowerCase())) {
    return jsonResponse({ error: 'Upload gambar hanya tersedia untuk merchant aktif.' }, 403)
  }

  const token = crypto.randomUUID()
  const expire = Math.floor(Date.now() / 1000) + 5 * 60
  const signature = await createSignature(imagekitPrivateKey, token, expire)

  return jsonResponse({
    token,
    expire,
    signature,
    publicKey: imagekitPublicKey,
    uploadUrl: 'https://upload.imagekit.io/api/v1/files/upload',
    folder: `/anturun/merchant_${user.id}`,
  })
})
