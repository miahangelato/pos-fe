import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: 'signup',
        name: 'signup',
        component: () => import('../views/auth/SignUpView.vue'),
      },
      {
        path: 'signin',
        name: 'signin',
        component: () => import('../views/auth/SignInView.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('../views/auth/ForgotPasswordView.vue'),
      },
      {
        path: 'verify-email/:token',
        name: 'verify-email',
        component: () => import('../views/auth/EmailVerificationView.vue'),
      },
      {
        path: 'reset-password/:token',
        name: 'reset-password',
        component: () => import('../views/auth/ResetPasswordView.vue'),
      },
    ],
  },
  {
    path: '/marketplace',
    name: 'marketplace',
    component: () => import('../views/MarketplaceView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/ProductsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/OrdersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('../views/CustomersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Global navigation guard to handle authentication
 */
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Restore session from localStorage on app load
  if (!authStore.user && authStore.token) {
    try {
      await authStore.restoreSession()
    } catch {
      // Session restoration failed, clear auth
      authStore.signOut()
    }
  }

  const requiresAuth = to.meta.requiresAuth as boolean
  const requiresAdmin = to.meta.requiresAdmin as boolean

  // If route requires authentication and user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to signin and remember where they were trying to go
    next({
      name: 'signin',
      query: { redirect: to.fullPath },
    })
  }
  // If route requires admin and user is not admin
  else if (requiresAdmin && authStore.user?.role !== 'admin') {
    // Redirect to appropriate home page
    if (authStore.user?.role === 'customer') {
      next({ name: 'marketplace' })
    } else {
      next({ name: 'dashboard' })
    }
  }
  // If user is authenticated and trying to access auth routes
  else if (
    (to.name === 'signup' || to.name === 'signin') &&
    authStore.isAuthenticated
  ) {
    // Redirect customers to marketplace, others to dashboard
    if (authStore.user?.role === 'customer') {
      next({ name: 'marketplace' })
    } else {
      next({ name: 'dashboard' })
    }
  }
  // If customer trying to access dashboard, redirect to marketplace
  else if (
    to.name === 'dashboard' &&
    authStore.user?.role === 'customer'
  ) {
    next({ name: 'marketplace' })
  }
  // Otherwise, proceed normally
  else {
    next()
  }
})

/**
 * Navigation after route change
 */
router.afterEach((to) => {
  // Update page title based on route
  const titles: Record<string, string> = {
    home: 'POS System',
    about: 'About Us',
    signup: 'Create Account',
    signin: 'Sign In',
    'forgot-password': 'Forgot Password',
    'verify-email': 'Verify Email',
    'reset-password': 'Reset Password',
    dashboard: 'Dashboard',
    marketplace: 'Marketplace',
    cart: 'Shopping Cart',
    checkout: 'Checkout',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    users: 'User Management',
    settings: 'Settings',
  }

  document.title = `${titles[to.name as string] || 'Page'} - POS System`
})

export default router
