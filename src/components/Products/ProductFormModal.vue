<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

        <!-- Modal Content -->
        <div class="relative bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white">
              {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
            </h2>
            <button
              type="button"
              @click="closeModal"
              class="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Content -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
            <!-- Product Photo -->
            <div>
              <label class="block text-sm font-medium text-white mb-3">Product Photo</label>
              <div class="relative">
                <div v-if="formData.photoPreview" class="mb-4 relative w-full">
                  <img :src="formData.photoPreview" alt="Product preview" class="w-full h-48 object-cover rounded-lg border border-slate-700/50" />
                  <button
                    type="button"
                    @click="removePhoto"
                    class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <input
                  type="file"
                  ref="photoInput"
                  @change="handlePhotoUpload"
                  accept="image/*"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.photoInput?.click()"
                  class="w-full px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 transition-colors text-slate-400 hover:text-slate-300"
                >
                  <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Click to upload or drag and drop
                </button>
              </div>
              <p v-if="errors.photo" class="mt-2 text-sm text-red-400">{{ errors.photo }}</p>
            </div>

            <!-- Product Name -->
            <div>
              <label for="productName" class="block text-sm font-medium text-white mb-2">
                Product Name <span class="text-red-400">*</span>
              </label>
              <input
                id="productName"
                v-model="formData.name"
                type="text"
                placeholder="Enter product name"
                required
                class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
                @blur="validateField('name')"
              />
              <p v-if="errors.name" class="mt-2 text-sm text-red-400">{{ errors.name }}</p>
            </div>

            <!-- Product Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-white mb-2">
                Product Description <span class="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                placeholder="Enter product description"
                rows="4"
                class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70 resize-none"
              ></textarea>
              <p v-if="errors.description" class="mt-2 text-sm text-red-400">{{ errors.description }}</p>
            </div>

            <!-- Product Type -->
            <div>
              <label for="productType" class="block text-sm font-medium text-white mb-2">
                Product Type <span class="text-red-400">*</span>
              </label>
              <select
                id="productType"
                v-model="formData.type"
                class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
              >
                <option value="">Select product type</option>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
              <p v-if="errors.type" class="mt-2 text-sm text-red-400">{{ errors.type }}</p>
            </div>

            <!-- Category Section -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-white">
                  Product Category <span class="text-red-400">*</span>
                </label>
              </div>

              <!-- Category Form (Hidden by default) -->
              <div v-if="showCategoryForm" class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-3">
                <div>
                  <input
                    v-model="newCategory"
                    type="text"
                    placeholder="Enter new category name"
                    class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
                  />
                </div>
                <button
                  type="button"
                  @click="addCategory"
                  class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create Category
                </button>
              </div>

              <!-- Category Dropdown -->
              <select
                v-model="formData.categoryId"
                required
                class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
              >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <p v-if="errors.categoryId" class="mt-2 text-sm text-red-400">{{ errors.categoryId }}</p>
            </div>

            <!-- Price -->
            <div>
              <label for="price" class="block text-sm font-medium text-white mb-2">
                Product Price <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₱</span>
                <input
                  id="price"
                  v-model="formData.price"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  class="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
                  @blur="validateField('price')"
                />
              </div>
              <p v-if="errors.price" class="mt-2 text-sm text-red-400">{{ errors.price }}</p>
            </div>

            <!-- Stock Quantity (for physical products) -->
            <div v-if="formData.type === 'physical'">
              <label for="stock" class="block text-sm font-medium text-white mb-2">
                Stock Quantity <span class="text-red-400">*</span>
              </label>
              <input
                id="stock"
                v-model="formData.stock"
                type="number"
                placeholder="0"
                min="0"
                required
                class="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-slate-900/70"
                @blur="validateField('stock')"
              />
              <p v-if="errors.stock" class="mt-2 text-sm text-red-400">{{ errors.stock }}</p>
            </div>

            <!-- Error Message -->
            <Transition name="fade">
              <div v-if="submitError" class="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm text-red-300">{{ submitError }}</p>
                </div>
              </div>
            </Transition>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4 border-t border-slate-700/50">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-3 border border-slate-600 text-slate-300 hover:text-white rounded-lg font-medium transition-colors hover:bg-slate-800/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg v-if="isLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, CREATE_CATEGORY, GET_CATEGORIES } from '@/graphql/products'

