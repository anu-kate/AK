// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Auth from '../components/Auth.vue'
import PendingVerification from '../components/PendingVerification.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { pwaRole: 'user', theme: '#ffffff', title: 'Anturun' } },
  { path: '/login', name: 'Login', component: Auth, meta: { requiresGuest: true, pwaRole: 'user', theme: '#ffffff', title: 'Anturun' } },
  { path: '/pending', name: 'PendingVerification', component: PendingVerification, meta: { requiresAuth: true, pwaRole: 'user', theme: '#ffffff', title: 'Anturun' } }
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

  next()
})

router.afterEach((to) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const role = to.meta.pwaRole || 'user'
  const theme = to.meta.theme || '#ffffff'
  document.title = to.meta.title || 'Anturun'
  
  const manifestEl = document.getElementById('app-manifest')
  if (manifestEl) manifestEl.setAttribute('href', `${baseUrl}manifests/manifest-${role}.json`)

  const themeEl = document.getElementById('app-theme-color')
  if (themeEl) themeEl.setAttribute('content', theme)
})

export default router
