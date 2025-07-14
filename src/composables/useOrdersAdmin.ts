import { ref, computed } from 'vue'
import {
    orderService,
    type AdminOrder,
    type OrderFilters,
    type OrderStats,
} from '@/services/order.service'
import type { Order } from '@/stores/orders'

export function useOrdersAdmin() {
    // State
    const orders = ref<AdminOrder[]>([])
    const currentOrder = ref<AdminOrder | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const stats = ref<OrderStats | null>(null)

    // Filters
    const filters = ref<OrderFilters>({
        status: 'all',
        search: '',
        page: 1,
        limit: 10,
    })

    // Load all orders
    const loadOrders = async () => {
        try {
            loading.value = true
            error.value = null
            orders.value = await orderService.getAllOrders(filters.value)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load orders'
            console.error('Failed to load orders:', err)
        } finally {
            loading.value = false
        }
    }

    // Load single order
    const loadOrder = async (orderId: string) => {
        try {
            loading.value = true
            error.value = null
            currentOrder.value = await orderService.getOrder(orderId)
            if (!currentOrder.value) {
                error.value = 'Order not found'
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load order'
            console.error('Failed to load order:', err)
        } finally {
            loading.value = false
        }
    }

    // Update order status
    const updateOrderStatus = async (orderId: string, status: Order['status']) => {
        try {
            loading.value = true
            error.value = null
            await orderService.updateOrderStatus(orderId, status)

            // Update current order if it's the same one
            if (currentOrder.value && currentOrder.value.id === orderId) {
                currentOrder.value.status = status
                // Add tracking number if shipped
                if (status === 'shipped' && !currentOrder.value.tracking) {
                    currentOrder.value.tracking = orderService.generateTrackingNumber()
                }
            }

            // Update orders list
            const orderIndex = orders.value.findIndex((o) => o.id === orderId)
            if (orderIndex !== -1) {
                orders.value[orderIndex].status = status
                if (status === 'shipped' && !orders.value[orderIndex].tracking) {
                    orders.value[orderIndex].tracking = orderService.generateTrackingNumber()
                }
            }

            return true
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update order status'
            console.error('Failed to update order status:', err)
            return false
        } finally {
            loading.value = false
        }
    }

    // Load order statistics
    const loadStats = async () => {
        try {
            stats.value = await orderService.getOrderStats()
        } catch (err) {
            console.error('Failed to load order stats:', err)
        }
    }

    // Apply filters
    const applyFilters = async (newFilters: Partial<OrderFilters>) => {
        filters.value = { ...filters.value, ...newFilters }
        await loadOrders()
    }

    // Reset filters
    const resetFilters = async () => {
        filters.value = {
            status: 'all',
            search: '',
            page: 1,
            limit: 10,
        }
        await loadOrders()
    }

    // Computed
    const hasOrders = computed(() => orders.value.length > 0)
    const totalOrders = computed(() => stats.value?.totalOrders || 0)
    const pendingCount = computed(() => stats.value?.pendingOrders || 0)
    const processingCount = computed(() => stats.value?.processingOrders || 0)
    const shippedCount = computed(() => stats.value?.shippedOrders || 0)
    const deliveredCount = computed(() => stats.value?.deliveredOrders || 0)
    const cancelledCount = computed(() => stats.value?.cancelledOrders || 0)
    const totalRevenue = computed(() => stats.value?.totalRevenue || 0)
    const averageOrderValue = computed(() => stats.value?.averageOrderValue || 0)

    // Helper functions
    const getStatusVariant = (status: Order['status']) => orderService.getStatusVariant(status)
    const formatCurrency = (amount: number, currency?: string) =>
        orderService.formatCurrency(amount, currency)
    const formatDate = (dateString: string, locale?: string) =>
        orderService.formatDate(dateString, locale)

    return {
        // State
        orders,
        currentOrder,
        loading,
        error,
        stats,
        filters,

        // Actions
        loadOrders,
        loadOrder,
        updateOrderStatus,
        loadStats,
        applyFilters,
        resetFilters,

        // Computed
        hasOrders,
        totalOrders,
        pendingCount,
        processingCount,
        shippedCount,
        deliveredCount,
        cancelledCount,
        totalRevenue,
        averageOrderValue,

        // Helpers
        getStatusVariant,
        formatCurrency,
        formatDate,
    }
}
