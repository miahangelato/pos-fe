<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Header -->
    <header class="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-xl sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Dashboard</h1>
          <p class="text-sm text-slate-400 mt-1">Welcome back, {{ authStore.user?.fullName || 'User' }}</p>
        </div>
        <div class="flex items-center gap-4">
      
          <button
            class="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white transition-colors"
            @click="navigateToSettings"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
            @click="handleSignOut"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="bg-slate-900/30 border-b border-slate-700/50 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex gap-8" aria-label="Navigation">
          <button
            v-if="canManageProducts"
            @click="router.push('/')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'products'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
            ]"
          >
            Products
          </button>
          <button
            @click="activeTab = 'purchases'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'purchases'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
            ]"
          >
            Purchases
          </button>
          <button
            v-if="canManageOrders"
            @click="activeTab = 'orders'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
            ]"
          >
            Orders
          </button>
          <button
            v-if="isAdmin"
            @click="router.push('/users')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
            ]"
          >
            User Management
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Your Products</h2>
          <button 
            v-if="canManageProducts"
            @click="openAddProductModal" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            + Add Product
          </button>
        </div>
        <div v-if="loadingProducts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6 animate-pulse">
            <div class="bg-slate-800/50 rounded-lg h-40 mb-4"></div>
            <div class="h-4 bg-slate-800/50 rounded mb-2"></div>
            <div class="h-4 bg-slate-800/50 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
          </svg>
          <p class="text-slate-400 text-lg">No products yet</p>
          <p class="text-slate-500 text-sm mt-1">Create your first product to get started</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="product in products" :key="product.id" class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl overflow-hidden hover:bg-slate-900/70 transition-colors">
            <!-- Clickable Product Area -->
            <div @click="openProductViewModal(product)" class="p-6 pb-4 cursor-pointer">
              <div v-if="product.imageUrl" class="rounded-lg p-4 w-full h-40 mb-4 flex items-center justify-center overflow-hidden">
                <img :src="product.imageUrl" :alt="product.name" class="w-full h-full object-cover" />
              </div>
              <div v-else class="bg-blue-500/20 rounded-lg p-4 w-full h-40 mb-4 flex items-center justify-center">
                <svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white">{{ product.name }}</h3>
              <p class="text-sm text-slate-400 mt-1">{{ product.category?.name || 'Uncategorized' }}</p>
              <div class="mt-4 flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-400">Price</p>
                  <p class="text-xl font-bold text-white">₱{{ product.price.toFixed(2) }}</p>
                </div>
                <div v-if="product.productType === 'PHYSICAL'">
                  <p class="text-sm text-slate-400">Stock</p>
                  <p class="text-xl font-bold text-white">{{ product.stockQuantity || 0 }}</p>
                </div>
                <div v-else>
                  <p class="text-sm text-slate-400">Type</p>
                  <p class="text-xl font-bold text-green-400">Digital</p>
                </div>
              </div>
            </div>
            <!-- Action Buttons (Non-clickable area) -->
            <div class="px-6 pb-6 flex gap-2">
              <button @click.stop="openEditProductModal(product)" class="flex-1 px-3 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors">
                Edit
              </button>
              <button @click.stop="handleDeleteProduct(product.id)" class="flex-1 px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchases Tab -->
      <div v-else-if="activeTab === 'purchases'" class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-4">Customer Purchases</h2>
          <p class="text-slate-400 text-sm">All purchases made by customers to your products</p>
        </div>
        <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-700/50 bg-slate-900/80">
                  <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Customer</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Product</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Quantity</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Total Amount</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 5" :key="i" class="border-b border-slate-700/50 hover:bg-slate-900/70 transition-colors">
                  <td class="px-6 py-4 text-sm text-white">Customer {{ i }}</td>
                  <td class="px-6 py-4 text-sm text-slate-300">Product {{ i }}</td>
                  <td class="px-6 py-4 text-sm text-slate-300">{{ 5 + i }}</td>
                  <td class="px-6 py-4 text-sm font-semibold text-white">₱{{ (5000 + i * 1000).toLocaleString() }}</td>
                  <td class="px-6 py-4 text-sm text-slate-400">{{ new Date(2024, 10, i).toLocaleDateString() }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Orders Tab -->
      <div v-else-if="activeTab === 'orders'" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white">Orders Management</h2>
            <p class="text-slate-400 text-sm mt-1">View and manage customer orders</p>
          </div>
          <button
            @click="showCreateOrderModal = true"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            + Create Order
          </button>
        </div>

        <!-- Order Status Tabs -->
        <div>
          <nav class="flex space-x-8" aria-label="Order Tabs">
            <button
              v-for="tab in orderTabs"
              :key="tab.key"
              @click="activeOrderTab = tab.key"
              :class="[
                activeOrderTab === tab.key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="getOrderCount(tab.key) > 0"
                :class="[
                  activeOrderTab === tab.key ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-300',
                  'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
                ]"
              >
                {{ getOrderCount(tab.key) }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Loading State -->
        <div v-if="loadingOrders" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredOrders.length === 0 && !loadingOrders" class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl">
          <div class="px-6 py-8 text-center">
            <svg class="mx-auto h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-white">
              {{ activeOrderTab === 'all' ? 'No orders yet' : `No ${activeOrderTab} orders` }}
            </h3>
            <p class="mt-2 text-sm text-slate-400">
              {{ activeOrderTab === 'all' 
                ? 'Orders will appear here as customers place them.' 
                : `${activeOrderTab.charAt(0).toUpperCase() + activeOrderTab.slice(1)} orders will appear in this tab.`
              }}
            </p>
            <button
              @click="showCreateOrderModal = true"
              class="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              + Create Your First Order
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Items</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-800/30">
                  <!-- Order Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-white">{{ order.referenceNumber }}</div>
                    <div class="text-sm text-slate-400">{{ formatDate(order.createdAt) }}</div>
                    <div class="text-xs text-slate-500">{{ order.paymentMethod }} • {{ order.shippingMethod }}</div>
                  </td>

                  <!-- Customer Info -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-slate-300">{{ order.customer.fullName }}</div>
                    <div class="text-sm text-slate-400">{{ order.customer.email }}</div>
                    <div class="text-xs text-slate-500">{{ order.customer.mobileNumber }}</div>
                  </td>

                  <!-- Items -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-slate-300">{{ order.orderItems.length }} item{{ order.orderItems.length > 1 ? 's' : '' }}</div>
                    <div v-if="order.orderItems.length > 0" class="text-xs text-slate-400">
                      {{ order.orderItems[0].product.name }}
                      <span v-if="order.orderItems.length > 1">+{{ order.orderItems.length - 1 }} more</span>
                    </div>
                  </td>

                  <!-- Total -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-white">₱{{ order.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                    <div class="text-xs text-slate-400">
                      <span :class="getPaymentStatusClass(order.paymentStatus)">{{ order.paymentStatus }}</span>
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
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Product Form Modal -->
    <ProductFormModal
      :is-open="isProductModalOpen"
      :is-edit-mode="isEditingProduct"
      :product="selectedProduct"
      @close="isProductModalOpen = false"
      @save="handleProductSave"
    />

    <!-- Create Order Modal -->
    <CreateOrderModal
      v-if="showCreateOrderModal"
      @close="showCreateOrderModal = false"
      @created="handleOrderCreated"
    />

    <!-- View Order Modal -->
    <ViewOrderModal
      v-if="showViewOrderModal && selectedOrder"
      :order="selectedOrder"
      @close="showViewOrderModal = false"
      @updated="handleOrderUpdated"
    />

    <!-- Product View Modal -->
    <ProductViewModal
      v-if="showProductViewModal && selectedProductForView"
      :product="selectedProductForView"
      @close="showProductViewModal = false"
      @edit="openEditProductModalFromView"
      @delete="confirmDeleteProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '@/stores/auth'
import { usePermissions } from '@/composables/usePermissions'
import ProductFormModal from '@/components/Products/ProductFormModal.vue'
import ProductViewModal from '@/components/ProductViewModal.vue'
import CreateOrderModal from '@/components/Orders/CreateOrderModal.vue'
import ViewOrderModal from '@/components/Orders/ViewOrderModal.vue'
import { GET_PRODUCTS, DELETE_PRODUCT } from '@/graphql/products'
import { ORDERS_QUERY, CUSTOMERS_QUERY } from '@/graphql/queries'
import { UPDATE_ORDER_STATUS_MUTATION } from '@/graphql/mutations'

// Type definitions
interface Product {
  id: string
  name: string
  description?: string
  price: number
  productType: 'PHYSICAL' | 'DIGITAL'
  stockQuantity?: number
  imageUrl?: string
  category?: {
    id: string
    name: string
  }
}

interface ProductFormData {
  id: string
  name: string
  description: string
  type: 'physical' | 'digital'
  price: number
  stock: number
  categoryId: string
  photo: string
  photoPreview: string
}

interface Order {
  id: string
  referenceNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  grandTotal: number
  createdAt: string
  customer: {
    id: string
    fullName: string
    email: string
    mobileNumber: string
  }
}

const router = useRouter()
const authStore = useAuthStore()
const { canManageProducts, canCreateOrders, canManageOrders, isAdmin } = usePermissions()

const activeTab = ref('products')
const isProductModalOpen = ref(false)
const isEditingProduct = ref(false)
const selectedProduct = ref<ProductFormData | null>(null)

// Product view modal state
const showProductViewModal = ref(false)
const selectedProductForView = ref<Product | null>(null)

// Orders related state
const activeOrderTab = ref('all')
const showCreateOrderModal = ref(false)
const showViewOrderModal = ref(false)
const selectedOrder = ref<Order | null>(null)

const tabs = [
  { name: 'products', label: 'Products' },
  { name: 'purchases', label: 'Purchases' },
  { name: 'orders', label: 'Orders' },
]

const orderTabs = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' }
]

