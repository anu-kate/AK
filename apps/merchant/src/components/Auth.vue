<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 px-4 py-12">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-sm">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/30 mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight">Anturun Merchant</h1>
        <p class="text-purple-300/70 text-sm mt-1">Kelola tokomu dengan mudah</p>
      </div>

      <!-- Card -->
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl">
        <!-- Tab Switch -->
        <div class="flex bg-white/10 rounded-xl p-1 mb-6">
          <button type="button" @click="isLogin = true"
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            :class="isLogin ? 'bg-white text-purple-700 shadow-sm' : 'text-white/60 hover:text-white'">
            Masuk
          </button>
          <button type="button" @click="isLogin = false"
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            :class="!isLogin ? 'bg-white text-purple-700 shadow-sm' : 'text-white/60 hover:text-white'">
            Daftar Mitra
          </button>
        </div>

        <form @submit.prevent="handleAuth" class="space-y-4">
          <!-- Field tambahan saat daftar -->
          <Transition name="slide-down">
            <div v-if="!isLogin" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-purple-200 mb-1.5">Nama Pemilik</label>
                <input v-model="fullName" type="text" required placeholder="Nama lengkap pemilik"
                  class="w-full bg-white/10 border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition">
              </div>
            </div>
          </Transition>

          <!-- Nomor HP -->
          <div>
            <label class="block text-xs font-bold text-purple-200 mb-1.5">Nomor HP</label>
            <input v-model="phone" type="tel" required placeholder="08123456789"
              class="w-full bg-white/10 border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition">
          </div>

          <!-- Kata Sandi -->
          <div>
            <label class="block text-xs font-bold text-purple-200 mb-1.5">Kata Sandi</label>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" required
                :placeholder="isLogin ? '••••••••' : 'Minimal 6 karakter'"
                class="w-full bg-white/10 border border-white/15 text-white placeholder-white/30 rounded-xl px-4 py-3 pr-11 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition">
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              </button>
            </div>
          </div>

          <!-- Info review saat daftar -->
          <Transition name="slide-down">
            <div v-if="!isLogin" class="flex items-start gap-2.5 bg-purple-500/10 border border-purple-400/20 rounded-xl px-3.5 py-3">
              <svg class="w-4 h-4 text-purple-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p class="text-xs text-purple-200/80 leading-relaxed">Pendaftaran mitra perlu diverifikasi oleh Admin. Proses ini biasanya membutuhkan 1x24 jam.</p>
            </div>
          </Transition>

          <button type="submit" :disabled="loading"
            class="w-full py-3.5 mt-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar Sekarang') }}
          </button>
        </form>
      </div>

      <p class="text-center text-white/25 text-xs mt-6">Anturun Merchant · Mitra Terpercaya</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const isLogin = ref(true)
const loading = ref(false)
const phone = ref('')
const password = ref('')
const fullName = ref('')
const showPassword = ref(false)

const handleAuth = async () => {
  loading.value = true
  try {
    const formattedPhone = phone.value.replace(/\D/g, '')
    const dummyEmail = `${formattedPhone}@anturun.app`

    if (isLogin.value) {
      await authStore.signIn(dummyEmail, password.value)
      const merchantStatus = authStore.profile?.merchant_status
      if (merchantStatus === 'pending' || merchantStatus === 'rejected') {
        return router.push('/pending')
      }
      if (merchantStatus !== 'active') {
        await authStore.signOut()
        toast.show('Akun merchant kamu belum aktif.', 'error')
        return
      }
      toast.show('Selamat datang, Mitra!', 'success')
      router.push('/')
    } else {
      await authStore.signUp(dummyEmail, password.value, {
        full_name: fullName.value,
        phone_number: formattedPhone,
        role: 'merchant',
        account_status: 'active',
        merchant_status: 'pending'
      })
      toast.show('Pendaftaran berhasil! Menunggu verifikasi admin.', 'success')
      router.push('/pending')
    }
  } catch (error) {
    toast.show(error.message || 'Terjadi kesalahan.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
.slide-down-enter-to, .slide-down-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>