<template>
  <div class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-300 space-y-4 w-full">
    <div class="flex justify-between items-center mb-2">
      <input v-model="searchProduct" type="text" placeholder="Cari menu..." class="w-full mr-2 px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none text-sm">
      <button @click="openProductModal()" class="px-4 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shrink-0 text-xs shadow-md">Tambah</button>
    </div>

    <div class="space-y-3 pr-1">
      <div v-for="product in filteredProducts" :key="product.id" class="p-3 border border-gray-300 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3" :class="!product.is_available ? 'opacity-60 grayscale bg-gray-50' : ''">
        <div class="flex items-center gap-3 w-full">
          <div class="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0"><img :src="product.image_url || defaultMenuImage" :alt="product.name" class="w-full h-full object-cover" /></div>
          <div class="flex-1 min-w-0">
            <h3 class="font-extrabold text-gray-900 text-sm truncate">{{ product.name }}</h3>
            <div class="flex flex-col mt-0.5">
              <div v-if="product.discount_price > 0" class="flex items-center gap-1.5">
                  <span class="font-black text-red-500 text-xs">Rp {{ formatRupiah(product.discount_price) }}</span>
                  <span class="font-medium text-gray-400 text-[10px] line-through">Rp {{ formatRupiah(product.price) }}</span>
              </div>
              <div v-else>
                  <span class="font-black text-purple-600 text-xs">Rp {{ formatRupiah(product.price) }}</span>
              </div>
            </div>
            <span :class="product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase">{{ product.is_available ? 'Tersedia' : 'Habis' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-0 pt-2 sm:pt-0 border-gray-300">
            <button @click="toggleProductStatus(product)" class="px-3 py-2 rounded-xl text-xs font-bold" :class="product.is_available ? 'text-gray-500 hover:bg-gray-100' : 'text-purple-600 bg-purple-50'">{{ product.is_available ? 'Set Habis' : 'Set Ada' }}</button>
            <button @click="openProductModal(product)" class="p-2 bg-gray-50 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl">Edit</button>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <Teleport to="body">
      <div v-if="isProductModalOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] pb-[env(safe-area-inset-bottom)] animate-slide-up" :style="{ transform: `translateY(${modalDragY}px)` }" :class="isDraggingModal ? 'transition-none' : 'transition-transform duration-300 ease-out'">
          <div class="w-full pt-4 pb-2 flex justify-center cursor-grab md:hidden touch-none" @touchstart="handleModalTouchStart" @touchmove="handleModalTouchMove" @touchend="handleModalTouchEnd($event, closeProductModal)"><div class="w-12 h-1.5 bg-gray-200 rounded-full"></div></div>
          <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-white shrink-0 touch-none"><h2 class="font-extrabold text-lg">{{ productForm.id ? 'Edit Menu' : 'Tambah Menu' }}</h2><button @click="closeProductModal" class="p-1 bg-gray-100 rounded-full text-gray-500">X</button></div>
          
          <div class="p-5 space-y-4 overflow-y-auto hide-scrollbar">
            <label class="flex flex-col w-full h-44 border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-2xl cursor-pointer hover:bg-purple-50 relative overflow-hidden group">
                <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div v-if="!imagePreview" class="flex flex-col items-center justify-center h-full text-purple-400">
                    <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <p class="text-xs font-bold">{{ compressionMsg || 'Upload Foto Menu' }}</p>
                </div>
                <div v-if="imagePreview && compressionMsg.includes('⏳')" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 text-xs font-bold text-purple-600 animate-pulse">{{ compressionMsg }}</div>
                <input type="file" class="hidden" accept="image/*" @change="onFileSelected" />
            </label>

            <div><label class="block text-xs font-bold text-gray-700 mb-1">Nama Menu</label><input v-model="productForm.name" type="text" placeholder="Misal: Nasi Goreng Spesial" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none"></div>
            
            <div class="grid grid-cols-2 gap-3">
              <div><label class="block text-xs font-bold text-gray-700 mb-1">Harga Normal (Rp)</label><input v-model="productForm.price" type="number" placeholder="15000" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none"></div>
              <div><label class="block text-[10px] font-bold text-red-500 mb-1">Harga Diskon (Opsional)</label><input v-model="productForm.discount_price" type="number" placeholder="Kosongkan jika tdk ada" class="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-bold text-red-600 focus:ring-2 focus:ring-red-500 outline-none placeholder-red-300"></div>
            </div>
            
            <div><label class="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat</label><textarea v-model="productForm.description" rows="2" class="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none"></textarea></div>
            <div class="pt-2 flex items-center gap-2"><input type="checkbox" id="isActiveProd" v-model="productForm.is_available" class="w-5 h-5 text-purple-600 rounded"><label for="isActiveProd" class="text-sm font-bold">Tersedia (Bisa dibeli)</label></div>
          </div>
          <div class="p-4 border-t border-gray-300 bg-white flex gap-3 shrink-0">
            <button v-if="productForm.id" @click="deleteProduct(productForm.id)" class="py-3.5 px-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100">Hapus</button>
            <button @click="saveProduct" :disabled="savingData" class="flex-1 py-3.5 bg-purple-600 text-white font-extrabold rounded-xl hover:bg-purple-700 shadow-md disabled:opacity-50 text-sm">{{ savingData ? 'Menyimpan...' : 'Simpan Menu' }}</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Modal for Delete Product -->
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
import defaultMenuImage from '../../assets/default-menu.svg'

const authStore = useAuthStore()
const toast = useToastStore()

const products = ref([])
const searchProduct = ref('')
const savingData = ref(false)

const selectedFile = ref(null)
const imagePreview = ref('')
const compressionMsg = ref('')
const isProductModalOpen = ref(false)
const productForm = ref({ id: null, name: '', price: '', discount_price: '', description: '', image_url: '', is_available: true })

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

const fetchProducts = async () => {
  const { data } = await supabase.from('products').select('*').eq('merchant_id', authStore.user.id).order('created_at', { ascending: false })
  products.value = data || []
}

onMounted(() => { if (authStore.user) { fetchProducts() } })

const filteredProducts = computed(() => {
  if (!searchProduct.value) return products.value
  return products.value.filter(p => p.name.toLowerCase().includes(searchProduct.value.toLowerCase()))
})

const openProductModal = (product = null) => {
  modalDragY.value = 0; selectedFile.value = null; compressionMsg.value = ''
  if (product) { productForm.value = { ...product, discount_price: product.discount_price || '' }; imagePreview.value = product.image_url } 
  else { productForm.value = { id: null, name: '', price: '', discount_price: '', description: '', image_url: '', is_available: true }; imagePreview.value = '' }
  isProductModalOpen.value = true
}
const closeProductModal = () => { isProductModalOpen.value = false }

const onFileSelected = async (e) => {
  const file = e.target.files[0]; if (!file) return; imagePreview.value = URL.createObjectURL(file)
  if (file.size > 500 * 1024) { compressionMsg.value = '⏳ Mengompres...'; selectedFile.value = await compressImage(file); compressionMsg.value = '✅ Siap' } 
  else { selectedFile.value = file; compressionMsg.value = '✅ OK' }
}

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image(); img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas'); const MAX_WIDTH = 800; let width = img.width; let height = img.height
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH }
        canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.7)
      }
    }
  })
}

