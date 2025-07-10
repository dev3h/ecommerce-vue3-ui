import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminAuthStore } from '@/stores/adminAuth'

export function useAuthGuard() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const adminAuthStore = useAdminAuthStore()

    // Check if current route requires admin access
    const requiresAdmin = computed(() => {
        return (
            route.path.startsWith('/admin') &&
            route.path !== '/admin/login' &&
            route.path !== '/admin/forgot-password'
        )
    })

    // Check if user has proper access
    const hasAccess = computed(() => {
        if (!requiresAdmin.value) return true
        return adminAuthStore.isAuthenticated && adminAuthStore.isAdmin
    })

    // Redirect to appropriate login page if needed
    const checkAccess = () => {
        if (requiresAdmin.value && !adminAuthStore.isAuthenticated) {
            router.push({
                name: 'AdminLogin',
                query: { redirect: route.fullPath },
            })
            return false
        }

        if (requiresAdmin.value && adminAuthStore.isAuthenticated && !adminAuthStore.isAdmin) {
            router.push({ name: 'errors-403' })
            return false
        }

        return true
    }

    // Auto-check on mount
    onMounted(() => {
        checkAccess()
    })

    return {
        requiresAdmin,
        hasAccess,
        checkAccess,
        isAuthenticated: computed(() => authStore.isAuthenticated),
        isAdmin: computed(() => authStore.isAdmin),
        user: computed(() => authStore.user),
    }
}
