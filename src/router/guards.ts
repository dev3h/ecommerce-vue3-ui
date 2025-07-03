import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Authentication guard
 * Checks if user is authenticated for protected routes
 */
export const authGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) => {
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth
    const isGuest = to.meta.guest

    // Initialize auth store if not already initialized
    if (!authStore.user && !authStore.token) {
        authStore.initializeAuth()
    }

    // If route requires authentication and user is not authenticated
    if (requiresAuth && !authStore.isAuthenticated) {
        next({
            name: 'login',
            query: { redirect: to.fullPath },
        })
        return
    }

    // If route is for guests only and user is authenticated
    if (isGuest && authStore.isAuthenticated) {
        // Redirect to intended page or home
        const redirect = to.query.redirect as string
        next(redirect || '/')
        return
    }

    next()
}

/**
 * Role-based access control guard
 * Checks if user has required roles for the route
 */
export const roleGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) => {
    const authStore = useAuthStore()
    const requiredRoles = to.meta.roles as string[]

    if (requiredRoles && requiredRoles.length > 0) {
        if (!authStore.isAuthenticated) {
            next({
                name: 'login',
                query: { redirect: to.fullPath },
            })
            return
        }

        const userRole = authStore.user?.role
        if (!userRole || !requiredRoles.includes(userRole)) {
            // User doesn't have required role
            next({ name: 'errors-403' })
            return
        }
    }

    next()
}

/**
 * Admin access guard
 * Checks if user has admin privileges for admin routes
 */
export const adminGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) => {
    const authStore = useAuthStore()
    const isAdminRoute = to.path.startsWith('/admin')

    if (isAdminRoute) {
        if (!authStore.isAuthenticated) {
            next({
                name: 'login',
                query: { redirect: to.fullPath },
            })
            return
        }

        if (!authStore.isAdmin) {
            // User is not admin
            next({ name: 'errors-403' })
            return
        }
    }

    next()
}

/**
 * Title guard
 * Updates document title based on route meta with i18n support
 */
export const titleGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) => {
    const title = to.meta.title as string
    if (title) {
        document.title = `${title} - Nest Grocer`
    } else {
        document.title = 'Nest Grocer'
    }

    next()
}
