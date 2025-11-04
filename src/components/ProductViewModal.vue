<template>
  <div class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-white">Product Details</h3>
          <button @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Product Image -->
        <div class="mb-6">
          <div v-if="product.imageUrl" class="rounded-lg overflow-hidden bg-slate-800/50">
            <img :src="product.imageUrl" :alt="product.name" class="w-full h-64 object-cover" />
          </div>
          <div v-else class="bg-blue-500/20 rounded-lg h-64 flex items-center justify-center">
            <svg class="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
            </svg>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-4 mb-6">
          <div>
            <h2 class="text-2xl font-bold text-white">{{ product.name }}</h2>
            <p class="text-slate-400 mt-1">{{ product.category?.name || 'Uncategorized' }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-slate-800/50 rounded-lg p-4">
              <p class="text-sm text-slate-400">Price</p>
              <p class="text-2xl font-bold text-white">₱{{ product.price.toFixed(2) }}</p>
            </div>
            <div class="bg-slate-800/50 rounded-lg p-4">
              <p class="text-sm text-slate-400">Type</p>
              <p class="text-lg font-semibold text-white">{{ product.productType === 'PHYSICAL' ? 'Physical' : 'Digital' }}</p>
            </div>
            <div v-if="product.productType === 'PHYSICAL'" class="bg-slate-800/50 rounded-lg p-4">
              <p class="text-sm text-slate-400">Stock</p>
              <p class="text-lg font-semibold" :class="getStockColor(product.stockQuantity)">
                {{ product.stockQuantity || 0 }}
              </p>
            </div>
          </div>

          <div v-if="product.description" class="bg-slate-800/50 rounded-lg p-4">
            <p class="text-sm text-slate-400 mb-2">Description</p>
            <p class="text-white">{{ product.description }}</p>
          </div>

          <!-- Additional Details -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="bg-slate-800/50 rounded-lg p-3">
              <p class="text-slate-400">Created</p>
              <p class="text-white">{{ formatDate(product.createdAt) }}</p>
            </div>
            <div class="bg-slate-800/50 rounded-lg p-3">
              <p class="text-slate-400">Updated</p>
              <p class="text-white">{{ formatDate(product.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="$emit('edit', product)"
            class="flex-1 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Product
          </button>
          <button
            @click="$emit('delete', product.id)"
            class="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Product
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  stockQuantity?: number
  productType: 'PHYSICAL' | 'DIGITAL'
  category?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface Props {
  product: Product
}

defineProps<Props>()
defineEmits<{
  close: []
  edit: [product: Product]
  delete: [productId: string]
}>()

const getStockColor = (stock: number | undefined) => {
  if (!stock || stock === 0) return 'text-red-400'
  if (stock < 10) return 'text-yellow-400'
  return 'text-green-400'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>