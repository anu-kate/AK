<template>
  <div class="animate-fade-in space-y-6 pb-6">
    <div v-if="isMenusLoading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      <div v-for="i in 8" :key="i" class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
        <div class="w-full h-28 sm:h-40 bg-gray-200 rounded-xl mb-3"></div>
        <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="displayedMenus.length === 0" class="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm flex flex-col items-center">
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V10l-2.5-4h-9L5 10v11M3 10h18M5 21h14M7 10v3a2 2 0 004 0v-3m4 0v3a2 2 0 004 0v-3"></path></svg>
      <h3 class="text-base font-bold text-gray-600">Belum ada toko yang buka</h3>
      <p class="text-sm text-gray-400 mt-1">Silakan kembali lagi nanti.</p>
    </div>

    <div v-else class="space-y-3">
      <div v-if="selectedMerchantId" class="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center justify-between gap-3">
        <div>
          <p class="text-[10px] font-black uppercase tracking-wide text-blue-500">Menu Toko</p>
          <p class="font-bold text-sm text-blue-900">{{ selectedMerchantName }}</p>
        </div>
        <button @click="selectedMerchantId = null" class="px-3 py-2 bg-white text-blue-600 border border-blue-100 rounded-xl text-xs font-bold hover:bg-blue-100 transition">Lihat Semua</button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      <div v-for="product in displayedMenus" :key="product.id" class="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between group" :class="!product.is_available ? 'opacity-75' : ''">
        <div>
          <div class="relative w-full h-28 sm:h-40 bg-gray-100 rounded-xl mb-3 overflow-hidden">
             <img :src="product.image_url || defaultMenuImage" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
             <span :class="product.is_available ? 'text-green-600 border-green-100' : 'text-red-600 border-red-100'" class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm border">{{ product.is_available ? 'Ada' : 'Habis' }}</span>
          </div>
          <h4 class="font-bold text-sm leading-tight mb-1 line-clamp-2 text-gray-800">{{ product.name }}</h4>
          <button @click="selectedMerchantId = product.merchant.id" class="text-[10px] text-gray-500 mb-2 flex items-center gap-1 line-clamp-1 hover:text-blue-600 transition text-left">
            <svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V10l-2.5-4h-9L5 10v11M3 10h18M5 21h14M7 10v3a2 2 0 004 0v-3m4 0v3a2 2 0 004 0v-3"></path></svg>
            {{ product.merchant?.full_name }}
          </button>
        </div>
        
        <div class="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
          <div class="min-w-0 pr-2">
            <div v-if="hasPromoPrice(product)" class="flex flex-col leading-tight">
              <span class="font-black text-red-500 text-xs sm:text-sm truncate">Rp {{ formatRupiah(getEffectivePrice(product)) }}</span>
              <span class="text-[10px] text-gray-400 line-through">Rp {{ formatRupiah(product.price) }}</span>
            </div>
            <span v-else class="font-black text-blue-600 text-xs sm:text-sm truncate">Rp {{ formatRupiah(product.price) }}</span>
          </div>
          
          <div v-if="getItemQuantity(product.id) > 0" class="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-300 shrink-0 shadow-sm transition">
            <button @click="cartStore.removeItem(product.id)" class="w-7 h-7 flex items-center justify-center font-bold text-blue-600 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            </button>
            <span class="font-black text-xs w-4 text-center text-gray-800">{{ getItemQuantity(product.id) }}</span>
            <button @click="addToCart(product)" :disabled="!product.is_available" class="w-7 h-7 flex items-center justify-center font-bold text-white rounded-lg shadow-sm transition" :class="product.is_available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
          </div>

          <div v-else class="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-300 shrink-0 shadow-sm transition">
            <button @click="addToCart(product)" :disabled="!product.is_available" class="w-7 h-7 flex items-center justify-center font-bold text-white rounded-lg shadow-sm transition" :class="product.is_available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </button>
          </div>

        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useCartStore } from '../../stores/cart'
import { useToastStore } from '../../stores/toast'
import defaultMenuImage from '../../assets/default-menu.svg'

const cartStore = useCartStore()
const toast = useToastStore()

const allMenus = ref([])
const isMenusLoading = ref(true)
const selectedMerchantId = ref(null)
const formatRupiah = (angka) => angka ? angka.toLocaleString('id-ID') : '0'
const hasPromoPrice = (product) => Number(product.discount_price) > 0 && Number(product.discount_price) < Number(product.price)
const getEffectivePrice = (product) => hasPromoPrice(product) ? Number(product.discount_price) : Number(product.price || 0)
const displayedMenus = computed(() => {
  const menus = selectedMerchantId.value
    ? allMenus.value.filter(product => product.merchant?.id === selectedMerchantId.value)
    : allMenus.value

  return [...menus].sort((a, b) => Number(b.is_available) - Number(a.is_available))
})
const selectedMerchantName = computed(() => {
  const product = allMenus.value.find(item => item.merchant?.id === selectedMerchantId.value)
  return product?.merchant?.full_name || 'Toko'
})

onMounted(async () => {
  await fetchAllMenus()
})

const fetchAllMenus = async () => {
  isMenusLoading.value = true
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`*, merchant:merchant_id (id, full_name, merchant_details (store_name, is_open, latitude, longitude))`)
      
    if (error) throw error
    
    allMenus.value = (data || []).map(p => {
      const details = Array.isArray(p.merchant?.merchant_details) ? p.merchant.merchant_details[0] : p.merchant?.merchant_details
      return {
        ...p,
        merchant: {
          id: p.merchant?.id,
          full_name: details?.store_name || p.merchant?.full_name || 'Toko', 
          is_open: details?.is_open || false,
          latitude: details?.latitude,
          longitude: details?.longitude
        }
      }
    }).filter(p => p.merchant.is_open === true)
  } catch (error) {
    toast.show('Gagal memuat menu: ' + error.message, 'error')
  } finally {
    isMenusLoading.value = false
  }
}

// Mengecek kuantitas sebuah item di dalam keranjang (Store)
const getItemQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId)
  return item ? item.quantity : 0
}

const addToCart = (product) => {
  if (!product.is_available) return toast.show('Menu sedang tidak tersedia.', 'warning')
  cartStore.addItem({ ...product, price: getEffectivePrice(product), original_price: product.price }, product.merchant)
  toast.show(`${product.name} ditambahkan`, 'success')
}
</script>
