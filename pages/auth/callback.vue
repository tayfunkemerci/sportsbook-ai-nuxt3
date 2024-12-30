<template>
  <div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Verifying your email...
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { useSupabase } from '~/composables/useSupabase'

const userStore = useUserStore()
const { supabase } = useSupabase()
const router = useRouter()
const route = useRoute()

// Handle the OAuth callback
onMounted(async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    if (session?.user) {
      userStore.setUser({
        id: session.user.id,
        email: session.user.email || '',
        balance: session.user.user_metadata.balance || 1000
      })

      // Check for callback URL in route query
      const callback = route.query.callback as string
      if (callback) {
        await router.push(callback)
      } else {
        await router.push('/')
      }
    } else {
      await router.push('/auth')
    }
  } catch (error) {
    console.error('Error in auth callback:', error)
    await router.push('/auth')
  }
})
</script> 