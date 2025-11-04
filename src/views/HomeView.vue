<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/Common/AppButton.vue'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">POS System</span>
        </div>
        <div class="flex items-center gap-4">
          <router-link
            to="/auth/signin"
            class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Sign In
          </router-link>
          <AppButton
            label="Get Started"
            variant="primary"
            size="sm"
            @click="router.push({ name: 'signup' })"
          />
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16 animate-fade-in">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Modern Point of Sale System
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Manage your store with ease. Accept payments, track inventory, and grow your business with our comprehensive POS solution.
        </p>
        <div class="flex gap-4 justify-center">
          <AppButton
            label="Start Free Trial"
            variant="primary"
            size="lg"
            @click="router.push({ name: 'signup' })"
          />
          <AppButton
            label="Sign In"
            variant="outline"
            size="lg"
            @click="router.push({ name: 'signin' })"
          />
        </div>
      </div>

      <!-- Features Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div class="card-large">
          <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Easy Checkout</h3>
          <p class="text-gray-600">Fast and intuitive checkout process for your customers</p>
        </div>

        <div class="card-large">
          <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Real-time Reports</h3>
          <p class="text-gray-600">Get instant insights into your sales and inventory</p>
        </div>

        <div class="card-large">
          <div class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
          <p class="text-gray-600">Enterprise-grade security for all your transactions</p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p class="text-gray-600 mb-8 max-w-xl mx-auto">
          Join thousands of businesses already using our POS system to streamline their operations.
        </p>
        <AppButton
          label="Create Your Account Now"
          variant="primary"
          size="lg"
          @click="router.push({ name: 'signup' })"
        />
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h4 class="font-semibold mb-4">Product</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Legal</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Connect</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" class="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 POS System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