// GraphQL Queries
const { result: productsResult, loading: loadingProducts, refetch: refetchProducts } = useQuery(GET_PRODUCTS, null, {
  pollInterval: 0,
})
const { mutate: deleteProductMutation } = useMutation(DELETE_PRODUCT)

// Orders GraphQL
const { result: ordersResult, loading: loadingOrders, refetch: refetchOrders } = useQuery(ORDERS_QUERY, null, {
  pollInterval: 30000, // Poll every 30 seconds for new orders
})
const { mutate: updateOrderStatusMutation } = useMutation(UPDATE_ORDER_STATUS_MUTATION)

// Computed products from GraphQL
const products = computed(() => {
  return productsResult.value?.products || []
})

// Computed orders from GraphQL
const orders = computed(() => {
  return ordersResult.value?.orders || []
})

// Filtered orders based on active tab
const filteredOrders = computed(() => {
  if (activeOrderTab.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order: Order) => order.status.toLowerCase() === activeOrderTab.value)
})

/**
 * Navigate to settings page
 */
function navigateToSettings(): void {
  router.push({ name: 'settings' })
}

/**
 * Handle sign out
 */
async function handleSignOut(): Promise<void> {
  authStore.signOut()
  router.push({ name: 'signin' })
}

/**
 * Open product form modal for adding new product
 */
