<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          Sportsbook AI'ye Hoş Geldiniz
        </h1>
        <p class="mt-3 text-xl text-gray-500 dark:text-gray-400">
          Sanal bahisler yapın ve yapay zeka destekli tahminler alın
        </p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Hızlı Bahis Kartı -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Hızlı Bahis</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Bugünün en popüler etkinliklerine bahis yapın
            </p>
            <div class="mt-4">
              <button
                type="button"
                class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                @click="handleQuickBet"
              >
                Hızlı Bahis
              </button>
            </div>
          </div>
        </div>

        <!-- AI Tahminleri Kartı -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">AI Tahminleri</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Yapay zeka destekli akıllı tahminler alın
            </p>
            <div class="mt-4">
              <button
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Tahminleri Görüntüle
              </button>
            </div>
          </div>
        </div>

        <!-- Liderlik Tablosu Kartı -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Liderlik Tablosu</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Diğerleriyle nasıl sıralandığınızı görün
            </p>
            <div class="mt-4">
              <NuxtLink
                to="/leaderboard"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Sıralamaları Görüntüle
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

definePageMeta({
  layout: 'default'
})

const handleQuickBet = () => {
  if (!userStore.isAuthenticated) {
    // Redirect to auth page with callback to bets page
    router.push('/auth?callback=/bets')
    return
  }
  
  router.push('/bets')
}
</script> 