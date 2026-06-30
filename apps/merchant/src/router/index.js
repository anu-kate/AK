// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../components/Auth.vue'
import MerchantDashboard from '../components/MerchantDashboard.vue'
import PendingVerification from '../components/PendingVerification.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Merchant', component: MerchantDashboard, meta: { requiresAuth: true, pwaRole: 'merchant', theme: '#a855f7', title: 'Anturun Merchant' } },
  { path: '/login', name: 'Login', component: Auth, meta: { requiresGuest: true, pwaRole: 'merchant', theme: '#a855f7', title: 'Anturun Merchant' } },
  { path: '/pending', name: 'PendingVerification', component: PendingVerification, meta: { requiresAuth: true, pwaRole: 'merchant', theme: '#a855f7', title: 'Anturun Merchant' } }
]

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.user) await authStore.initialize()
  
  const isAuthenticated = !!authStore.user
  const baseStatus = authStore.profile?.account_status

  if (to.meta.requiresAuth && !isAuthenticated) return next('/login')
  if (to.meta.requiresGuest && isAuthenticated) return next('/')

  if (isAuthenticated && (baseStatus === 'pending' || baseStatus === 'rejected') && to.path !== '/pending') {
    return next('/pending')
  }

  if (isAuthenticated && to.path === '/pending') {
    const mStatus = authStore.profile?.merchant_status
    const isBasePending = (baseStatus === 'pending' || baseStatus === 'rejected')
    const isMerchantPending = (mStatus === 'pending' || mStatus === 'rejected')
    if (!isBasePending && !isMerchantPending) {
      return next('/')
    }
  }

  if (to.path === '/') {
    if (authStore.profile?.merchant_status === 'pending' || authStore.profile?.merchant_status === 'rejected') return next('/pending')
    if (authStore.profile?.merchant_status !== 'active') return next('/pending') // Or somewhere else if not merchant
  }
  
  next()
})

router.afterEach((to) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const role = to.meta.pwaRole || 'merchant'
  const theme = to.meta.theme || '#a855f7'
  document.title = to.meta.title || 'Anturun Merchant'
  
  const manifestEl = document.getElementById('app-manifest')
  if (manifestEl) manifestEl.setAttribute('href', `${baseUrl}manifests/manifest-${role}.json`)

  const themeEl = document.getElementById('app-theme-color')
  if (themeEl) themeEl.setAttribute('content', theme)
})

export default router
