import type { RouteRecordRaw } from 'vue-router'

// Authentication routes
export const authRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: {
            title: 'Sign In',
            requiresAuth: false,
            guest: true,
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: {
            title: 'Create Account',
            requiresAuth: false,
            guest: true,
        },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPasswordView.vue'),
        meta: {
            title: 'Forgot Password',
            requiresAuth: false,
            guest: true,
        },
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/views/auth/ResetPasswordView.vue'),
        meta: {
            title: 'Reset Password',
            requiresAuth: false,
            guest: true,
        },
    },
]
