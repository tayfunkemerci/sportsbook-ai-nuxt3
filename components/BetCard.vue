<template>
  <div class="overflow-hidden rounded-lg bg-white shadow">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <span 
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
          :class="statusClass"
        >
          {{ status }}
        </span>
      </div>
      
      <p class="mt-2 text-sm text-gray-500">
        {{ description }}
      </p>

      <div class="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <span class="text-sm font-medium text-gray-500">Odds</span>
          <p class="mt-1 text-lg font-semibold text-gray-900">{{ odds }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Potential Win</span>
          <p class="mt-1 text-lg font-semibold text-gray-900">${{ calculatePotentialWin }}</p>
        </div>
      </div>

      <div class="mt-4">
        <label for="amount" class="block text-sm font-medium text-gray-700">Bet Amount</label>
        <div class="mt-1 flex rounded-md shadow-sm">
          <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            $
          </span>
          <input
            type="number"
            name="amount"
            id="amount"
            v-model="betAmount"
            class="block w-full min-w-0 flex-1 border rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="5.00"
            min="5"
            :disabled="!isActive"
          >
        </div>
      </div>

      <div class="mt-6 flex flex-col gap-3">
        <button
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!canPlaceBet"
          @click="placeBet"
        >
          Place Bet
        </button>

        <button
          type="button"
          class="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!isActive"
          @click="viewPrediction"
        >
          <svg class="-ml-0.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
          </svg>
          View Prediction
        </button>
      </div>
    </div>

    <PredictionModal
      :show="showPrediction"
      :title="title"
      :description="description"
      :prediction="prediction"
      :loading="loadingPrediction"
      @close="showPrediction = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '~/stores/user'

const props = defineProps<{
  id: string
  title: string
  description: string
  odds: number
  status: 'active' | 'completed' | 'cancelled'
}>()

const emit = defineEmits<{
  (e: 'bet-placed', data: { id: string, amount: number }): void
}>()

const userStore = useUserStore()
const betAmount = ref(0)
const showPrediction = ref(false)
const prediction = ref<string | null>(null)
const loadingPrediction = ref(false)
const placingBet = ref(false)

const isActive = computed(() => props.status === 'active')

const hasEnoughBalance = computed(() => {
  return userStore.currentBalance >= betAmount.value
})

const canPlaceBet = computed(() => {
  return isActive.value && betAmount.value >= 5 && hasEnoughBalance.value && !placingBet.value
})

const placeBet = async () => {
  if (canPlaceBet.value) {
    placingBet.value = true
    try {
      const success = await userStore.deductBalance(betAmount.value)
      if (success) {
        emit('bet-placed', {
          id: props.id,
          amount: betAmount.value
        })
        betAmount.value = 0
      } else {
        throw new Error('Failed to place bet')
      }
    } catch (error) {
      console.error('Failed to place bet:', error)
      // Burada kullanıcıya hata mesajı gösterilebilir
    } finally {
      placingBet.value = false
    }
  }
}

const statusClass = computed(() => {
  switch (props.status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800'
    default:
      return ''
  }
})

const calculatePotentialWin = computed(() => {
  return (betAmount.value * props.odds).toFixed(2)
})

const viewPrediction = async () => {
  if (!isActive.value) return

  showPrediction.value = true
  
  if (!prediction.value) {
    loadingPrediction.value = true
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: props.title,
          description: props.description
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get prediction')
      }

      prediction.value = data.prediction
    } catch (error: any) {
      console.error('Failed to get prediction:', error)
      prediction.value = error?.message || 'Failed to get prediction. Please try again.'
    } finally {
      loadingPrediction.value = false
    }
  }
}
</script> 