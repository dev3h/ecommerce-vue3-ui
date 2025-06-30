# Vue 3 E-commerce Router

Advanced router configuration for Vue 3 e-commerce application with internationalization support, authentication guards, and modular route organization.

## 📁 Directory Structure

```
src/router/
├── index.ts           # Main router configuration with guards and settings
├── guards.ts          # Navigation guards (auth, roles, i18n titles)
├── utils.ts           # Route utility functions and breadcrumbs
├── README.md          # This documentation
└── routes/
    ├── index.ts       # Combines all route modules
    ├── home.ts        # Home page routes
    ├── auth.ts        # Authentication routes (login, register, etc.)
    ├── products.ts    # Product and category routes
    ├── cart.ts        # Shopping cart and checkout routes
    ├── account.ts     # User account and profile routes
    └── errors.ts      # Error pages and catch-all routes
```

## 🚀 Key Features

### 🔒 **Authentication & Authorization**

- Automatic redirect to login for protected routes
- Return URL preservation for seamless UX
- Role-based access control (RBAC)
- Route-level authentication guards

### 🌍 **Internationalization (i18n)**

- Dynamic page titles with translation support
- SEO-friendly multilingual routing
- Automatic language detection and persistence
- Translated route meta information

### ⚡ **Performance Optimizations**

- Lazy loading for all components using `() => import()`
- Code splitting at route level
- Tree-shaking friendly modular structure
- Optimized bundle sizes

### 🛠 **Developer Experience**

- Full TypeScript support with typed routes
- Route utility functions for common patterns
- Breadcrumb generation utilities
- Comprehensive error handling

### 🎯 **E-commerce Specific**

- Product catalog and detail routes
- Shopping cart and checkout flow
- User account management
- Category-based navigation
- Order management routes

## 📋 Route Structure

### **Public Routes** (No authentication required)

```typescript
/                    # Home page
/products           # Product listing
/products/:id       # Product details
/categories         # Category listing
/categories/:slug   # Category products
/cart              # Shopping cart
/login             # User login
/register          # User registration
/forgot-password   # Password recovery
```

### **Protected Routes** (Authentication required)

```typescript
/checkout          # Checkout process
/account           # Account dashboard
/account/profile   # User profile
/account/orders    # Order history
/account/orders/:id # Order details
/account/wishlist  # User wishlist
/account/addresses # Saved addresses
```

### **Error Routes**

```typescript
/404               # Page not found
/500               # Server error
/maintenance       # Maintenance mode
/:pathMatch(.*)*   # Catch-all redirect
```

## 🔧 Configuration

### **Router Setup**

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { authGuard, roleGuard, titleGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Smart scroll behavior for better UX
  },
})

// Apply global guards
router.beforeEach(authGuard)
router.beforeEach(roleGuard)
router.beforeEach(titleGuard)
```

### **Route Meta Configuration**

```typescript
{
  path: '/products',
  name: 'products',
  component: () => import('@/views/products/ProductListView.vue'),
  meta: {
    title: 'meta.productsTitle',  // i18n translation key
    requiresAuth: false,          // Authentication requirement
    roles: ['user', 'admin'],     // Required user roles
    layout: 'main',               // Layout component
  },
}
```

## 🛡️ Navigation Guards

### **Authentication Guard**

```typescript
export const authGuard = (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isAuthenticated()) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
    return
  }

  next()
}
```

### **Role Guard**

```typescript
export const roleGuard = (to, from, next) => {
  const requiredRoles = to.meta.roles
  const userRoles = getUserRoles()

  if (requiredRoles && !hasRequiredRole(userRoles, requiredRoles)) {
    next({ name: 'not-found' })
    return
  }

  next()
}
```

### **Title Guard (i18n)**

```typescript
export const titleGuard = (to, from, next) => {
  const { t } = i18n.global
  const baseTitle = t('meta.defaultTitle')
  const routeTitle = to.meta.title

  if (routeTitle && routeTitle.includes('.')) {
    const translatedTitle = t(routeTitle)
    document.title = `${translatedTitle} | ${baseTitle}`
  }

  next()
}
```

## 🧰 Utility Functions

### **RouteUtils Class**

```typescript
import { RouteUtils } from '@/router/utils'

const routeUtils = new RouteUtils(router)

// Navigate to product
routeUtils.goToProduct(123)

// Navigate to category
routeUtils.goToCategory('electronics')

// Go back or home
routeUtils.goBackOrHome()

// Update query parameters
routeUtils.updateQuery({ page: '2', filter: 'new' })

// Check route state
routeUtils.isRouteActive('products')
routeUtils.isPathActive('/account')
```

### **Breadcrumb Generation**

```typescript
import { generateBreadcrumbs } from '@/router/utils'

