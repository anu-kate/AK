import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { supabase } from './supabase'

const SOUND_STORAGE_KEY = 'anturun_driver_notification_sound'

export const DRIVER_NOTIFICATION_SOUNDS = [
  { id: 'default', label: 'Normal', description: 'Suara pendek untuk orderan baru.', channelId: 'driver_orders_default' },
  { id: 'urgent', label: 'Keras', description: 'Suara lebih menonjol untuk area ramai.', channelId: 'driver_orders_urgent' },
  { id: 'silent', label: 'Senyap', description: 'Tanpa suara, tetap muncul di notifikasi.', channelId: 'driver_orders_silent' }
]

export const isNativeDriverApp = () => Capacitor.isNativePlatform()

export const getDriverNotificationSound = () => {
  const saved = localStorage.getItem(SOUND_STORAGE_KEY)
  return DRIVER_NOTIFICATION_SOUNDS.some((option) => option.id === saved) ? saved : 'default'
}

export const setDriverNotificationSound = (sound) => {
  const nextSound = DRIVER_NOTIFICATION_SOUNDS.some((option) => option.id === sound) ? sound : 'default'
  localStorage.setItem(SOUND_STORAGE_KEY, nextSound)
  return nextSound
}

export const getDriverNotificationChannelId = (sound = getDriverNotificationSound()) => {
  return DRIVER_NOTIFICATION_SOUNDS.find((option) => option.id === sound)?.channelId || 'driver_orders_default'
}

const createChannel = async (channel) => {
  try {
    await PushNotifications.createChannel(channel)
  } catch (error) {
    console.warn('Unable to create notification channel', channel.id, error)
  }
}

export const setupDriverNotificationChannels = async () => {
  if (!isNativeDriverApp() || Capacitor.getPlatform() !== 'android') return

  await Promise.all([
    createChannel({
      id: 'driver_orders_default',
      name: 'Orderan Baru',
      description: 'Notifikasi orderan baru Anturun Driver.',
      importance: 5,
      visibility: 1,
      sound: 'order_chime',
      vibration: true,
      lights: true
    }),
    createChannel({
      id: 'driver_orders_urgent',
      name: 'Orderan Baru Keras',
      description: 'Notifikasi orderan baru dengan suara lebih jelas.',
      importance: 5,
      visibility: 1,
      sound: 'order_alert',
      vibration: true,
      lights: true
    }),
    createChannel({
      id: 'driver_orders_silent',
      name: 'Orderan Baru Senyap',
      description: 'Notifikasi orderan baru tanpa suara.',
      importance: 3,
      visibility: 1,
      vibration: false,
      lights: false
    })
  ])
}

const upsertNativeToken = async (driverId, token, sound = getDriverNotificationSound()) => {
  const { error } = await supabase
    .from('driver_push_tokens')
    .upsert({
      driver_id: driverId,
      fcm_token: token,
      platform: Capacitor.getPlatform(),
      user_agent: `capacitor/${Capacitor.getPlatform()}`,
      notification_sound: sound,
      notification_channel_id: getDriverNotificationChannelId(sound),
      last_seen_at: new Date().toISOString(),
      is_active: true
    }, { onConflict: 'fcm_token' })

  if (error) throw error
}

export const syncNativeDriverPushPreference = async (driverId, sound = getDriverNotificationSound()) => {
  if (!driverId || !isNativeDriverApp()) return
  setDriverNotificationSound(sound)
  await setupDriverNotificationChannels()

  const { data } = await supabase
    .from('driver_push_tokens')
    .select('fcm_token')
    .eq('driver_id', driverId)
    .in('platform', ['android', 'ios'])
    .eq('is_active', true)

  if (!data?.length) return

  const { error } = await supabase
    .from('driver_push_tokens')
    .update({
      notification_sound: sound,
      notification_channel_id: getDriverNotificationChannelId(sound),
      updated_at: new Date().toISOString()
    })
    .eq('driver_id', driverId)
    .in('platform', ['android', 'ios'])
    .eq('is_active', true)

  if (error) throw error
}

export const registerNativeDriverPushToken = async (driverId) => {
  if (!driverId || !isNativeDriverApp()) return { ok: false, reason: 'not_native' }

  await setupDriverNotificationChannels()

  const permission = await PushNotifications.requestPermissions()
  if (permission.receive !== 'granted') return { ok: false, reason: 'permission_denied' }

  const sound = getDriverNotificationSound()

  return new Promise((resolve, reject) => {
    let settled = false
    const finish = (result) => {
      if (settled) return
      settled = true
      resolve(result)
    }

    PushNotifications.removeAllListeners().then(async () => {
      await PushNotifications.addListener('registration', async (token) => {
        try {
          await upsertNativeToken(driverId, token.value, sound)
          finish({ ok: true, token: token.value })
        } catch (error) {
          reject(error)
        }
      })

      await PushNotifications.addListener('registrationError', (error) => {
        reject(new Error(error?.error || 'Gagal mendaftarkan push native.'))
      })

      await PushNotifications.addListener('pushNotificationActionPerformed', () => {
        window.location.assign('/driver')
      })

      await PushNotifications.register()

      window.setTimeout(() => {
        finish({ ok: false, reason: 'token_timeout' })
      }, 10000)
    }).catch(reject)
  })
}
