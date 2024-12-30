<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-xl font-bold text-gray-800 dark:text-white">Sportsbook AI</span>
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="userStore.isAuthenticated">
              <NuxtLink to="/bets" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">Bets</NuxtLink>
              <NuxtLink to="/leaderboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">Leaderboard</NuxtLink>
              <NuxtLink to="/profile" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">Profile</NuxtLink>
              <button
                @click="handleLogout"
                class="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/auth"
                class="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign In
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>

    <footer class="bg-white dark:bg-gray-800 shadow-lg mt-8">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 dark:text-gray-400">© 2024 Sportsbook AI. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useSupabase } from '~/composables/useSupabase'
import { onMounted } from 'vue'

const userStore = useUserStore()
const { supabase } = useSupabase()
const router = useRouter()

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    userStore.clearUser()
    router.push('/auth')
  } catch (error: any) {
    console.error('Error logging out:', error.message)
  }
}

onMounted(async () => {
  if (userStore.isAuthenticated) {
    await userStore.fetchBalance()
  }
})
</script> 