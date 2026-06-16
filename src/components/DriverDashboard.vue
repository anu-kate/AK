<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8 pb-28 font-sans text-gray-900 transition-colors duration-300">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <div v-if="activeTab !== 'profile'" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-300 flex justify-between items-center animate-fade-in transition-colors duration-300">
        <div>
          <h1 class="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            Halo, {{ authStore.profile?.full_name || 'Kurir' }}
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </h1>
          <p class="text-sm text-gray-600 mt-1">Siap berburu orderan hari ini?</p>
        </div>
        <button @click="themeStore.toggleTheme()" class="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-200 transition shadow-sm shrink-0">
          <svg v-if="themeStore.isDark" class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg v-else class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>
      </div>

      <DriverOrderan v-if="activeTab === 'orderan'" />
      <DriverPerforma v-if="activeTab === 'performa'" />
      <DriverProfile v-if="activeTab === 'profile'" />

    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50 pb-[env(safe-area-inset-bottom)]">
      <div class="max-w-4xl mx-auto flex justify-around">
        <button @click="activeTab = 'orderan'" :class="activeTab === 'orderan' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="flex-1 py-3 flex flex-col items-center gap-1 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <span class="text-[10px] font-bold">Orderan</span>
        </button>
        <button @click="activeTab = 'performa'" :class="activeTab === 'performa' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="flex-1 py-3 flex flex-col items-center gap-1 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          <span class="text-[10px] font-bold">Performa</span>
        </button>
        <button @click="activeTab = 'profile'" :class="activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'" class="flex-1 py-3 flex flex-col items-center gap-1 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span class="text-[10px] font-bold">Profil</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import DriverOrderan from './driver/DriverOrderan.vue'
import DriverPerforma from './driver/DriverPerforma.vue'
import DriverProfile from './driver/DriverProfile.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const activeTab = ref('orderan')
</script>