// src/stores/auth.js
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    initialized: false,
    authSubscription: null,
  }),
  
  actions: {
    async initialize() {
      if (this.initialized) return

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        this.user = session.user
        await this.fetchProfile()
      }

      const { data } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (currentSession) {
          this.user = currentSession.user
          if (!this.profile) await this.fetchProfile()
        } else {
          this.user = null
          this.profile = null
        }
      })

      this.authSubscription = data.subscription
      this.initialized = true
    },

    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.user = data.user
      await this.fetchProfile()
    },

    // Pendaftaran sekarang murni sebagai "Customer" default
    async signUp(email, password, metadata) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('Nomor HP ini sudah terdaftar! Silakan gunakan menu Masuk (Login).')
      }

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: metadata.full_name,
            phone_number: metadata.phone_number,
            role: 'customer', // Semua akun baru berawal dari Customer
            account_status: 'pending'
          }, { onConflict: 'id' })
        if (profileError) throw profileError
      }
      this.user = data.user
      await this.fetchProfile()
    },

    async signOut() {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      this.user = null
      this.profile = null
      localStorage.clear()
    },

    async fetchProfile() {
      if (!this.user) return
      
      // Ambil data dasar
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', this.user.id).single()
      
      // Ambil status ekstensi (Multi-Role)
      const { data: merchantData } = await supabase.from('merchant_details').select('*').eq('id', this.user.id).maybeSingle()
      const { data: driverData } = await supabase.from('driver_details').select('*').eq('id', this.user.id).maybeSingle()

      if (profileData) {
        this.profile = {
          ...profileData,
          merchant_status: merchantData?.status || null,
          driver_status: driverData?.status || null
        }
      }
    }
  }
})
