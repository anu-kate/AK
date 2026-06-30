<!-- src/components/PendingVerification.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border text-center animate-fade-in" :class="isRejected ? 'border-red-200' : 'border-gray-100'">
      
      <!-- ICON DINAMIS -->
      <div v-if="isRejected" class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </div>
      <div v-else class="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      
      <!-- TEKS DINAMIS -->
      <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ isRejected ? 'Pendaftaran Ditolak' : 'Akun Sedang Ditinjau' }}</h2>
      <p class="text-gray-500 mb-8 leading-relaxed">
        {{ isRejected 
            ? 'Maaf, pendaftaran Anda tidak dapat kami setujui karena terdeteksi indikasi yang tidak sesuai kebijakan kami. Hubungi admin untuk klarifikasi.' 
            : `Pendaftaran Anda sebagai ${pendingType} sedang diverifikasi untuk mencegah aktivitas fiktif. Hubungi admin via WA agar akun cepat aktif.` }}
      </p>
      
      <div class="space-y-3">
        <a :href="whatsappLink" target="_blank" :class="isRejected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'" class="w-full flex justify-center items-center gap-2 text-white py-3 rounded-xl font-bold transition shadow-sm">
          Chat Admin via WA
        </a>
        <button @click="handleLogout" class="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
          Keluar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const adminWhatsAppNumber = '6286701232027' 

const isRejected = computed(() => {
  return authStore.profile?.account_status === 'rejected' ||
         authStore.profile?.merchant_status === 'rejected' ||
         authStore.profile?.driver_status === 'rejected'
})

const pendingType = computed(() => {
  if (authStore.profile?.account_status === 'pending') return 'Pelanggan Baru'
  if (authStore.profile?.merchant_status === 'pending') return 'Mitra Toko'
  if (authStore.profile?.driver_status === 'pending') return 'Kurir / Driver'
  return 'Akun'
})

const whatsappLink = computed(() => {
  const userName = authStore.profile?.full_name || 'pengguna'
  const action = isRejected.value ? 'klarifikasi penolakan' : 'memverifikasi'
  const message = `Halo Admin, saya ${userName}. Mohon bantuannya untuk ${action} pendaftaran ${pendingType.value} saya. Terima kasih!`
  return `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`
})

const handleLogout = async () => { await authStore.signOut(); router.push('/login') }
</script>