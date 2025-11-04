<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex flex-col items-center justify-center px-4 py-8">
    <!-- Animated gradient background -->
    <div class="absolute inset-0 overflow-hidden -z-10">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <!-- Main container -->
    <div class="w-full max-w-sm">
      <!-- Header Section -->
      <div class="text-center mb-10">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white">Sign in to your account</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSignIn" class="space-y-5">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-white mb-2.5">
            Email address
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
            class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
            @blur="validateField('email')"
          />
          <p v-if="errors.email" class="mt-2 text-sm text-red-400">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-white mb-2.5">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Enter your password"
              required
              class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 pr-12 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
              @blur="validateField('password')"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors focus:outline-none"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.596" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-2 text-sm text-red-400">{{ errors.password }}</p>
        </div>

        <!-- Error Message -->
        <Transition name="fade">
          <div v-if="authStore.error" class="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <p class="text-sm text-red-300">{{ authStore.error }}</p>
            </div>
          </div>
        </Transition>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center mt-6"
        >
          <svg v-if="authStore.isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}</span>
        </button>
      </form>

      <!-- Sign Up Link -->
      <p class="mt-6 text-center text-sm text-slate-400">
        Not a member?
        <router-link to="/auth/signup" class="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          Sign up now.
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, type SignInData } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)

const formData = reactive<SignInData>({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = ref<Partial<Record<keyof SignInData, string>>>({})

function validateField(field: keyof SignInData): void {
  errors.value[field] = ''

  switch (field) {
    case 'email':
      if (!formData.email) {
        errors.value.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.value.email = 'Please enter a valid email'
      }
      break
    case 'password':
      if (!formData.password) {
        errors.value.password = 'Password is required'
      }
      break
  }
}

async function handleSignIn(): Promise<void> {
  authStore.clearError()

  Object.keys(formData).forEach((field) => {
    if (field !== 'rememberMe') {
      validateField(field as keyof SignInData)
    }
  })

  if (Object.values(errors.value).some((error) => error)) {
    return
  }

  try {
    await authStore.signIn(formData)
    router.push({ name: 'dashboard' })
  } catch {
    // Error is already set in the store
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
