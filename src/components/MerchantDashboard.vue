<template>
  <div class="bg-gray-50 min-h-screen text-gray-900 font-sans relative pb-28 md:pb-12 overflow-x-hidden">
    
    <div class="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg border-b border-gray-300 z-40 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
        <div class="flex flex-col truncate pr-2">
          <h1 class="text-lg md:text-xl font-extrabold text-gray-900 leading-tight truncate tracking-tight">{{ storeProfile.store_name || 'Toko Saya' }}</h1>
          <div class="flex items-center gap-1 mt-0.5">
            <span class="text-[10px] text-gray-500 truncate font-bold mr-1">{{ storeProfile.operational_hours || 'Belum diatur' }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex flex-row-reverse items-center shrink-0">
        <div class="flex flex-col items-center">
          <label class="relative inline-flex items-center cursor-pointer group">
            <input type="checkbox" v-model="storeProfile.is_open" @change="toggleStoreStatus" class="sr-only peer">
            <div class="w-12 h-6 md:w-14 md:h-7 bg-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5.5 md:after:h-6 md:after:w-6.5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
          </label>
          <p :class="storeProfile.is_open ? 'text-emerald-600' : 'text-red-600'" class="text-[9px] font-extrabold uppercase mt-1 tracking-wider">
            {{ storeProfile.is_open ? 'Buka' : 'Tutup' }}
          </p>
        </div>
        <div class="mr-4">
          <ThemeToggle />
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto pt-24 md:pt-28 px-4 md:px-8 space-y-4 md:space-y-6" @touchstart="handleSwipeStart" @touchend="handleSwipeEnd">
      
      <div class="hidden md:flex bg-gray-100 p-1.5 rounded-2xl shadow-sm mb-6">
        <button @click="changeTab('pesanan')" :class="activeMainTab === 'pesanan' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-3 px-6 font-bold transition rounded-xl flex items-center justify-center gap-2">
          Pesanan Masuk <span v-if="newOrders.length > 0" class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{{ newOrders.length }}</span>
        </button>
        <button @click="changeTab('produk')" :class="activeMainTab === 'produk' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-3 px-6 font-bold transition rounded-xl flex items-center justify-center gap-2">
          Katalog Produk
        </button>
        <button @click="changeTab('pengaturan')" :class="activeMainTab === 'pengaturan' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-3 px-6 font-bold transition rounded-xl flex items-center justify-center gap-2">
          Pengaturan
        </button>
      </div>

      <transition :name="slideDirection" mode="out-in">
        
        <div v-if="activeMainTab === 'pesanan'" key="pesanan" class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-300 space-y-4 w-full">
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
        </div>

        <div v-else-if="activeMainTab === 'produk'" key="produk" class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-300 space-y-4 w-full">
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
        </div>

        <div v-else-if="activeMainTab === 'pengaturan'" key="pengaturan" class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-300 space-y-6 w-full">
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
        </div>

      </transition>
    </div>

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

    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white backdrop-blur-xl border-t border-gray-300 z-40 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
      <div class="grid grid-cols-3 h-16">
        <button @click="changeTab('pesanan')" class="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all" :class="activeMainTab === 'pesanan' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'">
          <div class="relative"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg><span v-if="newOrders.length > 0" class="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full border-2 border-white">{{ newOrders.length }}</span></div>
          <span class="text-[10px] font-bold">Pesanan</span>
        </button>
        <button @click="changeTab('produk')" class="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all" :class="activeMainTab === 'produk' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg><span class="text-[10px] font-bold">Produk</span>
        </button>
        <button @click="changeTab('pengaturan')" class="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all" :class="activeMainTab === 'pengaturan' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg><span class="text-[10px] font-bold">Pengaturan</span>
        </button>
      </div>
    </nav>

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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import defaultMenuImage from '../assets/default-menu.svg'
import ThemeToggle from './ThemeToggle.vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToastStore()

// State Utama
const storeProfile = ref({})
const products = ref([])
const orders = ref([])
const vouchers = ref([])

const activeMainTab = ref('pesanan')
const activeSubTabOrder = ref('baru')
const slideDirection = ref('slide-left')
const loadingOrders = ref(false)
const savingData = ref(false)
const searchProduct = ref('')

// Modal Produk & ImageKit
const selectedFile = ref(null)
const imagePreview = ref('')
const compressionMsg = ref('')
const isProductModalOpen = ref(false)
const productForm = ref({ id: null, name: '', price: '', discount_price: '', description: '', image_url: '', is_available: true })

// Modal Toko & Leaflet Map
const isStoreModalOpen = ref(false)
const storeForm = ref({ store_name: '', store_address: '', operational_hours: '', latitude: null, longitude: null })
const mapContainer = ref(null)
let map = null
let marker = null

// Modal Tarik Saldo
const isWithdrawModalOpen = ref(false)
const withdrawAmount = ref('')

// Modal Voucher
const isVoucherModalOpen = ref(false)
const voucherForm = ref({ code: '', discount_amount: '', min_purchase: '' })

// Modal Konfirmasi
const confirmDialog = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Lanjutkan',
  confirmClass: 'bg-purple-600 hover:bg-purple-700',
  onConfirm: null
})

