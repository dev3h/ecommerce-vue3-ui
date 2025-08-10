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
    {
        path: '/reels',
        name: 'reels',
        component: () => import('@/views/ReelsView.vue'),
        meta: {
            title: 'home.reels.title',
            requiresAuth: false,
        },
    },
]
