<template>
    <Card class="w-full max-w-full overflow-hidden">
        <CardHeader>
            <CardTitle>{{ t('account.orderHistory') }}</CardTitle>
            <CardDescription>
                {{ t('account.orderHistoryDescription') }}
            </CardDescription>
        </CardHeader>
        <CardContent class="p-3 sm:p-6">
            <div v-if="isLoading" class="flex justify-center py-12">
                <div
                    class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
                ></div>
            </div>

            <div v-else-if="orders.length === 0" class="text-center py-12">
                <ShoppingBag class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 class="text-lg font-medium text-foreground mb-2">
                    {{ t('account.noOrders') }}
                </h3>
                <p class="text-muted-foreground mb-4">
                    {{ t('account.noOrdersDescription') }}
                </p>
                <Button asChild>
                    <RouterLink to="/products">
                        {{ t('navigation.shopNow') }}
                    </RouterLink>
                </Button>
            </div>

            <div v-else class="space-y-3 sm:space-y-4 w-full max-w-full">
                <div
                    v-for="order in orders"
                    :key="order.id"
                    class="border rounded-lg p-3 sm:p-6 hover:bg-accent/50 transition-colors w-full max-w-full overflow-hidden"
                >
                    <div
                        class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3 min-w-0"
                    >
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-foreground truncate text-sm sm:text-base">
                                {{ t('account.orderNumber') }}: {{ order.number }}
                            </p>
                            <p class="text-xs sm:text-sm text-muted-foreground">
                                {{ formatDate(order.date) }}
                            </p>
                        </div>
                        <div class="flex-shrink-0">
                            <div
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="getStatusColor(order.status)"
                            >
                                {{ getStatusText(order.status) }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                            <p class="text-sm font-medium text-foreground">
                                {{ t('account.items') }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                                {{ order.itemCount }} {{ t('account.items') }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-foreground">
                                {{ t('account.total') }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                                <PriceDisplay :price="order.total" />
                            </p>
                        </div>
                        <div class="sm:col-span-2 lg:col-span-1">
                            <p class="text-sm font-medium text-foreground">
                                {{ t('account.shippingTo') }}
                            </p>
                            <p class="text-sm text-muted-foreground truncate">
                                {{ order.shippingAddress.city }},
                                {{ order.shippingAddress.country }}
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-center space-x-2">
                            <Package class="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span class="text-sm text-muted-foreground">
                                {{ getDeliveryText(order.status) }}
                            </span>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm" asChild class="w-full sm:w-auto">
                                <RouterLink :to="`/account/orders/${order.id}`">
                                    {{ t('account.viewDetails') }}
                                </RouterLink>
                            </Button>
                            <Button
                                v-if="order.status === 'delivered'"
                                variant="outline"
                                size="sm"
                                class="w-full sm:w-auto"
                                @click="reorderItems(order.id)"
                            >
                                {{ t('account.reorder') }}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { useOrderStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Package } from 'lucide-vue-next'
import PriceDisplay from '@/components/PriceDisplay.vue'

const { t } = useAppI18n()
const orderStore = useOrderStore()
const authStore = useAuthStore()

// Get user orders from store
const orders = computed(() => orderStore.userOrders)
const isLoading = computed(() => orderStore.isLoading)

// Methods
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const getStatusColor = (status: string) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    }
    return colors[status as keyof typeof colors] || colors.pending
}

const getStatusText = (status: string) => {
    const statusMap = {
        pending: t('order.status.pending'),
        processing: t('order.status.processing'),
        shipped: t('order.status.shipped'),
        delivered: t('order.status.delivered'),
        cancelled: t('order.status.cancelled'),
    }
    return statusMap[status as keyof typeof statusMap] || status
}

const getDeliveryText = (status: string) => {
    const deliveryMap = {
        pending: t('order.orderReceived'),
        processing: t('order.preparingOrder'),
        shipped: t('order.onTheWay'),
        delivered: t('order.orderDelivered'),
        cancelled: t('order.orderCancelled'),
    }
    return deliveryMap[status as keyof typeof deliveryMap] || ''
}

const reorderItems = (orderId: string) => {
    // Here you would implement reorder functionality
    console.log('Reordering items from order:', orderId)
    // In a real app, this would add the items to cart
}

const loadOrders = async () => {
    // Load orders from store
    if (authStore.isAuthenticated) {
        orderStore.loadUserOrders()
    }
}

onMounted(() => {
    loadOrders()
})
</script>
