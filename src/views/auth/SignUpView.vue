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
      <div class="text-center mb-16">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white">Create your account</h1>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSignUp" class="space-y-7">
        <!-- Name Fields Row -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-white mb-2.5">
              First Name
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              autocomplete="given-name"
              placeholder="John"
              required
              class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
              @blur="validateField('firstName')"
            />
            <p v-if="errors.firstName" class="mt-2 text-sm text-red-400">{{ errors.firstName }}</p>
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-white mb-2.5">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              autocomplete="family-name"
              placeholder="Doe"
              required
              class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
              @blur="validateField('lastName')"
            />
            <p v-if="errors.lastName" class="mt-2 text-sm text-red-400">{{ errors.lastName }}</p>
          </div>
        </div>

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
            placeholder="john@example.com"
            required
            class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
            @blur="validateField('email')"
          />
          <p v-if="errors.email" class="mt-2 text-sm text-red-400">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-white mb-2.5">
            Password
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••"
            required
            class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
            @blur="validateField('password')"
          />
          <p v-if="errors.password" class="mt-2 text-sm text-red-400">{{ errors.password }}</p>
          <p class="mt-1 text-xs text-slate-400">Must be at least 8 characters</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-white mb-2.5">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••"
            required
            class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
            @blur="validateField('confirmPassword')"
          />
          <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-400">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Terms Checkbox -->
        <label class="flex items-start space-x-3 cursor-pointer group">
          <input
            v-model="formData.acceptTerms"
            type="checkbox"
            class="w-4 h-4 mt-1 rounded border-slate-600 bg-white/5 text-blue-500 cursor-pointer accent-blue-500 focus:ring-blue-500 transition-all hover:border-slate-500"
          />
          <span class="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
            I agree to the
            <router-link to="#" class="text-blue-400 hover:text-blue-300 font-medium">
              Terms & Conditions
            </router-link>
            and
            <router-link to="#" class="text-blue-400 hover:text-blue-300 font-medium">
              Privacy Policy
            </router-link>
          </span>
        </label>
        <p v-if="errors.acceptTerms" class="mt-2 text-sm text-red-400">{{ errors.acceptTerms }}</p>

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
          class="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center mt-8"
        >
          <svg v-if="authStore.isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ authStore.isLoading ? 'Creating account...' : 'Create account' }}</span>
        </button>
      </form>

      <!-- Sign In Link -->
      <p class="mt-6 text-center text-sm text-slate-400">
        Already have an account?
        <router-link to="/auth/signin" class="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, type SignUpData } from '@/stores/auth'
import AppInput from '@/components/Common/AppInput.vue'
import AppButton from '@/components/Common/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive<SignUpData>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const errors = ref<Partial<Record<keyof SignUpData, string>>>({})

/**
 * Validate a single field
 */
function validateField(field: keyof SignUpData): void {
  errors.value[field] = ''

  switch (field) {
    case 'firstName':
      if (!formData.firstName.trim()) {
        errors.value.firstName = 'First name is required'
      }
      break
    case 'lastName':
      if (!formData.lastName.trim()) {
        errors.value.lastName = 'Last name is required'
      }
      break
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
      } else if (formData.password.length < 8) {
        errors.value.password = 'Password must be at least 8 characters'
      }
      break
    case 'confirmPassword':
      if (!formData.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password'
      } else if (formData.confirmPassword !== formData.password) {
        errors.value.confirmPassword = 'Passwords do not match'
      }
      break
    case 'acceptTerms':
      if (!formData.acceptTerms) {
        errors.value.acceptTerms = 'You must accept the terms and conditions'
      }
      break
  }
}

/**
 * Validate all fields and submit
 */
async function handleSignUp(): Promise<void> {
  authStore.clearError()

  // Validate all fields
  Object.keys(formData).forEach((field) => {
    validateField(field as keyof SignUpData)
  })

  // Check if there are any errors
  if (Object.values(errors.value).some((error) => error)) {
    return
  }

  try {
    await authStore.signUp(formData)
    // Redirect to dashboard after successful sign up
    router.push({ name: 'dashboard' })
  } catch {
    // Error is already set in the store
  }
}
</script>

<style scoped>
.divider {
  position: relative;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
}

.divider span {
  padding: 0 1rem;
  font-size: 0.875rem;
  color: #9ca3af;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
