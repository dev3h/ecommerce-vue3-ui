<template>
    <div class="max-w-4xl mx-auto py-8 px-4">
        <Button class="mb-4" @click="goBack" variant="default" size="default">
            ← {{ t('common.back') || 'Back to list' }}
        </Button>
        <h1 class="text-2xl font-bold mb-6">{{ t('admin.customers.view') }}: {{ user?.name }}</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
                <div class="p-4">
                    <h2 class="text-lg font-semibold mb-2">{{ t('admin.customers.name') }}</h2>
                    <div class="mb-1">
                        <span class="font-medium">{{ t('admin.customers.email') }}:</span>
                        {{ user?.email }}
                    </div>
                    <div class="mb-1">
                        <span class="font-medium">{{ t('admin.customers.phone') }}:</span>
                        {{ user?.phone }}
                    </div>
                    <div>
                        <span class="font-medium">{{ t('admin.customers.status') }}:</span>
                        <span
                            :class="user?.active ? 'text-green-600 font-medium' : 'text-gray-400'"
                        >
                            {{
                                user?.active
                                    ? t('admin.customers.active')
                                    : t('admin.customers.inactive')
                            }}
                        </span>
                    </div>
                </div>
            </Card>
            <Card>
                <div class="p-4">
                    <h2 class="text-lg font-semibold mb-2">
                        {{ t('admin.customers.statistics') }}
                    </h2>
                    <div class="mb-1">
                        {{ t('admin.customers.totalOrders') }}:
                        <span class="font-bold">{{ stats.totalOrders }}</span>
                    </div>
                    <div>
                        {{ t('admin.customers.totalSpent') }}:
                        <span class="font-bold">{{ formattedTotalSpent }}</span>
                    </div>
                </div>
            </Card>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <div class="p-4">
                    <h2 class="text-lg font-semibold mb-4">
                        {{ t('admin.customers.monthlyOrders') }}
                    </h2>
                    <BarChart
                        :data="ordersPerMonth"
                        data-key="value"
                        name-key="name"
                        :label="t('admin.customers.orders')"
                    />
                </div>
            </Card>
            <Card>
                <div class="p-4">
                    <h2 class="text-lg font-semibold mb-4">
                        {{ t('admin.customers.monthlySpent') }}
                    </h2>
                    <BarChart
                        :data="spentPerMonth"
                        data-key="value"
                        name-key="name"
                        :label="t('admin.customers.spent')"
                        :colors="['#10b981']"
                    />
                </div>
            </Card>
            <Card class="md:col-span-2">
                <div class="p-4">
                    <h2 class="text-lg font-semibold mb-4">
                        {{ t('admin.customers.orderSuccessRate') }}
                    </h2>
                    <PieChart
                        :data="orderSuccessRate"
                        data-key="value"
                        name-key="name"
                        :colors="['#10b981', '#f87171']"
                    />
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { Card } from '@/components/ui/card'
import { BarChart, PieChart } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
// Fake data, replace with real API call
const { t } = useAppI18n()
const route = useRoute()
const router = useRouter()
const userId = route.params.id

function goBack() {
    router.push({ name: 'AdminCustomers' })
}
const user = ref({
    id: 1,
    name: 'Nguyen Van A',
    email: 'a@example.com',
    phone: '0901234567',
    active: true,
})
const stats = ref({
    totalOrders: 24,
    totalSpent: 12000000,
    successOrders: 22,
    failedOrders: 2,
})
const currencyFormatter = computed(
    () => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }),
)
const formattedTotalSpent = computed(() => currencyFormatter.value.format(stats.value.totalSpent))
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const ordersPerMonth = months.map((m, i) => ({
    name: m,
    value: [2, 1, 3, 2, 4, 2, 1, 3, 2, 2, 1, 1][i],
}))
const spentPerMonth = months.map((m, i) => ({
    name: m,
    value: [
        1000000, 500000, 1500000, 1000000, 2000000, 1000000, 500000, 1500000, 1000000, 1000000,
        500000, 500000,
    ][i],
}))
const orderSuccessRate = computed(() => [
    { name: t('admin.customers.success'), value: stats.value.successOrders },
    { name: t('admin.customers.failed'), value: stats.value.failedOrders },
])
</script>

<style scoped></style>
