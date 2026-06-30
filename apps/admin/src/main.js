// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css' // Pastikan nama file CSS Anda benar
import { useAuthStore } from './stores/auth'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// REGISTER VIRTUAL PWA DENGAN FUNGSI
import { registerSW } from 'virtual:pwa-register'

const pinia = createPinia()
const app = createApp(App)

// Aktifkan pendaftaran Service Worker (SW) otomatis untuk PWA
registerSW({ immediate: true })

// 1. Pasang Pinia terlebih dahulu
app.use(pinia)
pinia.use(piniaPluginPersistedstate)

// 2. Jalankan inisialisasi sesi login SEBELUM router dijalankan
const authStore = useAuthStore()

authStore.initialize().then(() => {
  // 3. Setelah sesi selesai dicek, barulah jalankan router dan aplikasi
  app.use(router)
  app.mount('#app')
})