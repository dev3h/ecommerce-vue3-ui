<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useCart } from '@/composables/useCart'
import PriceDisplay from '@/components/PriceDisplay.vue'

const { t } = useAppI18n()
const router = useRouter()
const { cartItems, cartSummary, updateQuantity, removeFromCart, isEmpty } = useCart()

// Methods
const handleQuantityChange = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity)
}

const handleRemoveItem = (productId: number) => {
    removeFromCart(productId)
}

const handleContinueShopping = () => {
    router.push('/products')
}

const handleCheckout = () => {
    router.push('/checkout')
}

// Format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount)
}
</script>

<template>
    <div class="min-h-screen bg-background px-3 sm:px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto py-3 sm:py-4 md:py-6 lg:py-8">
            <!-- Header -->
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {{ t('cart.title') }}
                </h1>
                <p class="text-muted-foreground">
                    {{ t('cart.subtitle') }}
                </p>
            </div>

            <!-- Empty Cart -->
            <div v-if="isEmpty" class="text-center py-12 sm:py-16">
                <div class="mb-6">
                    <svg
                        class="mx-auto h-16 w-16 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01"
                        />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-foreground mb-2">
                    {{ t('cart.emptyCart') }}
                </h3>
                <p class="text-muted-foreground mb-6">
                    {{ t('cart.emptyCartDescription') }}
                </p>
                <button
                    @click="handleContinueShopping"
                    class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                    {{ t('cart.continueShopping') }}
                </button>
            </div>

            <!-- Cart Content -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <!-- Cart Items -->
                <div class="lg:col-span-2">
                    <div class="bg-card rounded-lg border border-border overflow-hidden">
                        <div class="px-4 py-3 border-b border-border">
                            <h2 class="text-lg font-medium text-foreground">
                                {{ t('cart.items') }} ({{ cartItems.length }})
                            </h2>
                        </div>

                        <div class="divide-y divide-border">
                            <div
                                v-for="item in cartItems"
                                :key="item.id"
                                class="p-4 flex flex-col sm:flex-row gap-4"
                            >
                                <!-- Product Image -->
                                <div class="flex-shrink-0">
                                    <img
                                        :src="item.image"
                                        :alt="item.name"
                                        class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                                    />
                                </div>

                                <!-- Product Details -->
                                <div class="flex-1 min-w-0">
                                    <h3
                                        class="text-sm font-medium text-foreground line-clamp-2 mb-1"
                                    >
                                        {{ item.name }}
                                    </h3>
                                    <p
                                        v-if="item.category"
                                        class="text-xs text-muted-foreground mb-2"
                                    >
                                        {{ item.category }}
                                    </p>
                                    <PriceDisplay
                                        :price="item.price"
                                        :original-price="item.originalPrice"
                                        class="text-sm"
                                    />
                                </div>

                                <!-- Quantity Controls -->
                                <div class="flex flex-col sm:items-end gap-2">
                                    <div class="flex items-center gap-2">
                                        <button
                                            @click="
                                                handleQuantityChange(item.id, item.quantity - 1)
                                            "
                                            class="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                                            :disabled="item.quantity <= 1"
                                        >
                                            <svg
                                                class="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M20 12H4"
                                                />
                                            </svg>
                                        </button>
                                        <span class="min-w-[2rem] text-center text-sm font-medium">
                                            {{ item.quantity }}
                                        </span>
                                        <button
                                            @click="
                                                handleQuantityChange(item.id, item.quantity + 1)
                                            "
                                            class="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                                        >
                                            <svg
                                                class="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- Remove Button -->
                                    <button
                                        @click="handleRemoveItem(item.id)"
                                        class="text-red-500 hover:text-red-600 text-xs font-medium transition-colors"
                                    >
                                        {{ t('cart.remove') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-card rounded-lg border border-border p-4 sticky top-4">
                        <h2 class="text-lg font-medium text-foreground mb-4">
                            {{ t('cart.orderSummary') }}
                        </h2>

                        <div class="space-y-3 mb-4">
                            <div class="flex justify-between text-sm">
                                <span class="text-muted-foreground">{{ t('cart.subtotal') }}</span>
                                <span class="font-medium">{{
                                    formatCurrency(cartSummary.subtotal)
                                }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-muted-foreground">{{ t('cart.shipping') }}</span>
                                <span class="font-medium">
                                    {{
                                        cartSummary.shipping === 0
                                            ? t('cart.free')
                                            : formatCurrency(cartSummary.shipping)
                                    }}
                                </span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-muted-foreground">{{ t('cart.tax') }}</span>
                                <span class="font-medium">{{
                                    formatCurrency(cartSummary.tax)
                                }}</span>
                            </div>
                            <div
                                v-if="cartSummary.discount > 0"
                                class="flex justify-between text-sm"
                            >
                                <span class="text-muted-foreground">{{ t('cart.discount') }}</span>
                                <span class="font-medium text-green-600"
                                    >-{{ formatCurrency(cartSummary.discount) }}</span
                                >
                            </div>
                        </div>

                        <div class="border-t border-border pt-3 mb-4">
                            <div class="flex justify-between">
                                <span class="text-base font-medium text-foreground">{{
                                    t('cart.total')
                                }}</span>
                                <span class="text-lg font-bold text-foreground">{{
                                    formatCurrency(cartSummary.total)
                                }}</span>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <button
                                @click="handleCheckout"
                                class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                            >
                                {{ t('cart.proceedToCheckout') }}
                            </button>
                            <button
                                @click="handleContinueShopping"
                                class="w-full border border-border py-3 rounded-lg hover:bg-accent transition-colors font-medium"
                            >
                                {{ t('cart.continueShopping') }}
                            </button>
                        </div>

                        <div
                            v-if="cartSummary.shipping === 0"
                            class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                            <p class="text-xs text-green-700 dark:text-green-300 flex items-center">
                                <svg
                                    class="w-4 h-4 mr-1.5"
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
                                {{ t('cart.freeShippingMessage') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
