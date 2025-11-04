<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Header -->
    <header class="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-xl sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">
              {{ isCustomer ? 'My Orders' : 'Orders' }}
            </h1>
            <p class="text-sm text-slate-400 mt-1">
              {{ isCustomer ? 'View your order history' : 'View and manage customer orders' }}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <!-- Customer Navigation -->
            <template v-if="isCustomer">
              <button
                @click="$router.push('/marketplace')"
                class="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
              >
                Marketplace
              </button>
              <button
                @click="$router.push('/cart')"
                class="relative px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
              </button>
              <button
                class="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                @click="handleSignOut"
              >
                Sign Out
              </button>
            </template>
            <!-- Merchant Create Order Button -->
            <button
              v-else
              @click="showCreateOrder = true"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              + Create Order
            </button>
          </div>
        </div>

        <!-- Order Status Tabs -->
        <div class="mt-4">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="getOrderCount(tab.key) > 0"
                :class="[
                  activeTab === tab.key ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-300',
                  'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
                ]"
              >
                {{ getOrderCount(tab.key) }}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0 && !loading" class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl">
        <div class="px-6 py-8 text-center">
          <svg class="mx-auto h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-white">
            {{ activeTab === 'all' ? 'No orders yet' : `No ${activeTab} orders` }}
          </h3>
          <p class="mt-2 text-sm text-slate-400">
            {{ isCustomer 
              ? 'You haven\'t placed any orders yet. Visit the marketplace to start shopping!'
              : (activeTab === 'all' 
                ? 'Orders will appear here as customers place them.' 
                : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} orders will appear in this tab.`)
            }}
          </p>
          <button
            v-if="!isCustomer"
            @click="showCreateOrder = true"
            class="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            + Create Your First Order
          </button>
          <button
            v-else
            @click="$router.push('/marketplace')"
            class="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Go to Marketplace
          </button>
        </div>
      </div>

      <!-- Orders List -->
      <div v-else>
        <!-- Orders Table -->
        <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-700">
              <thead class="bg-slate-800/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Items
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-800/30">
                  <!-- Order Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-white">
                      {{ order.referenceNumber }}
                    </div>
                    <div class="text-sm text-slate-400">
                      {{ formatDate(order.createdAt) }}
                    </div>
                    <div class="text-xs text-slate-500">
                      {{ order.paymentMethod }} • {{ order.shippingMethod }}
                    </div>
                  </td>

                  <!-- Customer Info -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-slate-300">
                      {{ order.customer.fullName }}
                    </div>
                    <div class="text-sm text-slate-400">
                      {{ order.customer.email }}
                    </div>
                    <div class="text-xs text-slate-500">
                      {{ order.customer.mobileNumber }}
                    </div>
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
                    <span
                      :class="getStatusBadgeClass(order.status)"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ order.status }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2">
                      <!-- Customer Actions -->
                      <template v-if="isCustomer">
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
                      </template>
                      <!-- Merchant Actions -->
                      <template v-else>
                        <button
                          v-if="order.status === 'PENDING'"
                          @click="updateOrderStatus(order.id, 'CONFIRMED')"
                          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          v-if="order.status === 'CONFIRMED'"
                          @click="updateOrderStatus(order.id, 'COMPLETED')"
                          class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          @click="viewOrder(order)"
                          class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded transition-colors"
                        >
                          View
                        </button>
                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Order Modal -->
    <CreateOrderModal
      v-if="showCreateOrder"
      @close="showCreateOrder = false"
      @created="handleOrderCreated"
    />

    <!-- Order Success Modal -->
    <OrderSuccessModal
      v-if="showSuccessModal && createdOrder"
      :order="createdOrder"
      @close="showSuccessModal = false"
    />

    <!-- View Order Modal -->
    <ViewOrderModal
      v-if="showViewOrder && selectedOrder"
      :order="selectedOrder"
      @close="closeViewOrder"
      @updated="handleOrderUpdated"
    />

    <!-- Cancel Order Confirmation Modal -->
    <div
      v-if="showCancelConfirm && orderToCancel"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeCancelConfirm"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold mb-4 text-red-600">Cancel Order</h2>
        <p class="text-gray-700 mb-2">
          Are you sure you want to cancel order <strong>{{ orderToCancel.referenceNumber }}</strong>?
        </p>
        <p class="text-sm text-gray-600 mb-6">
          This action cannot be undone. Your order will be cancelled and the items will be returned to stock.
        </p>
        <div class="flex gap-3">
          <button
            @click="closeCancelConfirm"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Keep Order
          </button>
          <button
            @click="cancelOrder"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import AppButton from '@/components/Common/AppButton.vue'
import CreateOrderModal from '@/components/Orders/CreateOrderModal.vue'
import ViewOrderModal from '@/components/Orders/ViewOrderModal.vue'
import OrderSuccessModal from '@/components/Orders/OrderSuccessModal.vue'
import { ORDERS_QUERY } from '@/graphql/queries'
import { UPDATE_ORDER_STATUS_MUTATION, CANCEL_ORDER_MUTATION } from '@/graphql/mutations'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const isCustomer = computed(() => authStore.user?.role === 'customer')

// State for cancel confirmation
const showCancelConfirm = ref(false)
const orderToCancel = ref<Order | null>(null)

function handleSignOut() {
  authStore.signOut()
  router.push('/auth/signin')
}

// Types
interface Order {
  id: string
  referenceNumber: string
  orderType: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED'
  paymentStatus: string
  paymentMethod: string
  shippingMethod?: string
  subtotal: number
  deliveryFee: number
  convenienceFee: number
  discountAmount?: number
  grandTotal: number
  voucherCode?: string
  createdAt: string
  customer: {
    id: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    mobileNumber: string
  }
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    product: {
      id: string
      name: string
      price: number
      productType: string
      imageUrl?: string
    }
  }>
  deliveryAddress?: {
    id: string
    province: string
    city: string
    barangay: string
    street: string
    unitFloor?: string
    buildingName?: string
    landmark?: string
    remarks?: string
    fullAddress: string
  }
}

// Reactive data
const activeTab = ref('all')
const showCreateOrder = ref(false)
const showViewOrder = ref(false)
const showSuccessModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const createdOrder = ref<Order | null>(null)

// Tabs configuration
const tabs = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' }
]

// GraphQL queries
const { result: ordersResult, loading, error, refetch: refetchOrders, onResult } = useQuery(ORDERS_QUERY, {}, {
  fetchPolicy: 'cache-and-network'
})

// GraphQL mutations
const { mutate: updateOrderStatusMutation } = useMutation(UPDATE_ORDER_STATUS_MUTATION)
const { mutate: cancelOrderMutation } = useMutation(CANCEL_ORDER_MUTATION)

// Computed properties (MUST be before watch statements)
const orders = computed<Order[]>(() => ordersResult.value?.orders || [])

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(order => order.status.toLowerCase() === activeTab.value)
})

if (error) {
  watch(error, (newVal) => {
    console.error('GraphQL error:', newVal)
  })
}

// Methods
function getOrderCount(status: string): number {
  if (status === 'all') return orders.value.length
  return orders.value.filter(order => order.status.toLowerCase() === status).length
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
      return isCustomer.value 
        ? `${baseClasses} bg-yellow-900/30 text-yellow-400` 
        : `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'REFUNDED':
      return `${baseClasses} bg-purple-100 text-purple-800`
    default:
      return isCustomer.value 
        ? `${baseClasses} bg-slate-700 text-slate-300` 
        : `${baseClasses} bg-gray-100 text-gray-800`
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

async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await updateOrderStatusMutation({ id: orderId, status: newStatus })
    await refetchOrders()
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Failed to update order status')
  }
}

function viewOrder(order: Order) {
  selectedOrder.value = order
  showViewOrder.value = true
}

function confirmCancelOrder(order: Order) {
  orderToCancel.value = order
  showCancelConfirm.value = true
}

async function cancelOrder() {
  if (!orderToCancel.value) return

  try {
    const result = await cancelOrderMutation({ id: orderToCancel.value.id })
    
    if (result?.data?.cancelOrder?.errors?.length > 0) {
      alert(result.data.cancelOrder.errors[0])
    } else {
      showCancelConfirm.value = false
      orderToCancel.value = null
      await refetchOrders()
    }
  } catch (error: any) {
    console.error('Error cancelling order:', error)
    alert('Failed to cancel order. Please try again.')
  }
}

function closeCancelConfirm() {
  showCancelConfirm.value = false
  orderToCancel.value = null
}

function closeViewOrder() {
  showViewOrder.value = false
  selectedOrder.value = null
}

async function handleOrderCreated(order: Order) {
  showCreateOrder.value = false
  createdOrder.value = order
  showSuccessModal.value = true
  await refetchOrders()
}

async function handleOrderUpdated() {
  await refetchOrders()
}

// Lifecycle
onMounted(() => {
  // Component is mounted
})
</script>