// ==========================================
// INIT PETA LEAFLET
// ==========================================
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

// ==========================================
// UTILITY & NAVIGASI
// ==========================================
const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v || 0)

const tabsArray = ['pesanan', 'produk', 'pengaturan']
const changeTab = (newTab) => {
  const oldIndex = tabsArray.indexOf(activeMainTab.value); const newIndex = tabsArray.indexOf(newTab)
  slideDirection.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
  activeMainTab.value = newTab
}

const touchStartX = ref(0); const touchStartY = ref(0)
const handleSwipeStart = (e) => { touchStartX.value = e.touches[0].screenX; touchStartY.value = e.touches[0].screenY }
const handleSwipeEnd = (e) => {
  const diffX = touchStartX.value - e.changedTouches[0].screenX; const diffY = touchStartY.value - e.changedTouches[0].screenY
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
    const currentIndex = tabsArray.indexOf(activeMainTab.value)
    if (diffX > 0 && currentIndex < tabsArray.length - 1) changeTab(tabsArray[currentIndex + 1])
    else if (diffX < 0 && currentIndex > 0) changeTab(tabsArray[currentIndex - 1])
  }
}

const modalDragY = ref(0); const isDraggingModal = ref(false); let touchStartYModal = 0
const handleModalTouchStart = (e) => { touchStartYModal = e.touches[0].clientY; isDraggingModal.value = true; modalDragY.value = 0 }
const handleModalTouchMove = (e) => { if (!isDraggingModal.value) return; const diffY = e.touches[0].clientY - touchStartYModal; if (diffY > 0) { modalDragY.value = diffY; if (e.cancelable) e.preventDefault() } }
const handleModalTouchEnd = (e, closeFunction) => {
  if (!isDraggingModal.value) return; isDraggingModal.value = false;
  if (modalDragY.value > 120) { modalDragY.value = window.innerHeight; setTimeout(() => { closeFunction(); setTimeout(() => { modalDragY.value = 0 }, 50) }, 250) } else { modalDragY.value = 0 }
}

const openConfirmDialog = ({ title, message, confirmText = 'Lanjutkan', confirmClass = 'bg-purple-600 hover:bg-purple-700', onConfirm }) => {
  confirmDialog.value = { isOpen: true, title, message, confirmText, confirmClass, onConfirm }
}

const closeConfirmDialog = () => {
  confirmDialog.value.isOpen = false
}

const executeConfirmDialog = async () => {
  const action = confirmDialog.value.onConfirm
  closeConfirmDialog()
  if (typeof action === 'function') await action()
}

// ==========================================
// FETCHING DATA
// ==========================================
const fetchStoreProfile = async () => {
  const { data, error } = await supabase.from('merchant_details').select('*').eq('id', authStore.user.id).single()
  if (data) storeProfile.value = data
}
const fetchProducts = async () => {
  const { data } = await supabase.from('products').select('*').eq('merchant_id', authStore.user.id).order('created_at', { ascending: false })
  products.value = data || []
}
const fetchVouchers = async () => {
  const { data } = await supabase.from('store_vouchers').select('*').eq('merchant_id', authStore.user.id).order('created_at', { ascending: false })
  vouchers.value = data || []
}
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
    // PROTEKSI: Menerjemahkan String JSON menjadi Array Asli
    orders.value = data.map(order => {
      let parsedItems = order.items;
      
      // Jika tipe datanya 'string' (contoh: "[{...}]"), kita ubah jadi Array
      if (typeof parsedItems === 'string') {
        try {
          parsedItems = JSON.parse(parsedItems);
        } catch (e) {
          console.error("Gagal membaca item pesanan:", e);
          parsedItems = []; // Cegah aplikasi crash
        }
      }
      
      return {
        ...order,
        items: parsedItems
      }
    })
  }
  
  loadingOrders.value = false
}

