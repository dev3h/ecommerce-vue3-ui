import type { RouteRecordRaw } from 'vue-router'

// Authentication routes
export const authRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Login',
            requiresAuth: false,
            layout: 'auth',
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Register',
            requiresAuth: false,
            layout: 'auth',
        },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Forgot Password',
            requiresAuth: false,
            layout: 'auth',
        },
    },
]
