<template>
    <!-- Overlay for mobile -->
    <div
        v-if="props.isOpen"
        class="fixed inset-0 z-40 bg-black/50 md:hidden"
        @click="handleClose"
    />

    <aside
        class="admin-sidebar fixed left-0 top-0 h-full border-r border-border bg-background transition-all duration-300 ease-in-out"
        :class="{
            '-translate-x-full md:translate-x-0': !props.isOpen,
            'translate-x-0': props.isOpen,
            'w-64': !props.isCollapsed,
            'w-16': props.isCollapsed,
            'z-50': props.isMobile, // High z-index only on mobile
            'z-20': !props.isMobile, // Lower z-index on desktop
        }"
    >
        <div
            class="flex h-full flex-col overflow-x-hidden overflow-y-auto px-4 py-6 scrollbar-thin sidebar-content"
        >
            <!-- Logo Section -->
            <div class="mb-8 px-2 flex items-center justify-center">
                <RouterLink
                    to="/"
                    class="flex items-center space-x-3"
                    :class="{ 'justify-center': props.isCollapsed }"
                >
                    <div class="flex-shrink-0">
                        <svg
                            class="text-primary transition-all duration-300"
                            :class="props.isCollapsed ? 'h-8 w-8' : 'h-10 w-10'"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                            <path d="M12 3v6" />
                        </svg>
                    </div>
                    <div
                        v-if="!props.isCollapsed"
                        class="flex flex-col transition-all duration-300 overflow-hidden"
                    >
                        <span class="text-xl font-bold text-foreground">
                            {{ t('meta.defaultTitle') }}
                        </span>
                        <span class="text-sm text-muted-foreground">
                            {{ t('admin.title') }}
                        </span>
                    </div>
                </RouterLink>
            </div>

            <!-- Dashboard Section -->
            <div class="mb-6">
                <h2
                    v-if="!props.isCollapsed"
                    class="mb-2 px-4 text-lg font-semibold tracking-tight transition-opacity duration-300"
                >
                    {{ t('admin.sidebar.dashboard') }}
                </h2>
                <div class="space-y-1">
                    <AdminSidebarItem
                        to="/admin"
                        icon="LayoutDashboard"
                        :label="t('admin.sidebar.overview')"
                        :active="currentRoute === '/admin'"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/analytics"
                        icon="TrendingUp"
                        :label="t('admin.sidebar.analytics')"
                        :active="currentRoute === '/admin/analytics'"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/reports"
                        icon="FileText"
                        :label="t('admin.sidebar.reports')"
                        :active="currentRoute === '/admin/reports'"
                        :isCollapsed="props.isCollapsed"
                    />
                </div>
            </div>

            <!-- E-commerce Management -->
            <div class="mb-6">
                <h2
                    v-if="!props.isCollapsed"
                    class="mb-2 px-4 text-lg font-semibold tracking-tight transition-opacity duration-300"
                >
                    {{ t('admin.sidebar.ecommerce') }}
                </h2>
                <div class="space-y-1">
                    <AdminSidebarItem
                        to="/admin/products"
                        icon="Package"
                        :label="t('admin.sidebar.products')"
                        :badge="productsCount"
                        :active="currentRoute.startsWith('/admin/products')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/categories"
                        icon="FolderOpen"
                        :label="t('admin.sidebar.categories')"
                        :badge="categoriesCount"
                        :active="currentRoute.startsWith('/admin/categories')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/orders"
                        icon="ShoppingCart"
                        :label="t('admin.sidebar.orders')"
                        :badge="pendingOrdersCount"
                        variant="destructive"
                        :active="currentRoute.startsWith('/admin/orders')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/inventory"
                        icon="Warehouse"
                        :label="t('admin.sidebar.inventory')"
                        :active="currentRoute.startsWith('/admin/inventory')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/reviews"
                        icon="Star"
                        :label="t('admin.sidebar.reviews')"
                        :badge="pendingReviewsCount"
                        :active="currentRoute.startsWith('/admin/reviews')"
                        :isCollapsed="props.isCollapsed"
                    />
                </div>
            </div>

            <!-- Customer Management -->
            <div class="mb-6">
                <h2
                    v-if="!props.isCollapsed"
                    class="mb-2 px-4 text-lg font-semibold tracking-tight transition-opacity duration-300"
                >
                    {{ t('admin.sidebar.customers') }}
                </h2>
                <div class="space-y-1">
                    <AdminSidebarItem
                        to="/admin/customers"
                        icon="Users"
                        :label="t('admin.sidebar.customerList')"
                        :badge="totalCustomers"
                        :active="currentRoute.startsWith('/admin/customers')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/customer-support"
                        icon="MessageSquare"
                        :label="t('admin.sidebar.support')"
                        :badge="openTicketsCount"
                        variant="secondary"
                        :active="currentRoute.startsWith('/admin/customer-support')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/loyalty"
                        icon="Gift"
                        :label="t('admin.sidebar.loyalty')"
                        :active="currentRoute.startsWith('/admin/loyalty')"
                        :isCollapsed="props.isCollapsed"
                    />
                </div>
            </div>

            <!-- Marketing & Promotions -->
            <div class="mb-6">
                <h2
                    v-if="!props.isCollapsed"
                    class="mb-2 px-4 text-lg font-semibold tracking-tight transition-opacity duration-300"
                >
                    {{ t('admin.sidebar.marketing') }}
                </h2>
                <div class="space-y-1">
                    <AdminSidebarItem
                        to="/admin/promotions"
                        icon="Tag"
                        :label="t('admin.sidebar.promotions')"
                        :active="currentRoute.startsWith('/admin/promotions')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/coupons"
                        icon="Percent"
                        :label="t('admin.sidebar.coupons')"
                        :badge="activeCouponsCount"
                        :active="currentRoute.startsWith('/admin/coupons')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/newsletters"
                        icon="Mail"
                        :label="t('admin.sidebar.newsletters')"
                        :active="currentRoute.startsWith('/admin/newsletters')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/seo"
                        icon="Search"
                        :label="t('admin.sidebar.seo')"
                        :active="currentRoute.startsWith('/admin/seo')"
                        :isCollapsed="props.isCollapsed"
                    />
                </div>
            </div>

            <!-- Content Management -->
            <div class="mb-6">
                <h2
                    v-if="!props.isCollapsed"
                    class="mb-2 px-4 text-lg font-semibold tracking-tight transition-opacity duration-300"
                >
                    {{ t('admin.sidebar.content') }}
                </h2>
                <div class="space-y-1">
                    <AdminSidebarItem
                        to="/admin/pages"
                        icon="FileText"
                        :label="t('admin.sidebar.pages')"
                        :active="currentRoute.startsWith('/admin/pages')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/blog"
                        icon="Edit"
                        :label="t('admin.sidebar.blog')"
                        :active="currentRoute.startsWith('/admin/blog')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/media"
                        icon="Image"
                        :label="t('admin.sidebar.media')"
                        :active="currentRoute.startsWith('/admin/media')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/menus"
                        icon="Menu"
                        :label="t('admin.sidebar.menus')"
                        :active="currentRoute.startsWith('/admin/menus')"
                        :isCollapsed="props.isCollapsed"
                    />
                </div>
            </div>

            <!-- System & Settings -->
            <div class="mb-6">
                <h2
                    v-if="!props.isCollapsed"
                    class="mb-2 px-4 text-lg font-semibold tracking-tight transition-opacity duration-300"
                >
                    {{ t('admin.sidebar.system') }}
                </h2>
                <div class="space-y-1">
                    <AdminSidebarItem
                        to="/admin/users"
                        icon="UserCheck"
                        :label="t('admin.sidebar.users')"
                        :active="currentRoute.startsWith('/admin/users')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/roles"
                        icon="Shield"
                        :label="t('admin.sidebar.roles')"
                        :active="currentRoute.startsWith('/admin/roles')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/settings"
                        icon="Settings"
                        :label="t('admin.sidebar.settings')"
                        :active="currentRoute.startsWith('/admin/settings')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/backup"
                        icon="Database"
                        :label="t('admin.sidebar.backup')"
                        :active="currentRoute.startsWith('/admin/backup')"
                        :isCollapsed="props.isCollapsed"
                    />
                    <AdminSidebarItem
                        to="/admin/logs"
                        icon="FileSearch"
                        :label="t('admin.sidebar.logs')"
                        :active="currentRoute.startsWith('/admin/logs')"
                        :isCollapsed="props.isCollapsed"
                    />
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import AdminSidebarItem from '@/components/admin/AdminSidebarItem.vue'

