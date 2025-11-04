import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apolloClient } from '@/apollo'
import { SIGN_UP_MUTATION, SIGN_IN_MUTATION } from '@/lib/gql/auth'

export interface User {
  id: string
  name: string
  email: string
  role: 'merchant' | 'customer' | 'admin'
  avatar?: string
  fullName?: string
}

export interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface SignInData {
  email: string
  password: string
  rememberMe?: boolean
}

interface MerchantResponse {
  id: string
  name: string
  email: string
  fullName?: string
  role: string
}

interface SignUpResponse {
  signUp: {
    merchant: MerchantResponse | null
    token: string | null
    errors: string[]
  }
}

interface SignInResponse {
  signIn: {
    merchant: MerchantResponse | null
    token: string | null
    errors: string[]
  }
}

/**
 * Authentication Store
 * Manages user authentication state and operations
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('authToken') || null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const fullName = computed(() => {
    if (!user.value) return ''
    return user.value.name
  })

  // Actions
  /**
   * Sign up a new user
   */
  async function signUp(data: SignUpData): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // Validate input
      if (!data.firstName.trim()) throw new Error('First name is required')
      if (!data.lastName.trim()) throw new Error('Last name is required')
      if (!data.email.includes('@')) throw new Error('Valid email is required')
      if (data.password.length < 8) throw new Error('Password must be at least 8 characters')
      if (data.password !== data.confirmPassword) throw new Error('Passwords do not match')
      if (!data.acceptTerms) throw new Error('You must accept the terms and conditions')

      // Call GraphQL mutation
      const response = await apolloClient.mutate<SignUpResponse>({
        mutation: SIGN_UP_MUTATION,
        variables: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
      })

      const { merchant, token: newToken, errors } = response.data!.signUp

      if (errors && errors.length > 0) {
        throw new Error(errors[0])
      }

      if (!merchant || !newToken) {
        throw new Error('Sign up failed')
      }

      // Update state
      token.value = newToken
      user.value = {
        id: merchant.id,
        name: merchant.name,
        email: merchant.email,
        role: merchant.role.toLowerCase() as 'merchant' | 'admin' | 'customer',
        fullName: merchant.fullName || merchant.name,
      }

      // Persist token
      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign up failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sign in with email and password
   */
  async function signIn(data: SignInData): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // Validate input
      if (!data.email.includes('@')) throw new Error('Valid email is required')
      if (!data.password) throw new Error('Password is required')

      // Call GraphQL mutation
      const response = await apolloClient.mutate<SignInResponse>({
        mutation: SIGN_IN_MUTATION,
        variables: {
          email: data.email,
          password: data.password,
        },
      })

      const { merchant, token: newToken, errors } = response.data!.signIn

      if (errors && errors.length > 0) {
        throw new Error(errors[0])
      }

      if (!merchant || !newToken) {
        throw new Error('Sign in failed')
      }

      // Update state
      token.value = newToken
      user.value = {
        id: merchant.id,
        name: merchant.name,
        email: merchant.email,
        role: merchant.role.toLowerCase() as 'merchant' | 'admin' | 'customer',
        fullName: merchant.fullName || merchant.name,
      }

      // Persist token and user
      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(user.value))

      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign in failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sign out the current user
   */
  async function signOut(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      token.value = null
      user.value = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Sign out failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Restore session from localStorage
   */
  function restoreSession(): void {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
  }

  /**
   * Clear any authentication errors
   */
  function clearError(): void {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    fullName,

    // Actions
    signUp,
    signIn,
    signOut,
    restoreSession,
    clearError,
  }
})
