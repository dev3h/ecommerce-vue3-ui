import type { RouteRecordRaw } from 'vue-router'

// User account and profile routes
export const accountRoutes: RouteRecordRaw[] = [
    {
        path: '/account',
        name: 'account',
        component: () => import('@/views/account/AccountLayout.vue'),
        meta: {
            title: 'My Account',
            requiresAuth: true,
        },
        children: [
            {
                path: '',
                redirect: '/account/profile',
            },
            {
                path: 'profile',
                name: 'account-profile',
                component: () => import('@/views/account/ProfileView.vue'),
                meta: {
                    title: 'Profile',
                    requiresAuth: true,
                },
            },
            {
                path: 'addresses',
                name: 'account-addresses',
                component: () => import('@/views/account/AddressesView.vue'),
                meta: {
                    title: 'My Addresses',
                    requiresAuth: true,
                },
            },
            {
                path: 'orders',
                name: 'account-orders',
                component: () => import('@/views/account/OrderHistoryView.vue'),
                meta: {
                    title: 'Order History',
                    requiresAuth: true,
                },
            },
            {
                path: 'wishlist',
                name: 'account-wishlist',
                component: () => import('@/views/WishlistView.vue'),
                meta: {
                    title: 'My Wishlist',
                    requiresAuth: true,
                },
            },
            {
                path: 'orders/:id',
                name: 'account-order-detail',
                component: () => import('@/views/account/OrderDetailView.vue'),
                props: true,
                meta: {
                    title: 'Order Details',
                    requiresAuth: true,
                },
            },
        ],
    },
]
