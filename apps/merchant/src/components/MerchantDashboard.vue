<template>
  <div class="bg-gray-50 min-h-screen text-gray-900 font-sans relative pb-28 md:pb-12 overflow-x-hidden">
    
    <div class="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg border-b border-gray-300 z-40 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <div class="flex flex-col truncate pr-2">
          <h1 class="text-lg md:text-xl font-extrabold text-gray-900 leading-tight truncate tracking-tight">{{ storeProfile.store_name || 'Toko Saya' }}</h1>
          <div class="flex items-center gap-1 mt-0.5">
            <span class="text-[10px] text-gray-500 truncate font-bold mr-1">{{ storeProfile.operational_hours || 'Belum diatur' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Header Right: Status Toko & Theme Toggle -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- Status Toko Toggle -->
        <label class="relative inline-flex items-center cursor-pointer select-none" title="Status Toko">
          <input type="checkbox" v-model="storeProfile.is_open" @change="toggleStoreStatus" class="sr-only peer">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
            :class="storeProfile.is_open
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-600'">
            <span class="w-2 h-2 rounded-full animate-pulse" :class="storeProfile.is_open ? 'bg-emerald-500' : 'bg-red-400'"></span>
            {{ storeProfile.is_open ? 'Buka' : 'Tutup' }}
          </div>
        </label>
      </div>
    </div>

    <div class="max-w-5xl mx-auto pt-24 md:pt-28 px-4 md:px-8 space-y-4 md:space-y-6" @touchstart="handleSwipeStart" @touchend="handleSwipeEnd">
      
      <div class="hidden md:flex bg-gray-100 p-1.5 rounded-2xl shadow-sm mb-6">
        <button @click="changeTab('pesanan')" :class="activeMainTab === 'pesanan' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-3 px-6 font-bold transition rounded-xl flex items-center justify-center gap-2">
          Pesanan Masuk <span v-if="newOrdersCount > 0" class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{{ newOrdersCount }}</span>
        </button>
        <button @click="changeTab('produk')" :class="activeMainTab === 'produk' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-3 px-6 font-bold transition rounded-xl flex items-center justify-center gap-2">
          Katalog Produk
        </button>
        <button @click="changeTab('pengaturan')" :class="activeMainTab === 'pengaturan' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-3 px-6 font-bold transition rounded-xl flex items-center justify-center gap-2">
          Pengaturan
        </button>
      </div>

      <transition :name="slideDirection" mode="out-in">
        <MerchantOrders v-if="activeMainTab === 'pesanan'" key="pesanan" @update-orders-count="count => newOrdersCount = count" />
        <MerchantProducts v-else-if="activeMainTab === 'produk'" key="produk" />
        <MerchantSettings v-else-if="activeMainTab === 'pengaturan'" key="pengaturan" :storeProfile="storeProfile" @profile-updated="fetchStoreProfile" />
      </transition>
    </div>

    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white backdrop-blur-xl border-t border-gray-300 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
      <div class="grid grid-cols-3 h-16">
        <button @click="changeTab('pesanan')" class="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all" :class="activeMainTab === 'pesanan' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'">
          <div class="relative"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg><span v-if="newOrdersCount > 0" class="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full border-2 border-white">{{ newOrdersCount }}</span></div>
          <span class="text-[10px] font-bold">Pesanan</span>
        </button>
        <button @click="changeTab('produk')" class="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all" :class="activeMainTab === 'produk' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg><span class="text-[10px] font-bold">Produk</span>
        </button>
        <button @click="changeTab('pengaturan')" class="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all" :class="activeMainTab === 'pengaturan' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg><span class="text-[10px] font-bold">Pengaturan</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import ThemeToggle from './ThemeToggle.vue'
import MerchantOrders from './merchant/MerchantOrders.vue'
import MerchantProducts from './merchant/MerchantProducts.vue'
import MerchantSettings from './merchant/MerchantSettings.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const storeProfile = ref({})
const activeMainTab = ref('pesanan')
const slideDirection = ref('slide-left')
const newOrdersCount = ref(0)

const tabsArray = ['pesanan', 'produk', 'pengaturan']
const changeTab = (newTab) => {
  const oldIndex = tabsArray.indexOf(activeMainTab.value); const newIndex = tabsArray.indexOf(newTab)
  slideDirection.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
  activeMainTab.value = newTab
}

const touchStartX = ref(0); const touchStartY = ref(0)
const handleSwipeStart = (e) => { touchStartX.value = e.touches[0].screenX; touchStartY.value = e.touches[0].screenY }
const handleSwipeEnd = (e) => {
  const diffX = touchStartX.value - e.changedTouches[0].screenX; const diffY = touchStartY.value - e.changedTouches[0].screenY
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
    const currentIndex = tabsArray.indexOf(activeMainTab.value)
    if (diffX > 0 && currentIndex < tabsArray.length - 1) changeTab(tabsArray[currentIndex + 1])
    else if (diffX < 0 && currentIndex > 0) changeTab(tabsArray[currentIndex - 1])
  }
}

const fetchStoreProfile = async () => {
  const { data } = await supabase.from('merchant_details').select('*').eq('id', authStore.user.id).single()
  if (data) storeProfile.value = data
}

const toggleStoreStatus = async () => {
  const newStatus = storeProfile.value.is_open
  const { error } = await supabase.from('merchant_details').update({ is_open: newStatus }).eq('id', authStore.user.id)
  if (!error) toast.show(`Toko di${newStatus ? 'buka' : 'tutup'}!`, 'success')
  else { storeProfile.value.is_open = !newStatus; toast.show('Gagal ubah status', 'error') }
}

const handleLogout = async () => {
  await authStore.signOut()
  toast.show('Berhasil keluar', 'success')
  router.push('/login')
}

onMounted(() => { if (authStore.user) { fetchStoreProfile() } })
</script>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active { transition: all 0.3s ease-out; }
.slide-left-enter-from { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-40px); }
.slide-right-enter-active, .slide-right-leave-active { transition: all 0.3s ease-out; }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to { opacity: 0; transform: translateX(40px); }
</style>
