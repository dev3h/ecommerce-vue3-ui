<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <!-- Product Categories -->
        <Card class="p-6">
            <div class="mb-4">
                <h3 class="text-lg font-semibold">{{ t('admin.dashboard.productCategories') }}</h3>
                <p class="text-sm text-muted-foreground">
                    {{ t('admin.dashboard.salesByCategory') }}
                </p>
            </div>
            <div v-if="loading" class="flex justify-center items-center h-[300px]">
                <div class="text-muted-foreground">{{ t('admin.dashboard.loading') }}</div>
            </div>
            <PieChart v-else :data="categoryData" :height="300" :show-legend="true" />
        </Card>

        <!-- Top Products -->
        <Card class="p-6">
            <div class="mb-4">
                <h3 class="text-lg font-semibold">{{ t('admin.dashboard.topSellingProducts') }}</h3>
                <p class="text-sm text-muted-foreground">
                    {{ t('admin.dashboard.bestPerformers') }}
                </p>
            </div>
            <div v-if="loading" class="flex justify-center items-center h-[250px]">
                <div class="text-muted-foreground">{{ t('admin.dashboard.loading') }}</div>
            </div>
            <BarChart
                v-else
                :data="topProductsData"
                data-key="sales"
                name-key="product"
                :height="300"
                :colors="['rgba(59, 130, 246, 0.8)']"
            />
        </Card>

        <!-- Customer Activity -->
        <Card class="p-6">
            <div class="mb-4">
                <h3 class="text-lg font-semibold">{{ t('admin.dashboard.customerActivity') }}</h3>
                <p class="text-sm text-muted-foreground">
                    {{ t('admin.dashboard.monthlyActiveUsers') }}
                </p>
            </div>
            <div v-if="loading" class="flex justify-center items-center h-[250px]">
                <div class="text-muted-foreground">{{ t('admin.dashboard.loading') }}</div>
            </div>
            <AreaChart
                v-else
                :data="customerActivityData"
                :data-keys="['active']"
                :height="250"
                :colors="['#3b82f6']"
            />
        </Card>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Card } from '@/components/ui/card'
import { PieChart, BarChart, AreaChart } from '@/components/ui/chart'
import { useDashboard } from '@/composables/useDashboard'
import { useAppI18n } from '@/composables/useI18n'

const { t } = useAppI18n()
const { categoryData, topProductsData, customerActivityData, loading, loadDashboardData } =
    useDashboard()

onMounted(async () => {
    await loadDashboardData()
})
</script>
