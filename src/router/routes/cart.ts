import type { RouteRecordRaw } from 'vue-router'

// Shopping cart and checkout routes
export const cartRoutes: RouteRecordRaw[] = [
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Shopping Cart',
            requiresAuth: false,
        },
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Checkout',
            requiresAuth: true,
        },
    },
    {
        path: '/checkout/success',
        name: 'checkout-success',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Order Confirmed',
            requiresAuth: true,
        },
    },
]
