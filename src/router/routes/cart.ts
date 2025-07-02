import type { RouteRecordRaw } from 'vue-router'

// Shopping cart and checkout routes
export const cartRoutes: RouteRecordRaw[] = [
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/CartView.vue'),
        meta: {
            title: 'Shopping Cart',
            requiresAuth: false,
        },
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: () => import('@/views/CheckoutView.vue'),
        meta: {
            title: 'Checkout',
            requiresAuth: true,
        },
    },
    {
        path: '/checkout/success',
        name: 'checkout-success',
        component: () => import('@/views/CheckoutSuccessView.vue'),
        meta: {
            title: 'Order Confirmed',
            requiresAuth: true,
        },
    },
]