interface Product {
  id?: string
  name: string
  description: string
  type: 'physical' | 'digital' | ''
  price: number | string
  stock: number | string
  categoryId: string
  photo?: File | string
  photoPreview?: string
}

interface Category {
  id: string
  name: string
}

interface Props {
  isOpen: boolean
  isEditMode?: boolean
  product?: Product
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
})

const emit = defineEmits<{
  close: []
  save: [product: Product]
}>()

const photoInput = ref<HTMLInputElement>()
const isLoading = ref(false)
const submitError = ref('')
const showCategoryForm = ref(false)
const newCategory = ref('')

// GraphQL Queries and Mutations
const { result: categoriesResult, loading: loadingCategories } = useQuery(GET_CATEGORIES, null, {
  pollInterval: 0,
})

const { mutate: createProductMutation } = useMutation(CREATE_PRODUCT)
const { mutate: updateProductMutation } = useMutation(UPDATE_PRODUCT)
const { mutate: createCategoryMutation } = useMutation(CREATE_CATEGORY)

// Computed categories from GraphQL
const categories = computed(() => {
  return categoriesResult.value?.categories || []
})

const formData = reactive<Product>({
  name: '',
  description: '',
  type: '',
  price: '',
  stock: '',
  categoryId: '',
})

const errors = ref<Partial<Record<keyof Product, string>>>({})

const isEditModeComputed = computed(() => props.isEditMode)

/**
 * Initialize form with product data if in edit mode
 */
async function initializeForm() {
  console.log('=== initializeForm called ===')
  console.log('isEditMode:', isEditModeComputed.value)
  console.log('props.product:', props.product)
  
  if (isEditModeComputed.value && props.product) {
    console.log('Initializing form with product data...')
    
    // Use nextTick to ensure the form is ready
    await nextTick()
    
    formData.id = props.product.id
    formData.name = props.product.name
    formData.description = props.product.description
    formData.type = props.product.type
    formData.price = props.product.price
    formData.stock = props.product.stock
    formData.categoryId = props.product.categoryId
    if (typeof props.product.photo === 'string') {
      formData.photoPreview = props.product.photo
    }
    
    // Wait another tick for the select elements to update
    await nextTick()
    
    console.log('Form data after initialization:', { ...formData })
    console.log('Type:', formData.type, 'CategoryId:', formData.categoryId, 'Stock:', formData.stock)
  } else {
    console.log('Resetting form for new product')
    resetForm()
  }
}

/**
 * Handle photo upload
 */
function handlePhotoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errors.value.photo = 'File size must be less than 5MB'
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    errors.value.photo = 'File must be an image'
    return
  }

  formData.photo = file
  errors.value.photo = ''

  // Create preview
  const reader = new FileReader()
  reader.onload = () => {
    formData.photoPreview = reader.result as string
  }
  reader.readAsDataURL(file)
}

/**
 * Remove uploaded photo
 */
function removePhoto() {
  formData.photo = undefined
  formData.photoPreview = undefined
  if (photoInput.value) {
    photoInput.value.value = ''
  }
}

/**
 * Add new category
 */
async function addCategory() {
  if (!newCategory.value.trim()) {
    return
  }

  try {
    const result = await createCategoryMutation({
      name: newCategory.value,
    })

    if (result?.data?.createCategory?.category) {
      const newCat = result.data.createCategory.category
      formData.categoryId = newCat.id
      newCategory.value = ''
      showCategoryForm.value = false
    } else if (result?.data?.createCategory?.errors?.length) {
      submitError.value = result.data.createCategory.errors[0]
    }
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Failed to create category'
  }
}

/**
 * Validate a single field
 */
function validateField(field: keyof Product) {
  errors.value[field] = ''

  switch (field) {
    case 'name':
      if (!formData.name.trim()) {
        errors.value.name = 'Product name is required'
      }
      break
    case 'price':
      if (!formData.price) {
        errors.value.price = 'Price is required'
      } else if (Number(formData.price) < 0) {
        errors.value.price = 'Price must be greater than 0'
      }
      break
    case 'stock':
      if (formData.type === 'physical' && !formData.stock) {
        errors.value.stock = 'Stock quantity is required for physical products'
      } else if (Number(formData.stock) < 0) {
        errors.value.stock = 'Stock must be greater than or equal to 0'
      }
      break
    case 'categoryId':
      if (!formData.categoryId) {
        errors.value.categoryId = 'Please select a category'
      }
      break
  }
}