function openAddProductModal() {
  isEditingProduct.value = false
  selectedProduct.value = null
  isProductModalOpen.value = true
}

/**
 * Open product form modal for editing existing product
 */
function openEditProductModal(product: any) {
  console.log('=== openEditProductModal called ===')
  console.log('Original product from GraphQL:', product)
  
  // Transform GraphQL product to match ProductFormModal's expected structure
  const productType = product.productType ? product.productType.toLowerCase() : 'physical'
  
  const transformedProduct = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    type: productType as 'physical' | 'digital',
    price: product.price,
    stock: product.stockQuantity || 0,
    categoryId: product.category?.id || '',
    photo: product.imageUrl || '',
    photoPreview: product.imageUrl || ''
  }
  
  console.log('Transformed product for modal:', transformedProduct)
  console.log('Product type value:', productType)
  console.log('Category ID:', product.category?.id)
  
  isEditingProduct.value = true
  selectedProduct.value = transformedProduct
  isProductModalOpen.value = true
}

/**
 * Handle product save
 */
async function handleProductSave(product: any) {
  try {
    // Refetch products after successful save
    await refetchProducts()
  } catch (error) {
    console.error('Error refreshing products:', error)
  }
}

/**
 * Handle delete product
 */
async function handleDeleteProduct(productId: string) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }

  try {
    const result = await deleteProductMutation({
      id: productId,
    })

    if (result?.data?.deleteProduct?.success) {
      // Refetch products after successful deletion
      await refetchProducts()
    } else if (result?.data?.deleteProduct?.errors?.length) {
      alert('Error deleting product: ' + result.data.deleteProduct.errors[0])
    }
  } catch (error) {
    alert('Error deleting product: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Open product view modal
 */
function openProductViewModal(product: any) {
  selectedProductForView.value = product
  showProductViewModal.value = true
}

/**
 * Open edit product modal from view modal
 */
function openEditProductModalFromView(product: any) {
  showProductViewModal.value = false
  openEditProductModal(product)
}

/**
 * Confirm delete product from view modal
 */
function confirmDeleteProduct(productId: string) {
  showProductViewModal.value = false
  handleDeleteProduct(productId)
}

/**
 * Get order count for tab badge
 */
function getOrderCount(tabKey: string): number {
  if (tabKey === 'all') {
    return orders.value.length
  }
  return orders.value.filter((order: Order) => order.status.toLowerCase() === tabKey).length
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'CONFIRMED':
      return 'bg-blue-500/20 text-blue-400'
    case 'COMPLETED':
      return 'bg-green-500/20 text-green-400'
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-slate-500/20 text-slate-400'
  }
}

/**
 * Get payment status class
 */
function getPaymentStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'text-yellow-400'
    case 'COMPLETED':
      return 'text-green-400'
    case 'FAILED':
      return 'text-red-400'
    default:
      return 'text-slate-400'
  }
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const result = await updateOrderStatusMutation({
      id: orderId,
      status: newStatus
    })

    if (result?.data?.updateOrderStatus?.success) {
      await refetchOrders()
    } else {
      alert('Error updating order status')
    }
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Error updating order status')
  }
}

/**
 * View order details
 */
function viewOrder(order: Order) {
  selectedOrder.value = order
  showViewOrderModal.value = true
}

/**
 * Handle order created
 */
async function handleOrderCreated() {
  showCreateOrderModal.value = false
  await refetchOrders()
}

/**
 * Handle order updated - refresh both list and selected order
 */
async function handleOrderUpdated() {
  await refetchOrders()
  
  // Update the selectedOrder with fresh data from the refetched list
  if (selectedOrder.value && orders.value) {
    const updatedOrder = orders.value.find((order: Order) => order.id === selectedOrder.value?.id)
    if (updatedOrder) {
      selectedOrder.value = updatedOrder
    }
  }
}
</script>
