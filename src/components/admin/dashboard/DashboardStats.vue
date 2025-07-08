<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card class="p-6 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-muted-foreground">
                        {{ t('admin.dashboard.totalRevenue') }}
                    </p>
                    <p class="text-2xl font-bold">
                        <span v-if="loading">...</span>
                        <span v-else>${{ quickStats?.totalRevenue || '0' }}</span>
                    </p>
                    <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp class="h-3 w-3" />
                        <span v-if="loading">{{ t('admin.dashboard.loading') }}</span>
                        <span v-else
                            >{{ quickStats?.revenueGrowth || '+0%' }}
                            {{ t('admin.dashboard.fromLastYear') }}</span
                        >
                    </p>
                </div>
                <div class="p-3 bg-primary/10 rounded-full">
                    <DollarSign class="h-8 w-8 text-primary" />
                </div>
            </div>
        </Card>

        <Card class="p-6 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-muted-foreground">
                        {{ t('admin.dashboard.totalOrders') }}
                    </p>
                    <p class="text-2xl font-bold">
                        <span v-if="loading">...</span>
                        <span v-else>{{ quickStats?.totalOrders || '0' }}</span>
                    </p>
                    <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp class="h-3 w-3" />
                        <span v-if="loading">{{ t('admin.dashboard.loading') }}</span>
                        <span v-else
                            >{{ quickStats?.ordersGrowth || '+0%' }}
                            {{ t('admin.dashboard.fromLastYear') }}</span
                        >
                    </p>
                </div>
                <div class="p-3 bg-blue-500/10 rounded-full">
                    <Package class="h-8 w-8 text-blue-500" />
                </div>
            </div>
        </Card>

        <Card class="p-6 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-muted-foreground">
                        {{ t('admin.dashboard.activeCustomers') }}
                    </p>
                    <p class="text-2xl font-bold">
                        <span v-if="loading">...</span>
                        <span v-else>{{ quickStats?.activeCustomers || '0' }}</span>
                    </p>
                    <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp class="h-3 w-3" />
                        <span v-if="loading">{{ t('admin.dashboard.loading') }}</span>
                        <span v-else
                            >{{ quickStats?.customersGrowth || '+0%' }}
                            {{ t('admin.dashboard.fromLastYear') }}</span
                        >
                    </p>
                </div>
                <div class="p-3 bg-green-500/10 rounded-full">
                    <Users class="h-8 w-8 text-green-500" />
                </div>
            </div>
        </Card>

        <Card class="p-6 transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-muted-foreground">
                        {{ t('admin.dashboard.conversionRate') }}
                    </p>
                    <p class="text-2xl font-bold">
                        <span v-if="loading">...</span>
                        <span v-else>{{ quickStats?.conversionRate || '0%' }}</span>
                    </p>
                    <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <TrendingUp class="h-3 w-3" />
                        <span v-if="loading">{{ t('admin.dashboard.loading') }}</span>
                        <span v-else
                            >{{ quickStats?.conversionGrowth || '+0%' }}
                            {{ t('admin.dashboard.fromLastYear') }}</span
                        >
                    </p>
                </div>
                <div class="p-3 bg-purple-500/10 rounded-full">
                    <Activity class="h-8 w-8 text-purple-500" />
                </div>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Card } from '@/components/ui/card'
import { TrendingUp, Package, Users, DollarSign, Activity } from 'lucide-vue-next'
import { useDashboard } from '@/composables/useDashboard'
import { useAppI18n } from '@/composables/useI18n'

const { t } = useAppI18n()
const { quickStats, loading, loadDashboardData } = useDashboard()

onMounted(async () => {
    await loadDashboardData()
})
</script>
