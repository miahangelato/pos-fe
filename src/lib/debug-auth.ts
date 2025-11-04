// Add this to the script setup section to debug
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Log current user
console.log('Current user:', {
  id: authStore.user?.id,
  email: authStore.user?.email,
  role: authStore.user?.role,
  name: authStore.user?.name,
  isAuthenticated: authStore.isAuthenticated
})

// Log the token
console.log('Auth token:', localStorage.getItem('authToken')?.substring(0, 50) + '...')
