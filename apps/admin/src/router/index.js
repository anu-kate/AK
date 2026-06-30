// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../components/Auth.vue'
import AdminPanel from '../components/AdminPanel.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Admin', component: AdminPanel, meta: { requiresAuth: true, role: 'admin', pwaRole: 'admin', theme: '#2563eb', title: 'Panel Admin - Anturun' } },
  { path: '/login', name: 'Login', component: Auth, meta: { requiresGuest: true, allowedRoles: ['admin'], pwaRole: 'admin', theme: '#ffffff', title: 'Panel Admin' } },
]

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes })

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.user) await authStore.initialize()

  const isAuthenticated = !!authStore.user
  const role = authStore.profile?.role

  // ---- Authenticated routes ----
  if (to.meta.requiresAuth && !isAuthenticated) return next('/login')

  // ---- Guest‑only routes (login) ----
  if (to.meta.requiresGuest && isAuthenticated) {
    // Jika role tidak cocok dengan halaman login ini → logout & redirect ke login yang tepat
    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(role)) {
      await authStore.signOut()
      return next('/login')
    }
    return next('/')
  }

  if (isAuthenticated && role !== 'admin') {
    await authStore.signOut()
    return next('/login')
  }

  next()
})

router.afterEach((to) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const role = to.meta.pwaRole || 'admin'
  const theme = to.meta.theme || '#2563eb'
  document.title = to.meta.title || 'Anturun Admin'

  const manifestEl = document.getElementById('app-manifest')
  if (manifestEl) manifestEl.setAttribute('href', `${baseUrl}manifests/manifest-${role}.json`)

  const themeEl = document.getElementById('app-theme-color')
  if (themeEl) themeEl.setAttribute('content', theme)
})

export default router
