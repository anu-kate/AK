<template>
  <div class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 overflow-hidden w-full">
    <div class="flex justify-between items-center mb-2">
      <h2 class="font-extrabold text-lg text-gray-900 hidden md:block">Data Pesanan</h2>
      <button @click="fetchOrders" :disabled="loadingOrders" class="w-full md:w-auto px-4 py-3 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 transition text-sm flex items-center justify-center gap-2">
        <svg class="w-4 h-4" :class="{'animate-spin': loadingOrders}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> 
        {{ loadingOrders ? 'Sinkronisasi...' : 'Refresh Pesanan' }}
      </button>
    </div>

    <div v-if="!isOrdersLoaded" class="p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50">
      <h3 class="font-bold text-gray-900 mb-1">Dasbor Ditangguhkan</h3>
      <p class="text-xs text-gray-500">Klik refresh untuk memuat data.</p>
    </div>

    <div v-else>
      <div class="bg-gray-100 p-1.5 rounded-2xl flex overflow-x-auto hide-scrollbar mb-4">
        <button @click="activeSubTab = 'menunggu'" :class="activeSubTab === 'menunggu' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'" class="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition">Menunggu <span v-if="pendingOrders.length" class="ml-1 px-1.5 py-0.5 rounded-full bg-yellow-500 text-white text-[9px]">{{ pendingOrders.length }}</span></button>
        <button @click="activeSubTab = 'aktif'" :class="activeSubTab === 'aktif' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'" class="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition">Aktif <span v-if="activeOrders.length" class="ml-1 px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[9px]">{{ activeOrders.length }}</span></button>
        <button @click="activeSubTab = 'selesai'" :class="activeSubTab === 'selesai' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'" class="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition">Selesai <span v-if="completedOrders.length" class="ml-1 px-1.5 py-0.5 rounded-full bg-green-500 text-white text-[9px]">{{ completedOrders.length }}</span></button>
      </div>

      <div class="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
        Total data: <strong>{{ orders.length }}</strong>
        <span v-if="statusSummary"> | Status: {{ statusSummary }}</span>
      </div>

      <div v-if="activeSubTab === 'menunggu'" class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        <div v-if="pendingOrders.length === 0" class="p-10 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-3xl text-sm font-medium">Tidak ada pesanan.</div>
        <div v-for="order in pendingOrders" :key="order.id" class="p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
          <div class="flex justify-between items-start">
            <div>
              <span class="font-mono text-xs font-black bg-gray-100 px-2 py-0.5 rounded-md">#{{ getOrderCode(order) }}</span>
              <p class="text-xs mt-2"><span class="font-bold">Pembeli:</span> {{ getShortId(order.customer_id) }}</p>
            </div>
            <p class="font-black text-blue-600 text-lg">Rp {{ formatRupiah(order.total_price) }}</p>
          </div>
          <div class="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Menu Pesanan</p>
            <div v-for="(item, index) in getOrderItems(order)" :key="item.id || index" class="flex justify-between gap-3 text-xs">
              <span class="font-bold text-gray-700">{{ item.quantity || 1 }}x {{ item.name || 'Menu' }}</span>
              <span class="font-mono text-gray-500 shrink-0">Rp {{ formatRupiah((item.price || 0) * (item.quantity || 1)) }}</span>
            </div>
            <p v-if="getOrderItems(order).length === 0" class="text-xs text-gray-400">Detail menu tidak tersedia.</p>
          </div>
          <div class="flex gap-2 mt-4">
            <button @click="updateOrderStatus(order.id, 'dibatalkan')" class="py-2 px-4 bg-white text-red-600 border border-gray-200 font-bold rounded-lg text-xs w-full">Tolak</button>
            <button @click="updateOrderStatus(order.id, 'diproses')" class="py-2 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-sm text-xs w-full">Proses</button>
          </div>
        </div>
      </div>

      <div v-if="activeSubTab === 'aktif'" class="space-y-3 max-h-[60vh] overflow-y-auto">
        <div v-if="activeOrders.length === 0" class="p-10 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-3xl text-sm font-medium">Tidak ada pesanan aktif.</div>
        <div v-for="order in activeOrders" :key="order.id" class="p-4 border border-gray-100 rounded-2xl shadow-sm">
          <div class="flex justify-between items-start gap-3">
            <div>
              <p class="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded-md inline-block">#{{ getOrderCode(order) }}</p>
              <p class="text-xs mt-2 text-gray-500"><span class="font-bold">Status:</span> {{ formatStatus(order.status) }}</p>
            </div>
            <p class="font-black text-blue-600 text-lg">Rp {{ formatRupiah(order.total_price) }}</p>
          </div>
          <div class="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
            <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Menu Pesanan</p>
            <div v-for="(item, index) in getOrderItems(order)" :key="item.id || index" class="flex justify-between gap-3 text-xs">
              <span class="font-bold text-gray-700">{{ item.quantity || 1 }}x {{ item.name || 'Menu' }}</span>
              <span class="font-mono text-gray-500 shrink-0">Rp {{ formatRupiah((item.price || 0) * (item.quantity || 1)) }}</span>
            </div>
            <p v-if="getOrderItems(order).length === 0" class="text-xs text-gray-400">Detail menu tidak tersedia.</p>
          </div>
          <div class="mt-4 border-t pt-3 flex justify-end">
            <button @click="updateOrderStatus(order.id, 'selesai')" class="text-[11px] font-bold text-emerald-600 bg-gray-50 px-4 py-2 rounded-xl border border-emerald-100">Tandai Selesai</button>
          </div>
        </div>
      </div>
      
      <div v-if="activeSubTab === 'selesai'" class="space-y-3 max-h-[60vh] overflow-y-auto">
         <div v-if="completedOrders.length === 0" class="p-10 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-3xl text-sm font-medium">Belum ada riwayat pesanan.</div>
         <div v-for="order in completedOrders" :key="order.id" class="p-4 border border-gray-100 rounded-2xl shadow-sm opacity-80">
            <div class="flex justify-between items-start gap-3">
              <div>
                <span class="font-mono text-xs font-bold text-gray-500">#{{ getOrderCode(order) }}</span>
                <p class="text-xs mt-2 text-gray-500"><span class="font-bold">Status:</span> {{ formatStatus(order.status) }}</p>
              </div>
              <p class="font-black text-gray-700 text-sm">Rp {{ formatRupiah(order.total_price) }}</p>
            </div>
            <div class="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
              <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Menu Pesanan</p>
              <div v-for="(item, index) in getOrderItems(order)" :key="item.id || index" class="flex justify-between gap-3 text-xs">
                <span class="font-bold text-gray-700">{{ item.quantity || 1 }}x {{ item.name || 'Menu' }}</span>
                <span class="font-mono text-gray-500 shrink-0">Rp {{ formatRupiah((item.price || 0) * (item.quantity || 1)) }}</span>
              </div>
              <p v-if="getOrderItems(order).length === 0" class="text-xs text-gray-400">Detail menu tidak tersedia.</p>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useToastStore } from '../../stores/toast'