// In component
const breadcrumbs = generateBreadcrumbs(route)
// Returns: [{ name: 'Home', to: '/' }, { name: 'Products', to: '/products' }]
```

## 🎨 Usage Examples

### **Basic Navigation**

```vue
<template>
  <div>
    <!-- Programmatic navigation -->
    <button @click="$router.push({ name: 'products' })">View Products</button>

    <!-- Router link -->
    <RouterLink :to="{ name: 'product-detail', params: { id: 123 } }" class="btn-primary">
      View Product
    </RouterLink>
  </div>
</template>
```

### **With Route Utils**

```vue
<script setup>
import { inject } from 'vue'
import { RouteUtils } from '@/router/utils'

const router = inject('$router')
const routeUtils = new RouteUtils(router)

const handleProductClick = (productId) => {
  routeUtils.goToProduct(productId)
}

const handleCategoryClick = (categorySlug) => {
  routeUtils.goToCategory(categorySlug)
}
</script>
```

### **Route Guards in Components**

```vue
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Check if user can access route
const canEdit = computed(() => {
  const userRoles = getUserRoles()
  const requiredRoles = route.meta.roles
  return !requiredRoles || requiredRoles.some((role) => userRoles.includes(role))
})
</script>
```

## 📝 Adding New Routes

### **1. Create Route File**

```typescript
// src/router/routes/blog.ts
import type { RouteRecordRaw } from 'vue-router'

export const blogRoutes: RouteRecordRaw[] = [
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/blog/BlogView.vue'),
    meta: {
      title: 'meta.blogTitle',
      requiresAuth: false,
    },
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('@/views/blog/BlogPostView.vue'),
    props: true,
    meta: {
      title: 'meta.blogPostTitle',
      requiresAuth: false,
    },
  },
]
```

### **2. Update Route Index**

```typescript
// src/router/routes/index.ts
import { blogRoutes } from './blog'

export const routes: RouteRecordRaw[] = [
  ...homeRoutes,
  ...authRoutes,
  ...productRoutes,
  ...cartRoutes,
  ...accountRoutes,
  ...blogRoutes, // Add new routes
  ...errorRoutes, // Keep error routes last
]
```

### **3. Add Translations**

```json
// src/locales/en.json
{
  "meta": {
    "blogTitle": "Blog",
    "blogPostTitle": "Blog Post"
  }
}
```

## 🔍 Best Practices

### ✅ **Do's**

- Use lazy loading for all route components
- Add meaningful meta information for SEO
- Implement proper error boundaries
- Use typed routes with TypeScript
- Organize routes by feature, not by type
- Test authentication flows thoroughly
- Use translation keys for dynamic titles

### ❌ **Don'ts**

- Don't put business logic in route guards
- Don't forget to handle loading states
- Don't skip error handling for async routes
- Don't hardcode URLs in components
- Don't ignore accessibility in navigation
- Don't forget to update breadcrumbs

## 🚀 Performance Tips

### **Code Splitting**

```typescript
// ✅ Good - Lazy loading
component: () => import('@/views/ProductView.vue')

// ❌ Bad - Eager loading
import ProductView from '@/views/ProductView.vue'
component: ProductView
```

### **Route-level Guards**

```typescript
// ✅ Good - Route level
meta: {
  requiresAuth: true
}

// ❌ Bad - Component level for route-wide rules
// Using guards in every component
```

### **Smart Prefetching**

```typescript
// Use Vue's built-in prefetching
<RouterLink
  :to="{ name: 'product-detail', params: { id } }"
  prefetch
>
  Product
</RouterLink>
```

## 🐛 Debugging

### **Route Debugging**

```typescript
// Add to router for debugging
router.beforeEach((to, from, next) => {
  console.log('Navigating from:', from.name, 'to:', to.name)
  console.log('Route meta:', to.meta)
  next()
})
```

### **Common Issues**

1. **Routes not loading**: Check lazy import paths
2. **Guards not working**: Ensure guards are added to router
3. **Titles not updating**: Verify i18n keys exist
4. **Authentication loops**: Check guard logic
5. **404 errors**: Verify route paths and catch-all placement

## 📊 Router Analytics

Monitor route performance and user navigation patterns:

```typescript
// Track route changes
router.afterEach((to, from, failure) => {
  if (!failure) {
    // Send analytics event
    analytics.track('page_view', {
      page: to.name,
      path: to.path,
      from: from.name,
    })
  }
})
```

## 🔄 Migration Guide

### **From Vue 2 to Vue 3**

- Update import statements to use `vue-router@4`
- Replace `mode: 'history'` with `createWebHistory()`
- Update route guard syntax
- Migrate to Composition API in components

### **Adding i18n Support**

- Install `vue-i18n@9`
- Update route meta with translation keys
- Modify title guard for i18n support
- Add language switching functionality

This router setup provides a solid foundation for a production-ready Vue 3 e-commerce application with modern best practices, performance optimizations, and comprehensive feature support.
