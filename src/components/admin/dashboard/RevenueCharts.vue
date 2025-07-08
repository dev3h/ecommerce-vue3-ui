<template>
    <div class="space-y-6">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <!-- Revenue Chart -->
            <Card class="p-6">
                <div class="mb-4">
                    <h3 class="text-lg font-semibold">
                        {{ t('admin.dashboard.revenueOverview') }}
                    </h3>
                    <p class="text-sm text-muted-foreground">
                        {{ t('admin.dashboard.monthlyRevenue') }}
                    </p>
                </div>
                <div v-if="loading" class="flex justify-center items-center h-[300px]">
                    <div class="text-muted-foreground">{{ t('admin.dashboard.loading') }}</div>
                </div>
                <AreaChart
                    v-else
                    :data="revenueData"
                    :data-keys="['revenue', 'profit']"
                    :height="300"
                    :colors="['#3b82f6', '#22c55e']"
                />
            </Card>

            <!-- Orders Chart -->
            <Card class="p-6">
                <div class="mb-4">
                    <h3 class="text-lg font-semibold">
                        {{ t('admin.dashboard.ordersStatistics') }}
                    </h3>
                    <p class="text-sm text-muted-foreground">
                        {{ t('admin.dashboard.ordersAndCompleted') }}
                    </p>
                </div>
                <div v-if="loading" class="flex justify-center items-center h-[300px]">
                    <div class="text-muted-foreground">{{ t('admin.dashboard.loading') }}</div>
                </div>
                <BarChart
                    v-else
                    :data="ordersData"
                    :data-keys="['orders', 'completed']"
                    :height="300"
                    :colors="['rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)']"
                />
            </Card>
        </div>

        <!-- Yearly Revenue Comparison -->
        <Card class="p-6">
            <div class="mb-4">
                <h3 class="text-lg font-semibold">
                    {{ t('admin.dashboard.yearlyRevenueComparison') }}
                </h3>
                <p class="text-sm text-muted-foreground">
                    {{ t('admin.dashboard.lastYearsRevenue') }}
                </p>
            </div>
            <div v-if="loading" class="flex justify-center items-center h-[300px]">
                <div class="text-muted-foreground">{{ t('admin.dashboard.loading') }}</div>
            </div>
            <BarChart
                v-else
                :data="yearlyComparisonData"
                data-key="revenue"
                :height="300"
                :colors="['#64748b', '#3b82f6', '#22c55e']"
            />
        </Card>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Card } from '@/components/ui/card'
import { AreaChart, BarChart } from '@/components/ui/chart'
import { useDashboard } from '@/composables/useDashboard'
import { useAppI18n } from '@/composables/useI18n'

const { t } = useAppI18n()
const { revenueData, ordersData, yearlyComparisonData, loading, error, loadDashboardData } =
    useDashboard()

onMounted(async () => {
    await loadDashboardData()
})
</script>
