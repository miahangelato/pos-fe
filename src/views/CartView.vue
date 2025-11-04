<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Header -->
    <header class="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-xl sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="router.push('/marketplace')"
              class="text-slate-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-white">Shopping Cart</h1>
              <p class="text-sm text-slate-400 mt-1">{{ cartStore.itemCount }} items</p>
            </div>
          </div>
          <button
            class="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
            @click="handleSignOut"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Empty Cart State -->
      <div v-if="cartStore.isEmpty" class="text-center py-12">
        <svg class="w-24 h-24 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
        <p class="text-slate-400 mb-6">Add some products to get started</p>
        <button
          @click="router.push('/marketplace')"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Browse Products
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-4 flex gap-4"
          >
            <!-- Product Image -->
            <div class="w-24 h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-600">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-white mb-1">{{ item.name }}</h3>
              <p class="text-sm text-slate-400 mb-2">by {{ item.merchantName || 'Unknown Merchant' }}</p>
              <p class="text-xl font-bold text-blue-400">₱{{ item.price.toLocaleString() }}</p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex flex-col items-end gap-2">
              <button
                @click="cartStore.removeItem(item.id)"
                class="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <div class="flex items-center gap-2 bg-slate-800 rounded-lg">
                <button
                  @click="cartStore.decrementQuantity(item.id)"
                  class="px-3 py-2 text-white hover:bg-slate-700 rounded-l-lg transition-colors"
                >
                  -
                </button>
                <span class="px-4 py-2 text-white font-medium">{{ item.quantity }}</span>
                <button
                  @click="cartStore.incrementQuantity(item.id)"
                  class="px-3 py-2 text-white hover:bg-slate-700 rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>
              <p class="text-sm text-slate-400">
                Subtotal: ₱{{ (item.price * item.quantity).toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- Clear Cart Button -->
          <button
            @click="handleClearCart"
            class="w-full px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl p-6 sticky top-24">
            <h2 class="text-xl font-bold text-white mb-4">Order Summary</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-slate-300">
                <span>Subtotal ({{ cartStore.itemCount }} items)</span>
                <span>₱{{ cartStore.subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Shipping Fee</span>
                <span class="text-sm text-slate-500">Calculated at checkout</span>
              </div>
              <div class="border-t border-slate-700 pt-3 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>₱{{ cartStore.subtotal.toLocaleString() }}</span>
              </div>
            </div>

            <button
              @click="router.push('/checkout')"
              class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors mb-3"
            >
              Proceed to Checkout
            </button>

            <button
              @click="router.push('/marketplace')"
              class="w-full px-6 py-3 border border-slate-600 text-slate-300 hover:bg-slate-800/50 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

function handleClearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}

async function handleSignOut() {
  await authStore.signOut()
  router.push({ name: 'signin' })
}
</script>
