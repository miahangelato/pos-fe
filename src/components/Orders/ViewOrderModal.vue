<template>
  <div class="fixed inset-0 bg-white/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border border-slate-700/50 w-full max-w-4xl shadow-lg rounded-md bg-slate-900">
      <div class="mt-3">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-white">Order Details</h3>
            <p class="text-sm text-slate-400">{{ order.referenceNumber }}</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Order Information -->
          <div class="space-y-6">
            <!-- Order Status -->
            <div>
              <h4 class="text-sm font-semibold text-white mb-3">Order Status</h4>
              <div class="flex items-center space-x-4">
                <span
                  :class="getStatusBadgeClass(order.status)"
                  class="px-3 py-1 text-sm font-medium rounded-full"
                >
                  {{ order.status }}
                </span>
                <span
                  :class="getPaymentStatusClass(order.paymentStatus)"
                  class="text-sm"
                >
                  Payment: {{ order.paymentStatus }}
                </span>
              </div>
            </div>

            <!-- Customer Information -->
            <div>
              <h4 class="text-sm font-semibold text-white mb-3">Customer Information</h4>
              <div class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg space-y-2">
                <p class="text-slate-300"><strong class="text-white">Name:</strong> {{ order.customer.fullName }}</p>
                <p class="text-slate-300"><strong class="text-white">Email:</strong> {{ order.customer.email }}</p>
                <p class="text-slate-300"><strong class="text-white">Mobile:</strong> {{ order.customer.mobileNumber }}</p>
              </div>
            </div>

            <!-- Delivery Information -->
            <div v-if="order.deliveryAddress">
              <h4 class="text-sm font-semibold text-white mb-3">Delivery Address</h4>
              <div class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg">
                <p class="text-slate-300">{{ order.deliveryAddress.fullAddress }}</p>
                <p v-if="order.deliveryAddress.remarks" class="text-sm text-slate-400 mt-2">
                  <strong class="text-slate-300">Remarks:</strong> {{ order.deliveryAddress.remarks }}
                </p>
              </div>
            </div>

            <!-- Order Details -->
            <div>
              <h4 class="text-sm font-semibold text-white mb-3">Order Details</h4>
              <div class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg space-y-2">
                <p class="text-slate-300"><strong class="text-white">Order Type:</strong> {{ order.orderType }}</p>
                <p class="text-slate-300"><strong class="text-white">Payment Method:</strong> {{ order.paymentMethod }}</p>
                <p v-if="order.shippingMethod" class="text-slate-300"><strong class="text-white">Shipping:</strong> {{ order.shippingMethod }}</p>
                <p class="text-slate-300"><strong class="text-white">Order Date:</strong> {{ formatDate(order.createdAt) }}</p>
              </div>
            </div>

            <!-- Payment Proof (GCASH Orders Only) -->
            <div v-if="order.paymentMethod?.toLowerCase() === 'gcash' && order.paymentProof">
              <h4 class="text-sm font-semibold text-white mb-3">Payment Proof</h4>
              <div class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg space-y-3">
                <!-- Payment Proof Status -->
                <div class="flex items-center justify-between">
                  <span class="text-slate-300">Status:</span>
                  <span 
                    :class="{
                      'bg-yellow-500/20 text-yellow-400': order.paymentProof.status === 'PENDING',
                      'bg-green-500/20 text-green-400': order.paymentProof.status === 'VERIFIED',
                      'bg-red-500/20 text-red-400': order.paymentProof.status === 'REJECTED'
                    }"
                    class="px-3 py-1 text-sm font-medium rounded-full"
                  >
                    {{ order.paymentProof.status }}
                  </span>
                </div>

                <!-- Payment Proof File -->
                <div v-if="order.paymentProof.imageUrl">
                  <p class="text-slate-300 text-sm mb-2">Uploaded Screenshot:</p>
                  <div 
                    @click="viewPaymentProofImage(order.paymentProof.imageUrl)"
                    class="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p class="text-blue-400 text-sm hover:text-blue-300">Click to view payment proof image</p>
                        <p class="text-slate-500 text-xs mt-1">Submitted: {{ formatDate(order.paymentProof.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Customer Remarks -->
                <div v-if="order.paymentProof.remarks">
                  <p class="text-slate-300 text-sm mb-2">Customer Remarks:</p>
                  <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
                    <p class="text-slate-300 text-sm">{{ order.paymentProof.remarks }}</p>
                  </div>
                </div>

                <!-- Verification Info -->
                <div v-if="order.paymentProof.verifiedAt">
                  <p class="text-slate-400 text-sm">
                    Verified on: {{ formatDate(order.paymentProof.verifiedAt) }}
                  </p>
                </div>

                <!-- Payment Action Buttons -->
                <div class="flex gap-2 pt-2">
                  <button
                    @click="approvePayment"
                    :disabled="!canUpdatePaymentStatus || isApprovingPayment"
                    :class="[
                      'flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                      canUpdatePaymentStatus && !isApprovingPayment
                        ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 cursor-pointer'
                        : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    ]"
                  >
                    <svg 
                      v-if="isApprovingPayment"
                      class="w-4 h-4 animate-spin" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg 
                      v-else
                      class="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ isApprovingPayment ? 'Approving...' : 'Approve Payment' }}
                  </button>
                  <button
                    @click="rejectPayment"
                    :disabled="!canUpdatePaymentStatus || isRejectingPayment"
                    :class="[
                      'flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                      canUpdatePaymentStatus && !isRejectingPayment
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 cursor-pointer'
                        : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    ]"
                  >
                    <svg 
                      v-if="isRejectingPayment"
                      class="w-4 h-4 animate-spin" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg 
                      v-else
                      class="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ isRejectingPayment ? 'Rejecting...' : 'Reject Payment' }}
                  </button>
                </div>
                
                <!-- Helper message when buttons are disabled -->
                <div v-if="order.paymentMethod?.toLowerCase() === 'gcash' && !canUpdatePaymentStatus" class="mt-2 text-xs text-slate-400">
                  <div v-if="!order.paymentProof">
                    ⓘ Waiting for customer to upload payment proof
                  </div>
                  <div v-else-if="!order.paymentProof.imageUrl">
                    ⓘ Payment proof uploaded but image not available
                  </div>
                  <div v-else-if="order.paymentProof.status?.toLowerCase() !== 'pending'">
                    ⓘ Payment proof already processed ({{ order.paymentProof.status }})
                  </div>
                  <div v-else-if="order.paymentStatus?.toLowerCase() === 'paid'">
                    ⓘ Payment already approved
                  </div>
                </div>
              </div>
            </div>

            <!-- Pending Payment Notice (GCASH without proof) -->
            <div v-if="order.paymentMethod?.toLowerCase() === 'gcash' && !order.paymentProof && order.paymentStatus === 'PAYMENT_PENDING'">
              <h4 class="text-sm font-semibold text-white mb-3">Payment Status</h4>
              <div class="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p class="text-sm font-medium text-yellow-400">
                    Waiting for customer to upload GCash payment proof
                  </p>
                </div>
                <p class="text-sm text-yellow-300 mt-2">
                  The customer has been sent an email with instructions to upload their payment screenshot.
                </p>
              </div>
            </div>
          </div>

          <!-- Order Status Management -->
          <div v-if="canUpdateStatus" class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-white mb-3">Update Order Status</h4>
            <div class="flex gap-2">
              <button
                v-if="order.status?.toLowerCase() === 'pending'"
                @click="updateStatus('CONFIRMED')"
                :disabled="isUpdatingStatus"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                  !isUpdatingStatus 
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                    : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                ]"
              >
                <svg 
                  v-if="isUpdatingStatus"
                  class="w-4 h-4 animate-spin" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isUpdatingStatus ? 'Confirming...' : 'Confirm Order' }}
              </button>
              <button
                v-if="order.status?.toLowerCase() === 'confirmed'"
                @click="updateStatus('COMPLETED')"
                :disabled="isUpdatingStatus"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                  !isUpdatingStatus 
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                    : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                ]"
              >
                <svg 
                  v-if="isUpdatingStatus"
                  class="w-4 h-4 animate-spin" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isUpdatingStatus ? 'Completing...' : 'Complete Order' }}
              </button>
            </div>
          </div>

          <!-- Status Update Not Available -->
          <div v-else class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg">
            <h4 class="text-sm font-semibold text-white mb-3">Order Status</h4>
            <div class="text-slate-400 text-sm">
              <div v-if="order.status === 'COMPLETED'">
                ⓘ Order is already completed - no further status updates available
              </div>
              <div v-else-if="order.paymentMethod?.toLowerCase() === 'gcash' && order.paymentStatus?.toLowerCase() !== 'paid'">
                ⓘ GCash payment must be verified before updating order status
              </div>
              <div v-else>
                ⓘ Status updates not available for this order
              </div>
            </div>
          </div>

          <!-- Order Items and Summary -->
          <div class="space-y-6">
            <!-- Order Items -->
            <div>
              <h4 class="text-sm font-semibold text-white mb-3">Order Items</h4>
              <div class="space-y-3">
                <div
                  v-for="item in order.orderItems"
                  :key="item.id"
                  class="flex items-center space-x-3 bg-slate-800/50 border border-slate-700/50 p-3 rounded-lg"
                >
                  <img
                    v-if="item.product.imageUrl"
                    :src="item.product.imageUrl"
                    :alt="item.product.name"
                    class="w-12 h-12 rounded-md object-cover"
                  />
                  <div class="w-12 h-12 bg-blue-500/20 rounded-md flex items-center justify-center" v-else>
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-white">{{ item.product.name }}</p>
                    <p class="text-sm text-slate-400">
                      {{ item.quantity }}x ₱{{ item.unitPrice.toFixed(2) }}
                    </p>
                    <span
                      :class="{
                        'bg-green-500/20 text-green-400': item.product.productType === 'PHYSICAL',
                        'bg-blue-500/20 text-blue-400': item.product.productType === 'DIGITAL'
                      }"
                      class="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1"
                    >
                      {{ item.product.productType }}
                    </span>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-white">₱{{ item.totalPrice.toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div>
              <h4 class="text-sm font-semibold text-white mb-3">Order Summary</h4>
              <div class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-400">Subtotal:</span>
                  <span class="font-medium text-white">₱{{ order.subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Delivery Fee:</span>
                  <span class="font-medium text-white">₱{{ order.deliveryFee.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Convenience Fee:</span>
                  <span class="font-medium text-white">₱{{ order.convenienceFee.toFixed(2) }}</span>
                </div>
                <div v-if="order.discountAmount && order.discountAmount > 0" class="flex justify-between">
                  <span class="text-slate-400">Discount:</span>
                  <span class="font-medium text-red-400">-₱{{ order.discountAmount.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-lg font-semibold border-t border-slate-700/50 pt-2 text-white">
                  <span>Total:</span>
                  <span>₱{{ order.grandTotal.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Status Update Actions -->
            <div v-if="canUpdateStatus" class="flex space-x-3">
              <AppButton
                v-if="order.status === 'PENDING'"
                label="Confirm Order"
                variant="primary"
                @click="updateStatus('CONFIRMED')"
              />
              <AppButton
                v-if="order.status === 'CONFIRMED'"
                label="Mark as Completed"
                variant="success"
                @click="updateStatus('COMPLETED')"
              />
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="order.status === 'COMPLETED'" class="mt-6 bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="text-sm font-medium text-green-400">
              Order completed successfully! The customer has been notified.
            </p>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-700/50">
          <AppButton
            label="Close"
            variant="secondary"
            @click="$emit('close')"
          />
          <AppButton
            label="Print Receipt"
            variant="primary"
            @click="printReceipt"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Image Viewing Modal -->
  <div 
    v-if="showImageModal" 
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    @click="closeImageModal"
  >
    <div class="relative max-w-4xl max-h-[90vh] m-4">
      <button 
        @click="closeImageModal"
        class="absolute -top-4 -right-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-2 transition-colors z-10"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img 
        :src="imageModalSrc" 
        alt="Payment Proof" 
        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import AppButton from '@/components/Common/AppButton.vue'
import { UPDATE_ORDER_STATUS_MUTATION, UPDATE_PAYMENT_STATUS_MUTATION } from '@/graphql/mutations'

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
  paymentProof?: {
    id: string
    status: 'PENDING' | 'VERIFIED' | 'REJECTED'
    fileKey?: string
    imageUrl?: string
    remarks?: string
    verifiedAt?: string
    createdAt: string
  }
}

// Props
interface Props {
  order: Order
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  updated: []
}>()

// Reactive state
const showImageModal = ref(false)
const imageModalSrc = ref('')
const isApprovingPayment = ref(false)
const isRejectingPayment = ref(false)
const isUpdatingStatus = ref(false)

// GraphQL mutations
const { mutate: updateOrderStatus } = useMutation(UPDATE_ORDER_STATUS_MUTATION)
const { mutate: updatePaymentStatus } = useMutation(UPDATE_PAYMENT_STATUS_MUTATION)

// Computed properties
const canUpdateStatus = computed(() => {
  // Can only update order status if payment is resolved and order not completed
  if (props.order.status === 'COMPLETED') return false
  
  // For CASH orders, payment is always resolved
  if (props.order.paymentMethod?.toLowerCase() === 'cash') return true
  
  // For GCASH orders, payment must be PAID (verified)
  if (props.order.paymentMethod?.toLowerCase() === 'gcash') {
    return props.order.paymentStatus?.toLowerCase() === 'paid'
  }
  
  return false
})

const canUpdatePaymentStatus = computed(() => {
  // Can only update payment status if:
  // 1. Order is GCASH payment method
  // 2. Payment is not already PAID
  // 3. Payment proof exists and is attached (has image)
  // 4. Payment proof status is PENDING (not already verified/rejected)
  return props.order.paymentMethod?.toLowerCase() === 'gcash' &&
         props.order.paymentStatus?.toLowerCase() !== 'paid' &&
         props.order.paymentProof &&
         props.order.paymentProof.imageUrl &&  // Must have uploaded image
         props.order.paymentProof.status?.toLowerCase() === 'pending'
})

// Methods
function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPaymentStatusClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-600'
    case 'COMPLETED':
      return 'text-green-600'
    case 'FAILED':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function viewPaymentProofImage(imageUrl: string) {
  // Use the absolute URL provided by the backend
  imageModalSrc.value = imageUrl
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
  imageModalSrc.value = ''
}

async function updateStatus(newStatus: string) {
  if (isUpdatingStatus.value) return // Prevent double-click
  
  isUpdatingStatus.value = true
  try {
    const variables = {
      input: {
        id: props.order.id,
        status: newStatus
      }
    }
    
    const result = await updateOrderStatus(variables)
    
    if (result?.data?.updateOrderStatus?.errors?.length > 0) {
      alert('Error: ' + result.data.updateOrderStatus.errors.join(', '))
    } else {
      emit('updated') // This will refresh the parent list and modal data
    }
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Failed to update order status')
  } finally {
    isUpdatingStatus.value = false
  }
}

async function approvePayment() {
  if (isApprovingPayment.value) return // Prevent double-click
  
  isApprovingPayment.value = true
  try {
    const result = await updatePaymentStatus({
      input: {
        id: props.order.id,
        paymentStatus: 'PAID'
      }
    })
    
    if (result?.data?.updatePaymentStatus?.errors?.length > 0) {
      alert('Error: ' + result.data.updatePaymentStatus.errors.join(', '))
    } else {
      emit('updated') // This will refresh the parent list and modal data
    }
  } catch (error) {
    console.error('Error approving payment:', error)
    alert('Failed to approve payment')
  } finally {
    isApprovingPayment.value = false
  }
}

async function rejectPayment() {
  if (isRejectingPayment.value) return // Prevent double-click
  
  if (!confirm('Are you sure you want to reject this payment proof? The customer will need to submit a new one.')) {
    return
  }
  
  isRejectingPayment.value = true
  try {
    const result = await updatePaymentStatus({
      input: {
        id: props.order.id,
        paymentStatus: 'FAILED'
      }
    })
    
    if (result?.data?.updatePaymentStatus?.errors?.length > 0) {
      alert('Error: ' + result.data.updatePaymentStatus.errors.join(', '))
    } else {
      emit('updated') // This will refresh the parent list and modal data
    }
  } catch (error) {
    console.error('Error rejecting payment:', error)
    alert('Failed to reject payment')
  } finally {
    isRejectingPayment.value = false
  }
}

function printReceipt() {
  // In a real application, you would generate a PDF or open a print dialog
  window.print()
}
</script>