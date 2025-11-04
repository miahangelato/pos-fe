<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Header -->
    <header class="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-xl sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Customer Portal</h1>
            <p class="text-sm text-slate-400 mt-1">Shop products and manage your orders</p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Cart Button -->
            <button
              @click="router.push('/cart')"
              class="relative px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
              <span v-if="cartStore.itemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {{ cartStore.itemCount }}
              </span>
            </button>
            <!-- Sign Out Button -->
            <button
              class="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              @click="handleSignOut"
            >
              Sign Out
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mt-4">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              @click="activeTab = 'products'"
              :class="[
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              Browse Products
            </button>
            <button
              @click="activeTab = 'orders'"
              :class="[
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              My Orders
              <span
                v-if="orders.length > 0"
                :class="[
                  activeTab === 'orders' ? 'bg-blue-900/50 text-blue-400' : 'bg-slate-800 text-slate-300',
                  'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
                ]"
              >
                {{ orders.length }}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Products Tab -->
      <div v-show="activeTab === 'products'">
        <!-- Category Filter -->
        <div class="mb-6">
        <div class="flex gap-2 flex-wrap">
          <button
            @click="selectedCategory = null"
            :class="[
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
            ]"
          >
            All Products
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6 animate-pulse">
          <div class="bg-slate-700 h-48 rounded-lg mb-4"></div>
          <div class="bg-slate-700 h-4 rounded w-3/4 mb-2"></div>
          <div class="bg-slate-700 h-4 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl overflow-hidden hover:border-blue-500/50 transition-all group"
        >
          <!-- Product Image -->
          <div class="relative h-48 bg-slate-800 overflow-hidden">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-600">
              <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <!-- Product Type Badge -->
            <div class="absolute top-2 right-2">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                product.productType === 'DIGITAL' 
                  ? 'bg-purple-600/80 text-white' 
                  : 'bg-green-600/80 text-white'
              ]">
                {{ product.productType }}
              </span>
            </div>
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-white mb-1 line-clamp-2">{{ product.name }}</h3>
            <p v-if="product.description" class="text-sm text-slate-400 mb-3 line-clamp-2">{{ product.description }}</p>
            
            <!-- Merchant Name -->
            <p class="text-xs text-slate-500 mb-2">
              by {{ product.merchant?.name || 'Unknown Merchant' }}
            </p>

            <!-- Price -->
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl font-bold text-blue-400">₱{{ product.price.toLocaleString() }}</span>
              <span v-if="product.productType === 'PHYSICAL' && product.stockQuantity !== null" class="text-sm text-slate-400">
                Stock: {{ product.stockQuantity }}
              </span>
            </div>

            <!-- Add to Cart Button -->
            <button
              @click="addToCart(product)"
              :disabled="product.productType === 'PHYSICAL' && product.stockQuantity === 0"
              class="w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              :class="[
                product.productType === 'PHYSICAL' && product.stockQuantity === 0
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ product.productType === 'PHYSICAL' && product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="w-24 h-24 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">No products found</h3>
        <p class="text-slate-400">Try selecting a different category</p>
      </div>
      </div>

      <!-- Orders Tab -->
      <div v-show="activeTab === 'orders'">
        <!-- Loading State -->
        <div v-if="ordersLoading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="orders.length === 0" class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl">
          <div class="px-6 py-8 text-center">
            <svg class="mx-auto h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-white">No orders yet</h3>
            <p class="mt-2 text-sm text-slate-400">
              You haven't placed any orders yet. Visit the "Browse Products" tab to start shopping!
            </p>
            <button
              @click="activeTab = 'products'"
              class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>

        <!-- Orders Table -->
        <div v-else class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-700">
              <thead class="bg-slate-800/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Order</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Items</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-800/30">
                  <!-- Order Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-white">{{ order.referenceNumber }}</div>
                    <div class="text-sm text-slate-400">{{ formatDate(order.createdAt) }}</div>
                    <div class="text-xs text-slate-500">{{ order.paymentMethod }} • {{ order.shippingMethod }}</div>
                  </td>

                  <!-- Items -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-slate-300">
                      {{ order.orderItems.length }} item{{ order.orderItems.length > 1 ? 's' : '' }}
                    </div>
                    <div v-if="order.orderItems.length > 0" class="text-xs text-slate-400">
                      {{ order.orderItems[0].product.name }}
                      <span v-if="order.orderItems.length > 1">+{{ order.orderItems.length - 1 }} more</span>
                    </div>
                  </td>

                  <!-- Total -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-white">
                      ₱{{ order.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </div>
                    <div class="text-xs text-slate-400">
                      <span :class="getPaymentStatusClass(order.paymentStatus)">
                        {{ order.paymentStatus }}
                      </span>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ order.status }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2">
                      <button
                        v-if="order.status === 'PENDING'"
                        @click="confirmCancelOrder(order)"
                        class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        @click="viewOrder(order)"
                        class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Cancel Order Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCancelConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-white mb-2">Cancel Order</h3>
            <p class="text-slate-300 mb-4">
              Are you sure you want to cancel order <span class="font-medium text-white">{{ orderToCancel?.referenceNumber }}</span>?
              This action cannot be undone.
            </p>
            <div class="flex justify-end gap-3">
              <button
                @click="showCancelConfirm = false"
                class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Keep Order
              </button>
              <button
                @click="cancelOrder"
                class="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Success Toast -->
    <Transition name="fade">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Added to cart!</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { GET_PRODUCTS, GET_CATEGORIES } from '@/graphql/products'
import { ORDERS_QUERY } from '@/graphql/queries'
import { CANCEL_ORDER_MUTATION } from '@/graphql/mutations'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const activeTab = ref('products')
const selectedCategory = ref<string | null>(null)
const showToast = ref(false)
const showCancelConfirm = ref(false)
const orderToCancel = ref<any>(null)

// GraphQL Queries
const { result: productsResult, loading } = useQuery(GET_PRODUCTS, null, {
  pollInterval: 0,
})

const { result: categoriesResult } = useQuery(GET_CATEGORIES, null, {
  pollInterval: 0,
})

const { result: ordersResult, loading: ordersLoading, refetch: refetchOrders } = useQuery(ORDERS_QUERY, null, {
  pollInterval: 0,
})

// Mutations
const { mutate: cancelOrderMutation } = useMutation(CANCEL_ORDER_MUTATION)

// Computed
const products = computed(() => productsResult.value?.products || [])
const categories = computed(() => categoriesResult.value?.categories || [])
const orders = computed(() => ordersResult.value?.orders || [])

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value
  return products.value.filter((p: any) => p.category?.id === selectedCategory.value)
})

