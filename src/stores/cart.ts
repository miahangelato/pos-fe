import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  productType: string
  imageUrl?: string
  merchantId: string
  merchantName?: string
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])

  // Load cart from localStorage on init
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    try {
      items.value = JSON.parse(savedCart)
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e)
    }
  }

  // Computed
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Group items by merchant for checkout
  const itemsByMerchant = computed(() => {
    const grouped: Record<string, CartItem[]> = {}
    items.value.forEach(item => {
      if (!grouped[item.merchantId]) {
        grouped[item.merchantId] = []
      }
      grouped[item.merchantId]!.push(item)
    })
    return grouped
  })

  // Actions
  function addItem(product: {
    id: string
    name: string
    price: number
    productType: string
    imageUrl?: string
    merchant: { id: string; name?: string }
  }) {
    const existingItem = items.value.find(item => item.productId === product.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        productType: product.productType,
        imageUrl: product.imageUrl,
        merchantId: product.merchant.id,
        merchantName: product.merchant.name
      })
    }

    saveToLocalStorage()
  }

  function removeItem(itemId: string) {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function updateQuantity(itemId: string, quantity: number) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId)
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
  }

  function incrementQuantity(itemId: string) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.quantity++
      saveToLocalStorage()
    }
  }

  function decrementQuantity(itemId: string) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeItem(itemId)
      }
      saveToLocalStorage()
    }
  }

  function clearCart() {
    items.value = []
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  return {
    // State
    items,
    
    // Computed
    itemCount,
    subtotal,
    isEmpty,
    itemsByMerchant,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart
  }
})
