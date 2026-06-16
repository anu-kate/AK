<template>
  <div class="bg-gray-50 min-h-screen text-gray-900 relative pb-28 md:pb-12 overflow-x-hidden">
    <div class="fixed top-0 left-0 right-0 bg-white backdrop-blur-lg border-b border-gray-200 z-40 px-4 py-3 flex justify-between items-center shadow-sm">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-extrabold text-gray-900">ANTURUN</h1>
      </div>
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <button @click="handleLogout" class="px-4 py-2 bg-gray-100 font-bold rounded-xl text-sm">Keluar</button>
      </div>
    </div>

    <div class="max-w-5xl mx-auto pt-24 md:pt-28 px-4 space-y-6" @touchstart="handleSwipeStart" @touchend="handleSwipeEnd">
      
      <div class="hidden md:flex bg-gray-100 p-1.5 rounded-2xl shadow-sm mb-6">
        <button @click="changeTab('pengguna')" :class="activeMainTab === 'pengguna' ? 'bg-white text-blue-600' : 'text-gray-500'" class="flex-1 py-3 font-bold rounded-xl">Kelola Pengguna <span v-if="pendingUsersCount" class="bg-red-500 text-white text-[10px] px-2 rounded-full">{{ pendingUsersCount }}</span></button>
        <button @click="changeTab('pesanan')" :class="activeMainTab === 'pesanan' ? 'bg-white text-blue-600' : 'text-gray-500'" class="flex-1 py-3 font-bold rounded-xl">Monitor Pesanan <span v-if="pendingOrdersCount" class="bg-yellow-500 text-white text-[10px] px-2 rounded-full">{{ pendingOrdersCount }}</span></button>
        <button @click="changeTab('pengaturan')" :class="activeMainTab === 'pengaturan' ? 'bg-white text-blue-600' : 'text-gray-500'" class="flex-1 py-3 font-bold rounded-xl">Pengaturan</button>
      </div>

      <transition :name="slideDirection" mode="out-in">
        <keep-alive>
           <AdminUsers v-if="activeMainTab === 'pengguna'" @update-badge="c => pendingUsersCount = c" />
           <AdminOrders v-else-if="activeMainTab === 'pesanan'" @update-badge="c => pendingOrdersCount = c" />
           <AdminSettings v-else-if="activeMainTab === 'pengaturan'" />
        </keep-alive>
      </transition>
    </div>

    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 pb-[env(safe-area-inset-bottom)]">
      <div class="flex justify-around items-center h-16">
        <button @click="changeTab('pengguna')" :class="activeMainTab === 'pengguna' ? 'text-blue-600' : 'text-gray-400'" class="flex flex-col items-center w-full font-bold text-[10px]">
          Pengguna
        </button>
        <button @click="changeTab('pesanan')" :class="activeMainTab === 'pesanan' ? 'text-blue-600' : 'text-gray-400'" class="flex flex-col items-center w-full font-bold text-[10px]">
          Pesanan
        </button>
        <button @click="changeTab('pengaturan')" :class="activeMainTab === 'pengaturan' ? 'text-blue-600' : 'text-gray-400'" class="flex flex-col items-center w-full font-bold text-[10px]">
          Pengaturan
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ThemeToggle from './ThemeToggle.vue' 

// Import file komponen yang sudah kita pecah tadi
import AdminUsers from './admin/AdminUsers.vue'
import AdminOrders from './admin/AdminOrders.vue'
import AdminSettings from './admin/AdminSettings.vue'

const router = useRouter()
const authStore = useAuthStore()

// State Data dari Emit Sub-komponen (Untuk menampilkan lencana / badge notifikasi)
const pendingUsersCount = ref(0)
const pendingOrdersCount = ref(0)

// Navigasi State
const activeMainTab = ref('pengguna')
const slideDirection = ref('slide-left')
const tabsArray = ['pengguna', 'pesanan', 'pengaturan']

const changeTab = (newTab) => {
  const oldIndex = tabsArray.indexOf(activeMainTab.value)
  const newIndex = tabsArray.indexOf(newTab)
  slideDirection.value = newIndex > oldIndex ? 'slide-left' : 'slide-right'
  activeMainTab.value = newTab
}

// Logika Swipe Geser Antar Tab
const touchStartX = ref(0)
const touchStartY = ref(0)

const handleSwipeStart = (e) => {
  touchStartX.value = e.touches[0].screenX
  touchStartY.value = e.touches[0].screenY
}

const handleSwipeEnd = (e) => {
  const touchEndX = e.changedTouches[0].screenX
  const diffX = touchStartX.value - touchEndX
  const diffY = touchStartY.value - e.changedTouches[0].screenY

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
    const currentIndex = tabsArray.indexOf(activeMainTab.value)
    if (diffX > 0 && currentIndex < tabsArray.length - 1) {
      changeTab(tabsArray[currentIndex + 1])
    } else if (diffX < 0 && currentIndex > 0) {
      changeTab(tabsArray[currentIndex - 1])
    }
  }
}

const handleLogout = async () => { 
  await authStore.signOut()
  router.push('/login') 
}
</script>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active { transition: all 0.3s ease-out; }
.slide-left-enter-from { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-40px); }

.slide-right-enter-active, .slide-right-leave-active { transition: all 0.3s ease-out; }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to { opacity: 0; transform: translateX(40px); }
</style>