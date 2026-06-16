<template>
  <div class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 overflow-hidden w-full">
    <div class="bg-gray-100 p-1.5 rounded-2xl flex overflow-x-auto hide-scrollbar mb-4" @touchstart.stop @touchend.stop>
      <button @click="activeSubTab = 'verifikasi'" :class="activeSubTab === 'verifikasi' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 shrink-0 whitespace-nowrap py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        Verifikasi <span v-if="totalPending > 0" class="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-1">{{ totalPending }}</span>
      </button>
      <button @click="activeSubTab = 'semua'" :class="activeSubTab === 'semua' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 shrink-0 whitespace-nowrap py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        Semua
      </button>
      <button @click="activeSubTab = 'saldo'" :class="activeSubTab === 'saldo' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 shrink-0 whitespace-nowrap py-2.5 px-4 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
        Antur Kredit
      </button>
    </div>

    <div v-if="activeSubTab !== 'verifikasi'" class="flex flex-col md:flex-row justify-between gap-3 mb-2 animate-fade-in">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input v-model="searchQuery" type="text" placeholder="Cari nama atau HP..." class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-sm">
      </div>
      <button @click="fetchAllUsers" class="px-4 py-3 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 transition shrink-0 text-sm flex justify-center items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Refresh
      </button>
    </div>

    <div v-if="activeSubTab === 'verifikasi'" class="animate-fade-in space-y-3 max-h-[60vh] overflow-y-auto pr-1 hide-scrollbar">
      <div class="flex justify-between items-center mb-2 px-2">
        <p class="text-xs text-gray-500 font-medium">Membutuhkan persetujuan.</p>
        <button @click="fetchPendingUsers" class="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Refresh
        </button>
      </div>
      <div v-if="allPendingVerifications.length === 0" class="p-10 text-center flex flex-col items-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-500">
        <p class="text-gray-500 text-sm font-medium">Tidak ada antrean verifikasi.</p>
      </div>
      <div v-for="user in allPendingVerifications" :key="user.id + user.type" class="p-4 md:p-5 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-200 transition">
        <div class="w-full">
          <div class="flex items-center gap-2 mb-1.5">
            <p class="font-extrabold text-base text-gray-900">{{ user.full_name }}</p>
            <span :class="user.colorClass" class="text-[9px] px-2.5 py-1 rounded-md font-bold uppercase border">{{ user.label }}</span>
          </div>
          <p class="text-xs text-gray-500 font-mono flex items-center gap-1">{{ user.phone_number }}</p>
        </div>
        <div class="flex gap-2 w-full md:w-auto shrink-0 grid grid-cols-2 md:flex">
          <button @click="handleVerification(user.type, user.id, 'rejected', user.full_name)" class="py-2.5 px-5 bg-gray-50 border border-gray-200 text-red-600 font-bold rounded-xl text-sm hover:bg-red-50">Tolak</button>
          <button @click="handleVerification(user.type, user.id, 'active', user.full_name)" class="py-2.5 px-5 bg-blue-600 text-white font-bold rounded-xl shadow-md text-sm hover:bg-blue-700">Setujui</button>
        </div>
      </div>
    </div>

    <div v-if="activeSubTab === 'semua'" class="animate-fade-in space-y-3 max-h-[60vh] overflow-y-auto pr-1 hide-scrollbar">
      <div v-if="filteredUsers.length === 0" class="p-12 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-3xl text-sm font-medium">Tidak ditemukan.</div>
      <div v-for="user in filteredUsers" :key="user.id" class="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm flex items-center justify-between gap-4">
        <div class="flex items-center gap-4 overflow-hidden">
          <div class="w-12 h-12 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center text-white font-black shadow-md text-lg bg-blue-500">
            {{ user.full_name?.charAt(0).toUpperCase() }}
          </div>
          <div class="truncate space-y-1.5">
            <p class="font-extrabold text-gray-900 truncate leading-none text-sm">{{ user.full_name }}</p>
            <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span class="text-[10px] font-mono text-gray-500 mr-1">{{ user.phone_number }}</span>
              <span :class="getUserStatusClass(user.account_status)" class="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase border">App: {{ user.account_status }}</span>
            </div>
          </div>
        </div>
        <button @click="openEditModal(user)" class="p-2.5 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-100 rounded-xl transition shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </button>
      </div>
    </div>

    <div v-if="activeSubTab === 'saldo'" class="animate-fade-in space-y-3 max-h-[60vh] overflow-y-auto pr-1 hide-scrollbar">
      <div v-if="filteredDriverUsers.length === 0" class="p-12 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-3xl text-sm font-medium">Tidak ada data kurir.</div>
      <div v-for="user in filteredDriverUsers" :key="'ak-'+user.id" class="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-4 w-full md:w-1/3 shrink-0">
          <div class="w-12 h-12 shrink-0 bg-gray-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          </div>
          <div class="truncate">
            <p class="font-extrabold text-gray-900 truncate text-sm">{{ user.full_name }}</p>
            <p class="text-[10px] font-mono text-gray-500">{{ user.phone_number }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between w-full md:w-2/3 shrink-0 p-3 rounded-xl">  
          <div class="text-left flex flex-col gap-1.5 w-full">
            <div class="flex flex-col sm:flex-row gap-2 text-[11px] font-black">
              <span class="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                {{ user.antur_credit_balance || 0 }} AK
              </span>
            </div>
          </div>
          <div class="flex gap-2 ml-2 md:mr-4 shrink-0">
            <button @click="openSaldoModal(user)" class="px-3.5 py-2.5 bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 font-bold rounded-xl transition text-xs shadow-sm">
              Ubah AK
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] pb-[env(safe-area-inset-bottom)] animate-slide-up md:animate-scale-in"
           :style="{ transform: `translateY(${modalDragY}px)` }"
           :class="isDraggingModal ? 'transition-none' : 'transition-transform duration-300 ease-out'">
        
        <div class="w-full pt-4 pb-2 flex justify-center cursor-grab active:cursor-grabbing md:hidden touch-none"
             @touchstart="handleModalTouchStart"
             @touchmove="handleModalTouchMove"
             @touchend="handleModalTouchEnd($event, closeEditModal)">
          <div class="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>
        
        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <h2 class="font-extrabold text-lg text-gray-900">Edit Akses & Profil</h2>
          <button @click="closeEditModal" class="p-1 bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>
        
        <div class="p-5 space-y-5 overflow-y-auto hide-scrollbar">
          <div class="space-y-3">
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label><input v-model="editingUser.full_name" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Nomor HP</label><input v-model="editingUser.phone_number" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Status Aplikasi</label><select v-model="editingUser.account_status" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"><option value="active">🟢 Active</option><option value="pending">🟡 Pending</option><option value="rejected">🔴 Rejected</option><option value="banned">⚫ Banned</option></select></div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
          <button @click="closeEditModal" class="w-1/3 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 text-sm">Batal</button>
          <button @click="saveUserEdit" :disabled="savingEdit" class="w-2/3 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50 text-sm">
            {{ savingEdit ? 'Menyimpan...' : 'Simpan Semua' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isSaldoModalOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)] animate-slide-up md:animate-scale-in"
           :style="{ transform: `translateY(${modalDragY}px)` }"
           :class="isDraggingModal ? 'transition-none' : 'transition-transform duration-300 ease-out'">
        
        <div class="w-full pt-4 pb-2 flex justify-center cursor-grab active:cursor-grabbing md:hidden touch-none"
             @touchstart="handleModalTouchStart"
             @touchmove="handleModalTouchMove"
             @touchend="handleModalTouchEnd($event, closeSaldoModal)">
          <div class="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <h2 class="font-extrabold text-lg text-gray-900">Kelola Antur Kredit</h2>
          <button @click="closeSaldoModal" class="p-1 bg-gray-100 rounded-full text-gray-500 hover:text-gray-700"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>
        <div class="p-5 space-y-5 text-center">
          <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Antur Kredit Saat Ini</p>
            <p class="font-black text-gray-900 text-3xl">{{ currentSelectedBalance }} AK</p>
            <p class="text-[10px] text-gray-400 mt-1">Admin dapat menambahkan atau menarik AK kurir.</p>
          </div>
          <div class="bg-gray-100 p-1 rounded-xl flex gap-1 mt-2">
            <button @click="saldoForm.type = 'add'" :class="saldoForm.type === 'add' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'" class="flex-1 py-2.5 font-bold rounded-lg text-sm transition">Tambah AK</button>
            <button @click="saldoForm.type = 'deduct'" :class="saldoForm.type === 'deduct' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'" class="flex-1 py-2.5 font-bold rounded-lg text-sm transition">Tarik</button>
          </div>
          <div class="pt-1">
            <input v-model="saldoForm.amount" type="number" placeholder="Jumlah AK..." class="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-xl font-black text-center outline-none">
          </div>
        </div>
        <div class="p-4 border-t border-gray-100 bg-white flex gap-3 shrink-0">
          <button @click="saveSaldo" :disabled="savingSaldo" class="w-full py-4 bg-gray-900 text-white font-extrabold rounded-2xl hover:bg-black shadow-md disabled:opacity-50 text-sm">
            {{ savingSaldo ? 'Memproses...' : 'Proses Transaksi' }}
          </button>
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

