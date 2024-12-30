import { useUserStore } from '~/stores/user'
import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  const { supabase } = useSupabase()

  // İlk oturumu al
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Oturum alınırken hata oluştu:', error.message)
    return
  }

  if (session?.user) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', session.user.id)
      .single()

    // Kullanıcı users tablosunda yoksa, başlangıç bakiyesi ile oluştur
    if (!userData) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          { 
            id: session.user.id,
            email: session.user.email,
            balance: 1000 
          }
        ])
        .select()
        .single()

      userStore.setUser({
        id: session.user.id,
        email: session.user.email ?? '',
        balance: 1000
      })
    } else {
      userStore.setUser({
        id: session.user.id,
        email: session.user.email ?? '',
        balance: userData.balance
      })
    }
  }

  // Kimlik doğrulama durumu değişikliklerini dinle
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', session.user.id)
        .single()

      // Kullanıcı users tablosunda yoksa, başlangıç bakiyesi ile oluştur
      if (!userData) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            { 
              id: session.user.id,
              email: session.user.email,
              balance: 1000 
            }
          ])
          .select()
          .single()

        userStore.setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          balance: 1000
        })
      } else {
        userStore.setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          balance: userData.balance
        })
      }
    } else {
      userStore.logout()
    }
  })
}) 