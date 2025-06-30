import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { i18n } from '@/locales'

// Mock auth store - replace with your actual auth implementation
const isAuthenticated = () => {
    // This should check your actual authentication state
    // For example, check if user token exists in localStorage/cookies
    return localStorage.getItem('auth-token') !== null
}

// Mock user roles - replace with your actual user role implementation
const getUserRoles = (): string[] => {
    // This should return the actual user roles
    const userStr = localStorage.getItem('user')
    if (userStr) {
        const user = JSON.parse(userStr)
        return user.roles ?? []
    }
    return []
}

// Check if user is admin
const isAdmin = (): boolean => {
    const roles = getUserRoles()
    return roles.includes('admin') || roles.includes('administrator')
}

/**
 * Authentication guard
 * Checks if user is authenticated for protected routes
 */
export const authGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
) => {
    const requiresAuth = to.meta.requiresAuth

    // if (requiresAuth && !isAuthenticated()) {
    //     // Redirect to login page with return url
    //     next({
    //         name: 'login',
    //         query: { redirect: to.fullPath },
    //     })
    //     return
    // }

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
    const requiredRoles = to.meta.roles

    if (requiredRoles && requiredRoles.length > 0) {
        const userRoles = getUserRoles()
        const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role))

        if (!hasRequiredRole) {
            // Redirect to unauthorized page or home
            next({ name: 'not-found' })
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
    const { t } = i18n.global
    const baseTitle = t('meta.defaultTitle')
    const routeTitle = to.meta.title

    if (routeTitle) {
        // Check if it's a translation key
        if (typeof routeTitle === 'string' && routeTitle.includes('.')) {
            const translatedTitle = t(routeTitle)
            document.title = `${translatedTitle} | ${baseTitle}`
        } else {
            document.title = `${routeTitle} | ${baseTitle}`
        }
    } else {
        document.title = baseTitle
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
    const requiresAdmin = to.meta.requiresAdmin

    if (requiresAdmin && !isAdmin()) {
        // Redirect to unauthorized page or home
        next({ name: 'home' })
        return
    }

    next()
}
