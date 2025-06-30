import type { RouteRecordRaw } from 'vue-router'

// Home routes
export const homeRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'meta.homeTitle',
            requiresAuth: false,
        },
    },
]
