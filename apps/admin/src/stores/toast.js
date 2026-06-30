import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    type: 'success', // 'success' | 'error' | 'warning' | 'info'
    visible: false,
    timeoutId: null
  }),

  actions: {
    show(message, type = 'success', duration = 3000) {
      // Jika ada toast yang sedang berjalan, bersihkan timeout lamanya
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }

      this.message = message
      this.type = type
      this.visible = true

      // Sembunyikan otomatis setelah durasi habis
      this.timeoutId = setTimeout(() => {
        this.visible = false
      }, duration)
    },
    
    close() {
      this.visible = false
      if (this.timeoutId) clearTimeout(this.timeoutId)
    }
  }
})