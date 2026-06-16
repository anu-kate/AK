<template>
  <div class="animate-fade-in space-y-6 max-w-2xl mx-auto pb-6">
    <div class="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex justify-between items-center">
      <div>
        <h2 class="text-xl font-black text-gray-900">{{ authStore.profile?.full_name || 'Pengguna' }}</h2>
        <p class="text-gray-500 font-mono text-sm mt-1">{{ authStore.profile?.phone_number || '-' }}</p>
      </div>
      <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wide">
        {{ authStore.profile?.role || 'Customer' }}
      </span>
    </div>

    <div class="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex gap-1">
      <button @click="activeSubTab = 'active-orders'" :class="activeSubTab === 'active-orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        Pesanan <span v-if="activeOrders.length > 0" class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">{{ activeOrders.length }}</span>
      </button>
      <button @click="activeSubTab = 'history-orders'" :class="activeSubTab === 'history-orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        Riwayat
      </button>
      <button @click="activeSubTab = 'profile'" :class="activeSubTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"></path></svg>
        Profile
      </button>
    </div>

    <div v-show="activeSubTab === 'active-orders'" class="space-y-4 animate-fade-in">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Sedang Berjalan</h3>
        <button @click="emit('refreshOrders')" :disabled="isOrdersLoading" class="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline disabled:opacity-50">
          <svg :class="{'animate-spin-counterclockwise': isOrdersLoading}" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Perbarui
        </button>
      </div>

      <div v-if="activeOrders.length > 0" class="space-y-3">
        <div v-for="order in activeOrders" :key="order.id" class="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden transition-all duration-300">
          <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="order.status === 'terkirim' ? 'bg-orange-500' : (order.status === 'diantar' ? 'bg-blue-500' : (order.driver_id ? 'bg-green-500' : 'bg-gray-400'))"></div>
          
          <div @click="toggleExpand(order.id)" class="cursor-pointer select-none">
            <div class="flex justify-between items-center mb-2.5 pl-1">
              <div class="flex flex-col gap-1">
                <span class="font-mono text-[11px] font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md w-fit">#{{ getOrderCode(order) }}</span>
                <span class="text-[10px] font-bold text-gray-500">
                  {{ new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' }) }}
                </span>
              </div>
              <span :class="{
                'bg-yellow-100 text-yellow-700': order.status === 'pending' && !order.driver_id,
                'bg-green-100 text-green-700': order.status === 'pending' && order.driver_id,
                'bg-emerald-100 text-emerald-700': order.status === 'siap_diambil',
                'bg-blue-100 text-blue-700': order.status === 'diantar',
                'bg-orange-100 text-orange-700': order.status === 'terkirim'
              }" class="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <svg v-if="order.driver_id" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {{ getOrderStatusLabel(order) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center pl-1">
              <div class="font-black text-sm sm:text-base text-gray-800 flex items-center gap-2 truncate pr-2">
                <svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V10l-2.5-4h-9L5 10v11M3 10h18M5 21h14M7 10v3a2 2 0 004 0v-3m4 0v3a2 2 0 004 0v-3"></path></svg>
                <span class="truncate">{{ order.display_merchant_name }}</span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="font-black text-blue-600 text-sm sm:text-base">Rp {{ formatRupiah(order.total_price) }}</span>
                <div class="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full">
                  <svg :class="{'rotate-180': expandedOrderId === order.id}" class="w-4 h-4 text-gray-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div v-show="expandedOrderId === order.id" class="mt-4 pt-4 border-t border-gray-100 animate-fade-in pl-1">
            <div class="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 text-xs border border-gray-100">
              <p class="font-bold text-[10px] text-gray-500 uppercase tracking-wider mb-2">Rincian Belanja:</p>
              <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center border-b border-gray-200/50 pb-2 last:border-0 last:pb-0">
                <div class="flex items-center gap-2">
                  <span class="text-blue-600 font-extrabold bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px]">x{{ item.quantity }}</span>
                  <span class="font-bold text-gray-700">{{ item.name }}</span>
                </div>
                <span class="font-mono font-bold text-gray-500">Rp {{ formatRupiah(item.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="space-y-1.5 mb-4 px-1 text-[11px] text-gray-500 font-medium">
              <div class="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>Rp {{ formatRupiah(order.delivery_fee || 0) }}</span>
              </div>
              <div v-if="order.service_fee > 0" class="flex justify-between">
                <span>Biaya Layanan Aplikasi</span>
                <span>Rp {{ formatRupiah(order.service_fee) }}</span>
              </div>
              <div v-if="order.cross_store_fee > 0" class="flex justify-between text-orange-600">
                <span>Biaya Lintas Toko</span>
                <span>Rp {{ formatRupiah(order.cross_store_fee) }}</span>
              </div>
              <div class="flex justify-between font-extrabold text-gray-800 text-xs pt-2 mt-2 border-t border-gray-100">
                <span>Total Tagihan Akhir</span>
                <span class="text-blue-600">Rp {{ formatRupiah(order.total_price) }}</span>
              </div>
            </div>
            
            <div v-if="order.driver" class="bg-blue-50/50 border border-blue-100 rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm shrink-0 border border-blue-50">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10c0 .55.45 1 1 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                </div>
                <div>
                  <p class="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Kurir Pengantar:</p>
                  <p class="font-black text-sm text-gray-800 leading-tight">{{ order.driver.full_name }}</p>
                  <p class="text-[10px] font-mono text-gray-500 mt-0.5">{{ order.driver.phone_number || '-' }}</p>
                </div>
              </div>
              <a 
                v-if="order.driver.phone_number" 
                :href="'https://wa.me/' + order.driver.phone_number.replace(/^0/, '62')" 
                target="_blank" 
                class="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold rounded-lg transition shadow-sm flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                Chat
              </a>
            </div>
            
            <div v-if="order.status === 'diantar'" class="w-full py-3 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-pulse">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Kurir sedang menuju ke lokasi Anda
            </div>

            <button 
              v-else-if="order.status === 'terkirim'"
              @click="openConfirmModal('confirm_received', order, 'Pesanan Sudah Diterima?', 'Pastikan Anda telah menerima pesanan dengan baik. Pesanan yang sudah dikonfirmasi tidak dapat dibatalkan.', 'Ya, Sudah', 'bg-green-600 hover:bg-green-700')"
              class="w-full py-3 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 bg-green-600 text-white hover:bg-green-700 shadow-md animate-pulse hover:animate-none"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Konfirmasi Pesanan Diterima
            </button>

            <button 
              v-else
              :disabled="order.status !== 'pending' || order.driver_id"
              @click="openConfirmModal('cancel_order', order.id, 'Batalkan Pesanan?', 'Apakah Anda yakin ingin membatalkan pesanan ini?', 'Batalkan', 'bg-red-600 hover:bg-red-700')" 
              :class="(order.status === 'pending' && !order.driver_id) ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed hidden'"
              class="w-full py-3 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              Batalkan Pesanan Ini
            </button>

          </div>
        </div>
      </div>
      <div v-else-if="isOrdersFetched" class="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-sm text-gray-500">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        Tidak ada pesanan yang sedang aktif.
      </div>
    </div>

    <div v-show="activeSubTab === 'history-orders'" class="space-y-4 animate-fade-in">
      <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Selesai & Lampau</h3>
      <div v-if="historyOrders.length > 0" class="space-y-3">
        <div v-for="order in recentHistoryOrders" :key="order.id" class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm opacity-90 hover:opacity-100 transition">
          <div class="flex justify-between items-start gap-3 mb-2">
            <div class="flex flex-col gap-1">
              <span class="font-mono text-[11px] font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md w-fit">#{{ getOrderCode(order) }}</span>
              <span class="text-[10px] font-bold text-gray-500">{{ new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' }) }}</span>
            </div>
            <span :class="{'bg-green-100 text-green-700': order.status === 'selesai', 'bg-red-100 text-red-700': order.status === 'dibatalkan'}" class="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <svg v-if="order.status === 'selesai'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              {{ order.status }}
            </span>
          </div>
          <p class="font-bold text-sm text-gray-800 mb-1 flex items-center gap-1.5 line-clamp-1">
            <svg class="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V10l-2.5-4h-9L5 10v11M3 10h18M5 21h14M7 10v3a2 2 0 004 0v-3m4 0v3a2 2 0 004 0v-3"></path></svg>
            {{ order.display_merchant_name }}
          </p>
          <div class="flex justify-between items-end mt-2 pt-2 border-t border-gray-100">
            <div class="font-bold text-gray-600 text-xs">Total: Rp {{ formatRupiah(order.total_price) }}</div>
            
            <div v-if="order.status === 'selesai'">
              <button 
                v-if="!order.merchant_rating && !order.driver_rating"
                @click="openRatingModal(order)"
                class="text-[10px] flex items-center gap-1 font-bold px-2 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-md hover:bg-yellow-100 transition shadow-sm"
              >
                Beri Penilaian
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </button>
              <div v-else class="flex gap-0.5 text-yellow-400 text-sm" title="Sudah dinilai">
                <svg v-for="i in 5" :key="i" class="w-3.5 h-3.5" :class="i <= (order.merchant_rating || order.driver_rating || 0) ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="isOrdersFetched" class="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-sm text-gray-500">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        Belum ada riwayat transaksi.
      </div>
    </div>

    <div v-show="activeSubTab === 'profile'" class="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
      <div class="p-6 border-b border-gray-200 space-y-2">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Akun Pribadi</h3>
        <button @click="openModal('password')" class="w-full flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition font-bold text-gray-700">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            Ubah Sandi
          </span> 
          <span class="text-gray-400">→</span>
        </button>
        <button @click="openModal('address')" class="w-full flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition font-bold text-gray-700">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Alamat Pengiriman
          </span> 
          <span class="text-gray-400">→</span>
        </button>
      </div>
      <div class="p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Kemitraan & Dasbor</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <button 
            @click="handleMerchantClick" 
            :class="merchantStatus === 'active' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'"
            class="p-4 rounded-2xl font-bold transition flex items-center justify-between group border border-transparent hover:border-purple-200 shadow-sm"
          >
            <div class="text-left flex items-center gap-2">
              <svg class="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V10l-2.5-4h-9L5 10v11M3 10h18M5 21h14M7 10v3a2 2 0 004 0v-3m4 0v3a2 2 0 004 0v-3"></path></svg>
              <div class="flex flex-col leading-tight">
                <span v-if="merchantStatus === 'active'">Masuk Dasbor Toko</span>
                <span v-else-if="merchantStatus === 'pending'">Toko Sedang Ditinjau</span>
                <span v-else>Buka Toko Mitra</span>
              </div>
            </div>
            <span class="transform group-hover:translate-x-1 transition">→</span>
          </button>

          <button 
            @click="handleDriverClick" 
            :class="driverStatus === 'active' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-50 text-green-700 hover:bg-green-100'"
            class="p-4 rounded-2xl font-bold transition flex items-center justify-between group border border-transparent hover:border-green-200 shadow-sm"
          >
            <div class="text-left flex items-center gap-2">
              <svg class="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10c0 .55.45 1 1 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
              <div class="flex flex-col leading-tight">
                <span v-if="driverStatus === 'active'">Masuk Dasbor Kurir</span>
                <span v-else-if="driverStatus === 'pending'">Kurir Sedang Ditinjau</span>
                <span v-else>Daftar Jadi Kurir</span>
              </div>
            </div>
            <span class="transform group-hover:translate-x-1 transition">→</span>
          </button>

        </div>
      </div>
      <div class="p-6 bg-red-50/50">
        <button @click="handleLogout" class="w-full py-3 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition text-sm flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Keluar dari Akun
        </button>
      </div>
    </div>

    <div v-if="confirmDialog.isOpen" class="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center animate-fade-in m-auto">
        <h3 class="text-lg font-black mb-2">{{ confirmDialog.title }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ confirmDialog.message }}</p>
        <div class="flex gap-3">
          <button @click="confirmDialog.isOpen = false" class="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Tidak</button>
          <button @click="executeConfirm" :class="confirmDialog.btnClass" class="flex-1 py-3 text-white font-bold rounded-xl transition">{{ confirmDialog.btnText }}</button>
        </div>
      </div>
    </div>

    <div v-if="ratingModal.isOpen" class="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in m-auto">
        <div class="flex justify-center mb-2">
          <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
        </div>
        <h3 class="text-lg font-black text-center text-gray-900 mb-1">Pesanan Selesai!</h3>
        <p class="text-xs text-center text-gray-500 mb-6">Bagaimana pengalaman Anda untuk pesanan ini?</p>

        <div class="space-y-5">
          <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
            <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pelayanan Toko / Menu</p>
            <div class="flex justify-center gap-1.5 text-3xl">
              <button v-for="i in 5" :key="'m'+i" @click="ratingModal.merchantRating = i" class="focus:outline-none transition-transform hover:scale-110">
                <svg class="w-8 h-8 inline-block" :class="i <= ratingModal.merchantRating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </button>
            </div>
          </div>

          <div v-if="ratingModal.order?.driver" class="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
            <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pelayanan Kurir ({{ ratingModal.order.driver.full_name }})</p>
            <div class="flex justify-center gap-1.5 text-3xl">
              <button v-for="i in 5" :key="'d'+i" @click="ratingModal.driverRating = i" class="focus:outline-none transition-transform hover:scale-110">
                <svg class="w-8 h-8 inline-block" :class="i <= ratingModal.driverRating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 mt-6">
          <button @click="submitRating" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md">Kirim Penilaian</button>
          <button @click="ratingModal.isOpen = false" class="w-full py-2.5 bg-white text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition text-sm">Lewati</button>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'password'" class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-fade-in m-auto">
        <h3 class="text-lg font-bold mb-4">Ubah Sandi</h3>
        <div class="space-y-4">
          <div><label class="text-xs font-bold text-gray-500">Sandi Lama</label><input v-model="passwordForm.oldPassword" type="password" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2" /></div>
          <div><label class="text-xs font-bold text-gray-500">Sandi Baru</label><input v-model="passwordForm.newPassword" type="password" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2" /></div>
          <div><label class="text-xs font-bold text-gray-500">Konfirmasi Sandi Baru</label><input v-model="passwordForm.confirmPassword" type="password" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2" /></div>
          <div class="flex gap-3 pt-2">
            <button @click="closeModal" class="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
            <button @click="savePassword" :disabled="isLoading" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50">Perbarui</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeModal === 'address'" class="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-lg max-h-[90vh] rounded-3xl flex flex-col shadow-2xl animate-fade-in overflow-hidden m-auto">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h3 class="text-lg font-bold">{{ showAddressForm ? (editingAddressId ? 'Edit Alamat' : 'Tambah Alamat Baru') : 'Daftar Alamat' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>
        
        <div class="p-6 overflow-y-auto grow">
          <div v-if="showAddressForm" class="space-y-4">
            <div><label class="text-xs font-bold text-gray-500">Nama Penerima</label><input v-model="addressForm.recipient_name" type="text" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2" /></div>
            <div><label class="text-xs font-bold text-gray-500">Telepon</label><input v-model="addressForm.recipient_phone" type="text" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2" /></div>
            <div><label class="text-xs font-bold text-gray-500">Detail Alamat</label><textarea v-model="addressForm.address_detail" rows="2" class="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none focus:ring-2"></textarea></div>
            
            <div class="flex items-center gap-2 mt-2">
              <input type="checkbox" id="is_primary" v-model="addressForm.is_primary" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
              <label for="is_primary" class="text-sm font-bold text-gray-700">Jadikan sebagai alamat utama</label>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1 mt-2">
                <label class="text-xs font-bold text-gray-500">Tentukan Titik Peta (Wajib)</label>
                <button type="button" @click="centerToUserLocation" class="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Ke Lokasi Saya
                </button>
              </div>
              <div id="mapContainer" class="w-full h-48 rounded-xl border-2 border-gray-200 z-0 relative"></div>
            </div>
            <div class="flex gap-3 pt-4">
              <button @click="showAddressForm = false" class="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
              <button @click="saveAddress" :disabled="!addressForm.latitude || isLoading" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50">Simpan</button>
            </div>
          </div>
          <div v-else class="space-y-4">
            <button @click="openAddressForm()" class="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition flex justify-center items-center gap-2">Tambah Alamat Baru</button>
            <div v-for="addr in myAddresses" :key="addr.id" :class="addr.is_primary ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'" class="p-4 border rounded-2xl relative group">
              <div class="flex justify-between items-start mb-1">
                <h4 class="font-bold text-gray-800 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {{ addr.recipient_name }}
                  <span v-if="addr.is_primary" class="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black ml-1 uppercase">Utama</span>
                </h4>
                <div class="flex gap-2">
                  <button @click="openAddressForm(addr)" class="text-blue-600 text-xs font-bold bg-blue-100 px-2.5 py-1 rounded-md hover:bg-blue-200 transition">Edit</button>
                  <button @click="openConfirmModal('delete_address', addr.id, 'Hapus Alamat?', 'Apakah Anda yakin ingin menghapus alamat ini dari daftar?', 'Hapus', 'bg-red-600 hover:bg-red-700')" class="text-red-600 text-xs font-bold bg-red-100 px-2.5 py-1 rounded-md hover:bg-red-200 transition">Hapus</button>
                </div>
              </div>
              <p class="text-xs font-mono text-gray-500 mb-2 ml-6">{{ addr.recipient_phone }}</p>
              <p class="text-sm font-medium text-gray-600 ml-6 mb-3">{{ addr.address_detail }}</p>
              
              <div v-if="!addr.is_primary" class="ml-6">
                <button @click="setPrimaryAddress(addr.id)" class="text-[10px] font-bold text-gray-600 border border-gray-300 px-2.5 py-1 rounded-lg hover:bg-white hover:text-blue-600 hover:border-blue-300 transition shadow-sm">Jadikan Alamat Utama</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { useToastStore } from '../../stores/toast'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const merchantStatus = ref(null) 
const driverStatus = ref(null)   

// STATE UNTUK EXPAND/MINIMIZE ORDER
const expandedOrderId = ref(null)
const toggleExpand = (orderId) => {
  expandedOrderId.value = expandedOrderId.value === orderId ? null : orderId
}

onMounted(async () => {
  await checkPartnershipStatuses()
})

// === LOGIKA AUTO-COMPLETE 30 MENIT ===
const checkAutoCompleteOrders = async (ordersList) => {
  if (!ordersList || ordersList.length === 0) return;
  
  const now = new Date().getTime();
  let needsRefresh = false;

  for (const order of ordersList) {
    if (order.status === 'terkirim' && order.delivered_at) {
      const deliveredTime = new Date(order.delivered_at).getTime();
      const diffMinutes = (now - deliveredTime) / (1000 * 60);
      
      // Jika pesanan sudah lewat dari 30 menit tanpa dikonfirmasi user
      if (diffMinutes > 30) {
        await supabase.from('orders').update({ status: 'selesai' }).eq('id', order.id);
        needsRefresh = true;
      }
    }
  }

  if (needsRefresh) emit('refreshOrders');
}

const props = defineProps(['myOrders', 'isOrdersLoading', 'isOrdersFetched'])
const emit = defineEmits(['refreshOrders'])

// WATCHER: Jalankan auto-complete setiap kali daftar pesanan masuk dari parent
watch(() => props.myOrders, (newOrders) => {
  checkAutoCompleteOrders(newOrders);
}, { immediate: true, deep: true });

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

const formatRupiah = (angka) => angka ? angka.toLocaleString('id-ID') : '0'
const getOrderCode = (order) => (order.order_number || order.order_no || order.id || '').toString().slice(0, 8).toUpperCase()
const getOrderStatusLabel = (order) => {
  if (order.status === 'terkirim') return 'PESANAN TIBA'
  if (order.status === 'diantar') return 'SEDANG DIANTAR KURIR'
  if (order.status === 'siap_diambil') return 'SIAP DIAMBIL'
  if (order.status === 'diproses') return 'DIPROSES TOKO'
  if (order.status === 'pending' && order.driver_id) return 'DIPROSES KURIR'
  return order.status
}

const activeSubTab = ref('active-orders')
const activeModal = ref(null) 
const isLoading = ref(false)

const profileForm = ref({ full_name: '', phone_number: '' })
const passwordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

// === STATE & FUNGSI RATING ===
const ratingModal = ref({
  isOpen: false,
  order: null,
  merchantRating: 0,
  driverRating: 0
})

const openRatingModal = (order) => {
  ratingModal.value = {
    isOpen: true,
    order: order,
    merchantRating: order.merchant_rating || 0,
    driverRating: order.driver_rating || 0
  }
}

const submitRating = async () => {
  try {
    const { error } = await supabase.from('orders').update({
      merchant_rating: ratingModal.value.merchantRating || null,
      driver_rating: ratingModal.value.driverRating || null
    }).eq('id', ratingModal.value.order.id)

    if (error) throw error

    toast.show('Terima kasih atas penilaian Anda!', 'success')
    ratingModal.value.isOpen = false
    emit('refreshOrders')
  } catch (error) {
    toast.show('Gagal mengirim penilaian.', 'error')
  }
}

const confirmOrderReceived = async (order) => {
  try {
    const { error } = await supabase.from('orders').update({ status: 'selesai' }).eq('id', order.id)
    if (error) throw error

    toast.show('Pesanan dikonfirmasi Selesai!', 'success')
    emit('refreshOrders')
    openRatingModal(order) 
  } catch (e) {
    toast.show('Gagal memperbarui pesanan.', 'error')
  }
}

// STATE ALAMAT
const myAddresses = ref([])
const showAddressForm = ref(false)
const editingAddressId = ref(null)
const addressForm = ref({ recipient_name: '', recipient_phone: '', address_detail: '', latitude: null, longitude: null, is_primary: false })

let mapInstance = null; let mapMarker = null;

const activeOrders = computed(() => props.myOrders.filter(o => ['pending', 'diproses', 'siap_diambil', 'diantar', 'terkirim'].includes(o.status)))
const historyOrders = computed(() => props.myOrders.filter(o => o.status === 'selesai' || o.status === 'dibatalkan'))
const recentHistoryOrders = computed(() => historyOrders.value.slice(0, 10))

const confirmDialog = ref({ isOpen: false, type: '', payload: null, title: '', message: '', btnText: 'Ya', btnClass: 'bg-blue-600' })

const checkPartnershipStatuses = async () => {
  if (!authStore.user?.id) return
  try {
    const { data: merchantData } = await supabase.from('merchant_details').select('status').eq('id', authStore.user.id).maybeSingle()
    if (merchantData) merchantStatus.value = merchantData.status

    const { data: driverData } = await supabase.from('driver_details').select('status').eq('id', authStore.user.id).maybeSingle()
    if (driverData) driverStatus.value = driverData.status
  } catch (e) {
    console.error('Gagal mengecek status kemitraan:', e.message)
  }
}

const handleMerchantClick = () => {
  if (merchantStatus.value === 'active' || merchantStatus.value === 'aktif') {
    router.push('/merchant') 
  } else if (merchantStatus.value === 'pending') {
    toast.show('Pendaftaran Toko Anda sedang ditinjau oleh Admin.', 'info')
  } else {
    openConfirmModal('apply_role', 'merchant', 'Buka Toko Mitra?', 'Apakah Anda yakin ingin mengajukan diri sebagai Toko Mitra? Admin akan meninjau akun Anda.', 'Ajukan', 'bg-purple-600 hover:bg-purple-700')
  }
}

const handleDriverClick = () => {
  if (driverStatus.value === 'active' || driverStatus.value === 'aktif') {
    router.push('/driver') 
  } else if (driverStatus.value === 'pending') {
    toast.show('Pendaftaran Kurir Anda sedang ditinjau oleh Admin.', 'info')
  } else {
    openConfirmModal('apply_role', 'driver', 'Jadi Kurir?', 'Apakah Anda yakin ingin mendaftar sebagai Kurir Anturun? Admin akan meninjau akun Anda.', 'Ajukan', 'bg-green-600 hover:bg-green-700')
  }
}

const openConfirmModal = (type, payload, title, message, btnText, btnClass) => {
  confirmDialog.value = { isOpen: true, type, payload, title, message, btnText, btnClass }
}

const executeConfirm = () => {
  const { type, payload } = confirmDialog.value
  confirmDialog.value.isOpen = false 

  if (type === 'cancel_order') executeCancelOrder(payload)
  else if (type === 'delete_address') executeDeleteAddress(payload)
  else if (type === 'apply_role') executeApplyRole(payload)
  else if (type === 'confirm_received') confirmOrderReceived(payload)
}

const executeCancelOrder = async (orderId) => {
  if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
    return toast.show('Sistem gagal membaca ID Pesanan. Silakan muat ulang halaman.', 'error')
  }

  try {
    const { data: orderData, error: fetchError } = await supabase.from('orders').select('status, driver_id').eq('id', orderId).single()
    if (fetchError) throw fetchError

    if (orderData.status !== 'pending' || (orderData.driver_id && orderData.driver_id !== null)) {
      emit('refreshOrders') 
      return toast.show('Gagal! Pesanan sudah diproses Toko atau diambil Kurir.', 'error')
    }

    const { error: updateError } = await supabase.from('orders').update({ status: 'dibatalkan', driver_id: null }).eq('id', orderId)
    if (updateError) {
      if (updateError.message.includes('PESANAN_DIPROSES')) {
        emit('refreshOrders')
        throw new Error('Pesanan tidak bisa dibatalkan karena baru saja diambil oleh Toko/Kurir.')
      }
      throw updateError
    }
    
    toast.show('Pesanan berhasil dibatalkan', 'success')
    emit('refreshOrders')
  } catch (e) { 
    toast.show(e.message, 'error') 
    console.error("Cancel Error:", e)
  }
}

const executeDeleteAddress = async (id) => {
  try {
    await supabase.from('user_addresses').delete().eq('id', id)
    toast.show('Alamat dihapus', 'success')
    await fetchAddresses()
  } catch (e) { toast.show('Gagal menghapus alamat', 'error') }
}

const executeApplyRole = async (roleType) => {
  if (roleType === 'driver') {
    const { data: settings } = await supabase.from('app_settings').select('*').single()
    if (!settings.is_driver_reg_open) return toast.show('Pendaftaran kurir sedang ditutup.', 'error')
    const { count } = await supabase.from('driver_details').select('*', { count: 'exact', head: true })
    if (count >= settings.driver_reg_limit) return toast.show('Kuota kurir penuh.', 'error')
  }

  const table = roleType === 'merchant' ? 'merchant_details' : 'driver_details'
  const roleName = roleType === 'merchant' ? 'Toko Mitra' : 'Kurir'

  try {
    const { data: existingData, error: fetchError } = await supabase.from(table).select('status').eq('id', authStore.user.id).maybeSingle() 
    if (fetchError) throw fetchError

    if (existingData) {
      if (existingData.status === 'pending') {
        return toast.show(`Pengajuan ${roleName} Anda sudah ada dan sedang ditinjau Admin.`, 'info')
      } else if (existingData.status === 'active' || existingData.status === 'aktif') {
        return toast.show(`Akun Anda sudah terdaftar sebagai ${roleName}.`, 'info')
      } else {
        const { error: updateError } = await supabase.from(table).update({ status: 'pending' }).eq('id', authStore.user.id)
        if (updateError) throw updateError
      }
    } else {
      const { error: insertError } = await supabase.from(table).insert([{ id: authStore.user.id, status: 'pending' }])
      if (insertError) throw insertError
    }

    toast.show('Pengajuan berhasil dikirim! Menunggu admin.', 'success')
    await authStore.fetchProfile() 
    await checkPartnershipStatuses()
    router.push('/pending') 
  } catch (e) { 
    toast.show('Gagal mengajukan: ' + e.message, 'error') 
  }
}

const openModal = async (type) => {
  activeModal.value = type
  if (type === 'profile') {
    profileForm.value.full_name = authStore.profile?.full_name || ''
    profileForm.value.phone_number = authStore.profile?.phone_number || ''
  } else if (type === 'address') {
    showAddressForm.value = false
    await fetchAddresses()
  } else if (type === 'password') {
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  }
}

const closeModal = () => {
  activeModal.value = null
  if (mapInstance) { mapInstance.remove(); mapInstance = null }
}

const savePassword = async () => {
  if (!passwordForm.value.oldPassword) return toast.show('Sandi lama wajib diisi!', 'error')
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) return toast.show('Sandi baru tidak cocok!', 'error')
  if (passwordForm.value.newPassword.length < 6) return toast.show('Sandi minimal 6 karakter', 'error')
  
  isLoading.value = true
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: authStore.user.email, password: passwordForm.value.oldPassword })
    if (signInError) throw new Error('Kata sandi lama yang Anda masukkan salah!')

    const { error: updateError } = await supabase.auth.updateUser({ password: passwordForm.value.newPassword })
    if (updateError) throw updateError
    
    toast.show('Kata sandi berhasil diubah', 'success')
    closeModal()
  } catch (e) { toast.show(e.message, 'error') } finally { isLoading.value = false }
}

const fetchAddresses = async () => {
  const { data } = await supabase.from('user_addresses').select('*').eq('user_id', authStore.user.id).order('created_at', { ascending: false })
  myAddresses.value = data || []
}

const openAddressForm = async (addr = null) => {
  showAddressForm.value = true
  if (addr) {
    editingAddressId.value = addr.id
    addressForm.value = { ...addr }
  } else {
    editingAddressId.value = null
    const makePrimary = myAddresses.value.length === 0
    addressForm.value = { recipient_name: '', recipient_phone: '', address_detail: '', latitude: null, longitude: null, is_primary: makePrimary }
  }
  await nextTick()
  initMap()
}

const LELEA_LAT = -6.4716; const LELEA_LNG = 108.1887;

const initMap = () => {
  if (mapInstance) mapInstance.remove()
  
  const lat = addressForm.value.latitude || LELEA_LAT
  const lng = addressForm.value.longitude || LELEA_LNG
  
  mapInstance = L.map('mapContainer').setView([lat, lng], 15)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance)
  mapMarker = L.marker([lat, lng], { draggable: true }).addTo(mapInstance)
  
  addressForm.value.latitude = lat; addressForm.value.longitude = lng;
  
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
        addressForm.value.latitude = latitude; addressForm.value.longitude = longitude
        toast.show('Lokasi ditemukan!', 'success')
      },
      (err) => { toast.show('Gagal melacak GPS.', 'error') },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }
}

const setPrimaryAddress = async (id) => {
  isLoading.value = true
  try {
    await supabase.from('user_addresses').update({ is_primary: false }).eq('user_id', authStore.user.id)
    const { error } = await supabase.from('user_addresses').update({ is_primary: true }).eq('id', id)
    if (error) throw error
    toast.show('Alamat utama berhasil diperbarui', 'success')
    await fetchAddresses()
  } catch (e) {
    toast.show('Gagal memperbarui alamat utama', 'error')
  } finally {
    isLoading.value = false
  }
}

const saveAddress = async () => {
  isLoading.value = true
  try {
    if (addressForm.value.is_primary) {
      await supabase.from('user_addresses').update({ is_primary: false }).eq('user_id', authStore.user.id)
    }

    if (editingAddressId.value) {
      const { error } = await supabase.from('user_addresses').update(addressForm.value).eq('id', editingAddressId.value)
      if (error) throw error
      toast.show('Alamat berhasil diperbarui', 'success')
    } else {
      const { error } = await supabase.from('user_addresses').insert([{ user_id: authStore.user.id, ...addressForm.value }])
      if (error) throw error
      toast.show('Alamat berhasil disimpan', 'success')
    }
    showAddressForm.value = false
    await fetchAddresses()
  } catch (e) { 
    toast.show(e.message, 'error') 
  } finally { 
    isLoading.value = false 
  }
}

const handleLogout = async () => { await authStore.signOut(); router.push('/login') }
</script>
