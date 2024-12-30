<template>
  <header class="bg-white dark:bg-gray-800 shadow">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="flex h-16 items-center justify-between">
        <!-- Sol taraf: Logo ve menü -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
            Sportsbook AI
          </NuxtLink>
          <div class="ml-10 hidden space-x-8 lg:block">
            <NuxtLink
              v-for="link in navigation"
              :key="link.name"
              :to="link.href"
              class="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {{ link.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Sağ taraf: Bakiye, Dark Mode ve Profil -->
        <div class="flex items-center space-x-6">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            :title="isDark ? 'Light Mode' : 'Dark Mode'"
          >
            <svg
              v-if="isDark"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <!-- Bakiye (Giriş yapmışsa) -->
          <div v-if="userStore.isAuthenticated" class="flex items-center space-x-4">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              ${{ userStore.currentBalance }}
            </div>

            <!-- Profil Dropdown -->
            <div class="relative">
              <button
                @click="showProfileMenu = !showProfileMenu"
                class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
              >
                <span class="sr-only">Open user menu</span>
                <svg
                  class="h-8 w-8 rounded-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showProfileMenu"
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                  @click="showProfileMenu = false"
                >
                  Profilim
                </NuxtLink>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          <!-- Giriş Yap (Giriş yapmamışsa) -->
          <div v-else>
            <NuxtLink
              to="/auth"
              class="inline-block rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
            >
              Giriş Yap
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Mobil menü -->
      <div class="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
        <NuxtLink
          v-for="link in navigation"
          :key="link.name"
          :to="link.href"
          class="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          {{ link.name }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const showProfileMenu = ref(false)
const isDark = ref(false)

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Bahisler', href: '/bets' },
  { name: 'Sıralama', href: '/leaderboard' }
]

// Dark mode toggle
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  // Local storage'a kaydet
  localStorage.setItem('darkMode', isDark.value ? 'dark' : 'light')
}

// Dark mode tercihini yükle
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  isDark.value = savedMode === 'dark'
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})

const handleLogout = async () => {
  const { supabase } = useSupabase()
  await supabase.auth.signOut()
  userStore.logout()
  showProfileMenu.value = false
  navigateTo('/auth')
}
</script> 