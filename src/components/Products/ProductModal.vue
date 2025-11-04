<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ product ? 'Edit Product' : 'Add New Product' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Product Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div class="space-y-4">
              <!-- Image Preview -->
              <div class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <img 
                  v-if="form.imageUrl" 
                  :src="form.imageUrl" 
                  alt="Product preview" 
                  class="w-full h-full object-cover rounded-lg"
                  @error="handleImageError"
                />
                <svg v-else class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <!-- Image Upload Options -->
              <div class="space-y-3">
                <!-- File Upload -->
                <div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    class="hidden"
                  />
                  <AppButton
                    type="button"
                    label="Upload Image File"
                    variant="secondary"
                    size="sm"
                    @click="$refs.fileInput?.click()"
                  />
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
                
                <!-- URL Input -->
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Or enter image URL</label>
                  <input
                    v-model="form.imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <!-- Clear Image -->
                <AppButton
                  v-if="form.imageUrl"
                  type="button"
                  label="Clear Image"
                  variant="outline"
                  size="sm"
                  @click="clearImage"
                />
              </div>
            </div>
          </div>

          <!-- Product Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <!-- Product Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          <!-- Category -->
          <div>
            <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-2">
              Category <span class="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              v-model="form.categoryId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Product Type and Price -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="productType" class="block text-sm font-medium text-gray-700 mb-2">
                Product Type <span class="text-red-500">*</span>
              </label>
              <select
                id="productType"
                v-model="form.productType"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="PHYSICAL">Physical</option>
                <option value="DIGITAL">Digital</option>
              </select>
            </div>

            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                Price (₱) <span class="text-red-500">*</span>
              </label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Stock Quantity (only for physical products) -->
          <div v-if="form.productType === 'PHYSICAL'">
            <label for="stockQuantity" class="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              id="stockQuantity"
              v-model.number="form.stockQuantity"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter stock quantity"
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t">
            <AppButton
              type="button"
              label="Cancel"
              variant="secondary"
              @click="$emit('close')"
            />
            <AppButton
              type="submit"
              :label="product ? 'Update Product' : 'Create Product'"
              variant="primary"
              :loading="loading"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import AppButton from '@/components/Common/AppButton.vue'
import { CREATE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION } from '@/graphql/mutations'

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

// Props
interface Props {
  product?: Product | null
  categories: Category[]
}

const props = withDefaults(defineProps<Props>(), {
  product: null
})

// Emits
const emit = defineEmits<{
  close: []
  save: []
}>()

// Form data
const form = reactive({
  name: '',
  description: '',
  categoryId: '',
  productType: '',
  price: 0,
  stockQuantity: 0,
  imageUrl: ''
})

// Reactive refs
const loading = ref(false)

// GraphQL mutations
const { mutate: createProduct } = useMutation(CREATE_PRODUCT_MUTATION)
const { mutate: updateProduct } = useMutation(UPDATE_PRODUCT_MUTATION)

// Initialize form with product data if editing
watch(() => props.product, async (newProduct) => {
  console.log('Product prop changed:', newProduct) // Debug log
  await nextTick() // Wait for DOM to update
  initializeForm(newProduct)
}, { immediate: true })

// Also initialize on component mount
onMounted(async () => {
  console.log('ProductModal mounted with product:', props.product) // Debug log
  await nextTick()
  initializeForm(props.product)
})

function initializeForm(product: Product | null) {
  console.log('Initializing form with product:', product) // Debug log
  if (product) {
    // Set all form fields explicitly
    form.name = product.name || ''
    form.description = product.description || ''
    form.categoryId = product.category?.id || ''
    form.productType = product.productType || ''
    form.price = product.price || 0
    form.stockQuantity = product.stockQuantity || 0
    form.imageUrl = product.imageUrl || ''
    
    console.log('Form after initialization:', { ...form }) // Debug log
    console.log('Product ID for editing:', product.id) // Debug log
  } else {
    // Reset form for new product
    form.name = ''
    form.description = ''
    form.categoryId = ''
    form.productType = ''
    form.price = 0
    form.stockQuantity = 0
    form.imageUrl = ''
    
    console.log('Form reset for new product:', { ...form }) // Debug log
  }
}

// Methods
function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Validate file size
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB')
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }
    
    // Create data URL for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      form.imageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function handleImageError() {
  console.log('Image failed to load:', form.imageUrl)
  // Optionally clear the broken image URL
  // form.imageUrl = ''
}

function clearImage() {
  form.imageUrl = ''
  // Clear file input
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

async function handleSubmit() {
  console.log('=== FORM SUBMISSION DEBUG ===')
  console.log('Current form state:', { ...form })
  console.log('Props.product:', props.product)
  console.log('Is editing?', !!props.product)
  
  loading.value = true

  try {
    const variables = {
      name: form.name,
      description: form.description || null,
      categoryId: form.categoryId,
      productType: form.productType,
      price: form.price,
      stockQuantity: form.productType === 'PHYSICAL' ? form.stockQuantity : null,
      imageUrl: form.imageUrl || null
    }

    console.log('Variables to send:', variables)

    if (props.product && props.product.id) {
      // Update existing product
      console.log('UPDATING product with ID:', props.product.id)
      const updateVariables = {
        id: props.product.id,
        ...variables
      }
      console.log('Update mutation variables:', updateVariables)
      
      const result = await updateProduct(updateVariables)
      console.log('Update result:', result)
    } else {
      // Create new product
      console.log('CREATING new product')
      console.log('Create mutation variables:', variables)
      
      const result = await createProduct(variables)
      console.log('Create result:', result)
    }

    emit('save')
  } catch (error) {
    console.error('Error saving product:', error)
    console.error('Error details:', error)
    alert('Failed to save product. Check console for details.')
  } finally {
    loading.value = false
  }
}
</script>