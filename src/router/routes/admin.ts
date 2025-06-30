import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin',
        name: 'Admin',
        redirect: '/admin/dashboard',
        meta: {
            requiresAuth: false,
            requiresAdmin: false,
            layout: 'admin',
        },
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Dashboard',
            requiresAuth: false,
            requiresAdmin: false,
            layout: 'admin',
        },
    },
    {
        path: '/admin/products',
        name: 'AdminProducts',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Products Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/orders',
        name: 'AdminOrders',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Orders Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/customers',
        name: 'AdminCustomers',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Customers Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/analytics',
        name: 'AdminAnalytics',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Analytics',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/settings',
        name: 'AdminSettings',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Settings',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
]