const activeSubTab = ref('verifikasi')
const searchQuery = ref('')
const allUsers = ref([])
const pendingCustomers = ref([])
const pendingRoles = ref([])

// Swipe Modal State
const modalDragY = ref(0)
const isDraggingModal = ref(false)
const touchStartY = ref(0)

const isEditModalOpen = ref(false)
const editingUser = ref({})
const savingEdit = ref(false)

const isSaldoModalOpen = ref(false)
const savingSaldo = ref(false)
const saldoForm = ref({ id: null, user: null, amount: '', type: 'add' })

const allPendingVerifications = computed(() => {
  const customers = pendingCustomers.value.map(c => ({ id: c.id, full_name: c.full_name, phone_number: c.phone_number, type: 'customer', label: 'Pelanggan Baru', colorClass: 'bg-blue-50 text-blue-700' }))
  const merchants = pendingRoles.value.filter(r => r.apply_role === 'merchant').map(m => ({ id: m.user_id, full_name: m.full_name, phone_number: m.phone_number, type: 'merchant', label: 'Buka Toko', colorClass: 'bg-purple-50 text-purple-700' }))
  const drivers = pendingRoles.value.filter(r => r.apply_role === 'driver').map(d => ({ id: d.user_id, full_name: d.full_name, phone_number: d.phone_number, type: 'driver', label: 'Daftar Kurir', colorClass: 'bg-orange-50 text-orange-700' }))
  return [...customers, ...merchants, ...drivers]
})