onMounted(() => { if (authStore.user) { fetchStoreProfile(); fetchProducts(); fetchVouchers(); fetchOrders() } })

const filteredProducts = computed(() => {
  if (!searchProduct.value) return products.value
  return products.value.filter(p => p.name.toLowerCase().includes(searchProduct.value.toLowerCase()))
})
const newOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
const processingOrders = computed(() => orders.value.filter(o => ['diproses', 'siap_diambil'].includes(o.status)))
const historyOrders = computed(() => orders.value.filter(o => ['selesai', 'dibatalkan'].includes(o.status)))
const recentHistoryOrders = computed(() => historyOrders.value.slice(0, 10))

// ==========================================
// LOGIKA TOKO & TARIK SALDO
// ==========================================
const toggleStoreStatus = async () => {
  const newStatus = storeProfile.value.is_open // Already updated by v-model
  const { error } = await supabase.from('merchant_details').update({ is_open: newStatus }).eq('id', authStore.user.id)
  if (!error) toast.show(`Toko di${newStatus ? 'buka' : 'tutup'}!`, 'success')
  else { storeProfile.value.is_open = !newStatus; toast.show('Gagal ubah status', 'error') }
}

const openStoreEditModal = async () => {
  modalDragY.value = 0
  storeForm.value = { store_name: storeProfile.value.store_name || '', store_address: storeProfile.value.store_address || '', operational_hours: storeProfile.value.operational_hours || '', latitude: storeProfile.value.latitude || null, longitude: storeProfile.value.longitude || null }
  isStoreModalOpen.value = true; await nextTick(); initMap(); setTimeout(() => { if (map) map.invalidateSize() }, 300)
}
const closeStoreEditModal = () => { isStoreModalOpen.value = false }

const saveStoreProfile = async () => {
  savingData.value = true
  const { error } = await supabase.from('merchant_details').update(storeForm.value).eq('id', authStore.user.id)
  savingData.value = false
  if (!error) { toast.show('Profil disimpan!', 'success'); fetchStoreProfile(); closeStoreEditModal() } else toast.show('Gagal simpan', 'error')
}

// -- Withdraw Logic --
const openWithdrawModal = () => { modalDragY.value = 0; withdrawAmount.value = ''; isWithdrawModalOpen.value = true }

const submitWithdraw = async () => {
  const amount = parseInt(withdrawAmount.value)
  if (!amount || amount < 50000) return toast.show('Minimal penarikan Rp 50.000', 'warning')
  if (amount > (storeProfile.value.balance || 0)) return toast.show('Saldo Anda tidak mencukupi!', 'error')
  
  savingData.value = true
  const { error } = await supabase.from('store_withdrawals').insert([{ merchant_id: authStore.user.id, amount: amount }])
  savingData.value = false
  
  if (!error) {
    toast.show('Permintaan penarikan berhasil dikirim!', 'success')
    isWithdrawModalOpen.value = false
  } else toast.show('Gagal mengajukan penarikan.', 'error')
}

const chatAdminWithdraw = () => {
  const text = encodeURIComponent(`Halo Admin Anturun, saya ingin konfirmasi penarikan saldo untuk toko *${storeProfile.value.store_name || 'saya'}*. Mohon segera diproses ya, terima kasih!`)
  window.open(`https://wa.me/6281234567890?text=${text}`, '_blank')
}

// ==========================================
// VOUCHER PROMO
// ==========================================
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

// ==========================================
// PRODUK & IMAGEKIT
// ==========================================
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

const openProductModal = (product = null) => {
  modalDragY.value = 0; selectedFile.value = null; compressionMsg.value = ''
  if (product) { productForm.value = { ...product, discount_price: product.discount_price || '' }; imagePreview.value = product.image_url } 
  else { productForm.value = { id: null, name: '', price: '', discount_price: '', description: '', image_url: '', is_available: true }; imagePreview.value = '' }
  isProductModalOpen.value = true
}
const closeProductModal = () => { isProductModalOpen.value = false }

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
const handleLogout = async () => { await authStore.signOut(); router.push('/login') }
</script>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active { transition: all 0.3s ease-out; }
.slide-left-enter-from { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-40px); }
.slide-right-enter-active, .slide-right-leave-active { transition: all 0.3s ease-out; }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to { opacity: 0; transform: translateX(40px); }
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
