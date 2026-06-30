<template>
  <div class="animate-fade-in space-y-6 max-w-2xl mx-auto pb-8">
    <h2 class="text-2xl font-black mb-4 text-gray-900">Keranjang Saya</h2>

    <div v-if="cartStore.items.length === 0" class="bg-white p-12 text-center rounded-3xl shadow-sm border border-gray-200">
      <ShoppingCartIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 font-medium mb-6">Keranjang belanja Anda masih kosong.</p>
      <button @click="emit('changeTab', 'home')" class="px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2 mx-auto">
        <PlusIcon class="w-5 h-5" />
        Pilih Makanan
      </button>
    </div>

    <div v-else class="space-y-5">
      
      <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
        <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <MapPinIcon class="size-6 text-gray-400" />
          Alamat Pengiriman
        </h3>
        
        <div v-if="myAddresses.length > 0">
          <select v-model="selectedAddress" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 transition">
            <option v-for="addr in myAddresses" :key="addr.id" :value="addr">
              {{ addr.recipient_name }} - {{ addr.address_detail }}
            </option>
          </select>
          <p v-if="selectedAddress" class="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1.5">
            <PhoneIcon class="size-4 text-gray-400" />
            {{ selectedAddress.recipient_phone }}
          </p>
        </div>
        <div v-else class="text-center py-5 bg-orange-50 rounded-xl border border-orange-100">
          <p class="text-sm text-orange-600 font-medium mb-3">Anda belum menambahkan alamat.</p>
          <button @click="openAddressModal" class="text-xs font-bold bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition shadow-sm">Tambah Alamat Profil</button>
        </div>
      </div>

      <div class="space-y-4">
        <div v-for="group in cartStore.groupedByMerchant" :key="group.merchant_id" class="bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
          <h3 class="font-black text-gray-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
            <BuildingStorefrontIcon class="size-6 text-gray-400" />
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
                  <MinusIcon class="w-4 h-4" />
                </button>
                <span class="font-black text-sm w-6 text-center text-gray-800">{{ item.quantity }}</span>
                <button @click="cartStore.addItem(item, { id: group.merchant_id, full_name: group.merchant_name, latitude: item.lat, longitude: item.lng })" class="w-8 h-8 flex items-center justify-center font-bold text-white rounded-lg shadow-sm transition" :class="item.is_available ? 'bg-blue-600' : 'bg-blue-600'">
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
        <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BanknotesIcon class="size-6 text-gray-400" />
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
            <BanknotesIcon v-else class="w-7 h-7 text-gray-500 shrink-0" />
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
              <ArrowPathIcon v-if="isCalculatingDistance" class="w-3 h-3 text-gray-400 animate-spin" />
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

        <button @click="openCheckoutConfirm" :disabled="isCheckoutDisabled" class="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-extrabold shadow-md transition disabled:opacity-50">
          <ArrowPathIcon v-if="isCheckoutLoading || isCalculatingDistance" class="w-5 h-5 text-white animate-spin" />
          <CheckIcon v-else class="w-5 h-5 text-white" />
          Buat Pesanan Sekarang
        </button>
      </div>

    </div>

    <div v-if="showConfirmCheckout" class="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
        <CheckIcon class="w-12 h-12 text-green-600 mx-auto mb-4" />
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

    <!-- MODAL TAMBAH ALAMAT -->
    <div v-if="showAddressModal" class="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-lg max-h-[90vh] rounded-3xl flex flex-col shadow-2xl animate-fade-in overflow-hidden">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 class="text-lg font-bold">Tambah Alamat Pengiriman</h3>
          <button @click="closeAddressModal" class="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>
        
        <div class="p-6 overflow-y-auto grow">
          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-500">Nama Penerima</label>
              <input v-model="addressForm.recipient_name" type="text" placeholder="Masukkan nama penerima" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200">
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500">Telepon</label>
              <input v-model="addressForm.recipient_phone" type="text" placeholder="08xxxxxxxxxx" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200">
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500">Detail Alamat</label>
              <textarea v-model="addressForm.address_detail" rows="2" placeholder="Jalan, No. Rumah, RT/RW, dll" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200"></textarea>
            </div>
            
            <div class="flex items-center gap-2 mt-2">
              <input type="checkbox" id="is_primary" v-model="addressForm.is_primary" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <label for="is_primary" class="text-sm font-bold text-gray-700">Jadikan sebagai alamat utama</label>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1 mt-2">
                <label class="text-xs font-bold text-gray-500">Tentukan Titik Peta (Wajib)</label>
                <button type="button" @click="centerToUserLocation" class="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200 flex items-center gap-1">
                  <MapPinIcon class="w-3 h-3" />
                  Ke Lokasi Saya
                </button>
              </div>
              <div id="mapContainer" class="w-full h-48 rounded-xl border-2 border-gray-200 z-0 relative"></div>
            </div>
            <div class="flex gap-3 pt-4">
              <button @click="closeAddressModal" class="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
              <button @click="saveAddress" :disabled="!addressForm.latitude || isSavingAddress" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-blue-700 transition">
                {{ isSavingAddress ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BuildingStorefrontIcon, MapPinIcon, PhoneIcon, ShoppingCartIcon, BanknotesIcon, CheckIcon, PlusIcon, MinusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useToastStore } from '../../stores/toast'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

// --- STATE UNTUK MODAL ALAMAT ---
const showAddressModal = ref(false)
const isSavingAddress = ref(false)
const addressForm = ref({ recipient_name: '', recipient_phone: '', address_detail: '', latitude: null, longitude: null, is_primary: false })
let mapInstance = null
let mapMarker = null

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
    await fetchAddresses()
  }
})

