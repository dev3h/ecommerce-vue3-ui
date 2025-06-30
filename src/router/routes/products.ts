import type { RouteRecordRaw } from 'vue-router'

// E-commerce product routes
export const productRoutes: RouteRecordRaw[] = [
    {
        path: '/products',
        name: 'products',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Products',
            requiresAuth: false,
        },
    },
    {
        path: '/products/:id',
        name: 'product-detail',
        component: () => import('@/views/HomeView.vue'),
        props: true,
        meta: {
            title: 'Product Details',
            requiresAuth: false,
        },
    },
    {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            title: 'Categories',
            requiresAuth: false,
        },
    },
    {
        path: '/categories/:slug',
        name: 'category-products',
        component: () => import('@/views/HomeView.vue'),
        props: true,
        meta: {
            title: 'Category Products',
            requiresAuth: false,
        },
    },
]
