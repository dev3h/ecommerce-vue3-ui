<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useOrderStore } from '@/stores/orders'
import { Button } from '@/components/ui/button'

const { t } = useAppI18n()
const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()

// Get order info from query params
const orderId = route.query.orderId as string
const orderNumber = route.query.orderNumber as string

// Get order details
const order = computed(() => {
    if (orderId) {
        return orderStore.getOrderById(orderId)
    }
    return null
})

const goToHome = () => {
    router.push('/')
}

const goToProducts = () => {
    router.push('/products')
}

const goToOrderHistory = () => {
    router.push('/account/orders')
}

onMounted(() => {
    // If no order info in URL, redirect to home
    if (!orderId && !orderNumber) {
        router.push('/')
    }
})
</script>

<template>
    <div class="min-h-screen bg-background px-3 sm:px-4 md:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto py-12 sm:py-16 md:py-20">
            <!-- Success Icon -->
            <div class="text-center mb-8">
                <div
                    class="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-6"
                >
                    <svg
                        class="w-10 h-10 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1 class="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    {{ t('checkout.orderSuccess') }}
                </h1>

                <p class="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                    {{ order ? t('checkout.orderSuccessMessage') : t('checkout.orderProcessing') }}
                </p>
            </div>

            <!-- Order Details Card -->
            <div
                v-if="order || orderNumber"
                class="bg-card rounded-lg border border-border p-6 mb-8"
            >
                <h2 class="text-xl font-semibold text-foreground mb-4">
                    {{ t('common.orderDetails') }}
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p class="text-sm text-muted-foreground">{{ t('account.orderNumber') }}</p>
                        <p class="font-semibold text-foreground">
                            {{ order?.number || orderNumber }}
                        </p>
                    </div>
                    <div v-if="order">
                        <p class="text-sm text-muted-foreground">{{ t('account.orderDate') }}</p>
                        <p class="font-semibold text-foreground">
                            {{ new Date(order.date).toLocaleDateString() }}
                        </p>
                    </div>
                    <div v-if="order">
                        <p class="text-sm text-muted-foreground">{{ t('account.orderStatus') }}</p>
                        <span
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        >
                            {{ t(`order.${order.status}`) }}
                        </span>
                    </div>
                    <div v-if="order">
                        <p class="text-sm text-muted-foreground">{{ t('account.total') }}</p>
                        <p class="font-semibold text-foreground">${{ order.total.toFixed(2) }}</p>
                    </div>
                </div>

                <div v-if="order?.estimatedDelivery" class="p-4 bg-accent/30 rounded-lg">
                    <p class="text-sm text-muted-foreground mb-1">
                        {{ t('checkout.estimatedDelivery') }}
                    </p>
                    <p class="font-medium text-foreground">
                        {{ new Date(order.estimatedDelivery).toLocaleDateString() }}
                    </p>
                </div>
            </div>

            <!-- Order Details Card (fallback) -->
            <div v-else class="bg-card rounded-lg border border-border p-6 mb-8">
                <h2 class="text-xl font-semibold text-foreground mb-4">
                    {{ t('common.orderDetails') }}
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-muted-foreground">{{ t('common.orderNumber') }}:</span>
                        <span class="ml-2 font-medium"
                            >#{{ Math.random().toString(36).substr(2, 9).toUpperCase() }}</span
                        >
                    </div>
                    <div>
                        <span class="text-muted-foreground">{{ t('common.orderDate') }}:</span>
                        <span class="ml-2 font-medium">{{ new Date().toLocaleDateString() }}</span>
                    </div>
                    <div>
                        <span class="text-muted-foreground"
                            >{{ t('common.estimatedDelivery') }}:</span
                        >
                        <span class="ml-2 font-medium">{{
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
                        }}</span>
                    </div>
                    <div>
                        <span class="text-muted-foreground">{{ t('common.status') }}:</span>
                        <span class="ml-2 font-medium text-green-600">{{
                            t('common.confirmed')
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- Next Steps -->
            <div class="bg-accent/50 rounded-lg p-6 mb-8">
                <h3 class="text-lg font-medium text-foreground mb-3">
                    {{ t('common.whatNext') }}
                </h3>
                <ul class="space-y-2 text-sm text-muted-foreground">
                    <li class="flex items-start">
                        <svg
                            class="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {{ t('common.emailConfirmation') }}
                    </li>
                    <li class="flex items-start">
                        <svg
                            class="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {{ t('common.preparingOrder') }}
                    </li>
                    <li class="flex items-start">
                        <svg
                            class="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {{ t('common.shippingNotification') }}
                    </li>
                </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <Button @click="goToOrderHistory" size="lg">
                    {{ t('account.viewOrders') }}
                </Button>
                <Button @click="goToProducts" variant="outline" size="lg">
                    {{ t('common.continueShopping') }}
                </Button>
                <Button @click="goToHome" variant="outline" size="lg">
                    {{ t('common.backToHome') }}
                </Button>
            </div>
        </div>
    </div>
</template>
