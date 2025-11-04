<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-blue-600">404</h1>
        <p class="text-2xl font-bold text-gray-900 mt-4">Page Not Found</p>
        <p class="text-gray-600 mt-2">The page you're looking for doesn't exist or has been moved.</p>
      </div>

      <div class="space-y-4">
        <router-link to="/" class="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Go Home
        </router-link>
        <button
          class="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          @click="goBack"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack(): void {
  router.back()
}
</script>
