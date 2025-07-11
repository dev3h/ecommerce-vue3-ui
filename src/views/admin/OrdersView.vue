<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {{ t('admin.ordersManagement.title') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-300">
                    {{ t('admin.ordersManagement.subtitle') }}
                </p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card class="p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {{ t('admin.ordersManagement.stats.totalOrders') }}
                        </p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {{ totalOrders }}
                        </p>
                    </div>
                    <div
                        class="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center"
                    >
                        <Package class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </Card>

            <Card class="p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {{ t('admin.ordersManagement.stats.pendingOrders') }}
                        </p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {{ pendingCount }}
                        </p>
                    </div>
                    <div
                        class="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center"
                    >
                        <Clock class="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                </div>
            </Card>

            <Card class="p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {{ t('admin.ordersManagement.stats.deliveredOrders') }}
                        </p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {{ deliveredCount }}
                        </p>
                    </div>
                    <div
                        class="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center"
                    >
                        <CheckCircle class="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </Card>

            <Card class="p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {{ t('admin.ordersManagement.stats.totalRevenue') }}
                        </p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {{ formatCurrency(totalRevenue) }}
                        </p>
                    </div>
                    <div
                        class="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center"
                    >
                        <DollarSign class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
            </Card>
        </div>

        <!-- Orders Data Table -->
        <DataTable
            :columns="columns"
            :data="filteredOrders"
            :loading="loading"
            show-global-filter
            :filter-placeholder="t('admin.ordersManagement.searchOrders')"
            :rows-per-page-text="t('admin.ordersManagement.pagination.rowsPerPage')"
            :go-to-first-page-text="t('admin.ordersManagement.pagination.first')"
            :go-to-previous-page-text="t('admin.ordersManagement.pagination.previous')"
            :go-to-next-page-text="t('admin.ordersManagement.pagination.next')"
            :go-to-last-page-text="t('admin.ordersManagement.pagination.last')"
            :page-text="t('admin.ordersManagement.pagination.page')"
            :of-text="t('admin.ordersManagement.pagination.of')"
            :loading-text="t('common.loading')"
            :no-data-text="t('admin.ordersManagement.noOrders')"
            @row-click="handleRowClick"
        >
            <template #pagination-left="{ selectedCount, totalCount }">
                <div class="flex-1 text-sm text-muted-foreground">
                    {{ selectedCount }} {{ t('admin.ordersManagement.pagination.of') }}
                    {{ totalCount }} {{ t('admin.ordersManagement.pagination.entries') }}
                    {{ t('common.selected') }}.
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, h } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersAdmin } from '@/composables/useOrdersAdmin'
import { useAppI18n } from '@/composables/useI18n'
import { createColumnHelper } from '@tanstack/vue-table'
import type { AdminOrder } from '@/services/order.service'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import Badge from '@/components/ui/badge/Badge.vue'
import DataTable from '@/components/ui/DataTable.vue'
import { Package, Clock, CheckCircle, DollarSign, RefreshCw, Eye, User } from 'lucide-vue-next'

const router = useRouter()
const { t } = useAppI18n()

// Composables
const {
    orders,
    loading,
    error,
    stats,
    loadOrders,
    loadStats,
    applyFilters: applyOrderFilters,
    resetFilters: resetOrderFilters,
    hasOrders,
    totalOrders,
    pendingCount,
    deliveredCount,
    totalRevenue,
    getStatusVariant,
    formatCurrency,
    formatDate,
} = useOrdersAdmin()

// Local state
const searchQuery = ref('')
const statusFilter = ref('all')

// Column helper for DataTable
const columnHelper = createColumnHelper<AdminOrder>()

// Filtered orders for DataTable
const filteredOrders = computed(() => {
    let filtered = orders.value

    // Filter by status
    if (statusFilter.value && statusFilter.value !== 'all') {
        filtered = filtered.filter((order) => order.status === statusFilter.value)
    }

    // Filter by search
    if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
            (order) =>
                order.number.toLowerCase().includes(search) ||
                order.customerName.toLowerCase().includes(search) ||
                order.customerEmail.toLowerCase().includes(search),
        )
    }

    return filtered
})

