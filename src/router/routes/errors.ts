import type { RouteRecordRaw } from 'vue-router'

// Error and utility routes
export const errorRoutes: RouteRecordRaw[] = [
    {
        path: '/404',
        name: 'not-found',
        component: () => import('@/views/errors/NotFoundView.vue'),
        meta: {
            title: 'Page Not Found',
            requiresAuth: false,
        },
    },
    {
        path: '/500',
        name: 'server-error',
        component: () => import('@/views/errors/ServerErrorView.vue'),
        meta: {
            title: 'Server Error',
            requiresAuth: false,
        },
    },
    // Catch all route - must be last
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
]
