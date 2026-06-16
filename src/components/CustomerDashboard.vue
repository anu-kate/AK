<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900 pb-24">
    <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      <div class="flex items-center gap-4 mb-2">
        <button @click="router.push('/')" class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition font-bold text-gray-500">←</button>
        <h1 class="text-2xl font-extrabold">Dasbor Saya</h1>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-xl font-bold">{{ authStore.profile?.full_name }}</h2>
            <p class="text-gray-500 font-mono text-sm mt-1">{{ authStore.profile?.phone_number }}</p>
          </div>
          <button @click="handleLogout" class="px-5 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition text-sm">Keluar</button>
        </div>
        
        <div class="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button @click="applyRole('merchant')" class="p-4 bg-purple-50 text-purple-700 rounded-2xl font-bold hover:bg-purple-100 transition flex items-center justify-between group">
            <span>Daftar Mitra Toko 🏪</span>
            <span class="text-xl transform group-hover:translate-x-1 transition">→</span>
          </button>
          <button @click="applyRole('driver')" class="p-4 bg-green-50 text-green-700 rounded-2xl font-bold hover:bg-green-100 transition flex items-center justify-between group">
            <span>Daftar Kurir 🛵</span>
            <span class="text-xl transform group-hover:translate-x-1 transition">→</span>
          </button>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
         <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 class="text-lg font-bold">Riwayat Pesanan</h2>
              <p class="text-sm text-gray-500">Tekan muat pesanan untuk melihat pembaruan.</p>
            </div>
            <button @click="fetchMyOrders" :disabled="isLoading" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="isLoading" class="animate-spin">↻</span>
              <span v-else>🔄</span>
              {{ hasFetched ? 'Perbarui Data' : 'Muat Pesanan' }}
            </button>
         </div>

         <div v-if="myOrders.length === 0 && !hasFetched" class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p class="text-gray-500 text-sm font-medium">Data belum diambil dari server.</p>
         </div>
         
         <div v-else-if="myOrders.length === 0 && hasFetched" class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p class="text-gray-500 text-sm font-medium">Belum ada riwayat pesanan.</p>
         </div>

         <div v-else class="space-y-4">
            <div v-for="order in myOrders" :key="order.id" class="p-4 border border-gray-100 rounded-2xl hover:border-blue-200 transition">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                  {{ new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' }) }}
                </span>
                <span :class="{
                  'bg-yellow-100 text-yellow-700': order.status === 'pending',
                  'bg-blue-100 text-blue-700': order.status === 'diproses' || order.status === 'diantar',
                  'bg-green-100 text-green-700': order.status === 'selesai'
                }" class="text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {{ order.status }}
                </span>
              </div>
              <div class="font-bold text-gray-800">Total: Rp {{ order.total_price.toLocaleString('id-ID') }}</div>
              <div class="text-sm text-gray-500 mt-1">
                Terdiri dari {{ order.items.length }} macam pesanan.
              </div>
            </div>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import { supabase } from '../lib/supabase'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const myOrders = ref([])
const isLoading = ref(false)
const hasFetched = ref(false)

// Fungsi murni dipanggil saat klik, tidak ada onMounted
const fetchMyOrders = async () => {
  isLoading.value = true
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', authStore.user?.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    myOrders.value = data || []
    hasFetched.value = true
    
    // Opsional: Beri umpan balik bahwa data berhasil disegarkan
    toast.show('Data pesanan berhasil diperbarui', 'success')
  } catch (error) {
    toast.show('Gagal memuat pesanan: ' + error.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const applyRole = async (roleType) => {
  // Validasi limit kurir secara dinamis
  if (roleType === 'driver') {
    const { data: settings } = await supabase.from('app_settings').select('*').single()
    if (!settings.is_driver_reg_open) return toast.show('Pendaftaran kurir sedang ditutup.', 'error')
    
    const { count } = await supabase.from('driver_details').select('*', { count: 'exact', head: true })
    if (count >= settings.driver_reg_limit) return toast.show('Kuota pendaftaran penuh.', 'error')
  }
  
  const table = roleType === 'merchant' ? 'merchant_details' : 'driver_details'
  const roleName = roleType === 'merchant' ? 'Mitra Toko' : 'Kurir'
  
  if (!confirm(`Ajukan diri sebagai ${roleName}?`)) return
  
  try {
    const { error } = await supabase.from(table).insert([{ id: authStore.user.id, status: 'pending' }])
    if (error) throw error
    
    toast.show('Pengajuan dikirim! Menunggu admin.', 'success')
    await authStore.fetchProfile()
    
    // Lempar pengguna ke halaman pending setelah berhasil mendaftar role baru
    router.push('/pending')
  } catch (e) { 
    toast.show('Gagal mengajukan: ' + e.message, 'error') 
  }
}

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/login')
}
</script>