import { ref, computed } from 'vue'
import { dashboardService, type DashboardData, type QuickStats } from '@/services/dashboard.service'
import { useAppI18n } from '@/composables/useI18n'

const dashboardData = ref<DashboardData | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export function useDashboard() {
    const { t } = useAppI18n()

    // Computed properties for easy access to data
    const revenueData = computed(() => dashboardData.value?.revenueOverview || [])
    const ordersData = computed(() => dashboardData.value?.ordersStatistics || [])
    const customerActivityData = computed(() => dashboardData.value?.customerActivity || [])
    const yearlyComparisonData = computed(() => dashboardData.value?.yearlyComparison || [])
    const quickStats = computed(
        (): QuickStats => dashboardData.value?.quickStats || ({} as QuickStats),
    )
    const categoryData = computed(() => dashboardData.value?.productCategories || [])
    const topProductsData = computed(() => dashboardData.value?.topProducts || [])
    const recentOrders = computed(() => dashboardData.value?.recentOrders || [])
    const newMembers = computed(() => dashboardData.value?.newMembers || [])
    const recentActivities = computed(() => dashboardData.value?.recentActivities || [])

    // Load all dashboard data
    const loadDashboardData = async () => {
        try {
            loading.value = true
            error.value = null
            dashboardData.value = await dashboardService.getDashboardData()
        } catch (err) {
            error.value =
                err instanceof Error ? err.message : t('admin.dashboard.errors.loadDashboardData')
            console.error('Error loading dashboard data:', err)
        } finally {
            loading.value = false
        }
    }

    // Load specific data sections
    const loadRevenueData = async () => {
        try {
            loading.value = true
            const data = await dashboardService.getRevenueOverview()
            if (dashboardData.value) {
                dashboardData.value.revenueOverview = data
            }
        } catch (err) {
            error.value =
                err instanceof Error ? err.message : t('admin.dashboard.errors.loadRevenueData')
        } finally {
            loading.value = false
        }
    }

    const loadOrdersData = async () => {
        try {
            loading.value = true
            const data = await dashboardService.getOrdersStatistics()
            if (dashboardData.value) {
                dashboardData.value.ordersStatistics = data
            }
        } catch (err) {
            error.value =
                err instanceof Error ? err.message : t('admin.dashboard.errors.loadOrdersData')
        } finally {
            loading.value = false
        }
    }

    const loadCustomerActivityData = async () => {
        try {
            loading.value = true
            const data = await dashboardService.getCustomerActivity()
            if (dashboardData.value) {
                dashboardData.value.customerActivity = data
            }
        } catch (err) {
            error.value =
                err instanceof Error
                    ? err.message
                    : t('admin.dashboard.errors.loadCustomerActivityData')
        } finally {
            loading.value = false
        }
    }

    // Refresh all data
    const refreshData = async () => {
        await loadDashboardData()
    }

    // Check if data is loaded
    const isDataLoaded = computed(() => dashboardData.value !== null)

    return {
        // Data
        revenueData,
        ordersData,
        customerActivityData,
        yearlyComparisonData,
        quickStats,
        categoryData,
        topProductsData,
        recentOrders,
        newMembers,
        recentActivities,

        // State
        loading,
        error,
        isDataLoaded,

        // Actions
        loadDashboardData,
        loadRevenueData,
        loadOrdersData,
        loadCustomerActivityData,
        refreshData,
    }
}
