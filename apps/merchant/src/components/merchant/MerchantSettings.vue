<template>
  <div class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-300 space-y-6 w-full">
    <div class="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-purple-500/30 relative overflow-hidden">
      <svg class="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 text-white opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
      <p class="text-xs font-bold text-purple-200 uppercase tracking-widest mb-1 relative z-10">Saldo Pendapatan Toko</p>
      <h2 class="text-3xl font-black mb-4 relative z-10">Rp {{ formatRupiah(storeProfile.balance || 0) }}</h2>
      <button @click="openWithdrawModal" class="bg-white text-purple-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-purple-50 transition relative z-10 flex items-center gap-2 w-max">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Tarik Saldo
      </button>
    </div>

    <div>
      <div class="flex justify-between items-end mb-3 border-b border-gray-300 pb-2">
        <h3 class="font-extrabold text-gray-900 text-sm">Profile Toko</h3>
        <button @click="openStoreEditModal" class="text-xs font-bold text-purple-600 hover:underline">Edit Profile & Lokasi</button>
      </div>
      <div class="space-y-3">
        <div><p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Nama Toko</p><p class="font-medium text-sm text-gray-900">{{ storeProfile.store_name || '-' }}</p></div>
        <div><p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Alamat Lengkap</p><p class="font-medium text-sm text-gray-900">{{ storeProfile.store_address || '-' }}</p></div>
        <div>
          <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Titik Koordinat (Map)</p>
          <p v-if="storeProfile.latitude" class="font-mono text-xs text-blue-600 font-bold mt-0.5">{{ storeProfile.latitude.toFixed(6) }}, {{ storeProfile.longitude.toFixed(6) }}</p>
          <p v-else class="text-xs text-red-500 font-bold italic">Belum diatur. Pembeli akan kesulitan mencari toko Anda.</p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-300 pt-5">
      <div class="flex justify-between items-center mb-2">
        <div>
          <h2 class="font-extrabold text-lg text-gray-900">Voucher Toko</h2>
          <p class="text-xs text-gray-500">Tarik pembeli dengan promo diskon.</p>
        </div>
      <button @click="openVoucherModal()" class="px-4 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shrink-0 text-xs shadow-md">Buat Promo</button>
    </div>

    <div class="space-y-3">
        <div v-if="vouchers.length === 0" class="p-10 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-medium">Belum ada promo aktif.</div>
        <div v-for="v in vouchers" :key="v.id" class="p-4 border border-orange-200 bg-orange-50/30 rounded-2xl shadow-sm flex items-center justify-between" :class="!v.is_active ? 'opacity-50 grayscale' : ''">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md border border-orange-200 border-dashed">{{ v.code }}</span>
              <span :class="v.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'" class="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">{{ v.is_active ? 'Aktif' : 'Mati' }}</span>
            </div>
            <p class="font-extrabold text-gray-900 text-sm mt-2">Diskon Rp {{ formatRupiah(v.discount_amount) }}</p>
            <p class="text-[10px] text-gray-500 font-medium">Min. Belanja: Rp {{ formatRupiah(v.min_purchase) }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <button @click="toggleVoucherStatus(v)" class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg text-[10px] hover:bg-gray-50">{{ v.is_active ? 'Matikan' : 'Nyalakan' }}</button>
            <button @click="deleteVoucher(v.id)" class="px-3 py-1.5 bg-red-50 text-red-600 font-bold rounded-lg text-[10px] hover:bg-red-100">Hapus</button>
          </div>
        </div>
    </div>
    </div>

    <!-- Logout Section -->
    <div class="border-t border-gray-200 pt-5">
      <button @click="handleLogout"
        class="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 border-red-100 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 active:scale-[0.98] transition-all">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Keluar dari Akun
      </button>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <!-- Voucher Modal -->
      <div v-if="isVoucherModalOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)] animate-slide-up">
          <div class="p-4 border-b flex justify-between items-center"><h2 class="font-extrabold text-lg">Buat Voucher</h2><button @click="isVoucherModalOpen = false" class="p-1 bg-gray-100 rounded-full text-gray-500">X</button></div>
          <div class="p-5 space-y-4">
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Kode Voucher</label><input v-model="voucherForm.code" type="text" placeholder="PROMO10K" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500 outline-none"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Nominal Diskon (Rp)</label><input v-model="voucherForm.discount_amount" type="number" placeholder="10000" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Minimal Belanja (Rp)</label><input v-model="voucherForm.min_purchase" type="number" placeholder="50000" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"></div>
          </div>
          <div class="p-4 border-t"><button @click="saveVoucher" :disabled="savingData" class="w-full py-3.5 bg-orange-500 text-white font-extrabold rounded-xl hover:bg-orange-600 shadow-md">{{ savingData ? 'Menyimpan...' : 'Simpan Voucher' }}</button></div>
        </div>
      </div>

      <!-- Store Profile Modal -->
      <div v-if="isStoreModalOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] pb-[env(safe-area-inset-bottom)] animate-slide-up" :style="{ transform: `translateY(${modalDragY}px)` }" :class="isDraggingModal ? 'transition-none' : 'transition-transform duration-300 ease-out'">
          <div class="w-full pt-4 pb-2 flex justify-center cursor-grab md:hidden touch-none" @touchstart="handleModalTouchStart" @touchmove="handleModalTouchMove" @touchend="handleModalTouchEnd($event, closeStoreEditModal)"><div class="w-12 h-1.5 bg-gray-200 rounded-full"></div></div>
          <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-white shrink-0 touch-none"><h2 class="font-extrabold text-lg text-gray-900">Profil & Lokasi Toko</h2><button @click="closeStoreEditModal" class="p-1 bg-gray-100 rounded-full text-gray-500">X</button></div>
          
          <div class="p-5 space-y-4 overflow-y-auto hide-scrollbar">
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Nama Toko</label><input v-model="storeForm.store_name" type="text" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold"></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Alamat Lengkap</label><textarea v-model="storeForm.store_address" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium"></textarea></div>
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Jam Operasional</label><input v-model="storeForm.operational_hours" type="text" placeholder="08:00 - 21:00" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium"></div>
            
            <div class="pt-2">
              <div class="flex justify-between items-center mb-2">
                <label class="block text-xs font-bold text-gray-700">Tentukan Titik Peta (Pin)</label>
                <button @click="getCurrentLocation" type="button" class="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Lacak Saya</button>
              </div>
              <div ref="mapContainer" class="w-full h-48 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 relative z-0"></div>
            </div>
          </div>
          <div class="p-4 border-t border-gray-300 bg-white flex shrink-0">
            <button @click="saveStoreProfile" :disabled="savingData" class="w-full py-3.5 bg-purple-600 text-white font-extrabold rounded-xl shadow-md">{{ savingData ? 'Menyimpan...' : 'Simpan Perubahan' }}</button>
          </div>
        </div>
      </div>

      <!-- Withdraw Modal -->
      <div v-if="isWithdrawModalOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)] animate-slide-up">
          <div class="p-5 text-center">
            <div class="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 class="font-extrabold text-lg text-gray-900">Tarik Saldo</h2>
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-300 mt-2 mb-4">
              <p class="text-[10px] font-bold text-gray-400 uppercase">Saldo Tersedia</p>
              <p class="font-black text-xl text-gray-900">Rp {{ formatRupiah(storeProfile.balance || 0) }}</p>
            </div>
            
            <div class="text-left">
              <label class="block text-xs font-bold text-gray-700 mb-1">Nominal Penarikan (Rp)</label>
              <input v-model="withdrawAmount" type="number" placeholder="Minimal Rp 50.000" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none mb-2">
              <p class="text-[9px] text-gray-500 italic">*Saldo akan dipotong setelah Admin memproses dan mentransfer dana ke rekening Anda.</p>
            </div>
          </div>
          
          <div class="p-4 border-t border-gray-300 bg-white flex flex-col gap-2 shrink-0">
            <button @click="submitWithdraw" :disabled="savingData" class="w-full py-3.5 bg-gray-900 text-white font-extrabold rounded-xl shadow-md text-sm">{{ savingData ? 'Memproses...' : 'Ajukan Penarikan' }}</button>
            
            <div class="flex gap-2 mt-2">
              <button @click="isWithdrawModalOpen = false" class="w-1/3 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs">Batal</button>
              <button @click="chatAdminWithdraw" class="w-2/3 py-3 bg-[#25D366] text-white font-bold rounded-xl shadow-md text-xs flex justify-center items-center gap-1.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.098.824z"/></svg> Ingatkan Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirm Delete Voucher Modal -->
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()

const props = defineProps({
  storeProfile: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['profile-updated'])

const authStore = useAuthStore()
const toast = useToastStore()
const savingData = ref(false)

const handleLogout = async () => {
  await authStore.signOut()
  toast.show('Berhasil keluar', 'success')
  router.push('/login')
}

// Modals State
const isStoreModalOpen = ref(false)
const isWithdrawModalOpen = ref(false)
const isVoucherModalOpen = ref(false)
const withdrawAmount = ref('')

const storeForm = ref({ store_name: '', store_address: '', operational_hours: '', latitude: null, longitude: null })
const voucherForm = ref({ code: '', discount_amount: '', min_purchase: '' })
const vouchers = ref([])

// Map State
const mapContainer = ref(null)
let map = null
let marker = null

const customIcon = L.divIcon({
  html: `<svg class="w-8 h-8 text-red-600 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  className: 'bg-transparent', iconSize: [32, 32], iconAnchor: [16, 32]
})

const initMap = () => {
  const lat = storeForm.value.latitude || -6.175110
  const lng = storeForm.value.longitude || 106.827153
  if (map) { map.remove() }
  map = L.map(mapContainer.value).setView([lat, lng], 16)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
  marker = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(map)
  marker.on('dragend', (e) => { const pos = e.target.getLatLng(); storeForm.value.latitude = pos.lat; storeForm.value.longitude = pos.lng })
  map.on('click', (e) => { marker.setLatLng(e.latlng); storeForm.value.latitude = e.latlng.lat; storeForm.value.longitude = e.latlng.lng })
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    toast.show("Mencari titik...", "info")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        storeForm.value.latitude = pos.coords.latitude; storeForm.value.longitude = pos.coords.longitude
        if (map && marker) { map.flyTo([pos.coords.latitude, pos.coords.longitude], 17); marker.setLatLng([pos.coords.latitude, pos.coords.longitude]) }
        toast.show("Lokasi didapatkan!", "success")
      },
      (err) => { toast.show("Gagal mengambil GPS.", "error") }, { enableHighAccuracy: true, timeout: 10000 }
    )
  }
}

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

const fetchVouchers = async () => {
  const { data } = await supabase.from('store_vouchers').select('*').eq('merchant_id', authStore.user.id).order('created_at', { ascending: false })
  vouchers.value = data || []
}

onMounted(() => { if (authStore.user) { fetchVouchers() } })

const openStoreEditModal = async () => {
  modalDragY.value = 0
  storeForm.value = { store_name: props.storeProfile.store_name || '', store_address: props.storeProfile.store_address || '', operational_hours: props.storeProfile.operational_hours || '', latitude: props.storeProfile.latitude || null, longitude: props.storeProfile.longitude || null }
  isStoreModalOpen.value = true; await nextTick(); initMap(); setTimeout(() => { if (map) map.invalidateSize() }, 300)
}
const closeStoreEditModal = () => { isStoreModalOpen.value = false }

const saveStoreProfile = async () => {
  savingData.value = true
  const { error } = await supabase.from('merchant_details').update(storeForm.value).eq('id', authStore.user.id)
  savingData.value = false
  if (!error) { 
    toast.show('Profil disimpan!', 'success'); 
    emit('profile-updated'); 
    closeStoreEditModal() 
  } else toast.show('Gagal simpan', 'error')
}

const openWithdrawModal = () => { withdrawAmount.value = ''; isWithdrawModalOpen.value = true }
const submitWithdraw = async () => {
  const amount = parseInt(withdrawAmount.value)
  if (!amount || amount < 50000) return toast.show('Minimal penarikan Rp 50.000', 'warning')
  if (amount > (props.storeProfile.balance || 0)) return toast.show('Saldo Anda tidak mencukupi!', 'error')
  
  savingData.value = true
  const { error } = await supabase.from('store_withdrawals').insert([{ merchant_id: authStore.user.id, amount: amount }])
  savingData.value = false
  
  if (!error) {
    toast.show('Permintaan penarikan berhasil dikirim!', 'success')
    isWithdrawModalOpen.value = false
  } else toast.show('Gagal mengajukan penarikan.', 'error')
}
const chatAdminWithdraw = () => {
  const text = encodeURIComponent(`Halo Admin Anturun, saya ingin konfirmasi penarikan saldo untuk toko *${props.storeProfile.store_name || 'saya'}*. Mohon segera diproses ya, terima kasih!`)
  window.open(`https://wa.me/6281234567890?text=${text}`, '_blank')
}

const openVoucherModal = () => { voucherForm.value = { code: '', discount_amount: '', min_purchase: '' }; isVoucherModalOpen.value = true }
const saveVoucher = async () => {
  if (!voucherForm.value.code || !voucherForm.value.discount_amount) return toast.show('Kode dan Nominal wajib diisi!', 'warning')
  savingData.value = true
  const payload = { merchant_id: authStore.user.id, code: voucherForm.value.code.toUpperCase(), discount_amount: parseInt(voucherForm.value.discount_amount), min_purchase: parseInt(voucherForm.value.min_purchase || 0), is_active: true }
  const { error } = await supabase.from('store_vouchers').insert([payload])
  savingData.value = false
  if (!error) { toast.show('Voucher dibuat!', 'success'); fetchVouchers(); isVoucherModalOpen.value = false } else toast.show('Gagal buat voucher', 'error')
}

const toggleVoucherStatus = async (v) => {
  const newStatus = !v.is_active
  const { error } = await supabase.from('store_vouchers').update({ is_active: newStatus }).eq('id', v.id)
  if (!error) { v.is_active = newStatus; toast.show('Status voucher diubah', 'info') }
}

const deleteVoucher = async (id) => {
  openConfirmDialog({
    title: 'Hapus Voucher?',
    message: 'Voucher yang dihapus tidak bisa digunakan lagi oleh pembeli.',
    confirmText: 'Hapus',
    confirmClass: 'bg-red-600 hover:bg-red-700',
    onConfirm: async () => {
      await supabase.from('store_vouchers').delete().eq('id', id)
      fetchVouchers()
    }
  })
}

// Touch Drag Modal Logic
const modalDragY = ref(0); const isDraggingModal = ref(false); let touchStartYModal = 0
const handleModalTouchStart = (e) => { touchStartYModal = e.touches[0].clientY; isDraggingModal.value = true; modalDragY.value = 0 }
const handleModalTouchMove = (e) => { if (!isDraggingModal.value) return; const diffY = e.touches[0].clientY - touchStartYModal; if (diffY > 0) { modalDragY.value = diffY; if (e.cancelable) e.preventDefault() } }
const handleModalTouchEnd = (e, closeFunction) => {
  if (!isDraggingModal.value) return; isDraggingModal.value = false;
  if (modalDragY.value > 120) { modalDragY.value = window.innerHeight; setTimeout(() => { closeFunction(); setTimeout(() => { modalDragY.value = 0 }, 50) }, 250) } else { modalDragY.value = 0 }
}

// Modal Konfirmasi
const confirmDialog = ref({
  isOpen: false, title: '', message: '', confirmText: 'Lanjutkan', confirmClass: 'bg-purple-600 hover:bg-purple-700', onConfirm: null
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
</script>

<style scoped>
.touch-none { touch-action: none; }
.transition-none { transition-property: none !important; }
.animate-fade-in { animation: fadeIn 0.3s forwards; } 
.animate-slide-up { animation: slideUp 0.3s backwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
</style>
