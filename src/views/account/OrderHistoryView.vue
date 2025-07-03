<template>
    <Card>
        <CardHeader>
            <CardTitle>{{ t('account.orderHistory') }}</CardTitle>
            <CardDescription>
                {{ t('account.orderHistoryDescription') }}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div v-if="orders.length === 0" class="text-center py-12">
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

            <div v-else class="space-y-4">
                <div
                    v-for="order in orders"
                    :key="order.id"
                    class="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <p class="font-medium text-foreground">
                                {{ t('account.orderNumber') }}: {{ order.number }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                                {{ formatDate(order.date) }}
                            </p>
                        </div>
                        <div class="text-right">
                            <div
                                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="getStatusColor(order.status)"
                            >
                                {{ getStatusText(order.status) }}
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
                        <div>
                            <p class="text-sm font-medium text-foreground">
                                {{ t('account.shippingTo') }}
                            </p>
                            <p class="text-sm text-muted-foreground">
                                {{ order.shippingAddress.city }},
                                {{ order.shippingAddress.country }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <Package class="h-4 w-4 text-muted-foreground" />
                            <span class="text-sm text-muted-foreground">
                                {{ getDeliveryText(order.status) }}
                            </span>
                        </div>
                        <div class="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                                <RouterLink :to="`/account/orders/${order.id}`">
                                    {{ t('account.viewDetails') }}
                                </RouterLink>
                            </Button>
                            <Button
                                v-if="order.status === 'delivered'"
                                variant="outline"
                                size="sm"
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
import { ref, onMounted } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Package } from 'lucide-vue-next'
import PriceDisplay from '@/components/PriceDisplay.vue'

const { t } = useAppI18n()

// Mock order data
const orders = ref<any[]>([])

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
        pending: t('order.pending'),
        processing: t('order.processing'),
        shipped: t('order.shipped'),
        delivered: t('order.delivered'),
        cancelled: t('order.cancelled'),
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
    // Simulate loading orders
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For now, show empty state
    // In a real app, you would fetch from an API
    orders.value = []
}

onMounted(() => {
    loadOrders()
})
</script>
