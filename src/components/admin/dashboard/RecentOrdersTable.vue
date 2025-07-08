<template>
    <Card class="p-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold flex items-center gap-2">
                <ShoppingCart class="h-5 w-5" />
                {{ t('admin.dashboard.recentOrders') }}
            </h3>
            <div class="text-sm text-muted-foreground">
                {{
                    recentOrders.length > 0
                        ? `${Math.min(recentOrders.length, 10)} of ${recentOrders.length}`
                        : '0'
                }}
            </div>
        </div>

        <div class="rounded-md border overflow-hidden">
            <div class="overflow-x-auto">
                <Table class="w-full min-w-[800px]">
                    <TableHeader>
                        <TableRow class="hover:bg-transparent">
                            <TableHead class="w-[100px] font-semibold">
                                {{ t('admin.dashboard.orderId') }}
                            </TableHead>
                            <TableHead class="font-semibold">
                                {{ t('admin.dashboard.customer') }}
                            </TableHead>
                            <TableHead class="w-[110px] font-semibold hidden sm:table-cell">
                                {{ t('admin.dashboard.date') }}
                            </TableHead>
                            <TableHead class="w-[120px] text-right font-semibold">
                                {{ t('admin.dashboard.total') }}
                            </TableHead>
                            <TableHead class="w-[150px] font-semibold hidden md:table-cell">
                                {{ t('admin.dashboard.paymentMethod') }}
                            </TableHead>
                            <TableHead class="w-[120px] font-semibold">
                                {{ t('admin.dashboard.status') }}
                            </TableHead>
                            <TableHead class="w-[60px] font-semibold text-center">
                                <span class="sr-only">{{ t('admin.dashboard.viewDetails') }}</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="loading" class="hover:bg-transparent">
                            <TableCell colspan="7" class="text-center py-12">
                                <div class="flex flex-col items-center gap-3 text-muted-foreground">
                                    <div
                                        class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
                                    ></div>
                                    <span class="text-sm">{{ t('admin.dashboard.loading') }}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow
                            v-else
                            v-for="order in recentOrders.slice(0, 10)"
                            :key="order.id"
                            class="group hover:bg-muted/30 transition-colors"
                        >
                            <TableCell class="font-medium">
                                <span class="text-primary font-mono text-sm">#{{ order.id }}</span>
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                                    >
                                        {{ order.customer.charAt(0) }}
                                    </div>
                                    <div class="flex flex-col min-w-0">
                                        <span class="font-medium truncate">{{
                                            order.customer
                                        }}</span>
                                        <span
                                            class="text-xs text-muted-foreground sm:hidden truncate"
                                            >{{ order.date }}</span
                                        >
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell class="text-muted-foreground hidden sm:table-cell text-sm">
                                {{ order.date }}
                            </TableCell>
                            <TableCell class="text-right font-medium">
                                <div class="flex flex-col items-end">
                                    <span class="font-semibold">${{ order.amount }}</span>
                                    <span
                                        class="text-xs text-muted-foreground md:hidden truncate"
                                        >{{ order.paymentMethod }}</span
                                    >
                                </div>
                            </TableCell>
                            <TableCell class="hidden md:table-cell">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0"
                                    >
                                        <span
                                            class="text-xs text-blue-600 dark:text-blue-400 font-semibold"
                                        >
                                            {{ order.paymentMethod.charAt(0) }}
                                        </span>
                                    </div>
                                    <span class="text-sm truncate">{{ order.paymentMethod }}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap"
                                    :class="{
                                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
                                            order.status === 'Completed',
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400':
                                            order.status === 'Processing',
                                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400':
                                            order.status === 'Shipped',
                                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400':
                                            order.status === 'Pending',
                                    }"
                                >
                                    {{ order.status }}
                                </span>
                            </TableCell>
                            <TableCell class="text-center">
                                <button
                                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 opacity-0 group-hover:opacity-100"
                                    :title="t('admin.dashboard.viewDetails')"
                                >
                                    <ExternalLink class="h-4 w-4" />
                                </button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>

        <!-- Empty State -->
        <div
            v-if="!loading && recentOrders.length === 0"
            class="flex flex-col items-center justify-center py-16 text-center border-t"
        >
            <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingCart class="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 class="text-lg font-semibold text-foreground mb-2">No recent orders</h3>
            <p class="text-sm text-muted-foreground max-w-sm">
                Orders will appear here once customers start placing them. Check back later or
                refresh to see updates.
            </p>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Card } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ShoppingCart, ExternalLink } from 'lucide-vue-next'
import { useDashboard } from '@/composables/useDashboard'
import { useAppI18n } from '@/composables/useI18n'

const { t } = useAppI18n()
const { recentOrders, loading, loadDashboardData } = useDashboard()

onMounted(async () => {
    await loadDashboardData()
})
</script>
