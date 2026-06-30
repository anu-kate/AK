/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyC6II1y_7XaDAfzyoPQtWZ7e04SviE8QGo",
  authDomain: "anturun-01.firebaseapp.com",
  projectId: "anturun-01",
  storageBucket: "anturun-01.firebasestorage.app",
  messagingSenderId: "953772926678",
  appId: "1:953772926678:web:98d8c8584d5e461b224b77"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'Orderan Baru Masuk'
  const options = {
    body: payload.notification?.body || payload.data?.body || 'Ada orderan baru tersedia di bursa.',
    icon: '/driver/icons/driver-192.png',
    badge: '/driver/icons/driver-192.png',
    tag: payload.data?.order_id ? `order-${payload.data.order_id}` : 'driver-new-order',
    data: {
      url: payload.data?.url || '/driver/',
      order_id: payload.data?.order_id
    }
  }

  self.registration.showNotification(title, options)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const appBasePath = new URL('./', self.location.href).pathname
  const rawUrl = event.notification.data?.url || '/driver/'
  const url = rawUrl.startsWith('/')
    ? new URL(`${appBasePath}${rawUrl.slice(1)}`, self.location.origin).href
    : new URL(rawUrl, self.location.origin).href

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }

      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
