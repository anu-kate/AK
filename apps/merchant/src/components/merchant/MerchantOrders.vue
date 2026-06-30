<template>
  <div class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-300 space-y-4 w-full">
    <div class="flex justify-between items-center mb-2">
      <h2 class="font-extrabold text-lg text-gray-900 hidden md:block">Daftar Pesanan</h2>
      <button @click="fetchOrders" :disabled="loadingOrders" class="w-full md:w-auto px-4 py-3 bg-gray-50 text-purple-600 font-bold rounded-2xl hover:bg-purple-100 transition text-sm flex items-center justify-center gap-2">
        <span v-if="loadingOrders" class="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></span> 
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> 
        Refresh
      </button>
    </div>

    <div class="bg-gray-100 p-1.5 rounded-2xl flex overflow-x-auto hide-scrollbar mb-4 border border-gray-300" @touchstart.stop @touchend.stop>
      <button @click="activeSubTabOrder = 'baru'" :class="activeSubTabOrder === 'baru' ? 'bg-white text-purple-600 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-700'" class="flex-1 shrink-0 whitespace-nowrap py-2.5 px-3 rounded-xl font-bold text-xs transition">Baru <span v-if="newOrders.length > 0" class="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-0.5">{{ newOrders.length }}</span></button>
      <button @click="activeSubTabOrder = 'proses'" :class="activeSubTabOrder === 'proses' ? 'bg-white text-purple-600 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-700'" class="flex-1 shrink-0 whitespace-nowrap py-2.5 px-3 rounded-xl font-bold text-xs transition">Dimasak <span v-if="processingOrders.length > 0" class="bg-yellow-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-0.5">{{ processingOrders.length }}</span></button>
      <button @click="activeSubTabOrder = 'selesai'" :class="activeSubTabOrder === 'selesai' ? 'bg-white text-purple-600 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-700'" class="flex-1 shrink-0 whitespace-nowrap py-2.5 px-3 rounded-xl font-bold text-xs transition">Riwayat</button>
    </div>

    <div v-if="activeSubTabOrder === 'baru'" class="space-y-3 pr-1">
      <div v-if="newOrders.length === 0" class="p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-3xl text-sm font-medium">Belum ada pesanan masuk.</div>
      <div v-for="order in newOrders" :key="order.id" class="p-4 border border-gray-300 bg-gray-50 rounded-2xl shadow-sm flex flex-col gap-3">
        <div class="flex justify-between items-start">
          <div><span class="font-mono text-xs font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">#{{ order.id.slice(0,8) }}</span><p class="font-bold text-sm text-gray-900 mt-1">{{ order.profiles?.full_name || 'Pelanggan' }}</p></div>
          <div class="text-right"><p class="font-black text-purple-600 text-lg leading-none">Rp {{ formatRupiah(order.total_price) }}</p></div>
        </div>
        <div class="bg-white p-3 rounded-xl border border-gray-300 text-xs text-gray-700 font-medium">
          <ul class="space-y-1.5"><li v-for="item in order.items" :key="item.id" class="flex justify-between items-center"><span><b class="text-purple-600 mr-1">{{ item.quantity }}x</b> {{ item.name }}</span><span class="text-gray-500">Rp {{ formatRupiah(item.price * item.quantity) }}</span></li></ul>
        </div>
        <div class="flex items-center gap-2 grid grid-cols-2 mt-1">
          <button @click="updateOrderStatus(order.id, 'dibatalkan')" class="py-3 bg-white text-red-600 border border-gray-300 font-bold rounded-xl hover:bg-red-50 text-xs">Tolak</button>
          <button @click="updateOrderStatus(order.id, 'diproses')" class="py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md text-xs">Terima & Masak</button>
        </div>
      </div>
    </div>

    <div v-if="activeSubTabOrder === 'proses'" class="space-y-3 pr-1">
      <div v-if="processingOrders.length === 0" class="p-10 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-3xl text-sm font-medium">Tidak ada pesanan diproses.</div>
      <div v-for="order in processingOrders" :key="order.id" class="p-4 border border-blue-200 bg-blue-50/50 rounded-2xl shadow-sm flex flex-col gap-3">
          <div class="flex justify-between items-start mb-1">
          <div><span class="font-mono text-xs font-black text-blue-800 bg-blue-200 px-2 py-0.5 rounded-md">#{{ order.id.slice(0,8) }}</span><p class="font-bold text-sm text-gray-900 mt-1">{{ order.profiles?.full_name || 'Pelanggan' }}</p></div>
          <div class="text-right"><p class="font-black text-blue-600 text-lg leading-none">Rp {{ formatRupiah(order.total_price) }}</p></div>
        </div>
        <div v-if="order.profiles_driver" class="bg-white p-3 border border-blue-100 rounded-xl flex items-center gap-3"><span class="text-xl">🛵</span><div><p class="text-[10px] font-bold text-blue-400 uppercase">Kurir</p><p class="text-sm font-bold text-blue-900">{{ order.profiles_driver.full_name }}</p></div></div>
        <div class="bg-white p-3 rounded-xl border border-gray-300 text-xs text-gray-700 font-medium"><ul class="space-y-1"><li v-for="item in order.items" :key="item.id"><b>{{ item.quantity }}x</b> {{ item.name }}</li></ul></div>
        <button v-if="order.status === 'diproses'" @click="updateOrderStatus(order.id, 'siap_diambil')" class="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 shadow-md text-xs flex justify-center gap-2 mt-1">Tandai Siap Diambil</button>
        <div v-else class="w-full py-3 bg-green-50 text-green-700 border border-green-100 font-bold rounded-xl text-xs text-center mt-1">Pesanan siap diambil kurir</div>
      </div>
    </div>

    <div v-if="activeSubTabOrder === 'selesai'" class="space-y-3 pr-1">
      <div v-for="order in recentHistoryOrders" :key="order.id" class="p-4 border border-gray-300 rounded-2xl bg-white shadow-sm opacity-80 flex justify-between items-center">
          <div><span class="font-mono text-xs font-bold text-gray-500">#{{ order.id.slice(0,8) }}</span><p class="font-bold text-sm text-gray-900 mt-1">{{ order.profiles?.full_name || 'Pelanggan' }}</p></div>
          <div class="text-right"><span :class="order.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'" class="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase">{{ order.status }}</span><p class="font-black text-gray-700 text-sm mt-1">Rp {{ formatRupiah(order.total_price) }}</p></div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="confirmDialog.isOpen" class="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
        <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-300 animate-slide-up">
          <div class="w-14 h-14 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h3a2.25 2.25 0 012.25 2.25V9m-10.5 0h13.5m-13.5 0A2.25 2.25 0 003 11.25v7.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-7.5A2.25 2.25 0 0018.75 9"></path></svg>
          </div>
          <h3 class="text-xl font-black text-center text-gray-900 mb-2">{{ confirmDialog.title }}</h3>
          <p class="text-sm text-center text-gray-500 mb-6 leading-relaxed">{{ confirmDialog.message }}</p>
          <div class="flex gap-3">
            <button @click="closeConfirmDialog" class="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Batal</button>
            <button @click="executeConfirmDialog" :class="confirmDialog.confirmClass" class="flex-1 py-3 rounded-xl font-bold text-white transition shadow-sm">{{ confirmDialog.confirmText }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'

const emit = defineEmits(['update-orders-count'])

const authStore = useAuthStore()
const toast = useToastStore()

const orders = ref([])
const activeSubTabOrder = ref('baru')
const loadingOrders = ref(false)

// Modal Konfirmasi
const confirmDialog = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Lanjutkan',
  confirmClass: 'bg-purple-600 hover:bg-purple-700',
  onConfirm: null
})

