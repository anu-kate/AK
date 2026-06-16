<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          {{ isLogin ? 'Masuk ke Anturun' : 'Daftar Akun Baru' }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleAuth">
        <div class="rounded-md shadow-sm space-y-4">
          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input v-model="fullName" type="text" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Nama Lengkap">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nomor HP (Awali dengan 08)</label>
            <input v-model="phone" type="tel" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="08123456789">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <input v-model="password" type="password" required class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Minimal 6 karakter">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition">
            <span v-if="loading" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isLogin ? 'Masuk Sekarang' : 'Daftar' }}
          </button>
        </div>
      </form>
      <div class="text-center">
        <button @click="isLogin = !isLogin" class="text-sm text-blue-600 hover:text-blue-500 font-medium transition">
          {{ isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini' }}
        </button>
      </div>
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
const role = ref('customer')

const handleAuth = async () => {
  loading.value = true
  try {
    const formattedPhone = phone.value.replace(/\D/g, '')
    const dummyEmail = `${formattedPhone}@anturun.app`

    if (isLogin.value) {
      await authStore.signIn(dummyEmail, password.value)
      toast.show('Berhasil masuk!', 'success')
      routeUser(authStore.profile?.role, authStore.profile?.account_status)
    } else {
      await authStore.signUp(dummyEmail, password.value, {
        full_name: fullName.value,
        phone_number: formattedPhone,
        role: role.value,
        account_status: role.value === 'customer' ? 'active' : 'pending'
      })
      toast.show('Pendaftaran berhasil!', 'success')
      routeUser(role.value, role.value === 'customer' ? 'active' : 'pending')
    }
  } catch (error) {
    toast.show(error.message, 'error')
  } finally {
    loading.value = false
  }
}

const routeUser = (userRole, status) => {
  if (status === 'pending') router.push('/pending')
  else if (userRole === 'admin') router.push('/admin')
  else if (userRole === 'merchant') router.push('/merchant')
  else if (userRole === 'driver') router.push('/driver')
  else router.push('/')
}
</script>

<style scoped>
button:active:not(:disabled) { transform: scale(0.97); }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>