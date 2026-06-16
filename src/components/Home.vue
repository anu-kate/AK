<template>
  <div class="min-h-screen bg-gray-50 transition-colors duration-300 font-sans text-gray-900 text-gray-100 pb-32 md:pb-12 overflow-x-hidden relative">
    
    <header class="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg border-b border-gray-300 z-40 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm pt-[calc(0.75rem+env(safe-area-inset-top))] transition-colors">
      <div class="flex items-center gap-3">
        <div>
          <h1 class="text-xl font-black text-blue-600 text-blue-400 tracking-tighter leading-none">ANTURUN<span class="text-yellow-500">.</span></h1>
          <p class="text-[10px] font-bold text-gray-400 text-gray-500 uppercase tracking-widest mt-0.5">Super App</p>
        </div>
      </div>
      <div class="flex items-center gap-3"><ThemeToggle /></div>
    </header>

    <main class="pt-24 px-4 md:px-8 max-w-6xl mx-auto min-h-[80vh] bg-gray-50">
      <HomeTab v-show="activeTab === 'home'" />
      
      <CartTab v-show="activeTab === 'cart'" 
               @change-tab="activeTab = $event" 
               @refresh-orders="fetchMyOrders" />
               
      <SettingTab v-show="activeTab === 'setting'" 
                  :my-orders="myOrders" 
                  :is-orders-loading="isOrdersLoading" 
                  :is-orders-fetched="isOrdersFetched" 
                  @refresh-orders="fetchMyOrders" />
    </main>

    <nav class="fixed bottom-0 left-0 right-0 bg-white bg-gray-800 border-t border-gray-300 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
      <div class="max-w-md mx-auto flex justify-around">
        <button @click="activeTab = 'home'" :class="activeTab === 'home' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="relative flex flex-col items-center justify-center w-full py-3 transition-colors">
          <span class="text-xl mb-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clip-rule="evenodd" /></svg></span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Beranda</span>
        </button>
        <button @click="activeTab = 'cart'" :class="activeTab === 'cart' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="relative flex flex-col items-center justify-center w-full py-3 transition-colors">
          <div class="relative">
            <span class="text-xl mb-1 block"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" /></svg></span>
            <span v-if="cartStore.totalItems > 0" class="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 min-w-[18px] text-center rounded-full border-2 border-gray-50">{{ cartStore.totalItems }}</span>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider">Keranjang</span>
        </button>
        <button @click="handlesettingClick" :class="activeTab === 'setting' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="relative flex flex-col items-center justify-center w-full py-3 transition-colors">
          <span class="text-xl mb-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg></span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Pengaturan</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'
import ThemeToggle from './ThemeToggle.vue'

// Import Tab Components Baru Kita!
import HomeTab from './tabs/HomeTab.vue'
import CartTab from './tabs/CartTab.vue'
import SettingTab from './tabs/SettingTab.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToastStore()

const activeTab = ref('home')
const isLoggedIn = computed(() => !!authStore.user)

// STATE ORDER (Dikelola di Induk agar Cart bisa memicu refresh)
const myOrders = ref([])
const isOrdersLoading = ref(false)
const isOrdersFetched = ref(false)

onMounted(async () => {
  await cartStore.fetchSettings()
  if (isLoggedIn.value) fetchMyOrders()
})

const handlesettingClick = () => {
  if (!isLoggedIn.value) {
    toast.show('Silakan masuk terlebih dahulu untuk melihat profil.', 'error')
    router.push('/login')
  } else {
    activeTab.value = 'setting'
  }
}

const fetchMyOrders = async () => {
  isOrdersLoading.value = true
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *, 
        merchant:merchant_id(full_name, merchant_details(store_name)),
        driver:driver_id(full_name, phone_number)
      `) // Trik relasi: menarik data nama dan nomor telepon kurir
      .eq('customer_id', authStore.user?.id)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    
    myOrders.value = (data || []).map(order => {
      const details = Array.isArray(order.merchant?.merchant_details) ? order.merchant.merchant_details[0] : order.merchant?.merchant_details;
      return { ...order, display_merchant_name: details?.store_name || order.merchant?.full_name || 'Toko' }
    })
    isOrdersFetched.value = true
  } catch (error) {
    toast.show('Gagal memuat pesanan: ' + error.message, 'error')
  } finally {
    isOrdersLoading.value = false
  }
}
</script>