/**
 * Validate all fields
 */
function validateForm(): boolean {
  Object.keys(formData).forEach((field) => {
    if (field !== 'photo' && field !== 'photoPreview') {
      validateField(field as keyof Product)
    }
  })

  return Object.values(errors.value).every((error) => !error)
}

/**
 * Handle form submission
 */
async function handleSubmit() {
  console.log('=== FORM SUBMIT ===')
  console.log('formData:', { ...formData })
  console.log('isEditMode:', props.isEditMode)
  console.log('formData.id:', formData.id)
  
  submitError.value = ''

  if (!validateForm()) {
    console.log('Form validation failed')
    return
  }

  isLoading.value = true

  try {
    const variables = {
      name: formData.name,
      description: formData.description || null,
      price: Number(formData.price),
      productType: formData.type?.toUpperCase() || 'PHYSICAL',
      stockQuantity: formData.type === 'physical' ? Number(formData.stock) : null,
      categoryId: formData.categoryId,
    }

    console.log('Variables prepared:', variables)

    let result
    if (props.isEditMode && formData.id) {
      // Update existing product
      console.log('UPDATING EXISTING PRODUCT - ID:', formData.id)
      result = await updateProductMutation({
        id: formData.id,
        ...variables,
      })
      console.log('Update result:', result)
      if (result?.data?.updateProduct?.product) {
        // Upload image if provided
        if (formData.photo instanceof File) {
          await uploadProductImage(formData.id, formData.photo)
        }
        emit('save', result.data.updateProduct.product)
        closeModal()
      } else if (result?.data?.updateProduct?.errors?.length) {
        submitError.value = result.data.updateProduct.errors[0]
      }
    } else {
      // Create new product
      console.log('CREATING NEW PRODUCT')
      result = await createProductMutation(variables)
      console.log('Create result:', result)
      if (result?.data?.createProduct?.product) {
        // Upload image if provided
        if (formData.photo instanceof File) {
          await uploadProductImage(result.data.createProduct.product.id, formData.photo)
        }
        emit('save', result.data.createProduct.product)
        closeModal()
      } else if (result?.data?.createProduct?.errors?.length) {
        submitError.value = result.data.createProduct.errors[0]
      }
    }
  } catch (error) {
    console.error('Submit error:', error)
    submitError.value = error instanceof Error ? error.message : 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

/**
 * Upload product image via REST API
 */
async function uploadProductImage(productId: string, file: File) {
  try {
    const formDataObj = new FormData()
    formDataObj.append('image', file)

    const token = localStorage.getItem('authToken')
    const response = await fetch(`${import.meta.env.VITE_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:3000'}/api/products/${productId}/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formDataObj,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload image')
    }
  } catch (error) {
    // Log but don't fail the entire operation if image upload fails
    console.error('Image upload error:', error)
  }
}

/**
 * Close modal and reset form
 */
function closeModal() {
  emit('close')
  resetForm()
}

/**
 * Reset form
 */
function resetForm() {
  formData.name = ''
  formData.description = ''
  formData.type = ''
  formData.price = ''
  formData.stock = ''
  formData.categoryId = ''
  formData.photo = undefined
  formData.photoPreview = undefined
  errors.value = {}
  submitError.value = ''
  showCategoryForm.value = false
  newCategory.value = ''
}

// Initialize form when component is mounted or when product prop changes
onMounted(() => {
  console.log('=== ProductFormModal MOUNTED ===')
  console.log('Props:', { isOpen: props.isOpen, isEditMode: props.isEditMode, product: props.product })
  initializeForm()
})

// Watch for changes to product prop
watch(() => props.product, async (newProduct) => {
  console.log('=== Product prop changed ===')
  console.log('New product:', newProduct)
  await initializeForm()
}, { deep: true, immediate: true })

// Watch for isOpen changes to reinitialize
watch(() => props.isOpen, async (newValue) => {
  console.log('=== Modal isOpen changed to:', newValue)
  if (newValue) {
    console.log('Modal opened, initializing form...')
    await nextTick()
    await initializeForm()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
