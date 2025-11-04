<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8 animate-fade-in">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p class="text-gray-600">Enter your email and we'll send you a link to reset your password</p>
      </div>

      <!-- Card -->
      <div class="card-large animate-slide-up">
        <Transition name="fade">
          <div v-if="isEmailSent" class="p-4 rounded-lg bg-green-50 border border-green-200 mb-6">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="text-sm font-semibold text-green-800">Check your email</h3>
                <p class="text-sm text-green-700 mt-1">We've sent a password reset link to <span class="font-medium">{{ formData.email }}</span></p>
              </div>
            </div>
          </div>
        </Transition>

        <form v-if="!isEmailSent" @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email -->
          <AppInput
            v-model="formData.email"
            type="email"
            label="Email Address"
            placeholder="your@example.com"
            :error="errors.email"
            required
            @blur="validateField('email')"
          />

          <!-- Error Message -->
          <Transition name="fade">
            <div v-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>
          </Transition>

          <!-- Submit Button -->
          <AppButton
            label="Send Reset Link"
            type="submit"
            variant="primary"
            size="lg"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full"
          />
        </form>

        <!-- Back to Sign In Link -->
        <div class="mt-6 text-center">
          <router-link
            to="/auth/signin"
            class="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Sign In
          </router-link>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-xs text-gray-500">
        Remember your password?
        <router-link to="/auth/signin" class="font-medium text-blue-600 hover:text-blue-700">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '@/components/Common/AppInput.vue'
import AppButton from '@/components/Common/AppButton.vue'

interface FormData {
  email: string
}

const router = useRouter()
const formData = reactive<FormData>({
  email: '',
})

const errors = ref<Partial<Record<keyof FormData, string>>>({})
const isLoading = ref(false)
const error = ref<string | null>(null)
const isEmailSent = ref(false)

/**
 * Validate a single field
 */
function validateField(field: keyof FormData): void {
  errors.value[field] = ''

  switch (field) {
    case 'email':
      if (!formData.email) {
        errors.value.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.value.email = 'Please enter a valid email'
      }
      break
  }
}

/**
 * Handle form submission
 */
async function handleSubmit(): Promise<void> {
  error.value = null
  validateField('email')

  if (errors.value.email) {
    return
  }

  isLoading.value = true

  try {
    // TODO: Replace with actual GraphQL mutation
    // This will call the backend to send a password reset email
    await new Promise((resolve) => setTimeout(resolve, 1500))

    isEmailSent.value = true

    // Optionally redirect after a delay
    setTimeout(() => {
      router.push({ name: 'signin' })
    }, 5000)
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Failed to send reset email. Please try again.'
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