const fetchAddresses = async () => {
  const { data } = await supabase.from('user_addresses').select('*').eq('user_id', authStore.user.id).order('created_at', { ascending: false })
  myAddresses.value = data || []
  if (myAddresses.value.length > 0) selectedAddress.value = myAddresses.value[0]
}

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

// === FUNGSI MODAL ALAMAT ===
const LELEA_LAT = -6.4716; 
const LELEA_LNG = 108.1887;

const openAddressModal = async () => {
  if (!isLoggedIn.value) {
    toast.show('Silakan login terlebih dahulu untuk menambah alamat.', 'error')
    router.push('/login')
    return
  }
  
  showAddressModal.value = true
  addressForm.value = { recipient_name: '', recipient_phone: '', address_detail: '', latitude: null, longitude: null, is_primary: myAddresses.value.length === 0 }
  
  await nextTick()
  initMap()
}

const closeAddressModal = () => {
  showAddressModal.value = false
  if (mapInstance) { 
    mapInstance.remove()
    mapInstance = null
  }
}

const initMap = () => {
  if (mapInstance) mapInstance.remove()
  
  const lat = addressForm.value.latitude || LELEA_LAT
  const lng = addressForm.value.longitude || LELEA_LNG
  
  mapInstance = L.map('mapContainer').setView([lat, lng], 15)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance)
  mapMarker = L.marker([lat, lng], { draggable: true }).addTo(mapInstance)
  
  addressForm.value.latitude = lat
  addressForm.value.longitude = lng
  
  setTimeout(() => { mapInstance.invalidateSize() }, 200);

  mapMarker.on('dragend', (e) => { const pos = e.target.getLatLng(); addressForm.value.latitude = pos.lat; addressForm.value.longitude = pos.lng })
  mapInstance.on('click', (e) => { mapMarker.setLatLng(e.latlng); addressForm.value.latitude = e.latlng.lat; addressForm.value.longitude = e.latlng.lng })
}

const centerToUserLocation = () => {
  if (navigator.geolocation) {
    toast.show('Mencari lokasi Anda...', 'info')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        mapInstance.setView([latitude, longitude], 17)
        mapMarker.setLatLng([latitude, longitude])
        addressForm.value.latitude = latitude
        addressForm.value.longitude = longitude
        toast.show('Lokasi ditemukan!', 'success')
      },
      (err) => { toast.show('Gagal melacak GPS.', 'error') },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }
}

const saveAddress = async () => {
  if (!addressForm.value.recipient_name.trim()) {
    return toast.show('Nama penerima wajib diisi!', 'error')
  }
  if (!addressForm.value.recipient_phone.trim()) {
    return toast.show('Telepon wajib diisi!', 'error')
  }
  if (!addressForm.value.address_detail.trim()) {
    return toast.show('Detail alamat wajib diisi!', 'error')
  }
  if (!addressForm.value.latitude || !addressForm.value.longitude) {
    return toast.show('Tentukan lokasi di peta terlebih dahulu!', 'error')
  }

  isSavingAddress.value = true
  try {
    if (addressForm.value.is_primary) {
      await supabase.from('user_addresses').update({ is_primary: false }).eq('user_id', authStore.user.id)
    }

    const { error } = await supabase.from('user_addresses').insert([{ 
      user_id: authStore.user.id, 
      ...addressForm.value 
    }])
    
    if (error) throw error

    toast.show('Alamat berhasil disimpan', 'success')
    closeAddressModal()
    await fetchAddresses()
  } catch (e) { 
    toast.show(e.message || 'Gagal menyimpan alamat', 'error') 
  } finally { 
    isSavingAddress.value = false 
  }
}
</script>
