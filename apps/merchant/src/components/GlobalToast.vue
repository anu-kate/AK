<template>
  <Transition name="toast-fade">
    <div v-if="toastStore.visible" 
         class="fixed top-5 right-5 z-[9999] max-w-sm w-full p-4 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md"
         :class="toastClasses">
      
      <span class="text-xl shrink-0">
        <span v-if="toastStore.type === 'success'">✅</span>
        <span v-else-if="toastStore.type === 'error'">❌</span>
        <span v-else-if="toastStore.type === 'warning'">⚠️</span>
        <span v-else>ℹ️</span>
      </span>

      <p class="text-sm font-bold flex-1">{{ toastStore.message }}</p>

      <button @click="toastStore.close" class="text-gray-400 hover:text-gray-600 transition p-1 rounded-md">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '../stores/toast'

const toastStore = useToastStore()

const toastClasses = computed(() => {
  const baseClasses = {
    success: 'bg-green-50/90 text-green-800 border-green-200 shadow-green-100',
    error: 'bg-red-50/90 text-red-800 border-red-200 shadow-red-100',
    warning: 'bg-yellow-50/90 text-yellow-800 border-yellow-200 shadow-yellow-100',
    info: 'bg-blue-50/90 text-blue-800 border-blue-200 shadow-blue-100'
  }
  return baseClasses[toastStore.type] || baseClasses.info
})
</script>

<style scoped>
/* Animasi Transisi Elegan (Slide & Fade) */
.toast-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}
</style>