const totalPending = computed(() => pendingCustomers.value.length + pendingRoles.value.length)
watch(totalPending, (newVal) => { emit('update-badge', newVal) })

const filteredUsers = computed(() => {
  if (!searchQuery.value) return allUsers.value
  const q = searchQuery.value.toLowerCase()
  return allUsers.value.filter(u => u.full_name?.toLowerCase().includes(q) || u.phone_number?.includes(q))
})

const filteredDriverUsers = computed(() => filteredUsers.value.filter(user => user.is_driver))

const currentSelectedBalance = computed(() => {
  if (!saldoForm.value.user) return 0
  return saldoForm.value.user.antur_credit_balance || 0
})

onMounted(() => {
  fetchPendingUsers()
  fetchAllUsers()
})

const fetchPendingUsers = async () => {
  const { data: cData } = await supabase.from('profiles').select('id, full_name, phone_number, account_status').eq('account_status', 'pending')
  pendingCustomers.value = cData || []
  const { data: mData } = await supabase.from('merchant_details').select('*, profiles(full_name, phone_number)').eq('status', 'pending')
  const { data: dData } = await supabase.from('driver_details').select('*, profiles(full_name, phone_number)').eq('status', 'pending')
  pendingRoles.value = [
    ...(mData || []).map(m => ({ apply_role: 'merchant', user_id: m.id || m.user_id, full_name: m.profiles?.full_name, phone_number: m.profiles?.phone_number })),
    ...(dData || []).map(d => ({ apply_role: 'driver', user_id: d.id || d.user_id, full_name: d.profiles?.full_name, phone_number: d.profiles?.phone_number }))
  ]
}

const fetchAllUsers = async () => {
  const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  const { data: drivers } = await supabase.from('driver_details').select('*')
  const driverMap = new Map()
  ;(drivers || []).forEach(driver => {
    const possibleProfileIds = [driver.user_id, driver.profile_id, driver.driver_id, driver.id].filter(Boolean)
    possibleProfileIds.forEach(id => driverMap.set(id, driver))
  })

  allUsers.value = (profiles || []).map(profile => {
    const driver = driverMap.get(profile.id)
    const isDriver = !!driver || profile.role === 'driver' || profile.driver_status === 'active' || profile.driver_status === 'pending'
    return {
      ...profile,
      is_driver: isDriver,
      driver_detail_id: driver?.id || null,
      driver_user_id: driver?.user_id || profile.id,
      antur_credit_balance: Number(driver?.antur_credit_balance || 0)
    }
  })
}

