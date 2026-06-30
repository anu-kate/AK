// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../components/Auth.vue'
import DriverDashboard from '../components/DriverDashboard.vue'
import PendingVerification from '../components/PendingVerification.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Driver', component: DriverDashboard, meta: { requiresAuth: true, pwaRole: 'driver', theme: '#f97316', title: 'Anturun Driver' } },
  { path: '/login', name: 'DriverLogin', component: Auth, meta: { requiresGuest: true, pwaRole: 'driver', theme: '#f97316', title: 'Anturun Driver' } },
  { path: '/pending', name: 'PendingVerification', component: PendingVerification, meta: { requiresAuth: true, pwaRole: 'driver', theme: '#ffffff', title: 'Anturun Driver' } }
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
    const dStatus = authStore.profile?.driver_status
    const isBasePending = (baseStatus === 'pending' || baseStatus === 'rejected')
    const isDriverPending = (dStatus === 'pending' || dStatus === 'rejected')
    if (!isBasePending && !isDriverPending) {
      return next('/')
    }
  }

  if (to.path === '/') {
    if (authStore.profile?.driver_status === 'pending' || authStore.profile?.driver_status === 'rejected') return next('/pending')
    if (authStore.profile?.driver_status !== 'active') {
      await authStore.signOut()
      return next('/login')
    }
  }
  
  next()
})

router.afterEach((to) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const role = to.meta.pwaRole || 'driver'
  const theme = to.meta.theme || '#f97316'
  document.title = to.meta.title || 'Anturun Driver'
  
  const manifestEl = document.getElementById('app-manifest')
  if (manifestEl) manifestEl.setAttribute('href', `${baseUrl}manifests/manifest-${role}.json`)

  const themeEl = document.getElementById('app-theme-color')
  if (themeEl) themeEl.setAttribute('content', theme)
})

export default router
