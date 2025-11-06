<template>
  <div class="fixed inset-0 bg-white/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
    <div class="relative top-4 mx-auto p-5 border border-slate-700/50 w-full max-w-7xl shadow-lg rounded-md bg-slate-900 min-h-screen">
      <div class="flex h-full">
        <!-- Main Content Area -->
        <div class="flex-1 pr-6">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
            <h3 class="text-2xl font-semibold text-white">Create Order</h3>
            <button
              @click="$emit('close')"
              class="text-slate-400 hover:text-slate-300 transition-colors"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Tab Navigation -->
          <div class="mb-6">
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
                Products
              </button>
              <button
                @click="activeTab = 'checkout'"
                :class="[
                  activeTab === 'checkout'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600',
                  'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                Checkout
                <span
                  v-if="cartItems.length > 0"
                  class="ml-2 bg-blue-500/20 text-blue-400 py-0.5 px-2.5 rounded-full text-xs font-medium"
                >
                  {{ cartItems.length }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Products Tab -->
          <div v-if="activeTab === 'products'" class="space-y-6">
            <!-- Category Filter and Search -->
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search products..."
                  class="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                />
              </div>
              <select
                v-model="selectedCategoryId"
                class="px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white"
              >
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Products Grid -->
            <div v-if="loading" class="flex justify-center items-center h-64">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-white">No products found</h3>
              <p class="mt-2 text-sm text-slate-400">Try adjusting your search criteria.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-400 hover:bg-slate-800"
              >
                <!-- Clickable Product Info Area -->
                <div 
                  @click="showProductDetailModal(product)"
                  class="cursor-pointer"
                >
                  <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-blue-500/20 mb-3">
                    <img
                      v-if="product.imageUrl"
                      :src="product.imageUrl"
                      :alt="product.name"
                      class="h-32 w-full object-cover object-center"
                    />
                    <div v-else class="h-32 w-full flex items-center justify-center">
                      <svg class="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
                      </svg>
                    </div>
                  </div>
                  
                  <h4 class="text-sm font-semibold text-white mb-1">{{ product.name }}</h4>
                  <p v-if="product.description" class="text-xs text-slate-400 mb-2 line-clamp-2">{{ product.description }}</p>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-lg font-bold text-white">₱{{ product.price.toFixed(2) }}</span>
                    <span
                      :class="{
                        'bg-green-500/20 text-green-400': product.productType === 'PHYSICAL',
                        'bg-blue-500/20 text-blue-400': product.productType === 'DIGITAL'
                      }"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ product.productType }}
                    </span>
                  </div>

                  <div v-if="product.productType === 'PHYSICAL'" class="text-xs text-slate-400 mb-3">
                    Stock: {{ product.stockQuantity || 0 }}
                  </div>

                  <p class="text-xs text-blue-400 font-medium hover:text-blue-300 mb-3">
                    👆 Click to view details
                  </p>
                </div>

                <!-- Add to Cart Button (Non-clickable area) -->
                <button
                  @click.stop="addToCart(product)"
                  :disabled="product.productType === 'PHYSICAL' && product.stockQuantity <= 0"
                  class="w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  :class="product.productType === 'PHYSICAL' && product.stockQuantity <= 0 
                    ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' 
                    : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300'"
                >
                  <div class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {{ product.productType === 'PHYSICAL' && product.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart' }}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Checkout Tab -->
          <div v-if="activeTab === 'checkout'" class="space-y-6">
            <!-- Customer Information -->
            <div class="bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg">
              <h4 class="text-lg font-semibold text-white mb-4">Customer Information</h4>
              
              <!-- Customer Search -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-slate-300 mb-2">
                  Search Existing Customer
                </label>
                <div class="relative">
                  <input
                    v-model="customerSearchQuery"
                    @input="searchCustomers"
                    type="text"
                    placeholder="Type at least 2 characters to search..."
                    class="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white placeholder-slate-500"
                  />
                  
                  <!-- Loading indicator -->
                  <div v-if="customerSearchQuery.length >= 2 && searchResults.length === 0" class="absolute right-3 top-3">
                    <div class="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                  
                  <!-- Search Results Dropdown -->
                  <div
                    v-if="searchResults.length > 0"
                    class="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                  >
                    <div
                      v-for="customer in searchResults"
                      :key="customer.id"
                      @click="selectCustomer(customer)"
                      class="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 last:border-b-0 transition-colors"
                    >
                      <p class="font-semibold text-white" v-html="highlightMatch(customer.fullName, customerSearchQuery)"></p>
                      <p class="text-sm text-slate-400">📧 <span v-html="highlightMatch(customer.email, customerSearchQuery)"></span></p>
                      <p class="text-sm text-slate-400">📱 <span v-html="highlightMatch(customer.mobileNumber, customerSearchQuery)"></span></p>
                    </div>
                  </div>
                  
                  <!-- No results message -->
                  <div
                    v-if="customerSearchQuery.length >= 2 && searchResults.length === 0 && !searching"
                    class="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-3"
                  >
                    <p class="text-sm text-slate-400 text-center">No customers found</p>
                  </div>
                </div>
              </div>

              <!-- Customer Form -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    First Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.firstName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Last Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.lastName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                  <div v-if="selectedCustomerId" class="mt-1 text-xs text-slate-400">
                    ℹ️ Order notifications will be sent to the customer's registered email
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Mobile Number <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerForm.mobileNumber"
                    type="tel"
                    required
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            <!-- Order Type -->
            <div class="bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg">
              <h4 class="text-lg font-semibold text-white mb-4">Order Type</h4>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="orderForm.orderType"
                    type="radio"
                    value="ONLINE"
                    class="form-radio h-4 w-4 text-blue-600"
                  />
                  <span class="ml-2 text-sm text-slate-300">Online Order</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="orderForm.orderType"
                    type="radio"
                    value="IN_STORE"
                    class="form-radio h-4 w-4 text-blue-600"
                  />
                  <span class="ml-2 text-sm text-slate-300">In-Store Order</span>
                </label>
              </div>
            </div>

            <!-- Digital Products Notice -->
            <div v-if="!hasPhysicalProducts && cartItems.length > 0" class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div>
                  <h5 class="text-sm font-medium text-blue-400">Digital Products Only</h5>
                  <p class="text-sm text-blue-300 mt-1">
                    This order contains only digital products. Delivery information is not required.
                  </p>
                </div>
              </div>
            </div>

            <!-- Delivery Information (only for online orders) -->
            <div v-if="orderForm.orderType === 'ONLINE' && hasPhysicalProducts" class="bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg">
              <h4 class="text-lg font-semibold text-white mb-4">Delivery Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Province <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="deliveryForm.province"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    City <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="deliveryForm.city"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Barangay <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="deliveryForm.barangay"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Street <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="deliveryForm.street"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Unit/Floor</label>
                  <input
                    v-model="deliveryForm.unitFloor"
                    type="text"
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Building Name</label>
                  <input
                    v-model="deliveryForm.buildingName"
                    type="text"
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-slate-300 mb-2">Landmark</label>
                  <input
                    v-model="deliveryForm.landmark"
                    type="text"
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-slate-300 mb-2">Remarks</label>
                  <textarea
                    v-model="deliveryForm.remarks"
                    rows="2"
                    class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            <!-- Payment and Shipping -->
            <div class="space-y-6">
              <!-- Payment Method -->
              <div class="bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg">
                <h4 class="text-lg font-semibold text-white mb-4">Payment Method</h4>
                <select
                  v-model="orderForm.paymentMethod"
                  required
                  class="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-800 text-white"
                >
                  <option value="">Select payment method</option>
                  <option value="CASH">Cash</option>
                  <option value="GCASH">GCash</option>
                </select>
              </div>

              <!-- Shipping Method Toggle (only for online orders with physical products) -->
              <div v-if="orderForm.orderType === 'ONLINE' && hasPhysicalProducts">
                <button
                  type="button"
                  @click="showShippingOptions = !showShippingOptions"
                  class="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-between"
                >
                  <span>🚚 Show Available Shipping Options</span>
                  <svg
                    class="w-5 h-5 transform transition-transform"
                    :class="{ 'rotate-180': showShippingOptions }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                <!-- Shipping Options (Hidden by default) -->
                <transition name="slide">
                  <div v-show="showShippingOptions" class="mt-4 bg-slate-800/50 border border-slate-700/50 p-6 rounded-lg">
                    <h4 class="text-lg font-semibold text-white mb-4">Shipping Method</h4>
                    <div class="space-y-3">
                      <label class="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50 cursor-pointer text-slate-300" :class="{ 'border-blue-500 bg-blue-500/10': orderForm.shippingMethod === 'STANDARD' }">
                        <input
                          type="radio"
                          v-model="orderForm.shippingMethod"
                          value="STANDARD"
                          class="w-4 h-4 text-blue-600"
                        />
                        <span class="ml-3 flex-1">
                          <strong class="text-white">Standard Delivery</strong> - 3-5 business days (₱100)
                        </span>
                      </label>
                      <label class="flex items-center p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50 cursor-pointer text-slate-300" :class="{ 'border-blue-500 bg-blue-500/10': orderForm.shippingMethod === 'EXPRESS' }">
                        <input
                          type="radio"
                          v-model="orderForm.shippingMethod"
                          value="EXPRESS"
                          class="w-4 h-4 text-blue-600"
                        />
                        <span class="ml-3 flex-1">
                          <strong class="text-white">Express Delivery</strong> - 1-2 business days (₱200)
                        </span>
                      </label>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Sidebar -->
        <div class="w-96 bg-slate-800/50 p-6 border-l border-slate-700/50">
          <h4 class="text-lg font-semibold text-white mb-4">Cart</h4>
          
          <!-- Empty Cart -->
          <div v-if="cartItems.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <p class="mt-2 text-sm text-slate-400">Your cart is empty</p>
          </div>

          <!-- Cart Items -->
          <div v-else class="space-y-4 mb-6">
            <div
              v-for="item in cartItems"
              :key="item.productId"
              class="bg-slate-900/50 border border-slate-700/50 p-4 rounded-lg"
            >
              <div class="flex items-start space-x-3">
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
                
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-white truncate">{{ item.product.name }}</p>
                  <p class="text-sm text-slate-400">₱{{ item.product.price.toFixed(2) }} each</p>
                  
                  <div class="flex items-center space-x-2 mt-2">
                    <button
                      @click="updateCartItemQuantity(item.productId, item.quantity - 1)"
                      class="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-500"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="text-sm font-medium text-white">{{ item.quantity }}</span>
                    <button
                      @click="updateCartItemQuantity(item.productId, item.quantity + 1)"
                      class="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 hover:bg-slate-500"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button
                      @click="removeFromCart(item.productId)"
                      class="ml-auto text-red-400 hover:text-red-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <p class="text-sm font-medium text-white mt-1">
                    Subtotal: ₱{{ (item.product.price * item.quantity).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div v-if="cartItems.length > 0" class="border-t border-slate-700/50 pt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Subtotal:</span>
              <span class="font-medium text-white">₱{{ subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="hasPhysicalProducts && orderForm.orderType === 'ONLINE'" class="flex justify-between text-sm">
              <span class="text-slate-400">Delivery Fee:</span>
              <span class="font-medium text-white">₱{{ deliveryFee.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Convenience Fee:</span>
              <span class="font-medium text-white">₱{{ convenienceFee.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-semibold border-t border-slate-700/50 pt-2">
              <span class="text-white">Total:</span>
              <span class="text-white">₱{{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 space-y-3">
            <AppButton
              v-if="activeTab === 'products' && cartItems.length > 0"
              label="Continue to Checkout"
              variant="primary"
              size="md"
              class="w-full"
              @click="activeTab = 'checkout'"
            />
            
            <AppButton
              v-if="activeTab === 'checkout'"
              label="Place Order"
              variant="primary"
              size="md"
              class="w-full"
              :loading="submitting"
              :disabled="!canSubmitOrder"
              @click="submitOrder"
            />
            
            <AppButton
              label="Cancel"
              variant="secondary"
              size="md"
              class="w-full"
              @click="$emit('close')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Order Success Modal -->
    <OrderSuccessModal
      v-if="showSuccessModal"
      :order="createdOrder"
      @close="closeSuccessModal"
    />

    <!-- Product Detail Modal -->
    <ProductDetailModal
      v-if="showProductDetail && selectedProduct"
      :product="selectedProduct"
      @close="closeProductDetailModal"
      @addToCart="handleAddToCartFromModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useDebounceFn } from '@vueuse/core'
import AppButton from '@/components/Common/AppButton.vue'
import OrderSuccessModal from './OrderSuccessModal.vue'
import ProductDetailModal from './ProductDetailModal.vue'
import { PRODUCTS_QUERY, CATEGORIES_QUERY, CUSTOMERS_QUERY } from '@/graphql/queries'
import { CREATE_ORDER_MUTATION, SEARCH_CUSTOMERS_MUTATION } from '@/graphql/mutations'

// Types
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

interface Category {
  id: string
  name: string
}

interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  mobileNumber: string
}

interface CartItem {
  productId: string
  product: Product
  quantity: number
}

// Emits
const emit = defineEmits<{
  close: []
  created: [order: any]
}>()

// Reactive data
const activeTab = ref('products')
const searchQuery = ref('')
const selectedCategoryId = ref('')
const customerSearchQuery = ref('')
const searchResults = ref<Customer[]>([])
const searching = ref(false)
const cartItems = ref<CartItem[]>([])
const submitting = ref(false)
const showSuccessModal = ref(false)
const createdOrder = ref<any>(null)
const selectedCustomerId = ref<string | null>(null)
const isSelectingCustomer = ref(false) // Flag to prevent watchers from clearing selectedCustomerId
const showShippingOptions = ref(false) // Control visibility of shipping options
const selectedProduct = ref<Product | null>(null) // Track selected product for detail modal
const showProductDetail = ref(false) // Control visibility of product detail modal

// Forms
const customerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: ''
})

const orderForm = reactive({
  orderType: 'ONLINE',
  paymentMethod: '',
  shippingMethod: 'STANDARD'  // Set default shipping method
})

const deliveryForm = reactive({
  province: '',
  city: '',
  barangay: '',
  street: '',
  unitFloor: '',
  buildingName: '',
  landmark: '',
  remarks: ''
})

// GraphQL queries
const { result: productsResult, loading } = useQuery(PRODUCTS_QUERY, {
  categoryId: computed(() => selectedCategoryId.value || null)
})

const { result: categoriesResult } = useQuery(CATEGORIES_QUERY)

// GraphQL mutations
const { mutate: createOrder } = useMutation(CREATE_ORDER_MUTATION)
const { mutate: searchCustomersMutation } = useMutation(SEARCH_CUSTOMERS_MUTATION)

// Computed properties
const products = computed<Product[]>(() => productsResult.value?.products || [])
const categories = computed<Category[]>(() => categoriesResult.value?.categories || [])

const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const hasPhysicalProducts = computed(() => {
  return cartItems.value.some(item => item.product.productType === 'PHYSICAL')
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
})

const deliveryFee = computed(() => {
  if (orderForm.orderType === 'IN_STORE' || !hasPhysicalProducts.value) return 0
  return 50 // Default delivery fee
})

const convenienceFee = computed(() => 10) // Default convenience fee

const grandTotal = computed(() => {
  return subtotal.value + deliveryFee.value + convenienceFee.value
})

const canSubmitOrder = computed(() => {
  const hasCustomerInfo = customerForm.firstName && customerForm.lastName && 
                         customerForm.email && customerForm.mobileNumber
  const hasPaymentMethod = orderForm.paymentMethod
  const hasCartItems = cartItems.value.length > 0
  
  let hasDeliveryInfo = true
  if (orderForm.orderType === 'ONLINE' && hasPhysicalProducts.value) {
    hasDeliveryInfo = deliveryForm.province && deliveryForm.city && 
                     deliveryForm.barangay && deliveryForm.street
  }

  return hasCustomerInfo && hasPaymentMethod && hasCartItems && hasDeliveryInfo && !submitting.value
})

// No watchers needed - allow editing selected customer details
// The customer_id will be sent to backend to update the existing customer

// Methods
function showProductDetailModal(product: Product) {
  selectedProduct.value = product
  showProductDetail.value = true
}

function closeProductDetailModal() {
  showProductDetail.value = false
  selectedProduct.value = null
}

function handleAddToCartFromModal(payload: { product: Product; quantity: number }) {
  const existingItem = cartItems.value.find(item => item.productId === payload.product.id)
  
  if (existingItem) {
    existingItem.quantity += payload.quantity
  } else {
    cartItems.value.push({
      productId: payload.product.id,
      product: payload.product,
      quantity: payload.quantity
    })
  }
  
  closeProductDetailModal()
}

function addToCart(product: Product) {
  const existingItem = cartItems.value.find(item => item.productId === product.id)
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.value.push({
      productId: product.id,
      product,
      quantity: 1
    })
  }
}

function updateCartItemQuantity(productId: string, newQuantity: number) {
  if (newQuantity <= 0) {
    removeFromCart(productId)
    return
  }

  const item = cartItems.value.find(item => item.productId === productId)
  if (item) {
    item.quantity = newQuantity
  }
}

function removeFromCart(productId: string) {
  const index = cartItems.value.findIndex(item => item.productId === productId)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

const debouncedSearch = useDebounceFn(async () => {
  if (customerSearchQuery.value.length < 2) {
    searchResults.value = []
    searching.value = false
    return
  }

  searching.value = true
  
  try {
    console.log('Searching for customers:', customerSearchQuery.value)
    const result = await searchCustomersMutation({
      query: customerSearchQuery.value
    })
    
    console.log('Search result:', result)
    
    if (result?.data?.searchCustomers?.customers) {
      searchResults.value = result.data.searchCustomers.customers
      console.log('Found customers:', searchResults.value.length)
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('Error searching customers:', error)
    searchResults.value = []
  } finally {
    searching.value = false
  }
}, 300)

function searchCustomers() {
  debouncedSearch()
}

function selectCustomer(customer: Customer) {
  console.log('Selecting customer:', customer)
  
  // Set flag to prevent watchers from clearing selectedCustomerId
  isSelectingCustomer.value = true
  
  selectedCustomerId.value = customer.id
  console.log('Set selectedCustomerId to:', selectedCustomerId.value)
  
  customerForm.firstName = customer.firstName
  customerForm.lastName = customer.lastName
  customerForm.email = customer.email
  customerForm.mobileNumber = customer.mobileNumber
  
  searchResults.value = []
  customerSearchQuery.value = ''
  
  // Reset flag after a short delay to allow all watchers to process
  setTimeout(() => {
    isSelectingCustomer.value = false
  }, 100)
}

function highlightMatch(text: string, query: string): string {
  if (!query || !text) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 font-semibold px-0.5 rounded">$1</mark>')
}

async function submitOrder() {
  if (!canSubmitOrder.value) return

  submitting.value = true

  try {
    const orderItemsInput = cartItems.value.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))

    const variables: any = {
      orderItems: orderItemsInput,
      orderType: orderForm.orderType,
      paymentMethod: orderForm.paymentMethod
    }

    // Handle customer selection - no customer updates, just use for order context
    if (selectedCustomerId.value) {
      console.log('Using selected customer ID for order:', selectedCustomerId.value)
      variables.customerId = selectedCustomerId.value
      
      // Note: We don't send customerAttributes when using existing customer
      // Any form changes are just for this order's context (like email for notifications)
      // The original customer record remains unchanged
      console.log('Customer form data will be used for order context only, not updating customer record')
    } else {
      console.log('Creating new customer with provided attributes')
      // Only create new customer when no existing customer was selected
      variables.customerAttributes = {
        email: customerForm.email,
        firstName: customerForm.firstName,
        lastName: customerForm.lastName,
        mobileNumber: customerForm.mobileNumber
      }
    }

    // Add shipping method for ONLINE orders (required by backend)
    if (orderForm.orderType === 'ONLINE') {
      variables.shippingMethod = orderForm.shippingMethod || 'STANDARD'
    }

    // Add delivery address for ONLINE orders with physical products
    if (orderForm.orderType === 'ONLINE' && hasPhysicalProducts.value) {
      variables.deliveryAddressAttributes = {
        province: deliveryForm.province,
        city: deliveryForm.city,
        barangay: deliveryForm.barangay,
        street: deliveryForm.street,
        unitFloor: deliveryForm.unitFloor || null,
        buildingName: deliveryForm.buildingName || null,
        landmark: deliveryForm.landmark || null,
        remarks: deliveryForm.remarks || null
      }
    }

    console.log('Order variables:', JSON.stringify(variables, null, 2))

    const result = await createOrder(variables)

    console.log('DEBUG: Full mutation result:', result)
    console.log('DEBUG: result.data:', result?.data)
    console.log('DEBUG: result.data.createOrder:', result?.data?.createOrder)

    if (result?.data?.createOrder?.order) {
      console.log('DEBUG: Order created successfully:', result.data.createOrder.order)
      // Store the created order and show success modal
      createdOrder.value = result.data.createOrder.order
      showSuccessModal.value = true
      
      // Emit event so parent can refetch orders
      emit('created', result.data.createOrder.order)
      
      // Reset selected customer ID on successful order creation
      selectedCustomerId.value = null
    } else {
      console.log('DEBUG: Order creation failed')
      console.log('DEBUG: Errors:', result?.data?.createOrder?.errors)
      const errors = result?.data?.createOrder?.errors || ['Unknown error occurred']
      alert('Error creating order: ' + errors.join(', '))
    }
  } catch (error) {
    console.error('Error creating order:', error)
    alert('Failed to create order')
  } finally {
    submitting.value = false
  }
}

function closeSuccessModal() {
  showSuccessModal.value = false
  createdOrder.value = null
  // Reset the form and close the modal
  cartItems.value = []
  customerForm.firstName = ''
  customerForm.lastName = ''
  customerForm.email = ''
  customerForm.mobileNumber = ''
  deliveryForm.province = ''
  deliveryForm.city = ''
  deliveryForm.barangay = ''
  deliveryForm.street = ''
  deliveryForm.unitFloor = ''
  deliveryForm.buildingName = ''
  deliveryForm.landmark = ''
  deliveryForm.remarks = ''
  orderForm.orderType = 'ONLINE'
  orderForm.paymentMethod = ''
  orderForm.shippingMethod = 'STANDARD'
  emit('close')
}

// Lifecycle
onMounted(() => {
  // Initialize with default values
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.form-radio {
  height: 1rem;
  width: 1rem;
  color: rgb(37, 99, 235);
  border-color: rgb(209, 213, 219);
}

.form-radio:focus {
  --tw-ring-color: rgb(59, 130, 246);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>