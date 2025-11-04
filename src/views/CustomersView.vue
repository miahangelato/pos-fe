<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
            <p class="text-sm text-gray-600 mt-1">Manage your customer database</p>
          </div>
          <AppButton label="Add Customer" variant="primary" size="md" @click="handleAddCustomer" />
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No customers yet</h3>
          <p class="mt-2 text-sm text-gray-600">Customers will appear here as they place orders or you add them manually.</p>
          <AppButton
            label="Add Your First Customer"
            variant="primary"
            size="md"
            class="mt-6"
            @click="handleAddCustomer"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/Common/AppButton.vue'

const router = useRouter()

function handleAddCustomer(): void {
  // TODO: Implement customer creation
  console.log('Add new customer')
}
</script>
