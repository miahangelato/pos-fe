<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-sm text-gray-600 mt-1">Manage your account and application settings</p>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Settings Navigation -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <nav class="space-y-1">
              <button
                v-for="item in settingsSections"
                :key="item.id"
                :class="[
                  'w-full text-left px-4 py-3 text-sm font-medium transition-colors',
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent',
                ]"
                @click="activeSection = item.id"
              >
                {{ item.label }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Settings Content -->
        <div class="md:col-span-3">
          <div class="bg-white rounded-lg shadow p-6">
            <!-- Account Settings -->
            <div v-if="activeSection === 'account'" class="space-y-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      :value="authStore.user?.fullName || ''"
                      class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      :value="authStore.user?.email || ''"
                      class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Security Settings -->
            <div v-else-if="activeSection === 'security'" class="space-y-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm text-gray-600 mb-4">
                      Change your password to secure your account
                    </p>
                    <AppButton
                      label="Change Password"
                      variant="primary"
                      size="md"
                      @click="handleChangePassword"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications -->
            <div v-else-if="activeSection === 'notifications'" class="space-y-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                <div class="space-y-4">
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded" checked />
                    <span class="ml-3 text-sm text-gray-700">Email notifications for new orders</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded" checked />
                    <span class="ml-3 text-sm text-gray-700">Email notifications for low stock</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="rounded" />
                    <span class="ml-3 text-sm text-gray-700">Marketing emails and promotions</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div v-else-if="activeSection === 'danger'" class="space-y-6">
              <div class="p-4 rounded-lg bg-red-50 border border-red-200">
                <h2 class="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm text-red-800 mb-4">
                      Deleting your account is permanent and cannot be undone. All your data will be permanently deleted.
                    </p>
                    <AppButton
                      label="Delete Account"
                      variant="danger"
                      size="md"
                      @click="handleDeleteAccount"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/Common/AppButton.vue'

const authStore = useAuthStore()

const activeSection = ref('account')

const settingsSections = [
  { id: 'account', label: 'Account' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'danger', label: 'Danger Zone' },
]

function handleChangePassword(): void {
  // TODO: Implement password change
  console.log('Change password')
}

function handleDeleteAccount(): void {
  // TODO: Implement account deletion with confirmation
  const confirmed = confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
  )
  if (confirmed) {
    console.log('Delete account')
  }
}
</script>
