<template>
  <div class="fixed inset-0 bg-white/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border border-slate-700/50 w-full max-w-2xl shadow-lg rounded-md bg-slate-900">
      <!-- Success Icon -->
      <div class="flex items-center justify-center mb-6">
        <div class="rounded-full bg-green-500/20 p-3">
          <svg class="h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>

      <!-- Title -->
      <div class="text-center mb-6">
        <h3 class="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h3>
        <p class="text-sm text-slate-400">Order Reference Number: <span class="font-semibold text-blue-400">{{ order.referenceNumber }}</span></p>
      </div>

      <!-- Order Details -->
      <div class="space-y-6 max-h-96 overflow-y-auto">
        <!-- Customer Information -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <h4 class="font-semibold text-white mb-3">Customer Information</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-400">Full Name:</span>
              <span class="font-medium text-white">{{ order.customer.fullName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Email Address:</span>
              <span class="font-medium text-white">{{ order.customer.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Mobile Number:</span>
              <span class="font-medium text-white">{{ order.customer.mobileNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Address (if online order) -->
        <div v-if="order.deliveryAddress" class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <h4 class="font-semibold text-white mb-3">Delivery Address</h4>
          <p class="text-sm text-slate-300">{{ formatAddress(order.deliveryAddress) }}</p>
        </div>

        <!-- Shipping & Payment Methods -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-slate-400 block mb-1">Shipping Method:</span>
              <span class="font-medium text-white">{{ order.shippingMethod || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block mb-1">Payment Method:</span>
              <span class="font-medium text-white">{{ order.paymentMethod }}</span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <h4 class="font-semibold text-white mb-3">Order Items</h4>
          <div class="space-y-2">
            <div v-for="item in order.orderItems" :key="item.id" class="flex justify-between text-sm">
              <span class="text-slate-300">{{ item.product.name }} x{{ item.quantity }}</span>
              <span class="font-medium text-white">₱{{ ((item.priceAtPurchase || item.unitPrice) * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <h4 class="font-semibold text-white mb-3">Summary</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-400">Subtotal:</span>
              <span class="font-medium text-white">₱{{ order.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="order.shippingFee !== undefined && order.shippingFee > 0" class="flex justify-between">
              <span class="text-slate-400">Shipping Fee:</span>
              <span class="font-medium text-white">₱{{ order.shippingFee.toFixed(2) }}</span>
            </div>
            <div v-else-if="order.deliveryFee !== undefined && order.deliveryFee > 0" class="flex justify-between">
              <span class="text-slate-400">Shipping Fee:</span>
              <span class="font-medium text-white">₱{{ order.deliveryFee.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Convenience Fee:</span>
              <span class="font-medium text-white">₱{{ order.convenienceFee.toFixed(2) }}</span>
            </div>
            <div v-if="order.discountAmount" class="flex justify-between text-green-400">
              <span>Discount:</span>
              <span class="font-medium">-₱{{ order.discountAmount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-white pt-2 border-t border-slate-700/50">
              <span>Grand Total:</span>
              <span>₱{{ order.grandTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Link (for online orders with online payment) -->
        <div v-if="isOnlinePayment" class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p class="text-sm text-blue-300 mb-2">
            <strong>For online orders with online payments,</strong> share this link with the customer:
          </p>
          <div class="flex items-center gap-2">
            <input
              type="text"
              :value="paymentLink"
              readonly
              class="flex-1 px-3 py-2 text-sm border border-slate-600 rounded bg-slate-800 text-white"
            />
            <button
              @click="copyPaymentLink"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex gap-3">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors font-medium"
        >
          Close
        </button>
        <button
          @click="viewOrder"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface DeliveryAddress {
  roomUnit?: string
  floor?: string
  building?: string
  street: string
  barangay: string
  city: string
  province: string
  landmark?: string
}

interface Order {
  id: string
  referenceNumber: string
  orderType: string
  paymentMethod: string
  shippingMethod?: string
  subtotal: number
  shippingFee?: number
  deliveryFee?: number
  convenienceFee: number
  discountAmount?: number
  grandTotal: number
  customer: {
    fullName: string
    email: string
    mobileNumber: string
  }
  deliveryAddress?: DeliveryAddress
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice?: number
    priceAtPurchase?: number
    product: {
      name: string
    }
  }>
}

const props = defineProps<{
  order: Order
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const copied = ref(false)

const isOnlinePayment = computed(() => {
  return props.order.orderType === 'ONLINE' && 
         ['GCASH', 'PAYMAYA', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER'].includes(props.order.paymentMethod)
})

const paymentLink = computed(() => {
  // Generate payment link based on order ID
  return `${window.location.origin}/payment/${props.order.id}`
})

function formatAddress(address: DeliveryAddress) {
  const parts = []
  if (address.roomUnit) parts.push(address.roomUnit)
  if (address.floor) parts.push(address.floor)
  if (address.building) parts.push(address.building)
  if (address.street) parts.push(address.street)
  if (address.barangay) parts.push(address.barangay)
  if (address.city) parts.push(address.city)
  if (address.province) parts.push(address.province)
  return parts.filter(p => p).join(', ')
}

function copyPaymentLink() {
  navigator.clipboard.writeText(paymentLink.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function viewOrder() {
  emit('close')
  router.push('/orders')
}
</script>
