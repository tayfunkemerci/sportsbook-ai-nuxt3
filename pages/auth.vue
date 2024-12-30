<template>
  <div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        {{ isLogin ? 'Hesabınıza giriş yapın' : 'Yeni bir hesap oluşturun' }}
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-posta adresi</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                :class="[errors.email ? 'border-red-500' : '']"
                @input="validateEmail"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>
          </div>

          <div v-if="!isOtp">
            <label for="password" class="block text-sm font-medium text-gray-700">Şifre</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                :class="[errors.password ? 'border-red-500' : '']"
                @input="validatePassword"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
            </div>
          </div>

          <div v-if="isOtp">
            <label for="otp" class="block text-sm font-medium text-gray-700">Tek Kullanımlık Şifre</label>
            <div class="mt-1">
              <input
                id="otp"
                v-model="form.otp"
                name="otp"
                type="text"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="E-postanıza gönderilen kodu girin"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <svg
                v-if="loading"
                class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ buttonText }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Veya devam edin</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              class="flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              @click="toggleOtp"
            >
              {{ isOtp ? 'Şifre Kullan' : 'Sihirli Bağlantı Kullan' }}
            </button>
          </div>

          <div class="mt-6 text-center">
            <button
              type="button"
              class="text-sm font-medium text-blue-600 hover:text-blue-500"
              @click="toggleMode"
            >
              {{ isLogin ? 'Yeni bir hesap oluşturun' : 'Mevcut hesaba giriş yapın' }}
            </button>
          </div>
        </div>

        <!-- Hata mesajı -->
        <div v-if="authError" class="mt-4">
          <p class="text-sm text-red-500">{{ authError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import { useSupabase } from '~/composables/useSupabase'

const userStore = useUserStore()
const { supabase } = useSupabase()
const router = useRouter()
const route = useRoute()

const isLogin = ref(true)
const isOtp = ref(false)
const loading = ref(false)
const authError = ref('')

const form = reactive({
  email: '',
  password: '',
  otp: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const buttonText = computed(() => {
  if (loading.value) return 'Processing...'
  if (isOtp.value) return 'Send Magic Link'
  return isLogin.value ? 'Giriş Yap' : 'Üye ol'
})

const isFormValid = computed(() => {
  if (isOtp.value) {
    return !errors.email && form.email
  }
  return !errors.email && !errors.password && form.email && form.password
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  } else {
    errors.password = ''
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  isOtp.value = false
  authError.value = ''
  form.otp = ''
}

const toggleOtp = () => {
  isOtp.value = !isOtp.value
  authError.value = ''
  form.otp = ''
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  authError.value = ''

  try {
    if (isOtp.value) {
      const { error } = await supabase.auth.signInWithOtp({
        email: form.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      // Show success message and redirect to verification page
      router.push('/verify')
    } else if (isLogin.value) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })

      if (error) throw error

      if (data.user) {
        userStore.setUser({
          id: data.user.id,
          email: data.user.email || '',
          balance: 1000
        })
        
        // Check for callback URL in route query
        const callback = route.query.callback as string
        if (callback) {
          router.push(callback)
        } else {
          router.push('/')
        }
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            balance: 1000
          }
        }
      })

      if (error) throw error

      if (data.user && data.user.identities?.length === 0) {
        authError.value = 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.'
        return
      }

      // Redirect to verification page
      router.push('/verify')
    }
  } catch (error: any) {
    console.error('Authentication error:', error)
    authError.value = error.message || 'Kimlik doğrulama sırasında bir hata oluştu'
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  if (userStore.isAuthenticated) {
    const callback = route.query.callback as string
    if (callback) {
      router.push(callback)
    } else {
      router.push('/')
    }
  }
})
</script> 