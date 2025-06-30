import type { RouteRecordRaw } from 'vue-router'

// Import all route modules
import { homeRoutes } from './home'
import { authRoutes } from './auth'
import { productRoutes } from './products'
import { cartRoutes } from './cart'
import { accountRoutes } from './account'
import { errorRoutes } from './errors'

// Combine all routes
export const routes: RouteRecordRaw[] = [
    ...homeRoutes,
    ...authRoutes,
    ...productRoutes,
    ...cartRoutes,
    ...accountRoutes,
    ...errorRoutes, // Keep error routes last for catch-all behavior
]

// Export individual route groups for selective imports if needed
export { homeRoutes, authRoutes, productRoutes, cartRoutes, accountRoutes, errorRoutes }
