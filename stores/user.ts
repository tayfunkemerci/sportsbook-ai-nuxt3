import { defineStore } from 'pinia'
import { useSupabase } from '~/composables/useSupabase'

interface User {
  id: string
  email: string
  balance: number
}

interface UserState {
  user: User | null
  userBalance: number
  isBalanceFetched: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    userBalance: 0,
    isBalanceFetched: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentBalance: (state) => state.userBalance
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.userBalance = user.balance
      this.isBalanceFetched = true
    },

    async fetchBalance() {
      if (!this.user) return 0

      // Eğer balance zaten yüklenmişse, cache'den dön
      if (this.isBalanceFetched) {
        return this.userBalance
      }

      const { supabase } = useSupabase()
      const { data, error } = await supabase
        .from('users')
        .select('balance')
        .eq('id', this.user.id)
        .single()

      if (data && !error) {
        this.userBalance = data.balance
        if (this.user) {
          this.user.balance = data.balance
        }
        this.isBalanceFetched = true
      }
      return this.userBalance
    },

    async updateBalance(newBalance: number) {
      if (!this.user) return false

      const { supabase } = useSupabase()
      const { error } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', this.user.id)

      if (!error) {
        this.userBalance = newBalance
        if (this.user) {
          this.user.balance = newBalance
        }
        return true
      }
      return false
    },

    async deductBalance(amount: number) {
      if (!this.user || this.userBalance < amount) return false
      
      const newBalance = this.userBalance - amount
      return await this.updateBalance(newBalance)
    },

    async addBalance(amount: number) {
      if (!this.user) return false
      
      const newBalance = this.userBalance + amount
      return await this.updateBalance(newBalance)
    },

    logout() {
      this.user = null
      this.userBalance = 0
      this.isBalanceFetched = false
    }
  }
}) 