const getFunctionErrorMessage = async (error, fallback) => {
  const response = error?.context
  if (!response) return error?.message || fallback

  try {
    const body = await response.clone().json()
    return body.error || body.message || fallback
  } catch {
    try {
      const body = await response.text()
      return body || fallback
    } catch {
      return fallback
    }
  }
}

const uploadToImageKit = async () => {
  if (!selectedFile.value) return productForm.value.image_url

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session?.access_token) {
    throw new Error('Sesi login tidak ditemukan. Silakan login ulang.')
  }

  const { data: authData, error: authError } = await supabase.functions.invoke('imagekit-auth', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionData.session.access_token}`,
    },
  })
  if (authError) {
    const message = await getFunctionErrorMessage(authError, 'Gagal membuat otorisasi upload gambar')
    throw new Error(message)
  }
  if (!authData?.uploadUrl || !authData?.publicKey || !authData?.signature || !authData?.token || !authData?.expire) {
    throw new Error('Respons otorisasi upload gambar tidak lengkap')
  }

  const fd = new FormData()
  fd.append('file', selectedFile.value)
  fd.append('fileName', `menu_${Date.now()}.jpg`)
  fd.append('folder', authData.folder)
  fd.append('useUniqueFileName', 'true')
  fd.append('publicKey', authData.publicKey)
  fd.append('signature', authData.signature)
  fd.append('expire', String(authData.expire))
  fd.append('token', authData.token)

  const res = await fetch(authData.uploadUrl, { method: 'POST', body: fd })
  if (!res.ok) {
    let message = 'Gagal upload gambar'
    try {
      const body = await res.clone().json()
      message = body.message || body.error?.message || body.error || message
    } catch {
      try {
        message = await res.text()
      } catch {}
    }
    throw new Error(message)
  }

  const data = await res.json()
  return data.url
}

const saveProduct = async () => {
  if (!productForm.value.name || !productForm.value.price) return toast.show('Nama dan harga wajib diisi!', 'warning')
  savingData.value = true
  try {
    const finalUrl = await uploadToImageKit()
    const discPrice = parseInt(productForm.value.discount_price) || 0
    const payload = { merchant_id: authStore.user.id, name: productForm.value.name, price: parseInt(productForm.value.price), discount_price: discPrice > 0 ? discPrice : null, description: productForm.value.description, image_url: finalUrl, is_available: productForm.value.is_available }
    let error;
    if (productForm.value.id) { const { error: e } = await supabase.from('products').update(payload).eq('id', productForm.value.id); error = e } 
    else { const { error: e } = await supabase.from('products').insert([payload]); error = e }
    if (error) throw error; toast.show('Menu disimpan!', 'success'); fetchProducts(); closeProductModal()
  } catch (e) { toast.show(e.message, 'error') } finally { savingData.value = false }
}

const deleteProduct = async (id) => {
  openConfirmDialog({
    title: 'Hapus Menu?',
    message: 'Menu yang dihapus tidak akan tampil lagi di katalog toko.',
    confirmText: 'Hapus',
    confirmClass: 'bg-red-600 hover:bg-red-700',
    onConfirm: async () => {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  })
}

const toggleProductStatus = async (p) => { const n = !p.is_available; const { error } = await supabase.from('products').update({ is_available: n }).eq('id', p.id); if (!error) p.is_available = n }
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
