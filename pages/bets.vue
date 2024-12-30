<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto mt-10">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Mevcut Bahisler</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-white">
          Mevcut bahisleri inceleyin ve bilinçli kararlar almak için AI tahminlerini kullanın.
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <div class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
          Bakiye: ${{ userStore.userBalance.toFixed(2) }}
        </div>
      </div>
    </div>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <BetCard
        v-for="bet in availableBets"
        :key="bet.id"
        v-bind="bet"
        @bet-placed="handleBetPlaced"
      />
    </div>

    <!-- Boş durum -->
    <div v-if="availableBets.length === 0" class="mt-8 text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Mevcut bahis yok</h3>
      <p class="mt-1 text-sm text-gray-500">Yeni bahis fırsatları için daha sonra tekrar kontrol edin.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'
import { useSupabase } from '~/composables/useSupabase'

interface Bet {
  id: string
  title: string
  description: string
  odds: number
  status: 'active' | 'completed' | 'cancelled'
}
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

// Check if the user is authenticated
if (!userStore.isAuthenticated) {
  router.push('/auth')
}

// Mock data for available bets
const availableBets = ref<Bet[]>([
  {
    id: '1',
    title: 'Lakers vs Warriors',
    description: 'NBA Regular Season Game - Lakers to win against Warriors',
    odds: 1.95,
    status: 'active'
  },
  {
    id: '2',
    title: 'Manchester City vs Liverpool',
    description: 'Premier League Match - Manchester City to score in both halves',
    odds: 2.10,
    status: 'active'
  },
  {
    id: '3',
    title: 'Chiefs vs Bills',
    description: 'NFL Regular Season - Chiefs to win with +7.5 point spread',
    odds: 1.85,
    status: 'active'
  },
  {
    id: '4',
    title: 'Real Madrid vs Barcelona',
    description: 'La Liga Clasico - Total goals over 2.5',
    odds: 1.75,
    status: 'active'
  }
])

const handleBetPlaced = async ({ id, amount }: { id: string, amount: number }) => {
  try {
    // Check if user has sufficient balance
    if (amount > userStore.userBalance) {
      alert('Yetersiz bakiye')
      return
    }

    const bet = availableBets.value.find(b => b.id === id)
    if (!bet) return

    const { supabase } = useSupabase()

    // Create bet record
    const { error: betError } = await supabase
      .from('bets')
      .insert([
        {
          user_id: userStore.user?.id,
          title: bet.title,
          description: bet.description,
          amount: amount,
          odds: bet.odds,
          status: 'active'
        }
      ])

    if (betError) {
      throw betError
    }

    // Update user balance
    const success = await userStore.deductBalance(amount)
    if (!success) {
      throw new Error('Bakiye güncellenemedi')
    }

    // Update local bet status
    bet.status = 'completed'

    // Show success message
    alert('Bahis başarıyla oluşturuldu!')
  } catch (error) {
    console.error('Bahis oluşturma hatası:', error)
    alert('Bahis oluşturulamadı. Lütfen tekrar deneyin.')
  }
}
</script> 