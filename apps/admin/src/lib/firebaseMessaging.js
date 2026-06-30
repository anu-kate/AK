import { supabase } from './supabase'

const FIREBASE_SDK_VERSION = '10.13.2'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId &&
    import.meta.env.VITE_FIREBASE_VAPID_KEY
  )
}

const importFirebaseMessaging = async () => {
  const [{ initializeApp, getApps }, { getMessaging, getToken, onMessage, isSupported }] = await Promise.all([
    import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
    import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-messaging.js`)
  ])

  return { initializeApp, getApps, getMessaging, getToken, onMessage, isSupported }
}

const getBaseUrl = () => import.meta.env.BASE_URL || '/'

const clearLegacyFirebaseWorker = async () => {
  if (!navigator.serviceWorker.getRegistrations) return

  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map((registration) => {
    const scriptUrl = registration.active?.scriptURL || registration.installing?.scriptURL || registration.waiting?.scriptURL || ''
    const isFirebaseWorker = scriptUrl.endsWith('/firebase-messaging-sw.js')
    const isLegacyRootScope = registration.scope === `${window.location.origin}/`
    return isFirebaseWorker && isLegacyRootScope ? registration.unregister() : Promise.resolve(false)
  }))
}

export const registerDriverFcmToken = async (driverId) => {
  if (!driverId || !isFirebaseConfigured() || !('serviceWorker' in navigator)) {
    return { ok: false, reason: 'firebase_not_configured' }
  }

  const { initializeApp, getApps, getMessaging, getToken, isSupported } = await importFirebaseMessaging()
  if (!(await isSupported())) return { ok: false, reason: 'messaging_not_supported' }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return { ok: false, reason: 'permission_denied' }

  await clearLegacyFirebaseWorker()
  const baseUrl = getBaseUrl()
  const registration = await navigator.serviceWorker.register(`${baseUrl}firebase-messaging-sw.js`, {
    scope: `${baseUrl}firebase-cloud-messaging-push-scope`
  })
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  const messaging = getMessaging(app)
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration
  })

  if (!token) return { ok: false, reason: 'token_empty' }

  const { error } = await supabase
    .from('driver_push_tokens')
    .upsert({
      driver_id: driverId,
      fcm_token: token,
      platform: 'web',
      user_agent: navigator.userAgent,
      last_seen_at: new Date().toISOString(),
      is_active: true
    }, { onConflict: 'fcm_token' })

  if (error) throw error
  return { ok: true, token }
}

export const listenForegroundDriverMessages = async (onNotification) => {
  if (!isFirebaseConfigured()) return null

  const { initializeApp, getApps, getMessaging, onMessage, isSupported } = await importFirebaseMessaging()
  if (!(await isSupported())) return null

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  const messaging = getMessaging(app)
  return onMessage(messaging, (payload) => {
    onNotification?.(payload)
  })
}
