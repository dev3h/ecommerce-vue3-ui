<template>
    <div class="p-4 md:p-6 space-y-6 md:space-y-8">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
            <h1 class="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {{ t('admin.dashboard.title') }}
            </h1>
            <p class="text-muted-foreground">
                {{ t('admin.dashboard.subtitle') }}
            </p>
        </div>

        <!-- Quick Stats -->
        <DashboardStats />

        <!-- Charts Section -->
        <RevenueCharts />

        <!-- More Charts -->
        <AnalyticsCharts />

        <!-- Recent Orders Table -->
        <RecentOrdersTable />

        <!-- Bottom Section -->
        <ActivitySections />
    </div>
</template>

<script setup lang="ts">
import { useAppI18n } from '@/composables/useI18n'
import {
    DashboardStats,
    RevenueCharts,
    AnalyticsCharts,
    RecentOrdersTable,
    ActivitySections,
} from '@/components/admin/dashboard'

const { t } = useAppI18n()
</script>
