<!-- src/App.vue -->
<template>
  <div class="antialiased font-sans min-h-screen transition-colors duration-300">
    <router-view />
    
    <!-- Toast Notifikasi Global -->
    <GlobalToast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import GlobalToast from './components/GlobalToast.vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

// Terapkan tema saat aplikasi pertama kali dimuat
onMounted(() => {
  themeStore.applyTheme()
})
</script>