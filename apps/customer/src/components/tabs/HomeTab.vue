<template>
  <div class="animate-fade-in space-y-4 pb-6">

    <!-- Search Bar -->
    <div class="relative">
      <div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Cari menu atau nama toko..."
        class="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-10 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Filter aktif: toko dipilih -->
    <div v-if="selectedMerchantId && !searchQuery" class="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-black uppercase tracking-wide text-blue-500">Menu Toko</p>
        <p class="font-bold text-sm text-blue-900">{{ selectedMerchantName }}</p>
      </div>
      <button @click="selectedMerchantId = null" class="px-3 py-2 bg-white text-blue-600 border border-blue-100 rounded-xl text-xs font-bold hover:bg-blue-100 transition">Lihat Semua</button>
    </div>

    <!-- Label hasil pencarian -->
    <div v-if="searchQuery" class="flex items-center justify-between">
      <p class="text-xs text-gray-500 font-medium">
        Hasil untuk <span class="font-bold text-gray-800">"{{ searchQuery }}"</span>
        — <span class="text-blue-600 font-bold">{{ displayedMenus.length }} item</span>
      </p>
      <button @click="searchQuery = ''; selectedMerchantId = null" class="text-xs text-gray-400 hover:text-gray-600 transition">Reset</button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isMenusLoading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      <div v-for="i in 8" :key="i" class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
        <div class="w-full h-28 sm:h-40 bg-gray-200 rounded-xl mb-3"></div>
        <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Kosong: tidak ada menu -->
    <div v-else-if="displayedMenus.length === 0" class="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm flex flex-col items-center">
      <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <h3 class="text-base font-bold text-gray-600">
        {{ searchQuery ? 'Menu tidak ditemukan' : 'Belum ada toko yang buka' }}
      </h3>
      <p class="text-sm text-gray-400 mt-1">
        {{ searchQuery ? `Coba kata kunci lain atau hubungi admin.` : 'Silakan kembali lagi nanti.' }}
      </p>
      <button @click="contactAdmin" class="px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold mt-4 shadow-md hover:bg-[#128C7E] transition inline-flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.098.824z"/></svg>
        Hubungi Admin
      </button>
      <button v-if="searchQuery" @click="searchQuery = ''" class="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition">
        Hapus Pencarian
      </button>
    </div>

    <!-- Grid menu -->
    <div v-else class="space-y-4">
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        <div
          v-for="product in displayedMenus"
          :key="product.id"
          class="bg-white p-3 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between group"
          :class="!product.is_available ? 'opacity-75' : ''"
        >
          <div>
            <div class="relative w-full h-28 sm:h-40 bg-gray-100 rounded-xl mb-3 overflow-hidden">
              <img :src="product.image_url || defaultMenuImage" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <span
                :class="product.is_available ? 'text-green-600 border-gray-300' : 'text-red-600 border-gray-300'"
                class="absolute top-2 left-2 bg-white backdrop-blur-sm text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm border"
              >{{ product.is_available ? 'Ada' : 'Habis' }}</span>
            </div>
            <h4 class="font-bold text-sm leading-tight mb-1 line-clamp-2 text-gray-800">{{ product.name }}</h4>
            <button @click="selectMerchant(product)" class="text-[10px] text-gray-500 mb-2 flex items-center gap-1 line-clamp-1 hover:text-blue-600 transition text-left">
              <BuildingStorefrontIcon class="w-3.5 h-3.5 text-blue-500 shrink-0" />
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

            <div v-if="getItemQuantity(product.id) > 0" class="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-300 shrink-0 shadow-sm">
              <button @click="cartStore.removeItem(product.id)" class="w-7 h-7 flex items-center justify-center font-bold text-blue-600 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition">
                <MinusIcon class="w-3.5 h-3.5" />
              </button>
              <span class="font-black text-xs w-4 text-center text-gray-800">{{ getItemQuantity(product.id) }}</span>
              <button @click="addToCart(product)" :disabled="!product.is_available" class="w-7 h-7 flex items-center justify-center font-bold text-white rounded-lg shadow-sm transition" :class="product.is_available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'">
                <PlusIcon class="w-3.5 h-3.5" />
              </button>
            </div>

            <div v-else class="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-300 shrink-0 shadow-sm">
              <button @click="addToCart(product)" :disabled="!product.is_available" class="w-7 h-7 flex items-center justify-center font-bold text-white rounded-lg shadow-sm transition" :class="product.is_available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'">
                <PlusIcon class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Banner hubungi admin -->
      <div class="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 text-center shadow-sm">
        <p class="text-sm font-bold text-gray-800 mb-1">Menu yang dicari tidak ada atau belum terdaftar?</p>
        <p class="text-xs text-gray-500 mb-4">Silakan hubungi Admin untuk order menu yang belum tersedia.</p>
        <button @click="contactAdmin" class="px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#128C7E] transition inline-flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.098.824z"/></svg>
          Hubungi Admin
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, MinusIcon, BuildingStorefrontIcon } from '@heroicons/vue/16/solid'
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
const searchQuery = ref('')

const formatRupiah = (angka) => angka ? angka.toLocaleString('id-ID') : '0'
const hasPromoPrice = (product) => Number(product.discount_price) > 0 && Number(product.discount_price) < Number(product.price)
const getEffectivePrice = (product) => hasPromoPrice(product) ? Number(product.discount_price) : Number(product.price || 0)

const displayedMenus = computed(() => {
  let menus = allMenus.value

  // Filter berdasarkan pencarian (menu name atau nama toko)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    menus = menus.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.merchant?.full_name?.toLowerCase().includes(q)
    )
    return [...menus].sort((a, b) => Number(b.is_available) - Number(a.is_available))
  }

  // Filter berdasarkan toko dipilih
  if (selectedMerchantId.value) {
    menus = menus.filter(p => p.merchant?.id === selectedMerchantId.value)
  }

  return [...menus].sort((a, b) => Number(b.is_available) - Number(a.is_available))
})

const selectedMerchantName = computed(() => {
  const product = allMenus.value.find(item => item.merchant?.id === selectedMerchantId.value)
  return product?.merchant?.full_name || 'Toko'
})

const selectMerchant = (product) => {
  // Jika sedang mode search, klik toko akan set filter toko dan clear search
  searchQuery.value = ''
  selectedMerchantId.value = product.merchant.id
}

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

const getItemQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId)
  return item ? item.quantity : 0
}

const addToCart = (product) => {
  if (!product.is_available) return toast.show('Menu sedang tidak tersedia.', 'warning')
  cartStore.addItem({ ...product, price: getEffectivePrice(product), original_price: product.price }, product.merchant)
  toast.show(`${product.name} ditambahkan`, 'success')
}

const contactAdmin = () => {
  const text = encodeURIComponent('Halo Admin Anturun, saya ingin order menu yang belum terdaftar di aplikasi.')
  window.open(`https://wa.me/6285601232027?text=${text}`, '_blank')
}
</script>