const handleVerification = async (type, userId, targetStatus, fullName) => {
  const isAccepting = targetStatus === 'active'
  if (!confirm(`Yakin ingin ${isAccepting ? 'MENERIMA' : 'MENOLAK'} ${fullName}?`)) return
  const table = type === 'customer' ? 'profiles' : type === 'merchant' ? 'merchant_details' : 'driver_details'
  const column = type === 'customer' ? 'account_status' : 'status'
  
  let { error } = await supabase.from(table).update({ [column]: targetStatus }).eq('id', userId)
  if (error && type !== 'customer') {
    const fallback = await supabase.from(table).update({ [column]: targetStatus }).eq('user_id', userId)
    error = fallback.error
  }
  if (error) return toast.show('Gagal memperbarui verifikasi: ' + error.message, 'error')
  
  toast.show(`${fullName} ${isAccepting ? 'disetujui' : 'ditolak'}!`, 'success')
  fetchPendingUsers(); fetchAllUsers();
}

const saveUserEdit = async () => {
  savingEdit.value = true
  const { error } = await supabase.from('profiles').update({ full_name: editingUser.value.full_name, phone_number: editingUser.value.phone_number, account_status: editingUser.value.account_status }).eq('id', editingUser.value.id)
  savingEdit.value = false
  if (error) return toast.show('Gagal memperbarui data: ' + error.message, 'error')
  toast.show('Data diperbarui!', 'success')
  closeEditModal(); fetchAllUsers(); fetchPendingUsers()
}

const saveSaldo = async () => {
  const nominal = parseInt(saldoForm.value.amount)
  if (!nominal || nominal <= 0) { toast.show('Nominal tidak valid!', 'warning'); return }
  const newBalance = saldoForm.value.type === 'add' ? currentSelectedBalance.value + nominal : currentSelectedBalance.value - nominal
  savingSaldo.value = true

  const result = await supabase
    .from('driver_details')
    .update({ antur_credit_balance: newBalance })
    .eq('id', saldoForm.value.user.driver_detail_id || saldoForm.value.id)
  let error = result.error

  if (error) {
    const fallback = await supabase
      .from('driver_details')
      .update({ antur_credit_balance: newBalance })
      .eq('id', saldoForm.value.user.driver_id || saldoForm.value.id)
    error = fallback.error
  }

  savingSaldo.value = false
  if (error) return toast.show('Gagal memperbarui Antur Kredit: ' + error.message, 'error')
  toast.show('Antur Kredit diperbarui!', 'success')
  closeSaldoModal(); fetchAllUsers()
}

const openEditModal = (user) => { modalDragY.value = 0; editingUser.value = { ...user }; isEditModalOpen.value = true }
const closeEditModal = () => { isEditModalOpen.value = false; editingUser.value = {} }
const openSaldoModal = (user) => { modalDragY.value = 0; saldoForm.value = { id: user.id, user: user, amount: '', type: 'add' }; isSaldoModalOpen.value = true }
const closeSaldoModal = () => { isSaldoModalOpen.value = false }

const getUserStatusClass = (status) => {
  const styles = { 'active': 'bg-green-50 text-green-700', 'pending': 'bg-yellow-50 text-yellow-700', 'rejected': 'bg-red-50 text-red-700', 'banned': 'bg-gray-800 text-white' }
  return styles[status] || 'bg-gray-50 text-gray-700'
}

// Swipe Modal logic
const handleModalTouchStart = (e) => { touchStartY.value = e.touches[0].clientY; isDraggingModal.value = true; modalDragY.value = 0 }
const handleModalTouchMove = (e) => { if (!isDraggingModal.value) return; const diffY = e.touches[0].clientY - touchStartY.value; if (diffY > 0) modalDragY.value = diffY }
const handleModalTouchEnd = (e, closeFunc) => {
  if (!isDraggingModal.value) return; isDraggingModal.value = false;
  if (modalDragY.value > 120) { modalDragY.value = window.innerHeight; setTimeout(() => { closeFunc(); setTimeout(() => { modalDragY.value = 0 }, 50) }, 250) } 
  else { modalDragY.value = 0 }
}
</script>

<style scoped>
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
</style>
