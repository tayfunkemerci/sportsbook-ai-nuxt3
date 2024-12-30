<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 dark:text-white">Profil</h1>
      
      <!-- Kullanıcı Bilgileri -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 dark:text-white">Hesap Bilgileri</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">E-posta</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ userStore.user?.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mevcut Bakiye</label>
            <p class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">${{ userStore.currentBalance }}</p>
          </div>
        </div>
      </div>

      <!-- Bahis Geçmişi -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4 dark:text-white">Bahis Geçmişi</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bahis</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Miktar</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Oran</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durum</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarih</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="loading">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Yükleniyor...
                </td>
              </tr>
              <tr v-else-if="bets.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Henüz bahis oynanmamış
                </td>
              </tr>
              <tr v-for="bet in bets" :key="bet.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ bet.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  ${{ bet.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ bet.odds }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    bet.status === 'active' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    bet.status === 'won' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                    bet.status === 'lost' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  ]">
                    {{ bet.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ formatDate(bet.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bakiye Yükleme -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4 dark:text-white">Bakiye Yükle</h2>
        <div class="space-y-4">
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Yüklenecek Miktar ($)</label>
            <div class="mt-1">
              <input
                type="number"
                name="amount"
                id="amount"
                v-model="topupAmount"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="100"
                min="10"
                :disabled="loading"
              >
            </div>
          </div>

          <div class="flex gap-4">
            <button
              v-for="amount in quickAmounts"
              :key="amount"
              type="button"
              class="flex-1 rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="loading"
              @click="topupAmount = amount"
            >
              ${{ amount }}
            </button>
          </div>

          <button
            type="button"
            class="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            :disabled="!canTopup || loading"
            @click="handleTopup"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Bakiye Yükle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

definePageMeta({
  middleware: ['auth']
})

interface Bet {
  id: string
  title: string
  description: string
  amount: number
  odds: number
  status: string
  created_at: string
}

const userStore = useUserStore()
const topupAmount = ref(0)
const loading = ref(false)
const quickAmounts = [10, 50, 100, 500]
const bets = ref<Bet[]>([])

const canTopup = computed(() => {
  return topupAmount.value >= 10
})

const fetchBets = async () => {
  const { supabase } = useSupabase()
  loading.value = true
  
  try {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', userStore.user?.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    bets.value = data || []
  } catch (error) {
    console.error('Error fetching bets:', error)
  } finally {
    loading.value = false
  }
}

const handleTopup = async () => {
  if (!canTopup.value || loading.value) return

  loading.value = true
  try {
    const success = await userStore.addBalance(topupAmount.value)
    if (success) {
      topupAmount.value = 0
      // Başarılı mesajı gösterilebilir
    } else {
      throw new Error('Bakiye yükleme başarısız')
    }
  } catch (error) {
    console.error('Bakiye yükleme hatası:', error)
    // Hata mesajı gösterilebilir
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date)
}

onMounted(() => {
  fetchBets()
})
</script> 