<template>
  <div class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 overflow-hidden w-full relative">
    
    <div class="bg-gray-100 p-1.5 rounded-2xl flex overflow-x-auto hide-scrollbar mb-4">
      <button @click="activeSubTab = 'tarif'" :class="activeSubTab === 'tarif' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition">Tarif & Ongkir</button>
      <button @click="activeSubTab = 'rekrutmen'" :class="activeSubTab === 'rekrutmen' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition">Kurir</button>
      <button @click="activeSubTab = 'voucher'" :class="activeSubTab === 'voucher' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition">Voucher</button>
      <button @click="activeSubTab = 'pembayaran'" :class="activeSubTab === 'pembayaran' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition">Pembayaran</button>
    </div>
    
    <div v-if="activeSubTab === 'tarif'" class="space-y-4 animate-fade-in w-full">
      
      <div class="bg-purple-50 p-4 md:p-5 rounded-2xl border border-purple-100">
        <h3 class="font-extrabold text-purple-900 mb-4 text-sm flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg> 
          Biaya Layanan Aplikasi
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nominal Biaya Layanan (Rp)</label>
            <input v-model="settings.service_fee" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none">
            <p class="text-[10px] text-gray-400 mt-1.5">*Biaya ekstra ini akan ditambahkan ke tagihan pengguna untuk setiap transaksi pesanan.</p>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Biaya Layanan Driver (Rp)</label>
            <input v-model="settings.driver_service_fee" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none">
            <p class="text-[10px] text-gray-400 mt-1.5">*Biaya ini dipotong dari Antur Kredit kurir saat pesanan ditandai terkirim.</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100">
        <h3 class="font-extrabold text-gray-900 mb-4 text-sm flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> 
          Ongkos Kirim Standar
        </h3>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Ongkir Dasar (Rp)</label>
              <input v-model="settings.delivery_base_fee" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Jarak Dasar (KM)</label>
              <input v-model="settings.delivery_base_distance_km" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Biaya Ekstra per KM Selanjutnya (Rp)</label>
            <input v-model="settings.delivery_extra_fee_per_km" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none">
          </div>
        </div>
      </div>

      <div class="bg-blue-50/50 p-4 md:p-5 rounded-2xl border border-blue-100">
        <h3 class="font-extrabold text-blue-900 mb-4 text-sm flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
          Sistem Jam Sibuk (Rush Hour)
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status Jam Sibuk</label>
            <select v-model="settings.is_rush_hour_enabled" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
              <option :value="true">🟢 AKTIF (Terapkan Biaya Ekstra)</option>
              <option :value="false">🔴 MATI (Harga Normal)</option>
            </select>
          </div>
          <div v-if="settings.is_rush_hour_enabled" class="grid grid-cols-2 gap-3 animate-fade-in">
            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Jam Mulai</label>
              <input v-model="settings.rush_hour_start" type="time" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Jam Berakhir</label>
              <input v-model="settings.rush_hour_end" type="time" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>
          <div v-if="settings.is_rush_hour_enabled" class="animate-fade-in">
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tambahan Biaya (Rp)</label>
            <input v-model="settings.rush_hour_extra_fee" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
        </div>
      </div>

      <div class="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100">
        <h3 class="font-extrabold text-gray-900 mb-4 text-sm flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> 
          Biaya Lintas Toko (Multi-Store)
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Biaya Layanan Dasar (Rp)</label>
            <input v-model="settings.cross_store_base_fee" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Ambang Jarak (KM)</label>
              <input v-model="settings.distance_threshold_km" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Ekstra/KM (Rp)</label>
              <input v-model="settings.cross_store_distance_fee" type="number" class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>
        </div>
      </div>

      <button @click="saveSettings" :disabled="saving" class="w-full px-4 py-3.5 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-700 shadow-md transition disabled:opacity-50 text-sm">
        {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan Tarif' }}
      </button>
    </div>

    <div v-if="activeSubTab === 'rekrutmen'" class="space-y-4 animate-fade-in w-full">
      <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center text-sm font-medium text-gray-500">Pengaturan Kurir</div>
    </div>

    <div v-if="activeSubTab === 'voucher'" class="space-y-4 animate-fade-in w-full">
      <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center text-sm font-medium text-gray-500">Kelola Voucher Promo</div>
    </div>

    <div v-if="activeSubTab === 'pembayaran'" class="space-y-4 animate-fade-in w-full">
      <div class="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100">
        <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <div>
            <h3 class="font-extrabold text-gray-900 text-sm flex items-center gap-2">💳 Metode Pembayaran</h3>
            <p class="text-[11px] text-gray-500 mt-1">Tambah, hapus, atau nonaktifkan pembayaran pelanggan.</p>
          </div>
          <button @click="openAddPaymentModal" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl shadow-sm transition">
            + Tambah
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                <th class="p-3 rounded-l-xl">Ikon & Nama</th>
                <th class="p-3">Kode ID</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-center rounded-r-xl w-24">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 font-medium text-gray-700">
              <tr v-for="method in paymentMethodsList" :key="method.id" class="hover:bg-gray-100/50 transition">
                <td class="p-3">
                  <div class="flex items-center gap-2.5">
                    <span class="text-lg">{{ method.icon || '💳' }}</span>
                    <div>
                      <p class="font-bold text-xs">{{ method.name }}</p>
                      <p class="text-[9px] text-gray-400 truncate max-w-[120px]">{{ method.description || '-' }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-3 font-mono text-[10px] text-gray-400">{{ method.id }}</td>
                <td class="p-3">
                  <span :class="method.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'" class="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {{ method.is_active ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="p-3">
                  <div class="flex items-center justify-center gap-1.5">
                    <button @click="togglePaymentStatus(method)" :title="method.is_active ? 'Matikan' : 'Aktifkan'" class="p-1.5 rounded-lg text-xs transition" :class="method.is_active ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-green-600 bg-green-50 hover:bg-green-100'">
                      {{ method.is_active ? '⏸' : '▶' }}
                    </button>
                    <button @click="deletePaymentMethod(method.id)" title="Hapus" class="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs transition">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="paymentMethodsList.length === 0">
                <td colspan="4" class="text-center py-6 text-gray-400 text-xs">Belum ada metode pembayaran.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <h3 class="text-sm font-black mb-4 text-gray-900 border-b border-gray-100 pb-3">Tambah Metode Pembayaran</h3>
        
        <div class="space-y-3.5 mb-6 text-sm">
          <div>
            <label class="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Kode ID (Tanpa Spasi)</label>
            <input type="text" v-model="newMethodForm.id" placeholder="Cth: OVO, TRANSFER_BCA" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-blue-500 text-xs" />
          </div>
          <div class="grid grid-cols-4 gap-3">
            <div class="col-span-1">
              <label class="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Emoji</label>
              <input type="text" v-model="newMethodForm.icon" placeholder="🏦" class="w-full p-3 text-center bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-blue-500 text-xs" />
            </div>
            <div class="col-span-3">
              <label class="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Nama Metode</label>
              <input type="text" v-model="newMethodForm.name" placeholder="Cth: Transfer Bank BCA" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-blue-500 text-xs" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Deskripsi Instruksi (Opsional)</label>
            <input type="text" v-model="newMethodForm.description" placeholder="Cth: Panduan pembayaran via BCA..." class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-blue-500 text-xs" />
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="showPaymentModal = false" class="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition text-xs">Batal</button>
          <button @click="saveNewPaymentMethod" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-xs shadow-sm">Simpan Metode</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase'
import { useToastStore } from '../../stores/toast'

const toast = useToastStore()
const activeSubTab = ref('tarif')
const saving = ref(false)

// Set nilai default sesuai yang ada di database
const settings = ref({ 
  service_fee: 1000, // <--- BIAYA LAYANAN BARU
  driver_service_fee: 1000,
  delivery_base_fee: 5000,
  delivery_base_distance_km: 3,
  delivery_extra_fee_per_km: 1000,
  
  cross_store_base_fee: 2000, 
  cross_store_distance_fee: 1000,
  distance_threshold_km: 1,

  is_rush_hour_enabled: false,
  rush_hour_start: '16:00',
  rush_hour_end: '19:00',
  rush_hour_extra_fee: 2000
})

// === STATE METODE PEMBAYARAN ===
const paymentMethodsList = ref([])
const showPaymentModal = ref(false)
const newMethodForm = ref({ id: '', name: '', description: '', icon: '' })

onMounted(() => { 
  fetchSettings() 
  fetchPaymentMethods()
})

// === FUNGSI TARIF & PENGATURAN ===
const fetchSettings = async () => {
  const { data } = await supabase.from('app_settings').select('*').single()
  if (data) settings.value = { ...settings.value, ...data } // Merge with defaults
}

const saveSettings = async () => {
  saving.value = true
  const { error } = await supabase.from('app_settings').update(settings.value).eq('id', 1)
  saving.value = false
  
  if (!error) {
    toast.show('Pengaturan diperbarui!', 'success')
  } else {
    toast.show('Gagal menyimpan pengaturan!', 'error')
    console.error(error)
  }
}

// === FUNGSI MANAJEMEN METODE PEMBAYARAN ===
const fetchPaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('created_at', { ascending: true })
  if (!error && data) paymentMethodsList.value = data
}

const openAddPaymentModal = () => {
  newMethodForm.value = { id: '', name: '', description: '', icon: '' }
  showPaymentModal.value = true
}

const saveNewPaymentMethod = async () => {
  const { id, name, description, icon } = newMethodForm.value
  if (!id || !name) return toast.show('Kode ID dan Nama wajib diisi!', 'error')
  
  const cleanId = id.toUpperCase().replace(/\s+/g, '_')

  try {
    const { error } = await supabase
      .from('payment_methods')
      .insert([{ id: cleanId, name, description, icon, is_active: true }])

    if (error) throw error
    
    toast.show('Metode pembayaran berhasil ditambahkan', 'success')
    showPaymentModal.value = false
    fetchPaymentMethods()
  } catch (e) {
    toast.show('Gagal menambah: ' + e.message, 'error')
  }
}

const togglePaymentStatus = async (method) => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_active: !method.is_active })
      .eq('id', method.id)

    if (error) throw error
    
    toast.show(`Metode pembayaran berhasil ${!method.is_active ? 'diaktifkan' : 'dinonaktifkan'}`, 'success')
    fetchPaymentMethods()
  } catch (e) {
    toast.show('Gagal mengubah status: ' + e.message, 'error')
  }
}

const deletePaymentMethod = async (methodId) => {
  if (!confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) return

  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', methodId)

    if (error) throw error
    
    toast.show('Metode pembayaran berhasil dihapus', 'success')
    fetchPaymentMethods()
  } catch (e) {
    toast.show('Gagal menghapus: ' + e.message, 'error')
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
</style>
