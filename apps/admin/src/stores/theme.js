// src/stores/theme.js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // Cek apakah sebelumnya pengguna sudah memilih tema, default: false (Light)
    isDark: localStorage.getItem('anturun_theme') === 'dark'
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('anturun_theme', this.isDark ? 'dark' : 'light')
      this.applyTheme()
    },
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
})