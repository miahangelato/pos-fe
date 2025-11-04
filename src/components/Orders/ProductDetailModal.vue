<template>
  <div class="fixed inset-0 bg-white/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div class="relative bg-slate-900 border border-slate-700/50 rounded-lg shadow-xl max-w-2xl w-full max-h-96 m-4">
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-300 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Product Content -->
      <div class="flex h-full max-h-96">
        <!-- Product Image -->
        <div class="w-1/3 bg-blue-500/20 flex items-center justify-center rounded-l-lg">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="h-full w-full object-cover object-center rounded-l-lg"
          />
          <div v-else class="h-full w-full flex items-center justify-center">
            <svg class="h-16 w-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
            </svg>
          </div>
        </div>

        <!-- Product Details -->
        <div class="w-2/3 p-6 flex flex-col overflow-y-auto bg-slate-900">
          <!-- Header -->
          <div class="mb-4">
            <h2 class="text-2xl font-bold text-white mb-2">{{ product.name }}</h2>
            <div class="flex items-center gap-2">
              <span
                :class="{
                  'bg-green-500/20 text-green-400': product.productType === 'PHYSICAL',
                  'bg-blue-500/20 text-blue-400': product.productType === 'DIGITAL'
                }"
                class="px-3 py-1 text-xs font-medium rounded-full"
              >
                {{ product.productType }}
              </span>
              <span v-if="product.category" class="text-sm text-slate-400">
                {{ product.category.name }}
              </span>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-4">
            <span class="text-3xl font-bold text-white">₱{{ product.price.toFixed(2) }}</span>
          </div>

          <!-- Description -->
          <div v-if="product.description" class="mb-4">
            <p class="text-slate-300 text-sm leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Stock Info -->
          <div v-if="product.productType === 'PHYSICAL'" class="mb-4">
            <p class="text-sm text-slate-400">
              <span class="font-medium">Stock Available:</span>
              <span
                :class="{
                  'text-green-400 font-medium': (product.stockQuantity || 0) > 0,
                  'text-red-400 font-medium': (product.stockQuantity || 0) <= 0
                }"
              >
                {{ product.stockQuantity || 0 }} units
              </span>
            </p>
          </div>

          <!-- Quantity Selector -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
            <div class="flex items-center gap-2">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="px-3 py-2 border border-slate-600 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-300"
              >
                −
              </button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="product.productType === 'PHYSICAL' ? (product.stockQuantity || 0) : undefined"
                class="w-16 px-3 py-2 border border-slate-600 rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white"
              />
              <button
                @click="increaseQuantity"
                :disabled="product.productType === 'PHYSICAL' && quantity >= (product.stockQuantity || 0)"
                class="px-3 py-2 border border-slate-600 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-300"
              >
                +
              </button>
            </div>
          </div>

          <!-- Line Total -->
          <div class="mb-6 p-3 bg-slate-800/50 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Line Total:</span>
              <span class="text-xl font-bold text-white">₱{{ lineTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Spacer -->
          <div class="flex-1"></div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <AppButton
              label="Cancel"
              variant="secondary"
              size="md"
              class="flex-1"
              @click="$emit('close')"
            />
            <AppButton
              label="Add to Cart"
              variant="primary"
              size="md"
              class="flex-1"
              :disabled="product.productType === 'PHYSICAL' && (product.stockQuantity || 0) <= 0"
              @click="addToCart"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppButton from '@/components/Common/AppButton.vue'

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

interface Props {
  product: Product
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  addToCart: [payload: { product: Product; quantity: number }]
}>()

const quantity = ref(1)

const lineTotal = computed(() => {
  return (quantity.value || 1) * props.product.price
})

function increaseQuantity() {
  if (props.product.productType === 'PHYSICAL') {
    if (quantity.value < (props.product.stockQuantity || 0)) {
      quantity.value++
    }
  } else {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function addToCart() {
  emit('addToCart', {
    product: props.product,
    quantity: quantity.value
  })
  emit('close')
}
</script>