const emit = defineEmits(['update-badge'])
const toast = useToastStore()

const activeSubTab = ref('menunggu')
const orders = ref([])
const loadingOrders = ref(false)
const isOrdersLoaded = ref(false)

const normalizeStatus = (status) => (status || '').toLowerCase().trim().replace(/\s+/g, '_')
const pendingStatuses = ['pending', 'menunggu', 'baru', 'new', '']
const completedStatuses = ['selesai', 'dibatalkan', 'batal', 'terkirim', 'delivered', 'completed', 'complete', 'done', 'finished', 'finish', 'cancelled', 'canceled']

const pendingOrders = computed(() => orders.value.filter(o => pendingStatuses.includes(normalizeStatus(o.status)) && !o.driver_id))
const activeOrders = computed(() => orders.value.filter(o => {
  const status = normalizeStatus(o.status)
  return !completedStatuses.includes(status) && !pendingOrders.value.some(order => order.id === o.id)
}))
const completedOrders = computed(() => orders.value.filter(o => completedStatuses.includes(normalizeStatus(o.status))))
const statusSummary = computed(() => {
  const counts = orders.value.reduce((summary, order) => {
    const status = normalizeStatus(order.status) || 'kosong'
    summary[status] = (summary[status] || 0) + 1
    return summary
  }, {})

  return Object.entries(counts).map(([status, count]) => `${status}:${count}`).join(', ')
})

watch(() => pendingOrders.value.length, (newVal) => { emit('update-badge', newVal) })

onMounted(() => { fetchOrders() })

const getOrderCode = (order) => String(order.id || '').split('-')[0].toUpperCase()
const getShortId = (id) => String(id || '-').substring(0, 6)
const formatRupiah = (amount) => Number(amount || 0).toLocaleString('id-ID')
const formatStatus = (status) => status ? String(status).replace(/_/g, ' ').toUpperCase() : '-'
const getOrderItems = (order) => {
  if (Array.isArray(order.items)) return order.items
  if (typeof order.items === 'string') {
    try {
      const parsed = JSON.parse(order.items)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const fetchOrders = async () => {
  loadingOrders.value = true; isOrdersLoaded.value = true
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(1000)
  if (error) toast.show('Gagal memuat pesanan: ' + error.message, 'error')
  if (data) orders.value = data
  loadingOrders.value = false
}

const updateOrderStatus = async (orderId, newStatus) => {
  const isApproving = newStatus === 'diproses'
  const actionText = newStatus === 'selesai' ? 'MENYELESAIKAN' : isApproving ? 'MEMPROSES' : 'MEMBATALKAN'
  const successText = newStatus === 'selesai' ? 'Pesanan selesai!' : isApproving ? 'Pesanan diproses!' : 'Pesanan dibatalkan.'
  const toastType = newStatus === 'dibatalkan' ? 'warning' : 'success'

  if (!confirm(`Yakin ingin ${actionText} pesanan?`)) return
  const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
  if (error) return toast.show('Gagal memperbarui pesanan: ' + error.message, 'error')
  toast.show(successText, toastType)
  fetchOrders()
}
</script>
