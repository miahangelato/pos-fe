<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Header -->
    <header class="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-xl sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Products</h1>
            <p class="text-sm text-slate-400 mt-1">Manage your product catalog</p>
          </div>
          <AppButton label="Add Product" variant="primary" size="md" @click="showAddModal = true" />
        </div>

        <!-- Search and Filter Bar -->
        <div class="mt-4 flex flex-col sm:flex-row gap-4">
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
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0 && !loading" class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl">
        <div class="px-6 py-8 text-center">
          <svg class="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-white">
            {{ searchQuery || selectedCategoryId ? 'No products found' : 'No products yet' }}
          </h3>
          <p class="mt-2 text-sm text-slate-400">
            {{ searchQuery || selectedCategoryId 
              ? 'Try adjusting your search criteria.' 
              : 'Get started by adding your first product to the catalog.'
            }}
          </p>
          <AppButton
            v-if="!searchQuery && !selectedCategoryId"
            label="Add Your First Product"
            variant="primary"
            size="md"
            class="mt-6"
            @click="showAddModal = true"
          />
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-slate-900/50 border border-slate-700/50 rounded-lg backdrop-blur-xl hover:bg-slate-900/70 transition-colors"
        >
          <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-blue-500/20">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="h-48 w-full object-cover object-center"
            />
            <div v-else class="h-48 w-full flex items-center justify-center">
              <svg class="h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
              </svg>
            </div>
          </div>
          
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-white truncate">{{ product.name }}</h3>
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
            
            <p v-if="product.description" class="text-sm text-slate-400 mb-3 line-clamp-2">
              {{ product.description }}
            </p>
            
            <div class="flex items-center justify-between mb-3">
              <span class="text-lg font-bold text-white">₱{{ product.price.toFixed(2) }}</span>
              <span v-if="product.category" class="text-sm text-slate-400">{{ product.category.name }}</span>
            </div>

            <div v-if="product.productType === 'PHYSICAL'" class="mb-3">
              <span class="text-sm text-slate-400">
                Stock: 
                <span :class="{ 'text-red-400': (product.stockQuantity || 0) < 10 }">
                  {{ product.stockQuantity || 0 }}
                </span>
              </span>
            </div>

            <div class="flex gap-2">
              <AppButton
                label="Edit"
                variant="secondary"
                size="sm"
                class="flex-1"
                @click="editProduct(product)"
              />
              <AppButton
                label="Delete"
                variant="danger"
                size="sm"
                @click="deleteProduct(product.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add/Edit Product Modal -->
    <ProductFormModal
      :is-open="showAddModal || showEditModal"
      :is-edit-mode="showEditModal"
      :product="editingProduct"
      @close="closeModal"
      @save="handleSaveProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import AppButton from '@/components/Common/AppButton.vue'
import ProductFormModal from '@/components/Products/ProductFormModal.vue'
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/graphql/queries'
import { DELETE_PRODUCT_MUTATION } from '@/graphql/mutations'

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

// Reactive data
const searchQuery = ref('')
const selectedCategoryId = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref<Product | null>(null)

// GraphQL queries
const { result: productsResult, loading: productsLoading, refetch: refetchProducts } = useQuery(PRODUCTS_QUERY, {
  categoryId: computed(() => selectedCategoryId.value || null)
}, {
  fetchPolicy: 'cache-and-network'
})

const { result: categoriesResult, loading: categoriesLoading } = useQuery(CATEGORIES_QUERY, {}, {
  fetchPolicy: 'cache-first'
})

// GraphQL mutations
const { mutate: deleteProductMutation } = useMutation(DELETE_PRODUCT_MUTATION)

// Computed properties
const products = computed<Product[]>(() => productsResult.value?.products || [])
const categories = computed<Category[]>(() => categoriesResult.value?.categories || [])
const loading = computed(() => productsLoading.value || categoriesLoading.value)

const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.name.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
function editProduct(product: Product) {
  console.log('=== editProduct called ===')
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
  
  editingProduct.value = transformedProduct as any
  showEditModal.value = true
}

async function deleteProduct(productId: string) {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await deleteProductMutation({ id: productId })
    await refetchProducts()
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Failed to delete product')
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingProduct.value = null
}

async function handleSaveProduct() {
  closeModal()
  await refetchProducts()
}

// Watch for category changes to refetch products
watch(selectedCategoryId, () => {
  refetchProducts()
})

// Lifecycle
onMounted(() => {
  // Component is mounted
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
