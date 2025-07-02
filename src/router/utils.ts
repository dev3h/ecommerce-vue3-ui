import type { Router } from 'vue-router'

/**
 * Route utility functions for common navigation patterns
 */
export class RouteUtils {
    constructor(private readonly router: Router) {}

    /**
     * Navigate to product detail page
     */
    goToProduct(productId: string | number) {
        return this.router.push({
            name: 'product-detail',
            params: { id: String(productId) },
        })
    }

    /**
     * Navigate to category products page
     */
    goToCategory(categorySlug: string) {
        return this.router.push({
            name: 'category-products',
            params: { slug: categorySlug },
        })
    }

    /**
     * Navigate to login with return URL
     */
    goToLogin(returnUrl?: string) {
        return this.router.push({
            name: 'login',
            query: returnUrl ? { redirect: returnUrl } : undefined,
        })
    }

    /**
     * Go back or fallback to home
     */
    goBackOrHome() {
        if (window.history.length > 1) {
            this.router.back()
        } else {
            this.router.push({ name: 'home' })
        }
    }

    /**
     * Navigate to order detail
     */
    goToOrder(orderId: string | number) {
        return this.router.push({
            name: 'account-order-detail',
            params: { id: String(orderId) },
        })
    }

    /**
     * Check if current route is active
     */
    isRouteActive(routeName: string): boolean {
        return this.router.currentRoute.value.name === routeName
    }

    /**
     * Check if current route starts with a path
     */
    isPathActive(path: string): boolean {
        return this.router.currentRoute.value.path.startsWith(path)
    }

    /**
     * Get query parameter value
     */
    getQuery(key: string): string | undefined {
        const query = this.router.currentRoute.value.query[key]
        return Array.isArray(query) ? query[0] : query
    }

    /**
     * Update query parameters without navigation
     */
    updateQuery(updates: Record<string, string | undefined>) {
        const currentQuery = { ...this.router.currentRoute.value.query }

        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined) {
                delete currentQuery[key]
            } else {
                currentQuery[key] = value
            }
        })

        return this.router.replace({
            query: currentQuery,
        })
    }
}

/**
 * Breadcrumb utility for generating breadcrumbs
 */
export const generateBreadcrumbs = (route: any) => {
    const breadcrumbs = []

    // Always start with home
    breadcrumbs.push({
        name: 'breadcrumb.home',
        to: { name: 'home' },
    })

    // Add route-specific breadcrumbs
    switch (route.name) {
        case 'products':
            breadcrumbs.push({
                name: 'breadcrumb.products',
                to: { name: 'products' },
            })
            break
        case 'product-detail':
            breadcrumbs.push(
                {
                    name: 'breadcrumb.products',
                    to: { name: 'products' },
                },
                {
                    name: 'breadcrumb.productDetails',
                    to: route,
                },
            )
            break
        case 'cart':
            breadcrumbs.push({
                name: 'breadcrumb.cart',
                to: { name: 'cart' },
            })
            break
        case 'account-profile':
        case 'account-orders':
        case 'account-wishlist':
        case 'account-addresses': {
            const accountPageMap: Record<string, string> = {
                'account-profile': 'breadcrumb.profile',
                'account-orders': 'breadcrumb.orders',
                'account-wishlist': 'breadcrumb.wishlist',
                'account-addresses': 'breadcrumb.addresses',
            }
            breadcrumbs.push(
                {
                    name: 'breadcrumb.account',
                    to: { name: 'account' },
                },
                {
                    name: accountPageMap[route.name] ?? 'breadcrumb.account',
                    to: route,
                },
            )
            break
        }
    }

    return breadcrumbs
}
