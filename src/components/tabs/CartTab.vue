<template>
  <div class="animate-fade-in space-y-6 max-w-2xl mx-auto pb-8">
    <h2 class="text-2xl font-black mb-4 text-gray-900">Keranjang Saya</h2>

    <div v-if="cartStore.items.length === 0" class="bg-white p-12 text-center rounded-3xl shadow-sm border border-gray-200">
      <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
      <p class="text-gray-500 font-medium mb-6">Keranjang belanja Anda masih kosong.</p>
      <button @click="emit('changeTab', 'home')" class="px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2 mx-auto">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Pilih Makanan
      </button>
    </div>

    <div v-else class="space-y-5">
      
      <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
        <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Alamat Pengiriman
        </h3>
        
        <div v-if="myAddresses.length > 0">
          <select v-model="selectedAddress" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 transition">
            <option v-for="addr in myAddresses" :key="addr.id" :value="addr">
              {{ addr.recipient_name }} - {{ addr.address_detail }}
            </option>
          </select>
          <p v-if="selectedAddress" class="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            {{ selectedAddress.recipient_phone }}
          </p>
        </div>
        <div v-else class="text-center py-5 bg-orange-50 rounded-xl border border-orange-100">
          <p class="text-sm text-orange-600 font-medium mb-3">Anda belum menambahkan alamat.</p>
          <button @click="emit('changeTab', 'setting')" class="text-xs font-bold bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition shadow-sm">Tambah Alamat Profil</button>
        </div>
      </div>

      <div class="space-y-4">
        <div v-for="group in cartStore.groupedByMerchant" :key="group.merchant_id" class="bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
          <h3 class="font-black text-gray-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V10l-2.5-4h-9L5 10v11M3 10h18M5 21h14M7 10v3a2 2 0 004 0v-3m4 0v3a2 2 0 004 0v-3"></path></svg>
            {{ group.merchant_name }}
          </h3>
          
          <div class="space-y-4">
            <div v-for="item in group.items" :key="item.id" class="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm sm:text-base truncate text-gray-800">{{ item.name }}</p>
                <div class="mt-0.5">
                  <p class="font-extrabold text-blue-600 text-xs sm:text-sm">Rp {{ formatRupiah(item.price) }}</p>
                  <p v-if="item.original_price && item.original_price > item.price" class="text-[10px] text-gray-400 line-through">Rp {{ formatRupiah(item.original_price) }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200 shrink-0 shadow-sm">
                <button @click="cartStore.removeItem(item.id)" class="w-8 h-8 flex items-center justify-center font-bold text-blue-600 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                </button>
                <span class="font-black text-sm w-6 text-center text-gray-800">{{ item.quantity }}</span>
                <button @click="cartStore.addItem(item, { id: group.merchant_id, full_name: group.merchant_name, latitude: item.lat, longitude: item.lng })" class="w-8 h-8 flex items-center justify-center font-bold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
        <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          Metode Pembayaran
        </h3>
        
        <div v-if="activePaymentMethods.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label 
            v-for="method in activePaymentMethods" 
            :key="method.id"
            :class="paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'" 
            class="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition select-none"
          >
            <input type="radio" :value="method.id" v-model="paymentMethod" class="hidden" />
            <span v-if="method.icon" class="text-2xl shrink-0">{{ method.icon }}</span>
            <svg v-else class="w-7 h-7 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <div class="min-w-0">
              <p class="font-bold text-sm text-gray-800 truncate">{{ method.name }}</p>
              <p class="text-[10px] text-gray-500 truncate">{{ method.description }}</p>
            </div>
          </label>
        </div>
        <div v-else class="text-center py-4 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed">
          Metode pembayaran tidak tersedia. Hubungi admin.
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
        <h3 class="font-bold mb-4 text-gray-800">Rincian Pembayaran</h3>
        
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm text-gray-500">
            <span>Subtotal ({{ cartStore.totalItems }} Item)</span>
            <span class="font-medium text-gray-700">Rp {{ formatRupiah(cartStore.subtotalPrice) }}</span>
          </div>
          
          <div class="flex justify-between text-sm text-gray-500">
            <span class="flex items-center gap-1.5">
              Ongkos Kirim 
              <svg v-if="isCalculatingDistance" class="animate-spin w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              <span v-else-if="jarakTempuhKm > 0" class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono font-bold">{{ jarakTempuhKm.toFixed(1) }} km</span>
            </span>
            <span class="font-medium text-gray-700">Rp {{ formatRupiah(ongkosKirim) }}</span>
          </div>

          <div v-if="routingError" class="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {{ routingError }}
          </div>
          
          <div v-if="biayaLayanan > 0" class="flex justify-between text-sm text-gray-500">
            <span>Biaya Layanan Aplikasi</span>
            <span class="font-medium text-gray-700">Rp {{ formatRupiah(biayaLayanan) }}</span>
          </div>

          <div v-if="cartStore.crossStoreFee > 0" class="flex justify-between text-sm text-orange-600 font-medium">
            <span>Biaya Titip Lintas Toko (Multi-Order)</span>
            <span>Rp {{ formatRupiah(cartStore.crossStoreFee) }}</span>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4 mb-5 flex justify-between items-center">
          <span class="font-extrabold text-gray-800">Total Pembayaran</span>
          <span class="font-black text-2xl text-blue-600">Rp {{ formatRupiah(finalTotalPrice) }}</span>
        </div>

        <button @click="openCheckoutConfirm" :disabled="isCheckoutDisabled" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-extrabold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2">
          <svg v-if="isCheckoutLoading || isCalculatingDistance" class="animate-spin w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Buat Pesanan Sekarang
        </button>
      </div>

    </div>

    <div v-if="showConfirmCheckout" class="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
        <svg class="w-16 h-16 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        <h3 class="text-xl font-black text-gray-900 mb-2">Konfirmasi Pesanan</h3>
        <p class="text-sm text-gray-500 mb-2">
          Total Pembayaran: <br/><strong class="text-blue-600 text-2xl">Rp {{ formatRupiah(finalTotalPrice) }}</strong>
        </p>
        <p class="text-xs text-blue-700 bg-blue-50 p-3 rounded-xl font-bold mb-6 border border-blue-100">
          Pesanan akan segera diteruskan ke Toko. Lanjutkan?
        </p>
        
        <div class="flex gap-3">
          <button @click="showConfirmCheckout = false" class="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Batal</button>
          <button @click="executeCheckout" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm">Proses</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useToastStore } from '../../stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToastStore()
const emit = defineEmits(['changeTab', 'refreshOrders'])

const isLoggedIn = computed(() => !!authStore.user)
const isCheckoutLoading = ref(false)
const showConfirmCheckout = ref(false) 

const myAddresses = ref([])
const selectedAddress = ref(null)
const paymentMethod = ref('')
const appSettings = ref({})
const activePaymentMethods = ref([])

// --- STATE UNTUK ONGKIR & LAYANAN DINAMIS ---
const ongkosKirim = ref(0)
const jarakTempuhKm = ref(0)
const isCalculatingDistance = ref(false)
const routingError = ref('')
let routeRequestId = 0

const formatRupiah = (angka) => angka ? Math.round(angka).toLocaleString('id-ID') : '0'

// 1. Ambil Pengaturan Admin, Metode Pembayaran, dan Alamat User
onMounted(async () => {
  // Ambil pengaturan termasuk 'service_fee'
  const { data: settings } = await supabase.from('app_settings').select('*').single()
  if (settings) appSettings.value = settings

  // Ambil metode pembayaran aktif
  const { data: methods } = await supabase.from('payment_methods').select('*').eq('is_active', true).order('created_at', { ascending: true })
  activePaymentMethods.value = methods || []
  if (activePaymentMethods.value.length > 0) {
    paymentMethod.value = activePaymentMethods.value[0].id
  }

  // Ambil alamat user
  if (isLoggedIn.value) {
    const { data: addresses } = await supabase.from('user_addresses').select('*').eq('user_id', authStore.user.id).order('created_at', { ascending: false })
    myAddresses.value = addresses || []
    if (myAddresses.value.length > 0) selectedAddress.value = myAddresses.value[0] 
  }
})

// 2. Hitung jarak rute mobil toko ke alamat user
watch([selectedAddress, () => cartStore.groupedByMerchant], async ([newAddress, newCart]) => {
  const requestId = ++routeRequestId
  routingError.value = ''

  if (!newAddress || newCart.length === 0) {
    ongkosKirim.value = 0
    jarakTempuhKm.value = 0
    return
  }
  
  const firstItem = newCart[0].items[0]
  if (!firstItem.lat || !firstItem.lng || !newAddress.latitude || !newAddress.longitude) {
    ongkosKirim.value = 0
    jarakTempuhKm.value = 0
    routingError.value = 'Koordinat toko atau alamat belum lengkap, ongkir belum bisa dihitung.'
    return
  }

  isCalculatingDistance.value = true
  
  try {
    const distanceKm = await getDrivingRouteDistanceKm({
      startLat: Number(firstItem.lat),
      startLng: Number(firstItem.lng),
      endLat: Number(newAddress.latitude),
      endLng: Number(newAddress.longitude)
    })

    if (requestId !== routeRequestId) return

    jarakTempuhKm.value = distanceKm
    applyAdminPricingLogic()
  } catch (error) {
    if (requestId !== routeRequestId) return

    ongkosKirim.value = 0
    jarakTempuhKm.value = 0
    routingError.value = error.message || 'Rute toko ke alamat belum berhasil dihitung.'
  } finally {
    if (requestId === routeRequestId) isCalculatingDistance.value = false
  }
}, { deep: true, immediate: true })

const getDrivingRouteDistanceKm = async ({ startLat, startLng, endLat, endLng }) => {
  if (![startLat, startLng, endLat, endLng].every(Number.isFinite)) {
    throw new Error('Koordinat rute tidak valid.')
  }

  const orsApiKey = import.meta.env.VITE_ORS_API_KEY
  if (orsApiKey) {
    try {
      return await getOpenRouteServiceDistanceKm({ startLat, startLng, endLat, endLng, apiKey: orsApiKey })
    } catch {}
  }

  return getOsrmDistanceKm({ startLat, startLng, endLat, endLng })
}

const getOpenRouteServiceDistanceKm = async ({ startLat, startLng, endLat, endLng, apiKey }) => {
  const params = new URLSearchParams({
    api_key: apiKey,
    start: `${startLng},${startLat}`,
    end: `${endLng},${endLat}`
  })
  const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?${params.toString()}`)
  if (!response.ok) throw new Error('OpenRouteService gagal menghitung rute.')

  const data = await response.json()
  const distance = data.features?.[0]?.properties?.segments?.[0]?.distance
  if (!Number.isFinite(distance)) throw new Error('Rute OpenRouteService tidak ditemukan.')

  return distance / 1000
}

const getOsrmDistanceKm = async ({ startLat, startLng, endLat, endLng }) => {
  const baseUrl = (import.meta.env.VITE_OSRM_BASE_URL || 'https://router.project-osrm.org').replace(/\/$/, '')
  const coordinates = `${startLng},${startLat};${endLng},${endLat}`
  const response = await fetch(`${baseUrl}/route/v1/driving/${coordinates}?overview=false&alternatives=false&steps=false`)
  if (!response.ok) throw new Error('Layanan rute belum bisa dihubungi.')

  const data = await response.json()
  const distance = data.routes?.[0]?.distance
  if (data.code !== 'Ok' || !Number.isFinite(distance)) throw new Error('Rute toko ke alamat tidak ditemukan.')

  return distance / 1000
}

const applyAdminPricingLogic = () => {
  const baseFee = appSettings.value?.delivery_base_fee || 5000     
  const baseDistance = appSettings.value?.delivery_base_distance_km || 3   
  const extraFee = appSettings.value?.delivery_extra_fee_per_km || 1000    
  
  if (jarakTempuhKm.value <= baseDistance) {
    ongkosKirim.value = baseFee
  } else {
    const extraDistance = Math.ceil(jarakTempuhKm.value - baseDistance)
    ongkosKirim.value = baseFee + (extraDistance * extraFee)
  }
}

// === KALKULASI TOTAL BIAYA AKHIR TERMASUK SERVICE FEE ===
const biayaLayanan = computed(() => appSettings.value?.service_fee || 0)
const isCheckoutDisabled = computed(() => isCheckoutLoading.value || isCalculatingDistance.value || !!routingError.value || jarakTempuhKm.value <= 0)

const finalTotalPrice = computed(() => {
  if (isCalculatingDistance.value) return 0 
  return cartStore.subtotalPrice + cartStore.crossStoreFee + ongkosKirim.value + biayaLayanan.value
})

// === ALUR CHECKOUT ===
const openCheckoutConfirm = () => {
  if (!isLoggedIn.value) return (toast.show('Silakan login terlebih dahulu.', 'error'), router.push('/login'))
  if (!selectedAddress.value) return toast.show('Pilih atau tambahkan alamat pengiriman Anda terlebih dahulu!', 'error')
  if (routingError.value) return toast.show(routingError.value, 'error')
  if (jarakTempuhKm.value <= 0) return toast.show('Tunggu sampai ongkir rute selesai dihitung.', 'warning')
  showConfirmCheckout.value = true
}

const executeCheckout = async () => {
  showConfirmCheckout.value = false
  isCheckoutLoading.value = true
  
  try {
    const fullAddress = `${selectedAddress.value.recipient_name} | 📞 ${selectedAddress.value.recipient_phone} | 📍 ${selectedAddress.value.address_detail}`

    const ordersToInsert = cartStore.groupedByMerchant.map((group, index) => {
      const subtotalItems = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Bebankan ongkir, biaya layanan, & fee lintas toko HANYA pada pesanan PERTAMA.
      // Ini agar pelanggan yang membeli dari banyak toko tidak ditagih ongkir/layanan dobel.
      const isFirstOrder = index === 0;
      const appliedDeliveryFee = isFirstOrder ? ongkosKirim.value : 0;
      const appliedServiceFee = isFirstOrder ? biayaLayanan.value : 0;
      const appliedCrossStoreFee = isFirstOrder ? cartStore.crossStoreFee : 0;
      
      const totalSemuaFee = appliedDeliveryFee + appliedServiceFee + appliedCrossStoreFee;

      return {
        customer_id: authStore.user?.id,
        merchant_id: group.merchant_id,
        items: group.items,
        total_price: subtotalItems + totalSemuaFee, // Total bayar untuk referensi pembayaran
        
        // SIMPAN RINCIAN FEE KE DATABASE (Penting untuk transparansi admin & toko)
        service_fee: appliedServiceFee,
        delivery_fee: appliedDeliveryFee,
        cross_store_fee: appliedCrossStoreFee,

        status: 'pending',
        payment_method: paymentMethod.value,
        delivery_address: fullAddress,
        delivery_lat: selectedAddress.value.latitude,
        delivery_lng: selectedAddress.value.longitude,
        delivery_distance_km: isFirstOrder ? jarakTempuhKm.value : 0
      }
    });

    const { data: insertedOrders, error } = await supabase
      .from('orders')
      .insert(ordersToInsert)
      .select('id, merchant_id')
    if (error) throw error

    await Promise.allSettled((insertedOrders || []).map(order => (
      supabase.functions.invoke('notify-new-order', {
        body: {
          order_id: order.id
        }
      })
    )))
    
    toast.show('Pesanan berhasil dibuat!', 'success')
    cartStore.clearCart() 
    
    emit('refreshOrders')
    emit('changeTab', 'setting') 
  } catch (e) { 
    toast.show('Terjadi kesalahan saat checkout: ' + e.message, 'error') 
  } finally {
    isCheckoutLoading.value = false
  }
}
</script>
