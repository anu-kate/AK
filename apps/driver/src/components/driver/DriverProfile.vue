<template>
  <div class="animate-fade-in space-y-4">
    <h2 class="font-bold text-2xl mb-6 text-gray-800">Profil Saya</h2>
    <div class="bg-white p-6 rounded-3xl border border-gray-300 shadow-sm text-center">
      
      <div class="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-inner">
        {{ authStore.profile?.full_name ? authStore.profile.full_name.charAt(0).toUpperCase() : 'D' }}
      </div>
      <h3 class="font-bold text-xl text-gray-900">{{ authStore.profile?.full_name || 'Memuat Nama...' }}</h3>
      <p class="text-gray-500 font-mono mt-1">{{ authStore.profile?.phone_number || '-' }}</p>

      <div class="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-left">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[10px] font-black uppercase tracking-wide text-blue-500">Antur Kredit</p>
            <p class="text-xs text-blue-700 font-semibold mt-0.5">Rp1.000 = 1 AK</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-black text-blue-700">{{ anturCreditBalance }} AK</p>
            <button @click="fetchDriverCredit" class="text-[10px] font-bold text-blue-500 hover:text-blue-700">Refresh Kredit</button>
          </div>
        </div>
        <a
          :href="buyAkWhatsAppLink"
          target="_blank"
          class="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Topup AK
        </a>
      </div>

      <div class="mt-4 bg-orange-50 border border-orange-100 rounded-2xl p-4 text-left">
        <p class="text-[10px] font-black uppercase tracking-wide text-orange-500">Suara Notifikasi Orderan</p>
        <div class="mt-3 grid grid-cols-1 gap-2">
          <button
            v-for="option in notificationSoundOptions"
            :key="option.id"
            type="button"
            @click="updateNotificationSound(option.id)"
            :class="notificationSound === option.id ? 'border-orange-500 bg-white text-orange-700 shadow-sm' : 'border-orange-100 bg-orange-50 text-gray-700'"
            class="w-full text-left border rounded-xl p-3 transition"
          >
            <span class="block text-sm font-black">{{ option.label }}</span>
            <span class="block text-xs font-semibold mt-0.5 text-gray-500">{{ option.description }}</span>
          </button>
        </div>
        <button
          type="button"
          @click="refreshPushToken"
          class="mt-3 w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-sm hover:bg-orange-600 transition flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9"></path></svg>
          Refresh Push Driver
        </button>
      </div>
      
      <!-- <button @click="themeStore.toggleTheme()" class="mt-8 px-5 py-3 w-full bg-gray-50 border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition">
        <svg v-if="themeStore.isDark" class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        <span v-if="themeStore.isDark">Mode Terang</span>
        
        <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        <span v-if="!themeStore.isDark">Mode Gelap</span>
      </button> -->
      
      <button @click="handleLogout" class="mt-4 px-5 py-3 w-full bg-red-50 text-red-600 font-bold rounded-xl shadow-sm hover:bg-red-100 transition flex justify-center items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Keluar Akun
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'
import { DRIVER_NOTIFICATION_SOUNDS, getDriverNotificationSound, registerNativeDriverPushToken, setDriverNotificationSound, syncNativeDriverPushPreference } from '../../lib/driverNativePush'
import { useToastStore } from '../../stores/toast'
// import { useThemeStore } from '../../stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()
const anturCreditBalance = ref(0)
const notificationSound = ref(getDriverNotificationSound())
const notificationSoundOptions = DRIVER_NOTIFICATION_SOUNDS
const adminWhatsAppNumber = '6285601232027'
// const themeStore = useThemeStore()

const buyAkWhatsAppLink = computed(() => {
  const userName = authStore.profile?.full_name || 'Kurir'
  const phone = authStore.profile?.phone_number || '-'
  const message = `Halo Admin, saya ${userName} (${phone}). Saya ingin top up Antur Kredit (AK). AK saya saat ini ${anturCreditBalance.value} AK. Mohon info metode pembayarannya.`
  return `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`
})

const fetchDriverCredit = async () => {
  if (!authStore.user?.id) return
  const { data } = await supabase
    .from('driver_details')
    .select('antur_credit_balance')
    .eq('id', authStore.user.id)
    .maybeSingle()

  anturCreditBalance.value = Number(data?.antur_credit_balance || 0)
}

const handleLogout = async () => { 
  await authStore.signOut()
  router.push('/driver-login') 
}

const updateNotificationSound = async (sound) => {
  notificationSound.value = setDriverNotificationSound(sound)
  try {
    await syncNativeDriverPushPreference(authStore.user?.id, notificationSound.value)
    toast.show('Suara notifikasi disimpan.', 'success')
  } catch (error) {
    toast.show(error?.message || 'Gagal menyimpan suara notifikasi.', 'error')
  }
}

const refreshPushToken = async () => {
  try {
    const result = await registerNativeDriverPushToken(authStore.user?.id)
    if (result.ok) toast.show('Push driver aktif.', 'success')
    else toast.show('Izin push belum aktif.', 'warning')
  } catch (error) {
    toast.show(error?.message || 'Gagal refresh push driver.', 'error')
  }
}

onMounted(() => {
  fetchDriverCredit()
})
</script>