const openConfirmDialog = ({ title, message, confirmText = 'Lanjutkan', confirmClass = 'bg-purple-600 hover:bg-purple-700', onConfirm }) => {
  confirmDialog.value = { isOpen: true, title, message, confirmText, confirmClass, onConfirm }
}

const closeConfirmDialog = () => { confirmDialog.value.isOpen = false }

const executeConfirmDialog = async () => {
  const action = confirmDialog.value.onConfirm
  closeConfirmDialog()
  if (typeof action === 'function') await action()
}

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

const fetchOrders = async () => {
  loadingOrders.value = true
  
  const { data, error } = await supabase
    .from('orders')
    .select('*, profiles:customer_id(full_name, phone_number), profiles_driver:driver_id(full_name, phone_number)')
    .eq('merchant_id', authStore.user?.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Gagal menarik data relasi, error:", error.message)
    toast.show("Gagal menarik daftar pesanan", "error")
  } else if (data) {
    orders.value = data.map(order => {
      let parsedItems = order.items;
      if (typeof parsedItems === 'string') {
        try { parsedItems = JSON.parse(parsedItems); } 
        catch (e) { parsedItems = []; }
      }
      return { ...order, items: parsedItems }
    })
    emit('update-orders-count', newOrders.value.length)
  }
  
  loadingOrders.value = false
}

const updateOrderStatus = async (orderId, newStatus) => {
  const statusText = newStatus === 'diproses' ? 'menerima pesanan ini' : newStatus === 'dibatalkan' ? 'menolak pesanan ini' : newStatus === 'siap_diambil' ? 'menandai pesanan siap diambil kurir' : 'mengubah status pesanan ini'
  openConfirmDialog({
    title: newStatus === 'siap_diambil' ? 'Pesanan Siap Diambil?' : 'Ubah Status Pesanan?',
    message: `Anda yakin ingin ${statusText}?`,
    confirmText: newStatus === 'siap_diambil' ? 'Ya, Siap' : 'Lanjutkan',
    confirmClass: newStatus === 'dibatalkan' ? 'bg-red-600 hover:bg-red-700' : newStatus === 'siap_diambil' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700',
    onConfirm: async () => {
      const payload = { status: newStatus }
      const { error } = await supabase.from('orders').update(payload).eq('id', orderId)
      if (!error) {
        toast.show('Status diperbarui!', 'success')
        fetchOrders()
      } else {
        toast.show('Gagal memperbarui status pesanan.', 'error')
      }
    }
  })
}

const newOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
const processingOrders = computed(() => orders.value.filter(o => ['diproses', 'siap_diambil'].includes(o.status)))
const historyOrders = computed(() => orders.value.filter(o => ['selesai', 'dibatalkan'].includes(o.status)))
const recentHistoryOrders = computed(() => historyOrders.value.slice(0, 10))

onMounted(() => { if (authStore.user) { fetchOrders() } })

// Expose refresh function to parent if needed
defineExpose({
  fetchOrders,
  newOrdersCount: computed(() => newOrders.value.length)
})
</script>

<style scoped>
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.animate-fade-in { animation: fadeIn 0.3s forwards; } 
.animate-slide-up { animation: slideUp 0.3s backwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>
