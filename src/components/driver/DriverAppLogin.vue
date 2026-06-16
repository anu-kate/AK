<template>
  <main class="min-h-screen bg-gray-950 text-white flex flex-col">
    <section class="flex-1 flex flex-col justify-center px-5 py-8">
      <div class="mx-auto w-full max-w-md">
        <div class="mb-8">
          <div class="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <p class="mt-6 text-xs font-black uppercase tracking-[0.25em] text-orange-300">Anturun Driver</p>
          <h1 class="mt-2 text-3xl font-black leading-tight">Masuk Driver</h1>
        </div>

        <form class="space-y-4" @submit.prevent="handleDriverLogin">
          <div>
            <label class="block text-sm font-bold text-gray-200 mb-2">Nomor HP</label>
            <input
              v-model="phone"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              required
              class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-base font-semibold text-white placeholder:text-gray-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
              placeholder="08123456789"
            >
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-200 mb-2">Kata Sandi</label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-base font-semibold text-white placeholder:text-gray-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
              placeholder="Minimal 6 karakter"
            >
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-2xl bg-orange-500 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:opacity-60"
          >
            <span v-if="loading" class="inline-block mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin align-[-2px]"></span>
            Masuk ke Aplikasi Driver
          </button>
        </form>

        <button
          type="button"
          class="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-gray-200 hover:bg-white/10 transition"
          @click="router.push('/login')"
        >
          Masuk sebagai user atau merchant
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'
import { registerDriverFcmToken } from '../../lib/firebaseMessaging'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const phone = ref('')
const password = ref('')
const loading = ref(false)

const handleDriverLogin = async () => {
  loading.value = true

  try {
    const formattedPhone = phone.value.replace(/\D/g, '')
    const dummyEmail = `${formattedPhone}@anturun.app`

    await authStore.signIn(dummyEmail, password.value)
    const profile = authStore.profile

    if (profile?.driver_status !== 'active') {
      await authStore.signOut()
      toast.show('Akun driver belum aktif.', 'warning')
      return
    }

    try {
      await registerDriverFcmToken(authStore.user?.id)
    } catch (error) {
      console.warn('Driver push token registration skipped', error)
    }

    toast.show('Berhasil masuk sebagai driver.', 'success')
    router.replace('/driver')
  } catch (error) {
    toast.show(error?.message || 'Gagal masuk.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
