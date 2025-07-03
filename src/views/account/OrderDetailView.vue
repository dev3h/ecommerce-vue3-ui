<template>
    <div class="w-full max-w-full overflow-x-hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
            <div
                class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
            ></div>
        </div>

        <!-- Order Not Found -->
        <div v-else-if="!order" class="text-center py-12">
            <Package class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 class="text-xl font-semibold text-foreground mb-2">
                {{ t('order.orderNotFound') }}
            </h2>
            <p class="text-muted-foreground mb-6">
                {{ t('order.orderNotFoundDescription') }}
            </p>
            <Button asChild>
                <RouterLink to="/account/orders">
                    <ArrowLeft class="w-4 h-4 mr-2" />
                    {{ t('account.backToOrders') }}
                </RouterLink>
            </Button>
        </div>

        <!-- Order Details -->
        <div v-else class="space-y-4 sm:space-y-6">
            <!-- Back Button -->
            <div class="mb-4">
                <Button variant="ghost" size="sm" asChild>
                    <RouterLink to="/account/orders">
                        <ArrowLeft class="w-4 h-4 mr-2" />
                        {{ t('account.backToOrders') }}
                    </RouterLink>
                </Button>
            </div>

            <!-- Header Card -->
            <Card class="w-full max-w-full overflow-hidden">
                <CardHeader>
                    <div class="flex flex-col gap-4">
                        <!-- Order Info Row -->
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div class="min-w-0 flex-1">
                                <div class="flex items-start gap-3 mb-3">
                                    <div
                                        class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"
                                    >
                                        <Package class="w-5 h-5 text-primary" />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <CardTitle class="text-xl sm:text-2xl break-all">
                                            {{ order.number }}
                                        </CardTitle>
                                        <CardDescription class="text-sm sm:text-base mt-1">
                                            {{ t('order.details.orderDate') }}:
                                            {{ formatDate(order.date) }}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>

                            <!-- Status & Delivery Info -->
                            <div class="flex flex-col gap-3 sm:items-end">
                                <div
                                    class="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium w-fit"
                                    :class="getStatusColor(order.status)"
                                >
                                    <div class="w-2 h-2 rounded-full bg-current mr-2"></div>
                                    {{ getStatusText(order.status) }}
                                </div>
                                <div
                                    v-if="order.estimatedDelivery"
                                    class="bg-accent text-accent-foreground px-3 py-2 rounded-full text-sm font-medium w-fit"
                                >
                                    <Truck class="w-4 h-4 inline mr-2" />
                                    <span class="break-words">{{
                                        formatDate(order.estimatedDelivery)
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <!-- Order Progress -->
            <Card class="w-full max-w-full overflow-hidden">
                <CardHeader>
                    <CardTitle class="text-lg">{{ t('order.progress') }}</CardTitle>
                </CardHeader>
                <CardContent class="p-3 sm:p-6">
                    <div class="space-y-4">
                        <!-- Mobile Progress (Vertical) -->
                        <div class="block sm:hidden">
                            <div class="space-y-4">
                                <div
                                    v-for="(step, index) in progressSteps"
                                    :key="step.key"
                                    class="flex items-start gap-3 relative"
                                >
                                    <!-- Step Icon -->
                                    <div
                                        class="w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 bg-background relative z-10"
                                        :class="
                                            step.completed
                                                ? 'bg-primary border-primary text-primary-foreground'
                                                : step.active
                                                  ? 'border-primary text-primary'
                                                  : 'border-muted text-muted-foreground'
                                        "
                                    >
                                        <component
                                            :is="step.completed ? CheckCircle : step.icon"
                                            class="w-4 h-4"
                                        />
                                    </div>

                                    <!-- Step Info -->
                                    <div class="flex-1 min-w-0 pt-1">
                                        <span
                                            class="text-sm font-medium block"
                                            :class="
                                                step.completed || step.active
                                                    ? 'text-foreground'
                                                    : 'text-muted-foreground'
                                            "
                                        >
                                            {{ step.label }}
                                        </span>
                                        <span
                                            v-if="step.completed || step.active"
                                            class="text-xs text-muted-foreground mt-1 block"
                                        >
                                            {{ getStepDate(step.key) }}
                                        </span>
                                    </div>

                                    <!-- Vertical Line -->
                                    <div
                                        v-if="index < progressSteps.length - 1"
                                        class="absolute left-4 top-8 w-0.5 h-8 -translate-x-1/2"
                                        :class="
                                            progressSteps[index + 1].completed ||
                                            progressSteps[index + 1].active
                                                ? 'bg-primary'
                                                : 'bg-muted'
                                        "
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <!-- Desktop Progress (Horizontal) -->
                        <div class="hidden sm:block">
                            <div class="relative">
                                <div class="flex items-center justify-between">
                                    <div
                                        v-for="(step, index) in progressSteps"
                                        :key="step.key"
                                        class="flex flex-1 flex-col items-center relative"
                                    >
                                        <!-- Step Icon -->
                                        <div
                                            class="w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 bg-background"
                                            :class="
                                                step.completed
                                                    ? 'bg-primary border-primary text-primary-foreground'
                                                    : step.active
                                                      ? 'border-primary text-primary'
                                                      : 'border-muted text-muted-foreground'
                                            "
                                        >
                                            <component
                                                :is="step.completed ? CheckCircle : step.icon"
                                                class="w-5 h-5"
                                            />
                                        </div>

                                        <!-- Step Label -->
                                        <span
                                            class="text-sm font-medium text-center mb-1"
                                            :class="
                                                step.completed || step.active
                                                    ? 'text-foreground'
                                                    : 'text-muted-foreground'
                                            "
                                        >
                                            {{ step.label }}
                                        </span>

                                        <!-- Step Date -->
                                        <div>
                                            <span
                                                v-if="step.completed || step.active"
                                                class="text-xs text-muted-foreground text-center"
                                            >
                                                {{ getStepDate(step.key) }}
                                            </span>
                                            <span v-else>---</span>
                                        </div>

                                        <!-- Progress Line -->
                                        <div
                                            v-if="index < progressSteps.length - 1"
                                            class="absolute top-5 left-1/2 h-0.5 -translate-y-1/2 z-0"
                                            :class="
                                                progressSteps[index + 1].completed ||
                                                progressSteps[index + 1].active
                                                    ? 'bg-primary'
                                                    : 'bg-muted'
                                            "
                                            style="margin-left: 1.25rem; width: calc(100% - 2.5rem)"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                <!-- Order Items -->
                <div class="xl:col-span-2">
                    <Card class="w-full max-w-full overflow-hidden">
                        <CardHeader>
                            <CardTitle class="text-lg">{{
                                t('order.details.orderItems')
                            }}</CardTitle>
                        </CardHeader>
                        <CardContent class="p-3 sm:p-6">
                            <div class="space-y-3 sm:space-y-4">
                                <div
                                    v-for="item in order.items"
                                    :key="item.id"
                                    class="flex flex-col xs:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
                                >
                                    <!-- Product Image -->
                                    <div class="flex-shrink-0 self-center xs:self-start">
                                        <div
                                            class="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg flex items-center justify-center"
                                        >
                                            <img
                                                v-if="item.image"
                                                :src="item.image"
                                                :alt="item.name"
                                                class="w-full h-full object-cover rounded-lg"
                                            />
                                            <Package
                                                v-else
                                                class="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground"
                                            />
                                        </div>
                                    </div>

                                    <!-- Product Details & Price -->
                                    <div
                                        class="flex-1 min-w-0 flex flex-col xs:flex-row xs:items-center justify-between gap-2"
                                    >
                                        <!-- Product Info -->
                                        <div class="min-w-0 flex-1">
                                            <h4
                                                class="font-medium text-foreground text-sm sm:text-base mb-1 break-words"
                                            >
                                                {{ item.name }}
                                            </h4>
                                            <p class="text-xs sm:text-sm text-muted-foreground">
                                                {{ t('order.details.quantity') }}:
                                                {{ item.quantity }}
                                            </p>
                                        </div>

                                        <!-- Price -->
                                        <div class="flex-shrink-0 text-left xs:text-right">
                                            <PriceDisplay
                                                :price="item.price * item.quantity"
                                                class="font-medium text-sm sm:text-base"
                                            />
                                            <p
                                                v-if="item.quantity > 1"
                                                class="text-xs text-muted-foreground"
                                            >
                                                <PriceDisplay :price="item.price" />
                                                {{ t('order.details.each') }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Order Summary & Details -->
                <div class="space-y-4 sm:space-y-6">
                    <!-- Order Summary -->
                    <Card class="w-full max-w-full overflow-hidden">
                        <CardHeader>
                            <CardTitle class="text-lg">{{
                                t('order.details.orderSummary')
                            }}</CardTitle>
                        </CardHeader>
                        <CardContent class="p-3 sm:p-6">
                            <div class="space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span>{{ t('order.details.subtotal') }}</span>
                                    <PriceDisplay :price="order.subtotal" />
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span>{{ t('order.details.shipping') }}</span>
                                    <PriceDisplay :price="order.shipping" />
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span>{{ t('order.details.tax') }}</span>
                                    <PriceDisplay :price="order.tax" />
                                </div>
                                <div class="border-t pt-3 mt-3">
                                    <div class="flex justify-between font-medium">
                                        <span>{{ t('order.details.total') }}</span>
                                        <PriceDisplay :price="order.total" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Shipping Address -->
                    <Card class="w-full max-w-full overflow-hidden">
                        <CardHeader>
                            <CardTitle class="text-lg">{{
                                t('order.details.shippingAddress')
                            }}</CardTitle>
                        </CardHeader>
                        <CardContent class="p-3 sm:p-6">
                            <div class="space-y-2 text-sm">
                                <p class="font-medium">
                                    {{ order.shippingAddress.firstName }}
                                    {{ order.shippingAddress.lastName }}
                                </p>
                                <p>{{ order.shippingAddress.address }}</p>
                                <p>
                                    {{ order.shippingAddress.city }},
                                    {{ order.shippingAddress.state }}
                                    {{ order.shippingAddress.zipCode }}
                                </p>
                                <p>{{ order.shippingAddress.country }}</p>
                                <p v-if="order.shippingAddress.phone" class="text-muted-foreground">
                                    {{ order.shippingAddress.phone }}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Payment Method -->
                    <Card class="w-full max-w-full overflow-hidden">
                        <CardHeader>
                            <CardTitle class="text-lg">{{
                                t('order.details.paymentMethod')
                            }}</CardTitle>
                        </CardHeader>
                        <CardContent class="p-3 sm:p-6">
                            <div class="flex items-center space-x-3">
                                <CreditCard class="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p class="font-medium text-sm">
                                        {{ order.paymentMethod.type }}
                                    </p>
                                    <p
                                        v-if="order.paymentMethod.last4"
                                        class="text-xs text-muted-foreground"
                                    >
                                        **** **** **** {{ order.paymentMethod.last4 }}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <!-- Action Buttons -->
                    <Card class="w-full max-w-full overflow-hidden">
                        <CardContent class="p-3 sm:p-6">
                            <div class="flex flex-col gap-3">
                                <Button
                                    v-if="order.status === 'delivered'"
                                    variant="outline"
                                    @click="reorderItems"
                                    class="w-full justify-center"
                                    size="sm"
                                >
                                    <RefreshCw class="w-4 h-4 mr-2" />
                                    {{ t('account.reorder') }}
                                </Button>

                                <Button
                                    v-if="order.status === 'shipped' && order.tracking"
                                    variant="outline"
                                    @click="trackOrder"
                                    class="w-full justify-center"
                                    size="sm"
                                >
                                    <Truck class="w-4 h-4 mr-2" />
                                    {{ t('order.trackOrder') }}
                                </Button>

                                <Button
                                    v-if="canCancelOrder"
                                    variant="destructive"
                                    @click="cancelOrder"
                                    class="w-full justify-center"
                                    size="sm"
                                >
                                    <X class="w-4 h-4 mr-2" />
                                    {{ t('order.cancelOrder') }}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useOrderStore } from '@/stores/orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Package,
    CheckCircle,
    Clock,
    Truck,
    ShoppingBag,
    CreditCard,
    ArrowLeft,
    RefreshCw,
    X,
} from 'lucide-vue-next'
import PriceDisplay from '@/components/PriceDisplay.vue'

interface Props {
    id: string
}

const props = defineProps<Props>()
const { t } = useAppI18n()
const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

// Get order from store
const order = computed(() => orderStore.getOrderById(props.id))
const isLoading = computed(() => orderStore.isLoading)

// Order status helpers
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

// Progress steps
const progressSteps = computed(() => {
    if (!order.value) return []

    const currentStatus = order.value.status
    const steps = [
        {
            key: 'pending',
            label: t('order.status.pending'),
            icon: Clock,
            completed: ['processing', 'shipped', 'delivered'].includes(currentStatus),
            active: currentStatus === 'pending',
        },
        {
            key: 'processing',
            label: t('order.status.processing'),
            icon: Package,
            completed: ['shipped', 'delivered'].includes(currentStatus),
            active: currentStatus === 'processing',
        },
        {
            key: 'shipped',
            label: t('order.status.shipped'),
            icon: Truck,
            completed: currentStatus === 'delivered',
            active: currentStatus === 'shipped',
        },
        {
            key: 'delivered',
            label: t('order.status.delivered'),
            icon: ShoppingBag,
            completed: currentStatus === 'delivered',
            active: currentStatus === 'delivered',
        },
    ]

    return currentStatus === 'cancelled' ? [] : steps
})

// Computed properties
const canCancelOrder = computed(() => {
    return order.value && ['pending', 'processing'].includes(order.value.status)
})

// Methods
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const getStepDate = (step: string) => {
    if (!order.value) return ''

    // Mock dates based on order date
    const orderDate = new Date(order.value.date)
    const dates = {
        pending: orderDate,
        processing: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000),
        shipped: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000),
        delivered: new Date(orderDate.getTime() + 120 * 60 * 60 * 1000),
    }

    return (
        dates[step as keyof typeof dates]?.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }) || ''
    )
}

const getProgressWidth = () => {
    if (!order.value) return 0

    const statusProgress = {
        pending: 0,
        processing: 33,
        shipped: 66,
        delivered: 100,
        cancelled: 0,
    }

    return statusProgress[order.value.status as keyof typeof statusProgress] || 0
}

const reorderItems = () => {
    // Here you would implement reorder functionality
    console.log('Reordering items from order:', props.id)
    // In a real app, this would add the items to cart
}

const trackOrder = () => {
    if (order.value?.tracking) {
        // Open tracking URL or show tracking info
        console.log('Tracking order:', order.value.tracking)
    }
}

const cancelOrder = () => {
    if (order.value && canCancelOrder.value) {
        // Show confirmation dialog and cancel order
        console.log('Cancelling order:', props.id)
        // orderStore.cancelOrder(props.id)
    }
}

// Load order data
onMounted(() => {
    // If order is not in store, try to load it
    if (!order.value) {
        orderStore.loadUserOrders()
    }
})
</script>
