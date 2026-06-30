// src/stores/cart.js
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    settings: {
      cross_store_base_fee: 2000,
      cross_store_distance_fee: 1000,
      distance_threshold_km: 1
    }
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    subtotalPrice: (state) => state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
    
    // Mengelompokkan item berdasarkan toko
    groupedByMerchant: (state) => {
      const groups = {}
      state.items.forEach(item => {
        if (!groups[item.merchant_id]) {
          groups[item.merchant_id] = { merchant_id: item.merchant_id, merchant_name: item.merchant_name, lat: item.lat, lng: item.lng, items: [] }
        }
        groups[item.merchant_id].items.push(item)
      })
      return Object.values(groups)
    },
    
    // LOGIKA PERHITUNGAN BIAYA LINTAS TOKO
    crossStoreFee(state) {
      const merchants = this.groupedByMerchant
      if (merchants.length <= 1) return 0 // Gratis jika hanya 1 toko

      let totalExtraFee = 0
      for (let i = 0; i < merchants.length - 1; i++) {
        // Simulasi Jarak: Jika koordinat belum diatur di profil, kita gunakan jarak dummy
        // (Misalnya t1->t2 = 3.2km, t2->t3 = 0.5km sesuai contoh kasus Anda)
        const dist = (i === 0) ? 3.2 : 0.5 

        let routeFee = state.settings.cross_store_base_fee // Mulai dari Rp2000
        
        // Jika jarak melebihi ambang batas (1km), tambahkan Rp1000/km (dibulatkan ke bawah)
        if (dist > state.settings.distance_threshold_km) {
          routeFee += Math.floor(dist) * state.settings.cross_store_distance_fee
        }
        totalExtraFee += routeFee
      }
      return totalExtraFee
    },
    
    totalPrice(state) {
      return this.subtotalPrice + this.crossStoreFee
    }
  },
  actions: {
    async fetchSettings() {
      const { data } = await supabase.from('app_settings').select('*').single()
      if (data) this.settings = data
    },
    
    addItem(product, merchant) {
      const existing = this.items.find(i => i.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          original_price: product.original_price || product.price,
          quantity: 1,
          merchant_id: merchant.id,
          merchant_name: merchant.full_name,
          lat: merchant.latitude,
          lng: merchant.longitude
        })
      }
    },
    removeItem(productId) {
      const index = this.items.findIndex(i => i.id === productId)
      if (index > -1) {
        if (this.items[index].quantity > 1) {
          this.items[index].quantity--
        } else {
          this.items.splice(index, 1)
        }
      }
    },
    clearCart() {
      this.items = []
    }
  },
  
  // TAMBAHKAN BARIS INI UNTUK MENYIMPAN KE LOCAL STORAGE
  persist: true
})
