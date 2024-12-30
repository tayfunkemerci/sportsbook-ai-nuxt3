<template>
  <div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Check your email
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        We sent you a verification link. Please check your email and click the link to verify your account.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <div class="space-y-6">
          <div>
            <button
              type="button"
              :disabled="loading"
              class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              @click="resendEmail"
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
              Resend verification email
            </button>
          </div>

          <div class="text-center">
            <button
              type="button"
              class="text-sm font-medium text-blue-600 hover:text-blue-500"
              @click="router.push('/auth')"
            >
              Return to sign in
            </button>
          </div>
        </div>

        <!-- Success/Error message -->
        <div v-if="message" class="mt-4">
          <p :class="[
            'text-sm',
            messageType === 'success' ? 'text-green-500' : 'text-red-500'
          ]">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const { supabase } = useSupabase()
const router = useRouter()

const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const resendEmail = async () => {
  if (loading.value) return

  loading.value = true
  message.value = ''

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user?.email) throw new Error('No email found')

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error

    messageType.value = 'success'
    message.value = 'Verification email has been sent!'
  } catch (error: any) {
    console.error('Failed to resend email:', error)
    messageType.value = 'error'
    message.value = error.message || 'Failed to resend verification email'
  } finally {
    loading.value = false
  }
}
</script> 