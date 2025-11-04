<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8 animate-fade-in">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
             :class="verificationStatus === 'verifying' ? 'bg-blue-100' : verificationStatus === 'success' ? 'bg-green-100' : 'bg-red-100'">
          <svg v-if="verificationStatus === 'verifying'" class="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else-if="verificationStatus === 'success'" class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 v-if="verificationStatus === 'verifying'" class="text-3xl font-bold text-gray-900 mb-2">Verifying Email</h1>
        <h1 v-else-if="verificationStatus === 'success'" class="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
        <h1 v-else class="text-3xl font-bold text-gray-900 mb-2">Verification Failed</h1>

        <p v-if="verificationStatus === 'verifying'" class="text-gray-600">Please wait while we verify your email address...</p>
        <p v-else-if="verificationStatus === 'success'" class="text-gray-600">Your email has been successfully verified. You can now sign in.</p>
        <p v-else class="text-gray-600">We couldn't verify your email. The link may have expired.</p>
      </div>

      <!-- Card -->
      <div class="card-large animate-slide-up">
        <div v-if="verificationStatus === 'success'" class="space-y-6">
          <div class="p-4 rounded-lg bg-green-50 border border-green-200">
            <p class="text-sm text-green-700">
              Your email address has been verified successfully. You can now sign in with your credentials.
            </p>
          </div>

          <AppButton
            label="Go to Sign In"
            type="button"
            variant="primary"
            size="lg"
            class="w-full"
            @click="navigateToSignIn"
          />
        </div>

        <div v-else-if="verificationStatus === 'error'" class="space-y-6">
          <div class="p-4 rounded-lg bg-red-50 border border-red-200">
            <p class="text-sm text-red-700">
              {{ errorMessage || 'This verification link is invalid or has expired. Please request a new one.' }}
            </p>
          </div>

          <div class="flex gap-3">
            <AppButton
              label="Request New Link"
              type="button"
              variant="primary"
              size="lg"
              class="flex-1"
              @click="requestNewVerification"
            />
            <AppButton
              label="Back to Sign In"
              type="button"
              variant="outline"
              size="lg"
              class="flex-1"
              @click="navigateToSignIn"
            />
          </div>
        </div>

        <div v-else class="py-12 text-center">
          <div class="inline-flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600 font-medium">Verifying your email...</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="mt-8 text-center text-xs text-gray-500">
        Need help?
        <a href="mailto:support@pos.com" class="font-medium text-blue-600 hover:text-blue-700">
          Contact support
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppButton from '@/components/Common/AppButton.vue'

type VerificationStatus = 'verifying' | 'success' | 'error'

const router = useRouter()
const route = useRoute()

const verificationStatus = ref<VerificationStatus>('verifying')
const errorMessage = ref<string | null>(null)

/**
 * Verify email token on component mount
 */
onMounted(async () => {
  const token = route.params.token as string

  if (!token) {
    verificationStatus.value = 'error'
    errorMessage.value = 'No verification token provided.'
    return
  }

  try {
    // TODO: Replace with actual GraphQL mutation to verify email
    // Call backend to verify the email token
    await new Promise((resolve) => setTimeout(resolve, 2000))

    verificationStatus.value = 'success'

    // Auto-redirect after 3 seconds
    setTimeout(() => {
      navigateToSignIn()
    }, 3000)
  } catch (err) {
    verificationStatus.value = 'error'
    errorMessage.value =
      err instanceof Error ? err.message : 'Email verification failed.'
  }
})

/**
 * Navigate to sign in page
 */
function navigateToSignIn(): void {
  router.push({ name: 'signin' })
}

/**
 * Request a new verification email
 */
async function requestNewVerification(): Promise<void> {
  try {
    // TODO: Implement requesting a new verification email
    verificationStatus.value = 'verifying'

    await new Promise((resolve) => setTimeout(resolve, 1500))

    verificationStatus.value = 'success'
    errorMessage.value = null

    setTimeout(() => {
      navigateToSignIn()
    }, 3000)
  } catch (err) {
    verificationStatus.value = 'error'
    errorMessage.value =
      err instanceof Error ? err.message : 'Failed to request new verification.'
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
