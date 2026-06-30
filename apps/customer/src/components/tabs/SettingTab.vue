<template>
  <div class="animate-fade-in space-y-6 max-w-2xl mx-auto pb-6">
    <div class="bg-white p-6 rounded-3xl border border-gray-300 shadow-sm flex justify-between items-center">
      <div>
        <h2 class="text-xl font-black text-gray-900">{{ authStore.profile?.full_name || 'Pengguna' }}</h2>
        <p class="text-gray-500 font-mono text-sm mt-1">{{ authStore.profile?.phone_number || '-' }}</p>
      </div>
      <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wide">
        {{ authStore.profile?.role || 'Customer' }}
      </span>
    </div>

    <div class="bg-white p-1.5 rounded-2xl border border-gray-300 shadow-sm flex gap-1">
      <button @click="activeSubTab = 'active-orders'" :class="activeSubTab === 'active-orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
        <ShoppingBagIcon class="w-4 h-4" />
        Pesanan <span v-if="activeOrders.length > 0" class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">{{ activeOrders.length }}</span>
      </button>
      <button @click="activeSubTab = 'history-orders'" :class="activeSubTab === 'history-orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
        <ClipboardDocumentListIcon class="w-4 h-4" />
        Riwayat
      </button>
      <button @click="activeSubTab = 'profile'" :class="activeSubTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5">
        <UserIcon class="w-4 h-4" />
        Profile
      </button>
    </div>

    <div v-show="activeSubTab === 'active-orders'" class="space-y-4 animate-fade-in">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Sedang Berjalan</h3>
        <button @click="emit('refreshOrders')" :disabled="isOrdersLoading" class="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline disabled:opacity-50">
          <ArrowPathIcon :class="{'animate-spin': isOrdersLoading}" class="w-3.5 h-3.5" />
          Perbarui
        </button>
      </div>

      <div v-if="activeOrders.length > 0" class="space-y-3">
        <div v-for="order in activeOrders" :key="order.id" class="p-4 sm:p-5 bg-white rounded-2xl border border-gray-300 shadow-sm relative overflow-hidden transition-all duration-300">
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
                {{ getOrderStatusLabel(order) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center pl-1">
              <div class="font-black text-sm sm:text-base text-gray-800 flex items-center gap-2 truncate pr-2">
                <BuildingStorefrontIcon class="w-5 h-5 text-blue-500 shrink-0" />
                <span class="truncate">{{ order.display_merchant_name }}</span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="font-black text-blue-600 text-sm sm:text-base">Rp {{ formatRupiah(order.total_price) }}</span>
                <div class="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full">
                  <ChevronUpIcon :class="{'rotate-180': expandedOrderId === order.id}" class="w-4 h-4 text-gray-500 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          <div v-show="expandedOrderId === order.id" class="mt-4 pt-4 border-t border-gray-300 animate-fade-in pl-1">
            <div class="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 text-xs border border-gray-300">
              <p class="font-bold text-[10px] text-gray-500 uppercase tracking-wider mb-2">Rincian Belanja:</p>
              <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center border-b border-gray-300/50 pb-2 last:border-0 last:pb-0">
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
              <div class="flex justify-between font-extrabold text-gray-800 text-xs pt-2 mt-2 border-t border-gray-300">
                <span>Total Tagihan Akhir</span>
                <span class="text-blue-600">Rp {{ formatRupiah(order.total_price) }}</span>
              </div>
            </div>
            
            <div v-if="order.driver" class="bg-blue-50/50 border border-blue-100 rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm shrink-0 border border-blue-50">
                  <TruckIcon class="w-5 h-5" />
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
                <ChatBubbleBottomCenterTextIcon class="w-4 h-4" />
                Chat
              </a>
            </div>
            
            <div v-if="order.status === 'diantar'" class="w-full py-3 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 animate-pulse">
              <BoltIcon class="w-4 h-4" />
              Kurir sedang menuju ke lokasi Anda
            </div>

            <button 
              v-else-if="order.status === 'terkirim'"
              @click="openConfirmModal('confirm_received', order, 'Pesanan Sudah Diterima?', 'Pastikan Anda telah menerima pesanan dengan baik. Pesanan yang sudah dikonfirmasi tidak dapat dibatalkan.', 'Ya, Sudah', 'bg-green-600 hover:bg-green-700')"
              class="w-full py-3 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 bg-green-600 text-white hover:bg-green-700 shadow-md animate-pulse hover:animate-none"
            >
              <CheckIcon class="w-4 h-4" />
              Konfirmasi Pesanan Diterima
            </button>

            <button 
              v-else
              :disabled="order.status !== 'pending' || order.driver_id"
              @click="openConfirmModal('cancel_order', order.id, 'Batalkan Pesanan?', 'Apakah Anda yakin ingin membatalkan pesanan ini?', 'Batalkan', 'bg-red-600 hover:bg-red-700')" 
              :class="(order.status === 'pending' && !order.driver_id) ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed hidden'"
              class="w-full py-3 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <XMarkIcon class="w-4 h-4" />
              Batalkan Pesanan Ini
            </button>

          </div>
        </div>
      </div>
      <div v-else-if="isOrdersFetched" class="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-300 text-sm text-gray-500">
        <InboxIcon class="w-12 h-12 mx-auto text-gray-300 mb-3" />
        Tidak ada pesanan yang sedang aktif.
      </div>
    </div>

    <div v-show="activeSubTab === 'history-orders'" class="space-y-4 animate-fade-in">
      <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Selesai & Lampau</h3>
      <div v-if="historyOrders.length > 0" class="space-y-3">
        <div v-for="order in recentHistoryOrders" :key="order.id" class="p-4 bg-white rounded-2xl border border-gray-300 shadow-sm opacity-90 hover:opacity-100 transition">
          <div class="flex justify-between items-start gap-3 mb-2">
            <div class="flex flex-col gap-1">
              <span class="font-mono text-[11px] font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md w-fit">#{{ getOrderCode(order) }}</span>
              <span class="text-[10px] font-bold text-gray-500">{{ new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' }) }}</span>
            </div>
            <span :class="{'bg-green-100 text-green-700': order.status === 'selesai', 'bg-red-100 text-red-700': order.status === 'dibatalkan'}" class="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <CheckIcon v-if="order.status === 'selesai'" class="w-3 h-3" />
              <XMarkIcon v-else-if="order.status === 'dibatalkan'" class="w-3 h-3" />
              {{ order.status }}
            </span>
          </div>
          <p class="font-bold text-sm text-gray-800 mb-1 flex items-center gap-1.5 line-clamp-1">
            <BuildingStorefrontIcon class="w-5 h-5 text-blue-500 shrink-0" />
            {{ order.display_merchant_name }}
          </p>
          <div class="flex justify-between items-end mt-2 pt-2 border-t border-gray-300">
            <div class="font-bold text-gray-600 text-xs">Total: Rp {{ formatRupiah(order.total_price) }}</div>
            
            <div v-if="order.status === 'selesai'">
              <button 
                v-if="!order.merchant_rating && !order.driver_rating"
                @click="openRatingModal(order)"
                class="text-[10px] flex items-center gap-1 font-bold px-2 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-md hover:bg-yellow-100 transition shadow-sm"
              >
                Beri Penilaian
                <StarIcon class="w-3.5 h-3.5" />
              </button>
              <div v-else class="flex gap-0.5 text-yellow-400 text-sm" title="Sudah dinilai">
                <SolidStarIcon v-for="i in 5" :key="i" class="w-3.5 h-3.5" :class="i <= (order.merchant_rating || order.driver_rating || 0) ? 'text-yellow-400' : 'text-gray-300'" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="isOrdersFetched" class="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300 text-sm text-gray-500">
        <InboxIcon class="w-12 h-12 mx-auto text-gray-300 mb-3" />
        Belum ada riwayat transaksi.
      </div>
    </div>

    <div v-show="activeSubTab === 'profile'" class="bg-white rounded-3xl border border-gray-300 shadow-sm overflow-hidden animate-fade-in">
      <div class="p-6 border-b border-gray-300 space-y-2">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Akun Pribadi</h3>
        <button @click="openModal('password')" class="w-full flex justify-between items-center p-3 rounded-xl transition font-bold text-gray-700">
          <span class="flex items-center gap-2">
            <LockClosedIcon class="w-5 h-5 text-gray-500"/>
            Ubah Sandi
          </span> 
          <span class="text-gray-400">→</span>
        </button>
        <button @click="openModal('address')" class="w-full flex justify-between items-center p-3 rounded-xl transition font-bold text-gray-700">
          <span class="flex items-center gap-2">
            <MapPinIcon class="w-5 h-5 text-gray-500"/>
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
            :class="merchantStatus === 'active' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700'"
            class="p-4 rounded-2xl font-bold transition flex items-center justify-between group border border-transparent hover:border-purple-200 shadow-sm"
          >
            <div class="text-left flex items-center gap-2">
              <TruckIcon class="w-5 h-5 opacity-70" />
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
              <DriverIcon class="w-5 h-5 opacity-70" />
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
      <div class="p-6 bg-gray-50">
        <button @click="handleLogout" class="w-full py-3 border border-red-300 bg-red-100 text-red-600 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2">
          <ArrowRightStartOnRectangleIcon class="w-4 h-4" />
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
        </div>
        <h3 class="text-lg font-black text-center text-gray-900 mb-1">Pesanan Selesai!</h3>
        <p class="text-xs text-center text-gray-500 mb-6">Bagaimana pengalaman Anda untuk pesanan ini?</p>

        <div class="space-y-5">
          <div class="bg-gray-50 rounded-2xl p-4 border border-gray-300 text-center">
            <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pelayanan Toko / Menu</p>
            <div class="flex justify-center gap-1.5 text-3xl">
              <button v-for="i in 5" :key="'m'+i" @click="ratingModal.merchantRating = i" class="focus:outline-none transition-transform hover:scale-110">
                <SolidStarIcon :class="i <= ratingModal.merchantRating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'" class="w-8 h-8 inline-block" />
              </button>
            </div>
          </div>

          <div v-if="ratingModal.order?.driver" class="bg-gray-50 rounded-2xl p-4 border border-gray-300 text-center">
            <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pelayanan Kurir ({{ ratingModal.order.driver.full_name }})</p>
            <div class="flex justify-center gap-1.5 text-3xl">
              <button v-for="i in 5" :key="'d'+i" @click="ratingModal.driverRating = i" class="focus:outline-none transition-transform hover:scale-110">
                <SolidStarIcon :class="i <= ratingModal.driverRating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'" class="w-8 h-8 inline-block" />
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
        <div class="p-6 border-b border-gray-300 flex justify-between items-center shrink-0">
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
                  <MapPinIcon class="w-3 h-3" />
                  Ke Lokasi Saya
                </button>
              </div>
              <div id="mapContainer" class="w-full h-48 rounded-xl border-2 border-gray-300 z-0 relative"></div>
            </div>
            <div class="flex gap-3 pt-4">
              <button @click="showAddressForm = false" class="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Batal</button>
              <button @click="saveAddress" :disabled="!addressForm.latitude || isLoading" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl disabled:opacity-50">Simpan</button>
            </div>
          </div>
          <div v-else class="space-y-4">
            <button @click="openAddressForm()" class="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition flex justify-center items-center gap-2">Tambah Alamat Baru</button>
            <div v-for="addr in myAddresses" :key="addr.id" :class="addr.is_primary ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'" class="p-4 border rounded-2xl relative group">
              <div class="flex justify-between items-start mb-1">
                <h4 class="font-bold text-gray-800 flex items-center gap-1.5">
                  <MapPinIcon class="w-4 h-4 text-blue-500" />
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
import { StarIcon, XMarkIcon, BoltIcon, CheckIcon, ChatBubbleBottomCenterTextIcon, ChevronUpIcon, ShoppingBagIcon, ClipboardDocumentListIcon, UserIcon, ArrowPathIcon, BuildingStorefrontIcon, LockClosedIcon, MapPinIcon, TruckIcon, ArrowRightStartOnRectangleIcon, PencilSquareIcon, InboxIcon } from '@heroicons/vue/24/outline'
import { StarIcon as SolidStarIcon } from '@heroicons/vue/16/solid'
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
