<template>
  <div class="space-y-6 animate-fade-in relative">
    <div class="flex bg-white border border-gray-300 p-1 rounded-xl">
      <button 
        v-if="!activeOrder"
        @click="syncRadar" 
        class="flex-1 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all duration-200 bg-blue-600 shadow-sm text-white cursor-pointer hover:bg-blue-700"
      >
        Bursa Orderan
      </button>

      <button 
        v-if="activeOrder"
        @click="syncActiveOrder" 
        class="flex-1 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all duration-200 bg-yellow-500 shadow-sm text-white cursor-pointer hover:bg-yellow-600"
      >
        Orderan Aktif Berjalan
      </button>
    </div>

    <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-black uppercase tracking-wide text-blue-500">Antur Kredit</p>
        <a
          :href="buyAkWhatsAppLink"
          target="_blank"
          class="mt-2 inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition"
        >
          Topup AK
        </a>
      </div>
      <div class="text-right">
        <p class="text-2xl font-black text-blue-700">{{ driverCreditBalance }} AK</p>
        <button @click="fetchDriverCredit" class="text-[10px] font-bold text-blue-500 hover:text-blue-700">Refresh Kredit</button>
      </div>
    </div>

    <button
      v-if="!activeOrder"
      @click="requestNotificationPermission"
      class="w-full bg-white text-yellow-700 border border-gray-300 rounded-2xl px-4 py-3 text-xs font-black flex items-center justify-center gap-2 transition"
    >
      {{ notificationPermission === 'granted' || notificationPermission === 'native' ? 'Refresh Notifikasi Orderan' : 'Aktifkan Notifikasi Orderan' }}
    </button>

    <div v-if="!activeOrder" class="animate-slide-up space-y-4">
      <div v-if="availableOrders.length === 0" class="text-center py-10 bg-white rounded-3xl border border-gray-300 shadow-sm">
        <div v-if="isLoading" class="mb-3 w-10 h-10 mx-auto text-blue-600 animate-spin-counterclockwise">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </div>
        <div v-else class="mb-3 w-12 h-12 mx-auto text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">{{ isLoading ? 'Memindai Radar...' : 'Radar Kosong' }}</h3>
        <p class="text-gray-500 text-sm">Belum ada orderan masuk di sekitarmu.</p>
        <button :disabled="isLoading" @click="syncRadar" class="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-200 disabled:opacity-50 transition">
          {{ isLoading ? 'Menunggu...' : 'Pindai Radar' }}
        </button>
      </div>
      
      <div v-else class="space-y-3">
        <div v-for="order in availableOrders" :key="order.id" class="bg-white rounded-2xl border border-gray-300 shadow-sm transition-all duration-300 overflow-hidden">
          <div @click="toggleExpand(order.id)" class="p-4 cursor-pointer transition">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-mono text-[11px] font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md inline-block mb-1">#{{ getOrderCode(order) }}</span>
                <h3 class="font-extrabold text-base text-gray-900">{{ order.merchant?.full_name || 'Toko' }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  <span class="font-semibold text-gray-700">Belanja:</span> Rp {{ formatRupiah(getItemsSubtotal(order)) }} ({{ order.items?.length || 0 }} item)
                </p>
              </div>
              <div class="text-right">
                <span class="block font-black text-blue-600">Rp {{ formatRupiah(order.delivery_fee || 0) }}</span>
                <span class="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-bold">Ongkir</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center mt-3">
              <!-- Bagian Kiri: Info Rute -->
              <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-dashed border-gray-300 px-2 py-1 rounded-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                <span>Toko ke tujuan: {{ getRouteDisplay(order.id, 'toCustomer', 'Menghitung rute...') }}</span>
              </div>

              <!-- Bagian Kanan: Tombol Detail (Sudah Diperbarui) -->
              <!-- Catatan: Mengubah div menjadi button agar ramah aksesibilitas keyboard -->
              <button 
                @click="toggleDetail(order.id)" 
                class="text-[10px] text-gray-500 font-bold flex items-center gap-1 focus:outline-none hover:text-gray-700 transition-colors"
              >
                <span>
                  {{ expandedOrderId === order.id ? 'Tutup Detail' : 'Lihat Detail' }}
                </span>
                
                <!-- Menggunakan satu ikon Heroicons dengan efek rotasi smooth -->
                <ChevronDownIcon 
                  class="w-3.5 h-3.5 transition-transform duration-200" 
                  :class="{ 'rotate-180': expandedOrderId === order.id }"
                />
              </button>
            </div>
          </div>

          <div v-show="expandedOrderId === order.id" class="px-4 pb-4 pt-3 border-t border-gray-300 bg-gray-50 animate-fade-in">
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-2">Daftar Belanjaan</p>
            <ul class="space-y-1 text-xs mb-4">
              <li v-for="(item, idx) in order.items" :key="idx" class="flex items-start gap-2 text-gray-700">
                <span class="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded">{{ item.quantity }}x</span>
                <span class="mt-0.5">{{ item.name || item.product_name || 'Item Produk' }}</span>
              </li>
            </ul>

            <div class="mb-4 bg-white p-3 rounded-xl border border-gray-300 text-xs space-y-1.5">
              <div class="flex justify-between">
                <span class="font-semibold text-gray-500">Biaya layanan user</span>
                <span class="font-bold text-gray-800">Rp {{ formatRupiah(order.service_fee || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-500">Biaya layanan driver</span>
                <span class="font-bold text-gray-800">Rp {{ formatRupiah(getDriverServiceFee(order)) }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-300 pt-2 mt-2">
                <span class="font-black text-gray-700">Kebutuhan AK</span>
                <span :class="hasEnoughCredit(order) ? 'text-blue-700' : 'text-red-600'" class="font-black">{{ getRequiredCredit(order) }} AK</span>
              </div>
            </div>
            
            <button
              @click.stop="confirmAmbilOrder(order.id, order.status)"
              :disabled="!hasEnoughCredit(order)"
              :class="hasEnoughCredit(order) ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
              class="w-full px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition"
            >
              {{ hasEnoughCredit(order) ? 'Ambil Order Ini' : `AK Kurang ${getCreditShortage(order)} AK` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeOrder" class="animate-slide-up space-y-4">
      <div v-if="!activeOrder" class="text-center py-10 bg-white rounded-3xl border border-gray-300 shadow-sm">
        <div class="w-12 h-12 mx-auto text-gray-400 mb-3">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">Tidak ada orderan aktif</h3>
        <p class="text-gray-500 text-sm">Ambil orderan dari bursa untuk mulai bekerja.</p>
      </div>
      <div v-else class="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3 transition-colors">
        <div class="flex justify-between items-center mb-2">
          <div class="flex flex-col gap-1">
            <span class="font-mono text-[11px] font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md w-fit">#{{ getOrderCode(activeOrder) }}</span>
            <span class="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded uppercase w-fit">Sedang Berjalan</span>
          </div>
          <span class="text-xs text-gray-500 text-right">{{ formatDate(activeOrder.created_at) }}</span>
        </div>
        <div>
          <p class="font-black text-lg text-gray-900">{{ activeOrder.merchant?.full_name || 'Toko' }}</p>
          <div class="flex justify-between items-center mt-1">
            <p class="text-sm text-gray-600">Antar ke: {{ activeOrder.customer?.full_name || 'Pelanggan' }}</p>
            <button @click="chatWA(activeOrder.customer?.phone_number)" class="bg-green-100 text-green-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-extrabold hover:bg-green-200 transition shadow-sm">
                <ChatBubbleBottomCenterTextIcon class="w-3.5 h-3.5" />
                Chat
            </button>
          </div>
        </div>

        <div v-if="activeOrder.delivery_address" class="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-900">
          <p class="font-black uppercase tracking-wide text-[10px] text-blue-500 mb-1">Alamat Lengkap</p>
          <p class="font-semibold leading-relaxed whitespace-pre-line">{{ activeOrder.delivery_address }}</p>
        </div>

        <div class="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-300 text-sm">
          <ul class="space-y-1 mb-2">
            <li v-for="(item, idx) in activeOrder.items" :key="idx" class="text-gray-700">
              <b>{{ item.quantity }}x</b> {{ item.name || item.product_name }}
            </li>
          </ul>
          <div class="border-t border-gray-300 pt-2 flex justify-between">
            <span class="font-semibold text-gray-500">Total Belanja:</span>
            <span class="font-bold text-gray-800">Rp {{ formatRupiah(activeOrder.total_price) }}</span>
          </div>
        </div>

        <div class="flex gap-2 mt-4 pt-4 border-t border-gray-300">
          <template v-if="['diproses', 'pending', 'siap_diambil'].includes(activeOrder.status)">
            <button @click="confirmMulaiAntar(activeOrder.id)" class="flex-1 bg-yellow-500 text-white py-2.5 rounded-xl font-bold shadow-sm hover:bg-yellow-600 transition">Mulai Antar</button>
            <button @click="openMerchantMaps(activeOrder.merchant)" class="px-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition text-[11px] font-bold">Map Toko</button>
            <button @click="chatWA(activeOrder.merchant?.phone || activeOrder.merchant_phone)" class="px-3 bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition text-[11px] font-bold">WA Toko</button>
          </template>
          
          <template v-else-if="activeOrder.status === 'diantar'">
            <button @click="confirmSelesai(activeOrder.id)" class="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold shadow-sm hover:bg-green-700 transition">Terkirim</button>
            <button @click="openCustomerMaps(activeOrder)" class="px-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition text-[11px] font-bold">Map User</button>
          </template>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div 
        v-if="modal.isOpen" 
        class="fixed top-0 left-0 w-screen h-screen z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in"
      >
        <div class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-slide-up border border-gray-300 relative">
          <div :class="modal.iconBgClass" class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg v-if="modal.actionType === 'selesai'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <svg v-else-if="modal.actionType === 'antar'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
          <h3 class="text-xl font-black text-center text-gray-900 mb-2">{{ modal.title }}</h3>
          <p class="text-sm text-center text-gray-500 mb-6 leading-relaxed">
            {{ modal.message }}
          </p>
          <div v-if="modal.actionType === 'selesai' && activeOrder" class="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center">
            <p class="text-[10px] font-black uppercase tracking-wide text-blue-500 mb-1">Tagih ke User</p>
            <p class="text-2xl font-black text-blue-700">Rp {{ formatRupiah(activeOrder.total_price) }}</p>
          </div>
          <div v-if="(modal.actionType === 'ambil' || modal.actionType === 'selesai') && modalOrder" class="mb-6 rounded-2xl border border-gray-300 bg-gray-50 p-4 text-center">
            <p class="text-[10px] font-black uppercase tracking-wide text-gray-500 mb-1">{{ modal.actionType === 'ambil' ? 'Estimasi Kebutuhan AK' : 'AK Dipotong Saat Terkirim' }}</p>
            <p class="text-2xl font-black text-gray-800">{{ getRequiredCredit(modalOrder) }} AK</p>
            <p class="text-[10px] font-bold mt-1" :class="hasEnoughCredit(modalOrder) ? 'text-blue-600' : 'text-red-600'">Kredit sekarang: {{ driverCreditBalance }} AK</p>
          </div>
          <div class="flex gap-3">
            <button 
              @click="closeModal" 
              :disabled="isProcessing"
              class="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50">
              Batal
            </button>
            <button 
              @click="executeModalAction" 
              :disabled="isProcessing"
              :class="modal.btnColorClass"
              class="flex-1 py-3 rounded-xl font-bold text-white transition shadow-sm disabled:opacity-50 flex items-center justify-center">
              <span v-if="isProcessing" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span v-else>{{ modal.confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { MapPinIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleBottomCenterIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'
import { supabase } from '../../lib/supabase'
import { listenForegroundDriverMessages, registerDriverFcmToken } from '../../lib/firebaseMessaging'
import { isNativeDriverApp, registerNativeDriverPushToken } from '../../lib/driverNativePush'

const authStore = useAuthStore()
const toast = useToastStore()

const orderanSubTab = ref('aktif') 
const availableOrders = ref([])
const activeOrder = ref(null)
const isLoading = ref(false)
const expandedOrderId = ref(null)
const routeData = ref({}) 
const AK_RATE_RUPIAH = 1000
const driverCreditBalance = ref(0)
const appSettings = ref({ driver_service_fee: 1000 })
const adminWhatsAppNumber = '6285601232027'
const notificationPermission = ref(isNativeDriverApp() ? 'native' : typeof Notification === 'undefined' ? 'unsupported' : Notification.permission)
let ordersRealtimeChannel = null
let unsubscribeForegroundMessages = null

// State Modal Universal
const isProcessing = ref(false)
const modal = ref({
  isOpen: false,
  actionType: null, // 'ambil', 'antar', atau 'selesai'
  orderId: null,
  orderStatus: null, // Digunakan saat mengambil orderan (status pending/diproses)
  title: '',
  message: '',
  confirmText: '',
  btnColorClass: '',
  iconBgClass: ''
})

const getRouteDisplay = (orderId, key, fallback = 'Menghitung rute...') => {
  const data = routeData.value[orderId]
  if (!data || data[key] === undefined || data[key] === '?') return fallback
  return `${data[key]} km`
}

const openBursa = () => {
  if (activeOrder.value) {
    toast.show('Selesaikan orderan aktif terlebih dahulu!', 'warning')
    return
  }
  orderanSubTab.value = 'bursa'
  syncRadar()
}

const openAktif = () => {
  orderanSubTab.value = 'aktif'
  syncActiveOrder()
}

const getDrivingDistance = async (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  try {
    const url1 = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const res1 = await fetch(url1);
    const data1 = await res1.json();
    if (data1.code === 'Ok' && data1.routes?.length > 0) return parseFloat((data1.routes[0].distance / 1000).toFixed(1));
  } catch (err) {}
  try {
    const url2 = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const res2 = await fetch(url2);
    const data2 = await res2.json();
    if (data2.code === 'Ok' && data2.routes?.length > 0) return parseFloat((data2.routes[0].distance / 1000).toFixed(1));
  } catch (err) {}
  return null; 
}

const getCustomerCoordinates = async (order) => {
  const directLat = order.delivery_lat || order.customer_lat || order.latitude
  const directLng = order.delivery_lng || order.customer_lng || order.longitude
  if (directLat && directLng) return { lat: directLat, lng: directLng }

  const { data } = await supabase
    .from('user_addresses')
    .select('latitude, longitude, is_primary, created_at')
    .eq('user_id', order.customer_id)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (data?.latitude && data?.longitude) return { lat: data.latitude, lng: data.longitude }
  return null
}

const calculateRoutesForOrders = async (orders) => {
  for (const order of orders) {
    if (!routeData.value[order.id]) {
      const merDetails = Array.isArray(order.merchant?.merchant_details) ? order.merchant.merchant_details[0] : order.merchant?.merchant_details
      const customerCoordinates = await getCustomerCoordinates(order)
      
      let d2 = null;
      if (merDetails?.latitude && merDetails?.longitude && customerCoordinates?.lat && customerCoordinates?.lng) {
        d2 = await getDrivingDistance(merDetails.latitude, merDetails.longitude, customerCoordinates.lat, customerCoordinates.lng)
      }
      
      const isValidD2 = typeof d2 === 'number';
      
      routeData.value[order.id] = {
        toCustomer: isValidD2 ? d2 : '?'
      }
    }
  }
}

const toggleExpand = (id) => expandedOrderId.value = expandedOrderId.value === id ? null : id
const formatRupiah = (angka) => angka ? angka.toLocaleString('id-ID') : '0'
const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const getOrderCode = (order) => (order.order_number || order.order_no || order.id || '').toString().slice(0, 8).toUpperCase()
const getItemsSubtotal = (order) => (order?.items || []).reduce((sum, item) => {
  const price = Number(item.price || item.product_price || 0)
  const quantity = Number(item.quantity || 1)
  return sum + (price * quantity)
}, 0)
const buyAkWhatsAppLink = computed(() => {
  const userName = authStore.profile?.full_name || 'Kurir'
  const phone = authStore.profile?.phone_number || '-'
  const message = `Halo Admin, saya ${userName} (${phone}). Saya ingin Top up Antur Kredit (AK). AK saya saat ini ${driverCreditBalance.value} AK. Mohon metode pembayarannya.`
  return `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`
})
const modalOrder = computed(() => {
  if (!modal.value.orderId) return null
  return activeOrder.value?.id === modal.value.orderId
    ? activeOrder.value
    : availableOrders.value.find(order => order.id === modal.value.orderId)
})
const getDriverServiceFee = (order) => Number(order?.driver_service_fee || appSettings.value?.driver_service_fee || 1000)
const getRequiredCredit = (order) => Math.max(0, Math.ceil((Number(order?.service_fee || 0) + getDriverServiceFee(order)) / AK_RATE_RUPIAH))
const hasEnoughCredit = (order) => driverCreditBalance.value >= getRequiredCredit(order)
const getCreditShortage = (order) => Math.max(0, getRequiredCredit(order) - driverCreditBalance.value)

const fetchDriverCredit = async () => {
  if (!authStore.user?.id) return
  const { data, error } = await supabase
    .from('driver_details')
    .select('antur_credit_balance')
    .eq('id', authStore.user.id)
    .maybeSingle()

  if (!error && data) driverCreditBalance.value = Number(data.antur_credit_balance || 0)
}

const fetchAppSettings = async () => {
  const { data } = await supabase.from('app_settings').select('*').eq('id', 1).maybeSingle()
  if (data) appSettings.value = { ...appSettings.value, ...data }
}

const requestNotificationPermission = async () => {
  try {
    const result = isNativeDriverApp()
      ? await registerNativeDriverPushToken(authStore.user?.id)
      : await registerDriverFcmToken(authStore.user?.id)
    notificationPermission.value = isNativeDriverApp() ? 'native' : typeof Notification === 'undefined' ? 'unsupported' : Notification.permission

    if (result.ok) {
      toast.show('Push notifikasi orderan aktif.', 'success')
      if (!isNativeDriverApp()) setupForegroundFcmMessages()
    } else {
      toast.show(result.reason === 'firebase_not_configured' ? 'Konfigurasi Firebase belum lengkap.' : 'Izin notifikasi belum aktif.', 'warning')
    }
  } catch (error) {
    toast.show(error?.message || 'Gagal mengaktifkan push notifikasi.', 'error')
  }
}

const refreshGrantedNotificationToken = async () => {
  try {
    if (isNativeDriverApp()) {
      const result = await registerNativeDriverPushToken(authStore.user?.id)
      notificationPermission.value = 'native'
      return result
    }

    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const result = await registerDriverFcmToken(authStore.user?.id)
    notificationPermission.value = Notification.permission
    if (result.ok) setupForegroundFcmMessages()
  } catch (error) {
    console.warn('Unable to refresh driver push token', error)
  }
}

const showNewOrderNotification = (order) => {
  const orderCode = getOrderCode(order)
  toast.show(`Orderan baru masuk #${orderCode}`, 'success')

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    const notification = new Notification('Orderan Baru Masuk', {
      body: `Order #${orderCode} tersedia di bursa orderan.`,
      icon: '/icons/driver-192.png',
      badge: '/icons/driver-192.png',
      tag: `new-order-${order.id}`,
      renotify: true
    })
    notification.onclick = () => {
      window.focus()
      orderanSubTab.value = 'bursa'
      notification.close()
    }
  }
}

const setupOrdersRealtime = () => {
  if (ordersRealtimeChannel) return

  ordersRealtimeChannel = supabase
    .channel('driver-new-orders')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      async (payload) => {
        const order = payload.new
        if (!order || order.driver_id || !['pending', 'diproses', 'siap_diambil'].includes(order.status)) return

        showNewOrderNotification(order)
        if (!activeOrder.value) {
          orderanSubTab.value = 'bursa'
          await fetchAvailableOrdersLogic()
        }
      }
    )
    .subscribe()
}

const setupForegroundFcmMessages = async () => {
  if (unsubscribeForegroundMessages) return
  unsubscribeForegroundMessages = await listenForegroundDriverMessages((payload) => {
    const orderId = payload?.data?.order_id
    toast.show(payload?.notification?.body || payload?.data?.body || 'Orderan baru masuk.', 'success')
    if (!activeOrder.value) {
      orderanSubTab.value = 'bursa'
      fetchAvailableOrdersLogic()
    }
    if (orderId) expandedOrderId.value = orderId
  })
}

const openMerchantMaps = (merchant) => {
  if (!merchant) return toast.show('Data toko tidak ditemukan', 'warning')
  const details = Array.isArray(merchant.merchant_details) ? merchant.merchant_details[0] : merchant.merchant_details
  const query = (details?.latitude && details?.longitude)
    ? `${details.latitude},${details.longitude}`
    : merchant.full_name
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  window.open(mapUrl, '_blank')
}

const openCustomerMaps = async (order) => {
  const coordinates = await getCustomerCoordinates(order)
  const query = coordinates
    ? `${coordinates.lat},${coordinates.lng}`
    : order.delivery_address

  if (!query) return toast.show('Lokasi tujuan tidak ditemukan', 'warning')

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  window.open(mapUrl, '_blank')
}

const fetchActiveOrderLogic = async () => {
  try {
    const { data, error } = await supabase.from('orders')
      .select('*, merchant:merchant_id(id, full_name, phone_number, merchant_details(store_name, latitude, longitude)), customer:customer_id(id, full_name, phone_number)')
      .eq('driver_id', authStore.user?.id)
      .neq('status', 'selesai')
      .neq('status', 'terkirim')
      .order('created_at', { ascending: false }).limit(1).single()
    
    if (data) {
      const details = Array.isArray(data.merchant?.merchant_details) ? data.merchant.merchant_details[0] : data.merchant?.merchant_details
      if (data.merchant) data.merchant.full_name = details?.store_name || data.merchant.full_name || 'Toko'
      activeOrder.value = data
      calculateRoutesForOrders([data]) 
    } else {
      activeOrder.value = null
    }
  } catch (error) { if (error.code !== 'PGRST116') console.error('Error:', error) }
}

const fetchAvailableOrdersLogic = async () => {
  if (activeOrder.value) return;

  const { data, error } = await supabase.from('orders')
    .select('*, merchant:merchant_id(id, full_name, merchant_details(store_name, latitude, longitude)), customer:customer_id(id, full_name)')
    .is('driver_id', null).in('status', ['pending', 'diproses', 'siap_diambil']).order('created_at', { ascending: false })
  
  if (error) throw error
  
  availableOrders.value = (data || []).map(order => {
    const details = Array.isArray(order.merchant?.merchant_details) ? order.merchant.merchant_details[0] : order.merchant?.merchant_details
    if (order.merchant) order.merchant.full_name = details?.store_name || order.merchant.full_name || 'Toko'
    return order
  })
  await calculateRoutesForOrders(availableOrders.value)
}

const syncRadar = async () => {
  isLoading.value = true

  try {
    await fetchAppSettings()
    await fetchDriverCredit()
    await fetchActiveOrderLogic()
    if (activeOrder.value) {
      toast.show('Selesaikan orderan aktif terlebih dahulu.', 'warning')
      orderanSubTab.value = 'aktif'
    } else {
      await fetchAvailableOrdersLogic()
      if (availableOrders.value.length > 0) toast.show(`${availableOrders.value.length} pesanan ditemukan!`, 'success')
    }
  } catch (e) { toast.show('Gagal memindai radar: ' + e.message, 'error') } 
  finally { isLoading.value = false }
}

const syncActiveOrder = async () => { 
  isLoading.value = true; 
  await fetchAppSettings()
  await fetchDriverCredit()
  await fetchActiveOrderLogic(); 
  isLoading.value = false 
}


// ----- SISTEM MODAL UNIVERSAL -----

const confirmAmbilOrder = (orderId, currentStatus) => {
  if (activeOrder.value) {
    toast.show('Selesaikan orderan aktifmu terlebih dahulu!', 'warning')
    return
  }
  const order = availableOrders.value.find(item => item.id === orderId)
  if (order && !hasEnoughCredit(order)) {
    toast.show(`AK tidak mencukupi. Dibutuhkan ${getRequiredCredit(order)} AK untuk mengambil pesanan ini.`, 'warning')
    return
  }
  modal.value = {
    isOpen: true,
    actionType: 'ambil',
    orderId: orderId,
    orderStatus: currentStatus,
    title: 'Ambil Orderan?',
    message: 'Pastikan kamu bisa menyelesaikan orderan ini. AK akan dipotong saat pesanan ditandai terkirim.',
    confirmText: 'Ya, Ambil Order',
    btnColorClass: 'bg-blue-600 hover:bg-blue-700',
    iconBgClass: 'bg-blue-100 text-blue-600'
  }
}

const confirmMulaiAntar = (orderId) => {
  modal.value = {
    isOpen: true,
    actionType: 'antar',
    orderId: orderId,
    title: 'Mulai Antar?',
    message: 'Pastikan pesanan sudah diambil dari toko dan siap diantar ke tujuan pelanggan.',
    confirmText: 'Ya, Mulai Antar',
    btnColorClass: 'bg-yellow-500 hover:bg-yellow-600',
    iconBgClass: 'bg-yellow-100 text-yellow-600'
  }
}

const confirmSelesai = (orderId) => {
  modal.value = {
    isOpen: true,
    actionType: 'selesai',
    orderId: orderId,
    title: 'Apakah Pesanan Telah Terkirim?',
    message: '',
    confirmText: 'Ya, Terkirim',
    btnColorClass: 'bg-green-600 hover:bg-green-700',
    iconBgClass: 'bg-green-100 text-green-600'
  }
}

const closeModal = () => {
  modal.value.isOpen = false
  setTimeout(() => {
    modal.value.orderId = null
    modal.value.actionType = null
    modal.value.orderStatus = null
  }, 300) // Reset setelah animasi selesai
}

const executeModalAction = async () => {
  if (!modal.value.orderId) return
  isProcessing.value = true
  
  try {
    if (modal.value.actionType === 'ambil') {
      const { data, error } = await supabase.rpc('accept_driver_order_with_credit', {
        p_order_id: modal.value.orderId
      })
        
      if (error || !data?.ok) {
        toast.show(error?.message || 'Maaf, pesanan sudah tidak tersedia atau AK tidak mencukupi.', 'error')
      } else {
        toast.show('Pesanan berhasil diamankan!', 'success')
        await fetchDriverCredit()
        expandedOrderId.value = null 
        orderanSubTab.value = 'aktif'
        availableOrders.value = []
        await syncActiveOrder()
      }
    }
    else if (modal.value.actionType === 'antar') {
      const { error } = await supabase.from('orders').update({ status: 'diantar' }).eq('id', modal.value.orderId)
      if (error) throw error
      toast.show('Status diperbarui: Makanan sedang diantar!', 'success')
      await syncActiveOrder()
    } 
    else if (modal.value.actionType === 'selesai') {
      const { data, error } = await supabase.rpc('complete_driver_order_with_credit', {
        p_order_id: modal.value.orderId
      })
      if (error || !data?.ok) throw error || new Error('Gagal memotong Antur Kredit.')
      await fetchDriverCredit()
      toast.show('Kerja bagus! Pesanan telah terkirim.', 'success')
      activeOrder.value = null
      orderanSubTab.value = 'bursa' 
      await syncRadar() // Otomatis kembali memindai radar
    }
  } catch (e) {
    toast.show(e?.message || 'Gagal memproses pesanan ke pangkalan data.', 'error')
  } finally {
    isProcessing.value = false
    closeModal()
  }
}

// Fungsi aman membuka WhatsApp
const chatWA = (phone) => {
  if (!phone) {
    toast.show('Nomor WA tidak tersedia pada data ini.', 'warning')
    return
  }
  let formattedPhone = phone.toString().replace(/\D/g, '')
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.substring(1)
  }
  window.open(`https://wa.me/${formattedPhone}`, '_blank')
}

onMounted(async () => {
  isLoading.value = true

  await fetchAppSettings()
  await fetchDriverCredit()
  await fetchActiveOrderLogic()

  if (activeOrder.value) {
    orderanSubTab.value = 'aktif'
  } else {
    orderanSubTab.value = 'bursa'
    await fetchAvailableOrdersLogic()
  }
  
  isLoading.value = false
  setupOrdersRealtime()
  if (!isNativeDriverApp()) setupForegroundFcmMessages()
  refreshGrantedNotificationToken()
})

onUnmounted(() => {
  if (ordersRealtimeChannel) {
    supabase.removeChannel(ordersRealtimeChannel)
    ordersRealtimeChannel = null
  }
  if (unsubscribeForegroundMessages) {
    unsubscribeForegroundMessages()
    unsubscribeForegroundMessages = null
  }
})
</script>
