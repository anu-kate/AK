import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

const encoder = new TextEncoder()

const base64Url = (input: ArrayBuffer | string) => {
  const bytes = typeof input === 'string' ? encoder.encode(input) : new Uint8Array(input)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const importPrivateKey = async (privateKeyPem: string) => {
  const pem = privateKeyPem.replace(/\\n/g, '\n')
  const key = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')
  const binary = Uint8Array.from(atob(key), (char) => char.charCodeAt(0))

  return crypto.subtle.importKey(
    'pkcs8',
    binary.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
}

const getAccessToken = async () => {
  const clientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL')
  const privateKey = Deno.env.get('FIREBASE_PRIVATE_KEY')
  if (!clientEmail || !privateKey) throw new Error('Firebase service account secrets are not configured')

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  const unsignedJwt = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claim))}`
  const cryptoKey = await importPrivateKey(privateKey)
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, encoder.encode(unsignedJwt))
  const jwt = `${unsignedJwt}.${base64Url(signature)}`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  })

  if (!response.ok) throw new Error(`Failed to get Firebase access token: ${await response.text()}`)
  const data = await response.json()
  return data.access_token as string
}

const getAppDriverUrl = () => {
  const appUrl = Deno.env.get('APP_PUBLIC_URL')?.trim().replace(/\/+$/, '')
  if (!appUrl || !/^https:\/\//i.test(appUrl)) return null
  return `${appUrl}/driver`
}

type PushToken = {
  fcm_token: string
  platform?: string | null
  notification_sound?: string | null
  notification_channel_id?: string | null
}

const getAndroidSoundName = (sound?: string | null) => {
  if (sound === 'urgent') return 'order_alert'
  if (sound === 'silent') return undefined
  return 'order_chime'
}

const sendFcmMessage = async (accessToken: string, tokenRow: PushToken, payload: Record<string, string>) => {
  const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID is not configured')

  const token = tokenRow.fcm_token
  const driverUrl = getAppDriverUrl()
  const isAndroid = tokenRow.platform === 'android'
  const androidSound = getAndroidSoundName(tokenRow.notification_sound)
  const androidNotification: Record<string, unknown> = {
    title: payload.title,
    body: payload.body,
    channel_id: tokenRow.notification_channel_id || 'driver_orders_default',
    notification_priority: 'PRIORITY_MAX',
    visibility: 'PUBLIC'
  }

  if (androidSound) {
    androidNotification.sound = androidSound
  }

  const webpush: Record<string, unknown> = {
    headers: {
      Urgency: 'high',
      TTL: '3600'
    },
    notification: {
      title: payload.title,
      body: payload.body,
      icon: '/icons/driver-192.png',
      badge: '/icons/driver-192.png',
      tag: payload.order_id ? `order-${payload.order_id}` : 'driver-new-order',
      data: {
        url: payload.url,
        order_id: payload.order_id
      }
    }
  }

  if (driverUrl) {
    webpush.fcm_options = {
      link: driverUrl
    }
  }

  const response = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: {
        token,
        notification: {
          title: payload.title,
          body: payload.body
        },
        data: payload,
        ...(isAndroid ? {
          android: {
            priority: 'HIGH',
            ttl: '3600s',
            notification: androidNotification
          }
        } : {}),
        webpush
      }
    })
  })

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: await response.text()
    }
  }

  return { ok: true, status: response.status }
}

const isInvalidFcmTokenError = (error: string) => {
  return [
    'UNREGISTERED',
    'INVALID_ARGUMENT',
    'SENDER_ID_MISMATCH',
    'Requested entity was not found'
  ].some((marker) => error.includes(marker))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !serviceRoleKey) throw new Error('Supabase service role is not configured')

    const { order_id, merchant_name } = await req.json()
    if (!order_id) throw new Error('order_id is required')

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    const { data: tokens, error } = await supabase
      .from('driver_push_tokens')
      .select('fcm_token, platform, notification_sound, notification_channel_id')
      .eq('is_active', true)

    if (error) throw error
    if (!tokens?.length) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const accessToken = await getAccessToken()
    const payload = {
      order_id: String(order_id),
      title: 'Orderan Baru Masuk',
      body: merchant_name ? `Order baru dari ${merchant_name}.` : 'Ada orderan baru tersedia di bursa driver.',
      url: '/driver'
    }

    const results = await Promise.allSettled(
      tokens.map((row) => sendFcmMessage(accessToken, row, payload))
    )

    const invalidTokens: string[] = []
    const errors: Array<{ status?: number; error: string }> = []
    let sent = 0
    for (let index = 0; index < results.length; index++) {
      const result = results[index]
      if (result.status === 'fulfilled' && result.value.ok) {
        sent++
      } else {
        const token = tokens[index].fcm_token
        const errorDetail = result.status === 'fulfilled'
          ? result.value.error || 'Firebase rejected the push token'
          : result.reason instanceof Error ? result.reason.message : 'Failed to send FCM message'
        const errorText = String(errorDetail)
        if (isInvalidFcmTokenError(errorText)) {
          invalidTokens.push(token)
        }
        errors.push({
          status: result.status === 'fulfilled' ? result.value.status : undefined,
          error: errorText.slice(0, 500)
        })
      }
    }

    if (invalidTokens.length) {
      await supabase
        .from('driver_push_tokens')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .in('fcm_token', invalidTokens)
    }

    return new Response(JSON.stringify({ sent, failed: errors.length, disabled_tokens: invalidTokens.length, errors: errors.slice(0, 3) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send notification'
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
