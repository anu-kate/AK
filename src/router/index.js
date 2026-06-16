// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Auth from '../components/Auth.vue'
import MerchantDashboard from '../components/MerchantDashboard.vue'
import DriverDashboard from '../components/DriverDashboard.vue'
import DriverAppLogin from '../components/driver/DriverAppLogin.vue'
import AdminPanel from '../components/AdminPanel.vue'
import PendingVerification from '../components/PendingVerification.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { pwaRole: 'user', theme: '#ffffff', title: 'Anturun' } },
  { path: '/login', name: 'Login', component: Auth, meta: { requiresGuest: true, pwaRole: 'user', theme: '#ffffff', title: 'Anturun' } },
  { path: '/driver-login', name: 'DriverLogin', component: DriverAppLogin, meta: { requiresGuest: true, guestRedirect: '/driver', pwaRole: 'driver', theme: '#f97316', title: 'Anturun Driver' } },
  { path: '/pending', name: 'PendingVerification', component: PendingVerification, meta: { requiresAuth: true, pwaRole: 'user', theme: '#ffffff', title: 'Anturun' } },
  { path: '/admin', name: 'Admin', component: AdminPanel, meta: { requiresAuth: true, role: 'admin', pwaRole: 'admin', theme: '#2563eb', title: 'Anturun Admin' } },
  { path: '/merchant', name: 'Merchant', component: MerchantDashboard, meta: { requiresAuth: true, pwaRole: 'merchant', theme: '#a855f7', title: 'Anturun Merchant' } },
  { path: '/driver', name: 'Driver', component: DriverDashboard, meta: { requiresAuth: true, loginPath: '/driver-login', pwaRole: 'driver', theme: '#f97316', title: 'Anturun Driver' } }
]

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })

// 1. HOOK PROTEKSI ROUTE (LOGIKA ANDA YANG SUDAH SOLID)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.user) await authStore.initialize()
  
  const isAuthenticated = !!authStore.user
  const role = authStore.profile?.role
  const baseStatus = authStore.profile?.account_status
  
  // 1. Tamu dilarang masuk rute privat, User login dilarang ke halaman auth
  if (to.meta.requiresAuth && !isAuthenticated) return next(to.meta.loginPath || '/login')
  if (to.meta.requiresGuest && isAuthenticated) return next(to.meta.guestRedirect || '/')

  // 2. Kurung user dasar (Customer) yang belum aktif/ditolak agar tidak bisa keluyuran
  if (isAuthenticated && (baseStatus === 'pending' || baseStatus === 'rejected') && to.path !== '/pending') {
    return next('/pending')
  }

  // 3. ATURAN BARU (BUGFIX): Tendang user Active yang mencoba mengintip /pending
  if (isAuthenticated && to.path === '/pending') {
    const mStatus = authStore.profile?.merchant_status
    const dStatus = authStore.profile?.driver_status
    
    const isBasePending = (baseStatus === 'pending' || baseStatus === 'rejected')
    const isMerchantPending = (mStatus === 'pending' || mStatus === 'rejected')
    const isDriverPending = (dStatus === 'pending' || dStatus === 'rejected')

    // Jika akunnya sehat walafiat (tidak ada yang pending/ditolak), kembalikan ke Dasbor!
    if (!isBasePending && !isMerchantPending && !isDriverPending) {
      return next('/')
    }
  }

  // 4. Proteksi Admin
  if (to.meta.role === 'admin' && role !== 'admin') return next('/')
  if (role === 'admin' && to.path !== '/admin') return next('/admin')

  // 5. Cek Status Role Lanjutan (Toko)
  if (to.path === '/merchant') {
    if (authStore.profile?.merchant_status === 'pending' || authStore.profile?.merchant_status === 'rejected') return next('/pending')
    if (authStore.profile?.merchant_status !== 'active') return next('/')
  }
  
  // 6. Cek Status Role Lanjutan (Kurir)
  if (to.path === '/driver') {
    if (authStore.profile?.driver_status === 'pending' || authStore.profile?.driver_status === 'rejected') return next('/pending')
    if (authStore.profile?.driver_status !== 'active') return next('/')
  }

  next()
})

// 2. HOOK DYNAMIC PWA MANIFEST (BARU)
router.afterEach((to) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  // Ambil data meta dari rute saat ini, default ke 'user' jika tidak ada
  const role = to.meta.pwaRole || 'user'
  const theme = to.meta.theme || '#ffffff'
  document.title = to.meta.title || 'Anturun'
  
  // Ganti file manifest secara dinamis
  const manifestEl = document.getElementById('app-manifest')
  if (manifestEl) {
    manifestEl.setAttribute('href', `${baseUrl}manifests/manifest-${role}.json`)
  }

  // Ganti warna tema status bar browser
  const themeEl = document.getElementById('app-theme-color')
  if (themeEl) {
    themeEl.setAttribute('content', theme)
  }
})

export default router
