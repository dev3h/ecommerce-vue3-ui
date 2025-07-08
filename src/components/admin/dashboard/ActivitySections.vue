<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- New Members -->
        <Card class="p-6">
            <div class="mb-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UserPlus class="h-5 w-5" />
                    {{ t('admin.dashboard.newMembers') }}
                </h3>
            </div>
            <div class="space-y-4">
                <div v-if="loading" class="text-center py-4">
                    <div class="text-muted-foreground">{{ t('admin.dashboard.loading') }}</div>
                </div>
                <div
                    v-else
                    v-for="(member, index) in newMembers.slice(0, 4)"
                    :key="index"
                    class="flex items-center gap-3 p-3 bg-accent/50 rounded-lg"
                >
                    <div
                        class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold"
                    >
                        {{ member.name.charAt(0) }}
                    </div>
                    <div class="flex-1">
                        <p class="font-medium">{{ member.name }}</p>
                        <p class="text-sm text-muted-foreground">{{ member.email }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-muted-foreground">
                            {{ member.orders }} {{ t('admin.dashboard.orders') }}
                        </p>
                    </div>
                </div>
            </div>
        </Card>

        <!-- Recent Activities -->
        <Card class="p-6">
            <div class="mb-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <Activity class="h-5 w-5" />
                    {{ t('admin.dashboard.recentActivities') }}
                </h3>
            </div>
            <div class="space-y-4">
                <div v-if="loading" class="text-center py-4">
                    <div class="text-muted-foreground">{{ t('admin.dashboard.loading') }}</div>
                </div>
                <div
                    v-else
                    v-for="(activity, index) in recentActivities.slice(0, 5)"
                    :key="index"
                    class="flex items-start gap-3"
                >
                    <div class="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div class="flex-1">
                        <p class="text-sm font-medium">{{ activity.message }}</p>
                        <p class="text-xs text-muted-foreground">{{ activity.time }}</p>
                    </div>
                </div>
            </div>
        </Card>

        <!-- Marketing Channels -->
        <Card class="p-6">
            <div class="mb-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp class="h-5 w-5" />
                    {{ t('admin.dashboard.marketingChannels') }}
                </h3>
            </div>
            <div class="space-y-4">
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium">Google Ads</span>
                        <span class="text-sm text-green-600">+12.5%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: 42%"></div>
                    </div>
                    <p class="text-xs text-muted-foreground">
                        12,580 {{ t('admin.dashboard.visitors') }}
                    </p>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium">Facebook</span>
                        <span class="text-sm text-green-600">+8.2%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 28%"></div>
                    </div>
                    <p class="text-xs text-muted-foreground">
                        8,420 {{ t('admin.dashboard.visitors') }}
                    </p>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium">Instagram</span>
                        <span class="text-sm text-red-600">-3.1%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div class="bg-purple-500 h-2 rounded-full" style="width: 18%"></div>
                    </div>
                    <p class="text-xs text-muted-foreground">
                        5,410 {{ t('admin.dashboard.visitors') }}
                    </p>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium">Email Marketing</span>
                        <span class="text-sm text-green-600">+15.8%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: 12%"></div>
                    </div>
                    <p class="text-xs text-muted-foreground">
                        3,600 {{ t('admin.dashboard.visitors') }}
                    </p>
                </div>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Card } from '@/components/ui/card'
import { UserPlus, Activity, TrendingUp } from 'lucide-vue-next'
import { useDashboard } from '@/composables/useDashboard'
import { useAppI18n } from '@/composables/useI18n'

const { t } = useAppI18n()
const { newMembers, recentActivities, loading, loadDashboardData } = useDashboard()

onMounted(async () => {
    await loadDashboardData()
})
</script>
