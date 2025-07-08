import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('@/views/admin/AdminLoginView.vue'),
        meta: {
            title: 'Admin Login',
            requiresAuth: false,
            requiresAdmin: false,
            layout: 'auth', // Use auth layout (no header/footer)
        },
    },
    {
        path: '/admin/forgot-password',
        name: 'AdminForgotPassword',
        component: () => import('@/views/admin/AdminForgotPasswordView.vue'),
        meta: {
            title: 'Admin Forgot Password',
            requiresAuth: false,
            requiresAdmin: false,
            layout: 'auth', // Use auth layout (no header/footer)
        },
    },
    {
        path: '/admin/change-password',
        name: 'AdminChangePassword',
        component: () => import('@/views/admin/AdminChangePasswordView.vue'),
        meta: {
            title: 'Admin Change Password',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'auth', // Use auth layout (no header/footer)
        },
    },
    {
        path: '/admin',
        name: 'Admin',
        redirect: (to) => {
            // This will be handled by the guard, but we set a default redirect
            return '/admin/dashboard'
        },
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: {
            title: 'Dashboard',
            requiresAuth: true,
            requiresAdmin: true,
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