interface Props {
    isOpen: boolean
    isCollapsed?: boolean
    isMobile?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
    close: []
}>()

const route = useRoute()
const router = useRouter()
const { t } = useAppI18n()

// Computed
const currentRoute = computed(() => route.path)

const sidebarHeight = computed(() => {
    return 'calc(100vh - 3.5rem)'
})

// Mock data - in real app these would come from stores/API
const productsCount = computed(() => 1247)
const categoriesCount = computed(() => 23)
const pendingOrdersCount = computed(() => 15)
const pendingReviewsCount = computed(() => 8)
const totalCustomers = computed(() => 3456)
const openTicketsCount = computed(() => 12)
const activeCouponsCount = computed(() => 5)

// Methods
const handleClose = () => {
    emit('close')
}

const handleQuickAction = (action: string) => {
    switch (action) {
        case 'add-product':
            router.push('/admin/products/new')
            break
        case 'view-site':
            window.open('/', '_blank')
            break
    }
}

const handleResize = () => {
    // Force re-calculation of sidebar height if needed
}

// Lifecycle
onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    transition: width 0.3s ease;
}

.admin-sidebar.w-64 {
    width: 16rem; /* 256px */
}

.admin-sidebar.w-16 {
    width: 4rem; /* 64px */
}

.scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--primary)) hsl(var(--background));
}

.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: hsl(var(--background));
    border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: hsl(var(--primary));
    border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary) / 0.8);
}

/* Mobile overlay */
@media (max-width: 768px) {
    .admin-sidebar {
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
}

/* Allow tooltips to overflow outside sidebar */
.sidebar-content {
    /* Keep overflow-x-hidden for the content, but allow child elements to overflow */
    position: relative;
}

.sidebar-content > * {
    /* Allow tooltip containers to overflow horizontally */
    position: static;
}

/* Ensure tooltips can escape the sidebar bounds */
.admin-sidebar .relative {
    overflow: visible;
}
</style>
