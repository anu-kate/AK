<template>
  <div class="animate-fade-in space-y-4">
    <h2 class="font-bold text-xl text-gray-800 flex items-center gap-2">
      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
      Performa & Pendapatan
    </h2>
    
    <div class="flex border-b border-gray-300 bg-white rounded-xl p-1 shadow-sm transition-colors">
      <button @click="performaSubTab = 'ringkasan'" :class="performaSubTab === 'ringkasan' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200">Ringkasan</button>
      <button @click="performaSubTab = 'riwayat'" :class="performaSubTab === 'riwayat' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200">Riwayat</button>
    </div>

    <div v-show="performaSubTab === 'ringkasan'" class="space-y-4 pt-2 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-gray-300 shadow-sm text-center">
          <p class="text-gray-500 text-xs font-bold uppercase">Hari Ini</p>
          <h3 class="text-2xl font-black text-green-600 mt-2">Rp {{ formatRupiah(performanceStats.todayEarnings) }}</h3>
          <p class="text-[10px] text-gray-400 mt-1">{{ performanceStats.todayCount }} Pesanan</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-gray-300 shadow-sm text-center">
          <p class="text-gray-500 text-xs font-bold uppercase">Kemarin</p>
          <h3 class="text-2xl font-black text-gray-700 mt-2">Rp {{ formatRupiah(performanceStats.yesterdayEarnings) }}</h3>
          <p class="text-[10px] text-gray-400 mt-1">{{ performanceStats.yesterdayCount }} Pesanan</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-gray-300 shadow-sm text-center">
          <p class="text-gray-500 text-xs font-bold uppercase">Minggu Ini</p>
          <h3 class="text-2xl font-black text-blue-600 mt-2">Rp {{ formatRupiah(performanceStats.weekEarnings) }}</h3>
          <p class="text-[10px] text-gray-400 mt-1">{{ performanceStats.weekCount }} Total</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm text-center">
        <div v-if="driverRating.totalReviews > 0">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full text-2xl font-black mb-3 border-4 border-yellow-100 relative">
            {{ driverRating.average }}
            <svg class="w-4 h-4 absolute bottom-0 right-0 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          </div>
          <h4 class="font-bold text-base text-gray-900">Rating Kamu</h4>
          <p class="text-gray-500 text-sm mt-1">Dari {{ driverRating.totalReviews }} ulasan.</p>
        </div>
        <div v-else>
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-50 text-gray-400 rounded-full text-2xl font-black mb-3">-</div>
          <h4 class="font-bold text-base text-gray-900">Belum Ada Rating</h4>
        </div>
      </div>
    </div>

    <div v-show="performaSubTab === 'riwayat'" class="animate-fade-in">
      <div v-if="completedOrders.length === 0" class="bg-white p-8 rounded-3xl border border-gray-300 shadow-sm text-center">
        <div class="w-12 h-12 mx-auto text-gray-300 mb-2">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
        <p class="text-gray-500 text-sm font-medium">Belum ada riwayat orderan.</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="order in recentCompletedOrders" :key="order.id" class="bg-white p-4 rounded-2xl border border-gray-300 shadow-sm flex justify-between items-center gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span :class="order.status === 'terkirim' ? 'text-orange-700 bg-orange-100' : 'text-green-700 bg-green-100'" class="text-[10px] font-bold px-2 py-0.5 rounded">{{ order.status === 'terkirim' ? 'TERKIRIM' : 'SELESAI' }}</span>
              <span class="text-[10px] text-gray-400">{{ formatDate(getCompletionDate(order)) }}</span>
            </div>
            <p class="font-mono text-[11px] font-black text-gray-500 mb-1">#{{ getOrderCode(order) }}</p>
            <p class="font-bold text-sm text-gray-800">{{ order.merchant?.full_name || 'Toko' }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black uppercase tracking-wide text-gray-400">Pendapatan</p>
            <span class="block text-sm font-black text-blue-600">Rp {{ formatRupiah(order.delivery_fee || order.total_price) }}</span>
            <p class="text-[10px] font-black uppercase tracking-wide text-gray-400 mt-2">Total Tagihan User</p>
            <span class="block text-sm font-black text-gray-800">Rp {{ formatRupiah(order.total_price) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const performaSubTab = ref('ringkasan') 
const completedOrders = ref([])
const performanceStats = ref({ todayEarnings: 0, todayCount: 0, yesterdayEarnings: 0, yesterdayCount: 0, weekEarnings: 0, weekCount: 0 })
const driverRating = ref({ average: 0, totalReviews: 0 })
const recentCompletedOrders = computed(() => completedOrders.value.slice(0, 10))

const formatRupiah = (angka) => angka ? angka.toLocaleString('id-ID') : '0'
const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const getCompletionDate = (order) => order.delivered_at || order.updated_at || order.created_at
const getOrderCode = (order) => (order.order_number || order.order_no || order.id || '').toString().slice(0, 8).toUpperCase()

const fetchPerformanceData = async () => {
  try {
    const { data, error } = await supabase.from('orders')
      .select('*, merchant:merchant_id(id, full_name)')
      .eq('driver_id', authStore.user?.id)
      .in('status', ['terkirim', 'selesai'])
      .order('created_at', { ascending: false })
      
    if (error) throw error

    if (data) {
      const sortedOrders = [...data].sort((a, b) => new Date(getCompletionDate(b)) - new Date(getCompletionDate(a)))
      completedOrders.value = sortedOrders
      const now = new Date()
      const today = now.toDateString()
      const yesterdayDate = new Date(now)
      yesterdayDate.setDate(now.getDate() - 1)
      const yesterday = yesterdayDate.toDateString()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - 6)
      weekStart.setHours(0, 0, 0, 0)

      const getFee = (order) => Number(order.delivery_fee || 0)
      const todayOrders = sortedOrders.filter(order => new Date(getCompletionDate(order)).toDateString() === today)
      const yesterdayOrders = sortedOrders.filter(order => new Date(getCompletionDate(order)).toDateString() === yesterday)
      const weekOrders = sortedOrders.filter(order => new Date(getCompletionDate(order)) >= weekStart)

      performanceStats.value = {
        todayEarnings: todayOrders.reduce((sum, order) => sum + getFee(order), 0),
        todayCount: todayOrders.length,
        yesterdayEarnings: yesterdayOrders.reduce((sum, order) => sum + getFee(order), 0),
        yesterdayCount: yesterdayOrders.length,
        weekEarnings: weekOrders.reduce((sum, order) => sum + getFee(order), 0),
        weekCount: weekOrders.length
      }

      const ratedOrders = sortedOrders.filter(order => Number(order.driver_rating) > 0)
      if (ratedOrders.length > 0) {
        const average = ratedOrders.reduce((sum, order) => sum + Number(order.driver_rating), 0) / ratedOrders.length
        driverRating.value = { average: average.toFixed(1), totalReviews: ratedOrders.length }
      }
    }
  } catch {}
}

onMounted(() => {
  fetchPerformanceData()
})
</script>