// Methods
function addToCart(product: any) {
  cartStore.addItem(product)
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

async function handleSignOut() {
  await authStore.signOut()
  router.push({ name: 'signin' })
}

function confirmCancelOrder(order: any) {
  orderToCancel.value = order
  showCancelConfirm.value = true
}

async function cancelOrder() {
  if (!orderToCancel.value) return

  try {
    const result = await cancelOrderMutation({
      orderId: orderToCancel.value.id
    })

    if (result?.data?.cancelOrder?.order) {
      await refetchOrders()
      showCancelConfirm.value = false
      orderToCancel.value = null
    } else if (result?.data?.cancelOrder?.errors) {
      alert(result.data.cancelOrder.errors.join(', '))
    }
  } catch (error) {
    console.error('Error cancelling order:', error)
    alert('Failed to cancel order')
  }
}

function viewOrder(order: any) {
  // For now, just log it. You can add a detail modal later if needed
  console.log('View order:', order)
  alert(`Order ${order.referenceNumber}\nStatus: ${order.status}\nTotal: ₱${order.grandTotal.toFixed(2)}`)
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPaymentStatusClass(status: string): string {
  const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded'
  switch (status) {
    case 'PAID':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'UNPAID':
      return `${baseClasses} bg-yellow-900/30 text-yellow-400`
    case 'REFUNDED':
      return `${baseClasses} bg-purple-100 text-purple-800`
    default:
      return `${baseClasses} bg-slate-700 text-slate-300`
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