// Table columns
const columns = [
    columnHelper.accessor('number', {
        header: () => t('admin.ordersManagement.table.orderNumber'),
        cell: ({ row }) => {
            const order = row.original
            return h('div', { class: 'space-y-1' }, [
                h(
                    'div',
                    { class: 'text-sm font-medium text-gray-900 dark:text-gray-100' },
                    order.number,
                ),
                h('div', { class: 'text-xs text-gray-500 dark:text-gray-400' }, order.id),
            ])
        },
        size: 150,
    }),
    columnHelper.accessor('customerName', {
        header: () => t('admin.ordersManagement.table.customer'),
        cell: ({ row }) => {
            const order = row.original
            return h('div', { class: 'flex items-center gap-3' }, [
                h(
                    'div',
                    {
                        class: 'h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center',
                    },
                    [h(User, { class: 'h-4 w-4 text-gray-500 dark:text-gray-400' })],
                ),
                h('div', { class: 'space-y-1' }, [
                    h(
                        'div',
                        { class: 'text-sm font-medium text-gray-900 dark:text-gray-100' },
                        order.customerName,
                    ),
                    h(
                        'div',
                        { class: 'text-xs text-gray-500 dark:text-gray-400' },
                        order.customerEmail,
                    ),
                ]),
            ])
        },
        size: 200,
    }),
    columnHelper.accessor('date', {
        header: () => t('admin.ordersManagement.table.date'),
        cell: ({ getValue }) =>
            h('div', { class: 'text-sm text-gray-900 dark:text-gray-100' }, formatDate(getValue())),
        size: 120,
    }),
    columnHelper.accessor('itemCount', {
        header: () => t('admin.ordersManagement.table.items'),
        cell: ({ getValue }) => {
            const count = getValue()
            return h(
                'div',
                { class: 'text-sm text-gray-900 dark:text-gray-100' },
                `${count} ${count > 1 ? 'items' : 'item'}`,
            )
        },
        size: 80,
    }),
    columnHelper.accessor('total', {
        header: () => t('admin.ordersManagement.table.total'),
        cell: ({ row }) => {
            const order = row.original
            return h(
                'div',
                { class: 'text-sm font-medium text-gray-900 dark:text-gray-100' },
                formatCurrency(order.total, order.currency),
            )
        },
        size: 100,
    }),
    columnHelper.accessor('status', {
        header: () => t('admin.ordersManagement.table.status'),
        cell: ({ getValue }) => {
            const status = getValue()
            return h(
                Badge,
                {
                    variant: getStatusVariant(status),
                },
                () => t(`admin.ordersManagement.status.${status}`),
            )
        },
        size: 100,
    }),
    columnHelper.display({
        id: 'actions',
        header: () => t('admin.ordersManagement.table.actions'),
        cell: ({ row }) => {
            const order = row.original
            return h(
                Button,
                {
                    variant: 'ghost',
                    size: 'sm',
                    class: 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300',
                    onClick: () => viewOrder(order.id),
                },
                () => [h(Eye, { class: 'h-4 w-4 mr-1' }), t('admin.ordersManagement.viewOrder')],
            )
        },
        size: 120,
    }),
]

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        // Search is handled by computed filteredOrders
    }, 300)
}

// Methods
const applyFilters = async (additionalFilters = {}) => {
    await applyOrderFilters({
        status: statusFilter.value,
        search: searchQuery.value,
        ...additionalFilters,
    })
}

const resetFilters = async () => {
    searchQuery.value = ''
    statusFilter.value = 'all'
    await resetOrderFilters()
}

const viewOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`)
}

const handleRowClick = (order: AdminOrder) => {
    viewOrder(order.id)
}

// Watchers
watch(statusFilter, () => {
    applyFilters()
})

// Lifecycle
onMounted(async () => {
    await Promise.all([loadOrders(), loadStats()])
})
</script>
