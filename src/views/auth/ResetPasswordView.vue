<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8 animate-fade-in">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p class="text-gray-600">Enter your new password below</p>
      </div>

      <!-- Card -->
      <div class="card-large animate-slide-up">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- New Password -->
          <div class="form-group">
            <label class="form-label">New Password</label>
            <div class="relative">
              <AppInput
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :error="errors.password"
                required
                @blur="validateField('password')"
              />
              <button
                type="button"
                class="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L3.596 3.039m10.318 10.318L3.039 3.596" />
                </svg>
              </button>
            </div>
            <p v-if="formData.password" class="mt-2 text-sm" :class="passwordStrength.class">
              {{ passwordStrength.label }}
            </p>
          </div>

          <!-- Confirm Password -->
          <AppInput
            v-model="formData.confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            :error="errors.confirmPassword"
            required
            @blur="validateField('confirmPassword')"
          />

          <!-- Password Requirements -->
          <div class="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p class="text-sm font-semibold text-gray-700 mb-3">Password Requirements:</p>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 text-sm">
                <svg :class="['w-4 h-4', isPasswordValid('length') ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span :class="isPasswordValid('length') ? 'text-gray-700' : 'text-gray-500'">
                  At least 8 characters
                </span>
              </li>
              <li class="flex items-center gap-2 text-sm">
                <svg :class="['w-4 h-4', isPasswordValid('uppercase') ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span :class="isPasswordValid('uppercase') ? 'text-gray-700' : 'text-gray-500'">
                  One uppercase letter
                </span>
              </li>
              <li class="flex items-center gap-2 text-sm">
                <svg :class="['w-4 h-4', isPasswordValid('number') ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span :class="isPasswordValid('number') ? 'text-gray-700' : 'text-gray-500'">
                  One number
                </span>
              </li>
            </ul>
          </div>

          <!-- Error Message -->
          <Transition name="fade">
            <div v-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>
          </Transition>

          <!-- Submit Button -->
          <AppButton
            label="Reset Password"
            type="submit"
            variant="primary"
            size="lg"
            :loading="isLoading"
            :disabled="isLoading || !isFormValid"
            class="w-full"
          />
        </form>

        <!-- Back Link -->
        <p class="mt-6 text-center">
          <router-link to="/auth/signin" class="text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Back to Sign In
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppInput from '@/components/Common/AppInput.vue'
import AppButton from '@/components/Common/AppButton.vue'

interface FormData {
  password: string
  confirmPassword: string
}

const router = useRouter()
const route = useRoute()

const formData = reactive<FormData>({
  password: '',
  confirmPassword: '',
})

const errors = ref<Partial<Record<keyof FormData, string>>>({})
const isLoading = ref(false)
const error = ref<string | null>(null)
const showPassword = ref(false)

/**
 * Password strength requirements
 */
const passwordStrength = computed(() => {
  const password = formData.password
  let strength = 0

  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++

  const levels = [
    { label: 'Very weak', class: 'text-red-600' },
    { label: 'Weak', class: 'text-orange-600' },
    { label: 'Good', class: 'text-yellow-600' },
    { label: 'Strong', class: 'text-green-600' },
  ]

  return levels[strength] || levels[0]
})

/**
 * Check if password meets a specific requirement
 */
function isPasswordValid(requirement: 'length' | 'uppercase' | 'number'): boolean {
  const password = formData.password

  switch (requirement) {
    case 'length':
      return password.length >= 8
    case 'uppercase':
      return /[A-Z]/.test(password)
    case 'number':
      return /[0-9]/.test(password)
  }
}

/**
 * Check if form is valid and can be submitted
 */
const isFormValid = computed(() => {
  return (
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    isPasswordValid('length') &&
    isPasswordValid('uppercase') &&
    isPasswordValid('number') &&
    formData.password === formData.confirmPassword &&
    !Object.values(errors.value).some((error) => error)
  )
})

/**
 * Validate a single field
 */
function validateField(field: keyof FormData): void {
  errors.value[field] = ''

  switch (field) {
    case 'password':
      if (!formData.password) {
        errors.value.password = 'Password is required'
      } else if (!isPasswordValid('length') || !isPasswordValid('uppercase') || !isPasswordValid('number')) {
        errors.value.password = 'Password does not meet requirements'
      }
      break
    case 'confirmPassword':
      if (!formData.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match'
      }
      break
  }
}

/**
 * Handle form submission
 */
async function handleSubmit(): Promise<void> {
  error.value = null
  validateField('password')
  validateField('confirmPassword')

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
  const token = route.params.token as string

  try {
    // TODO: Replace with actual GraphQL mutation to reset password
    // Call backend with token and new password
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to signin
    router.push({
      name: 'signin',
      query: { message: 'Password reset successfully. Please sign in.' },
    })
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Failed to reset password. Please try again.'
  } finally {
    isLoading.value = false
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
