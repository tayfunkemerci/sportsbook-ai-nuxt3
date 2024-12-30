<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal panel -->
      <div class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
        <div class="absolute right-0 top-0 pr-4 pt-4">
          <button
            type="button"
            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="$emit('close')"
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="sm:flex sm:items-start">
          <div class="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 class="text-xl font-semibold leading-6 text-gray-900">
              AI Prediction
            </h3>
            
            <div class="mt-4">
              <h4 class="font-medium text-gray-900">{{ title }}</h4>
              <p class="mt-1 text-sm text-gray-500">{{ description }}</p>
            </div>

            <div class="mt-4">
              <div v-if="loading" class="flex justify-center py-4">
                <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>

              <div v-else-if="prediction" class="rounded-lg bg-gray-50 p-4">
                <div v-if="prediction.includes('confidence')" class="space-y-3">
                  <!-- Main prediction -->
                  <div class="text-lg font-medium text-gray-900">
                    {{ extractMainPrediction(prediction) }}
                  </div>

                  <!-- Confidence level -->
                  <div class="flex items-center gap-2">
                    <div class="text-sm font-medium text-gray-700">Confidence Level:</div>
                    <div 
                      class="rounded-full px-2 py-1 text-sm font-medium"
                      :class="getConfidenceClass(extractConfidence(prediction))"
                    >
                      {{ extractConfidence(prediction) }}%
                    </div>
                  </div>

                  <!-- Analysis -->
                  <div class="mt-4 space-y-4">
                    <div class="text-sm font-medium text-gray-700">Analysis:</div>
                    
                    <!-- Historical Analysis -->
                    <div v-if="historicalFactors" class="rounded-lg bg-white p-3">
                      <div class="font-medium text-gray-700">Historical Factors:</div>
                      <div class="mt-1 text-sm text-gray-600" v-html="formatAnalysis(historicalFactors)"></div>
                    </div>

                    <!-- Current Form Analysis -->
                    <div v-if="currentFactors" class="rounded-lg bg-white p-3">
                      <div class="font-medium text-gray-700">Current Form:</div>
                      <div class="mt-1 text-sm text-gray-600" v-html="formatAnalysis(currentFactors)"></div>
                    </div>

                    <!-- Match Analysis -->
                    <div v-if="analysisFactors" class="rounded-lg bg-white p-3">
                      <div class="font-medium text-gray-700">Match Analysis:</div>
                      <div class="mt-1 text-sm text-gray-600" v-html="formatAnalysis(analysisFactors)"></div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-gray-600">
                  {{ prediction }}
                </div>
              </div>
              <div v-else class="text-center text-gray-500">
                No prediction available
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            @click="$emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean
  title: string
  description: string
  prediction: string | null
  loading: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const extractMainPrediction = (text: string) => {
  const endIndex = text.indexOf(' with ')
  return endIndex > -1 ? text.substring(0, endIndex) : text
}

const extractConfidence = (text: string) => {
  const match = text.match(/(\d+)% confidence/)
  return match ? parseInt(match[1]) : 0
}

const historicalFactors = computed(() => {
  if (!props.prediction) return ''
  const match = props.prediction.match(/Historical: ([^]*?)(?=Current Form:|$)/)
  return match ? match[1].trim() : ''
})

const currentFactors = computed(() => {
  if (!props.prediction) return ''
  const match = props.prediction.match(/Current Form: ([^]*?)(?=Analysis:|$)/)
  return match ? match[1].trim() : ''
})

const analysisFactors = computed(() => {
  if (!props.prediction) return ''
  const match = props.prediction.match(/Analysis: ([^]*?)(?=\n|$)/)
  return match ? match[1].trim() : ''
})

const formatAnalysis = (text: string) => {
  // Önemli kelimeleri bold yap
  const keywords = [
    'win', 'loss', 'draw', 'victory', 'defeat',
    'goals', 'scored', 'conceded',
    'home', 'away', 'record',
    'form', 'performance', 'streak',
    'injured', 'injury', 'available',
    'attack', 'defense', 'midfield',
    'strong', 'weak', 'consistent',
    'advantage', 'disadvantage',
    'history', 'trend', 'pattern'
  ]

  let formattedText = text
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    formattedText = formattedText.replace(regex, `<b>$&</b>`)
  })

  return formattedText
}

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 80) return 'bg-green-100 text-green-800'
  if (confidence >= 60) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
</script> 