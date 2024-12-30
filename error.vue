<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
    <div class="max-w-md w-full text-center">
      <h1 class="text-9xl font-bold text-gray-900 dark:text-white">
        {{ error?.statusCode || '404' }}
      </h1>
      <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">
        {{ error?.message || 'Page not found' }}
      </p>
      <div class="mt-8">
        <button
          @click="handleError"
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Back to home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const error = useError()

const handleError = () => {
  clearError()
  navigateTo('/')
}
</script> 