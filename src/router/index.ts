import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { authGuard, roleGuard, adminGuard, titleGuard } from './guards'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // Scroll behavior for better UX
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        } else {
            return { top: 0 }
        }
    },
})

// Global navigation guards
router.beforeEach(authGuard)
router.beforeEach(roleGuard)
router.beforeEach(adminGuard)
router.beforeEach(titleGuard)

// Global error handling for navigation
router.onError((error) => {
    console.error('Router error:', error)
    // You can add more sophisticated error handling here
})

export default router
