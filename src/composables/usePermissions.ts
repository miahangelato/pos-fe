import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * Composable for role-based permissions
 * Provides permission checks based on user role
 */
export function usePermissions() {
  const authStore = useAuthStore()

  // Role checks
  const isAdmin = computed(() => authStore.user?.role === 'admin')
  const isMerchant = computed(() => authStore.user?.role === 'merchant')
  const isCustomer = computed(() => authStore.user?.role === 'customer')

  // Permission checks
  const canManageMerchants = computed(() => isAdmin.value)
  
  const canManageProducts = computed(() => 
    isAdmin.value || isMerchant.value
  )
  
  const canCreateOrders = computed(() => 
    isAdmin.value || isMerchant.value
  )
  
  const canManageOrders = computed(() => 
    isAdmin.value || isMerchant.value
  )
  
  const canViewReports = computed(() => 
    isAdmin.value || isMerchant.value
  )
  
  const canConfigureShipping = computed(() => isAdmin.value)
  
  const canConfigurePayments = computed(() => isAdmin.value)
  
  const canAccessDashboard = computed(() => 
    isAdmin.value || isMerchant.value
  )

  const canViewOwnOrders = computed(() => 
    isCustomer.value || isMerchant.value || isAdmin.value
  )

  return {
    // Role checks
    isAdmin,
    isMerchant,
    isCustomer,
    
    // Permission checks
    canManageMerchants,
    canManageProducts,
    canCreateOrders,
    canManageOrders,
    canViewReports,
    canConfigureShipping,
    canConfigurePayments,
    canAccessDashboard,
    canViewOwnOrders,
  }
}
