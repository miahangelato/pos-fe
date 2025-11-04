<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="mt-2 text-gray-600">Manage merchants, customers, and admin accounts</p>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <!-- Search -->
          <div class="flex-1 max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or email..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Filters and Create Button -->
          <div class="flex gap-3">
            <select
              v-model="selectedRole"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="MERCHANT">Merchants</option>
              <option value="ADMIN">Admins</option>
            </select>

            <button
              @click="openCreateModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create User
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading users...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading users: {{ error.message }}
      </div>

      <!-- Users Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-purple-100 text-purple-800': user.role === 'ADMIN',
                    'bg-blue-100 text-blue-800': user.role === 'MERCHANT',
                    'bg-green-100 text-green-800': user.role === 'CUSTOMER'
                  }"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ user.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openEditModal(user)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(user)"
                  class="text-red-600 hover:text-red-900"
                  :disabled="user.id === currentUserId"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold mb-4">{{ modalTitle }}</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password {{ isEditMode ? '(leave blank to keep current)' : '' }}
            </label>
            <input
              v-model="formData.password"
              type="password"
              :required="!isEditMode"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              v-model="formData.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="MERCHANT">Merchant</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div class="flex items-center">
            <input
              v-model="formData.active"
              type="checkbox"
              id="active"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="active" class="ml-2 block text-sm text-gray-700">Active</label>
          </div>

          <div v-if="formError" class="text-red-600 text-sm">
            {{ formError }}
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold mb-4 text-red-600">Confirm Delete</h2>
        <p class="text-gray-700 mb-6">
          Are you sure you want to delete user <strong>{{ userToDelete?.name }}</strong>?
          This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="closeDeleteModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_USERS } from '@/graphql/users'
import { CREATE_USER_MUTATION, UPDATE_USER_MUTATION, DELETE_USER_MUTATION } from '@/graphql/mutations'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

// State
const searchQuery = ref('')
const selectedRole = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const formError = ref('')
const submitting = ref(false)
const deleting = ref(false)
const userToDelete = ref<any>(null)

const formData = ref({
  id: '',
  name: '',
  email: '',
  password: '',
  role: 'CUSTOMER',
  active: true
})

// Query users
const { result, loading, error, refetch } = useQuery(GET_USERS, {
  role: selectedRole,
  query: searchQuery
})

const users = computed(() => result.value?.users || [])

// Filter users locally as well
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((user: any) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Watch filters and refetch
watch([selectedRole, searchQuery], () => {
  refetch({
    role: selectedRole.value || undefined,
    query: searchQuery.value || undefined
  })
})

// Mutations
const { mutate: createUser } = useMutation(CREATE_USER_MUTATION)
const { mutate: updateUser } = useMutation(UPDATE_USER_MUTATION)
const { mutate: deleteUser } = useMutation(DELETE_USER_MUTATION)

// Modal title
const modalTitle = computed(() => isEditMode.value ? 'Edit User' : 'Create New User')

// Methods
function openCreateModal() {
  isEditMode.value = false
  formData.value = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    active: true
  }
  formError.value = ''
  showModal.value = true
}

function openEditModal(user: any) {
  isEditMode.value = true
  formData.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    active: user.active
  }
  formError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  formError.value = ''
}

async function handleSubmit() {
  formError.value = ''
  submitting.value = true

  try {
    if (isEditMode.value) {
      // Update user
      const variables: any = {
        id: formData.value.id,
        name: formData.value.name,
        email: formData.value.email,
        role: formData.value.role,
        active: formData.value.active
      }
      
      // Only include password if provided
      if (formData.value.password) {
        variables.password = formData.value.password
      }

      const result = await updateUser(variables)
      
      if (result?.data?.updateUser?.errors?.length > 0) {
        formError.value = result.data.updateUser.errors.join(', ')
      } else {
        closeModal()
        refetch()
      }
    } else {
      // Create user
      const result = await createUser({
        name: formData.value.name,
        email: formData.value.email,
        password: formData.value.password,
        role: formData.value.role,
        active: formData.value.active
      })

      if (result?.data?.createUser?.errors?.length > 0) {
        formError.value = result.data.createUser.errors.join(', ')
      } else {
        closeModal()
        refetch()
      }
    }
  } catch (err: any) {
    formError.value = err.message || 'An error occurred'
  } finally {
    submitting.value = false
  }
}

function confirmDelete(user: any) {
  userToDelete.value = user
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  userToDelete.value = null
}

async function handleDelete() {
  if (!userToDelete.value) return

  deleting.value = true

  try {
    const result = await deleteUser({ id: userToDelete.value.id })

    if (result?.data?.deleteUser?.success) {
      closeDeleteModal()
      refetch()
    } else if (result?.data?.deleteUser?.errors?.length > 0) {
      alert(result.data.deleteUser.errors.join(', '))
    }
  } catch (err: any) {
    alert(err.message || 'Failed to delete user')
  } finally {
    deleting.value = false
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
