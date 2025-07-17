import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin/coupons',
        name: 'AdminCoupons',
        component: () => import('@/views/admin/CouponsManagementView.vue'),
        meta: {
            title: 'Coupons Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
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
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: {
            title: 'Products Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/products/new',
        name: 'AdminProductNew',
        component: () => import('@/views/admin/ProductFormView.vue'),
        meta: {
            title: 'Add New Product',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/products/:id/edit',
        name: 'AdminProductEdit',
        component: () => import('@/views/admin/ProductFormView.vue'),
        meta: {
            title: 'Edit Product',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/products/:id',
        name: 'AdminProductDetail',
        component: () => import('@/views/admin/ProductDetailView.vue'),
        meta: {
            title: 'Product Details',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/AdminCategoriesView.vue'),
        meta: {
            title: 'Categories Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/brands',
        name: 'AdminBrands',
        component: () => import('@/views/admin/BrandsView.vue'),
        meta: {
            title: 'Brands Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/OrdersView.vue'),
        meta: {
            title: 'Orders Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/orders/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/views/admin/OrderDetailView.vue'),
        meta: {
            title: 'Order Details',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/customers',
        name: 'AdminCustomers',
        component: () => import('@/views/admin/CustomerManagementView.vue'),
        meta: {
            title: 'Customers Management',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/customers/:id',
        name: 'AdminCustomerDetail',
        component: () => import('@/views/admin/CustomerDetailView.vue'),
        meta: {
            title: 'Customer Detail',
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
    {
        path: '/admin/profile',
        name: 'AdminProfile',
        component: () => import('@/views/admin/profile/Index.vue'),
        meta: {
            title: 'Admin Profile',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin',
        },
    },
    {
        path: '/admin/change-password',
        name: 'AdminSecurity',
        component: () => import('@/views/admin/profile/Index.vue'),
        meta: {
            title: 'Admin Change Password',
            requiresAuth: true,
            requiresAdmin: true,
            layout: 'admin', // Use auth layout (no header/footer)
        },
    },
]
