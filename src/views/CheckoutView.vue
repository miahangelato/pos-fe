<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Header -->
    <header class="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-xl sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center gap-4">
          <button
            @click="router.push('/cart')"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-white">Checkout</h1>
            <p class="text-sm text-slate-400 mt-1">{{ currentStep === 1 ? 'Enter your information' : 'Review your order' }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Step 1: Customer Information -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Customer Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
              <input
                v-model="customerInfo.firstName"
                type="text"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
              <input
                v-model="customerInfo.lastName"
                type="text"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                v-model="customerInfo.email"
                type="email"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Mobile Number *</label>
              <input
                v-model="customerInfo.mobileNumber"
                type="tel"
                placeholder="+639171234567"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <!-- Digital Products Notice -->
        <div v-if="!hasPhysicalProducts" class="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg backdrop-blur-xl">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div>
              <h5 class="text-sm font-medium text-blue-300">Digital Products Only</h5>
              <p class="text-sm text-blue-200 mt-1">
                Your cart contains only digital products. Delivery address and shipping are not required.
              </p>
            </div>
          </div>
        </div>

        <div v-if="hasPhysicalProducts" class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Delivery Address *</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Province</label>
              <input
                v-model="deliveryAddress.province"
                type="text"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">City</label>
              <input
                v-model="deliveryAddress.city"
                type="text"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Barangay</label>
              <input
                v-model="deliveryAddress.barangay"
                type="text"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Street</label>
              <input
                v-model="deliveryAddress.street"
                type="text"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-300 mb-2">Building/Unit/Floor (Optional)</label>
              <input
                v-model="deliveryAddress.unitFloor"
                type="text"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">{{ hasPhysicalProducts ? 'Payment & Shipping' : 'Payment Method' }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Payment Method *</label>
              <select
                v-model="paymentMethod"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-if="!hasPhysicalProducts" value="GCASH">GCash</option>
                <option v-if="!hasPhysicalProducts" value="PAYMAYA">PayMaya</option>
                <option v-if="!hasPhysicalProducts" value="BANK_TRANSFER">Bank Transfer</option>
                <option v-if="hasPhysicalProducts" value="COD">Cash on Delivery</option>
                <option value="GCASH">GCash</option>
                <option value="PAYMAYA">PayMaya</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>
            <div v-if="hasPhysicalProducts">
              <label class="block text-sm font-medium text-slate-300 mb-2">Shipping Method *</label>
              <select
                v-model="shippingMethod"
                class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="STANDARD">Standard (₱50.00)</option>
                <option value="EXPRESS">Express (₱100.00)</option>
                <option value="SAME_DAY">Same Day (₱200.00)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
            @click="router.push('/cart')"
            class="px-6 py-3 border border-slate-600 text-slate-300 hover:bg-slate-800/50 rounded-lg font-medium transition-colors"
          >
            Back to Cart
          </button>
          <button
            @click="proceedToConfirmation"
            :disabled="!isFormValid"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            Review Order
          </button>
        </div>
      </div>

      <!-- Step 2: Order Confirmation -->
      <div v-else class="space-y-6">
        <!-- Customer Info Review -->
        <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Customer Information</h2>
          <div class="text-slate-300 space-y-1">
            <p>{{ customerInfo.firstName }} {{ customerInfo.lastName }}</p>
            <p>{{ customerInfo.email }}</p>
            <p>{{ customerInfo.mobileNumber }}</p>
          </div>
        </div>

        <!-- Delivery Address Review -->
        <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Delivery Address</h2>
          <p class="text-slate-300">
            {{ deliveryAddress.unitFloor ? deliveryAddress.unitFloor + ', ' : '' }}
            {{ deliveryAddress.street }}, {{ deliveryAddress.barangay }}, 
            {{ deliveryAddress.city }}, {{ deliveryAddress.province }}
          </p>
        </div>

        <!-- Order Items Review -->
        <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Order Items ({{ cartStore.itemCount }} items)</h2>
          <div class="space-y-3">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between items-center border-b border-slate-700 pb-3"
            >
              <div>
                <p class="text-white font-medium">{{ item.name }}</p>
                <p class="text-sm text-slate-400">Qty: {{ item.quantity }} × ₱{{ item.price.toLocaleString() }}</p>
              </div>
              <p class="text-white font-bold">₱{{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">Order Summary</h2>
          <div class="space-y-2">
            <div class="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span>₱{{ cartStore.subtotal.toLocaleString() }}</span>
            </div>
            <div v-if="hasPhysicalProducts" class="flex justify-between text-slate-300">
              <span>Shipping Fee ({{ shippingMethod }})</span>
              <span>₱{{ shippingFee.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span>Convenience Fee</span>
              <span>₱{{ convenienceFee.toLocaleString() }}</span>
            </div>
            <div class="border-t border-slate-700 pt-2 flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>₱{{ grandTotal.toLocaleString() }}</span>
            </div>
          </div>
          <div class="mt-4 text-sm text-slate-400">
            <p>Payment Method: {{ paymentMethod }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4">
          <button
            @click="currentStep = 1"
            class="px-6 py-3 border border-slate-600 text-slate-300 hover:bg-slate-800/50 rounded-lg font-medium transition-colors"
          >
            Edit Information
          </button>
          <button
            @click="submitOrder"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Placing Order...' : 'Confirm & Place Order' }}
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p class="text-red-400">{{ errorMessage }}</p>
        </div>
      </div>
    </main>

    <!-- Order Success Modal -->
    <OrderSuccessModal
      v-if="showSuccessModal && placedOrders.length > 0"
      :order="placedOrders[0]"
      @close="closeSuccessModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { useCartStore } from '@/stores/cart'
import OrderSuccessModal from '@/components/Orders/OrderSuccessModal.vue'
import { useAuthStore } from '@/stores/auth'
import { PLACE_CUSTOMER_ORDER_MUTATION } from '@/graphql/mutations'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// GraphQL Mutation
const { mutate: placeOrder, loading: isSubmitting } = useMutation(PLACE_CUSTOMER_ORDER_MUTATION)

// Redirect if cart is empty
if (cartStore.isEmpty) {
  router.push('/cart')
}

const currentStep = ref(1)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const placedOrders = ref<any[]>([])

// Pre-fill customer info from auth
const customerInfo = ref({
  firstName: authStore.user?.name?.split(' ')[0] || '',
  lastName: authStore.user?.name?.split(' ')[1] || '',
  email: authStore.user?.email || '',
  mobileNumber: ''
})

const deliveryAddress = ref({
  province: '',
  city: '',
  barangay: '',
  street: '',
  unitFloor: ''
})

const paymentMethod = ref('COD')
const shippingMethod = ref('STANDARD')

const hasPhysicalProducts = computed(() => {
  return cartStore.items.some(item => item.product.productType === 'PHYSICAL')
})

// Watch for changes in cart items and update payment method if needed
watch(hasPhysicalProducts, (newValue) => {
  // If switching to digital only, remove COD option
  if (!newValue && paymentMethod.value === 'COD') {
    paymentMethod.value = 'GCASH'
  }
}, { immediate: true })

const shippingFee = computed(() => {
  if (!hasPhysicalProducts.value) return 0
  switch (shippingMethod.value) {
    case 'EXPRESS': return 100
    case 'SAME_DAY': return 200
    default: return 50
  }
})

const convenienceFee = computed(() => 10)

const grandTotal = computed(() => {
  return cartStore.subtotal + shippingFee.value + convenienceFee.value
})

const isFormValid = computed(() => {
  const basicInfoValid = customerInfo.value.firstName &&
    customerInfo.value.lastName &&
    customerInfo.value.email &&
    customerInfo.value.mobileNumber
  
  // If all products are digital, delivery address is not required
  if (!hasPhysicalProducts.value) {
    return basicInfoValid
  }
  
  // For physical products, require delivery address
  return basicInfoValid &&
    deliveryAddress.value.province &&
    deliveryAddress.value.city &&
    deliveryAddress.value.barangay &&
    deliveryAddress.value.street
})

function proceedToConfirmation() {
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }
  currentStep.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function submitOrder() {
  errorMessage.value = ''
  
  try {
    // Prepare order items from cart
    const orderItems = cartStore.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))

    // Call the GraphQL mutation
    const result = await placeOrder({
      customerAttributes: {
        firstName: customerInfo.value.firstName,
        lastName: customerInfo.value.lastName,
        email: customerInfo.value.email,
        mobileNumber: customerInfo.value.mobileNumber
      },
      orderItems,
      paymentMethod: paymentMethod.value,
      shippingMethod: hasPhysicalProducts.value ? shippingMethod.value : null,
      deliveryAddressAttributes: hasPhysicalProducts.value ? {
        province: deliveryAddress.value.province,
        city: deliveryAddress.value.city,
        barangay: deliveryAddress.value.barangay,
        street: deliveryAddress.value.street,
        unitFloor: deliveryAddress.value.unitFloor || null,
        buildingName: null,
        landmark: null,
        remarks: null
      } : null
    })

    if (result?.data?.placeCustomerOrder?.errors?.length > 0) {
      errorMessage.value = result.data.placeCustomerOrder.errors[0]
      alert(errorMessage.value)
      return
    }

    // Success! Show order success modal
    placedOrders.value = result?.data?.placeCustomerOrder?.orders || []
    showSuccessModal.value = true
  } catch (error: any) {
    console.error('Order submission error:', error)
    errorMessage.value = error.message || 'Failed to place order. Please try again.'
    alert(errorMessage.value)
  }
}

function closeSuccessModal() {
  showSuccessModal.value = false
  placedOrders.value = []
  
  // Clear cart
  cartStore.clearCart()
  
  // Reset form
  currentStep.value = 1
  customerInfo.value.customerName = ''
  customerInfo.value.contactNumber = ''
  customerInfo.value.email = ''
  deliveryAddress.value = {
    province: '',
    city: '',
    barangay: '',
    street: '',
    unitFloor: ''
  }
  paymentMethod.value = 'COD'
  shippingMethod.value = 'STANDARD'
  
  // Redirect to marketplace orders tab
  router.push('/marketplace?tab=orders')
}
</script>
