import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()

  // Korumalı rotalar
  const protectedRoutes = ['/profile', '/bets']

  // Eğer korumalı bir sayfaya erişmeye çalışıyorsa ve giriş yapmamışsa
  if (protectedRoutes.includes(to.path)) {
    if (!userStore.isAuthenticated) {
      return navigateTo({
        path: '/auth',
        query: { callback: to.fullPath }
      })
    }
  }

  // Eğer auth sayfasına erişmeye çalışıyorsa ve giriş yapmışsa
  if (to.path === '/auth' && userStore.isAuthenticated) {
    return navigateTo('/')
  }
}) 