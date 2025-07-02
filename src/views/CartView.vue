<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useCart } from '@/composables/useCart'
import PriceDisplay from '@/components/PriceDisplay.vue'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-vue-next'

const { t } = useAppI18n()
const router = useRouter()
const { cartItems, totalItems, updateQuantity, removeFromCart, isEmpty } = useCart()

// Methods
const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return
    updateQuantity(productId, quantity)
    // Không hiển thị toast cho quantity update
}

const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    // Không hiển thị toast cho remove item
}

const handleContinueShopping = () => {
    router.push('/products')
}

const handleProceedToCheckout = () => {
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
    <div class="min-h-screen bg-background">
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 py-6 lg:py-8">
            <div class="max-w-4xl mx-auto">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                        {{ t('cart.title') }}
                    </h1>
                    <p class="text-muted-foreground">
                        {{ t('cart.subtitle') }}
                    </p>
                </div>

                <!-- Empty Cart -->
                <div v-if="isEmpty" class="text-center py-16 lg:py-24">
                    <div class="mb-8">
                        <div
                            class="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center"
                        >
                            <ShoppingCart class="w-10 h-10 lg:w-12 lg:h-12 text-muted-foreground" />
                        </div>
                        <h2 class="text-xl lg:text-2xl font-semibold text-foreground mb-3">
                            {{ t('cart.emptyCart') }}
                        </h2>
                        <p class="text-muted-foreground mb-8 max-w-md mx-auto">
                            {{ t('cart.emptyCartDescription') }}
                        </p>
                    </div>
                    <button
                        @click="handleContinueShopping"
                        class="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft class="w-4 h-4" />
                        {{ t('cart.continueShopping') }}
                    </button>
                </div>

                <!-- Cart Content -->
                <div v-else class="space-y-6">
                    <!-- Cart Items Header -->
                    <div class="flex items-center justify-between pb-4 border-b border-border">
                        <h2 class="text-lg font-semibold text-foreground">
                            {{ t('cart.items') }} ({{ totalItems }})
                        </h2>
                    </div>

                    <!-- Cart Items List -->
                    <div class="space-y-4">
                        <div
                            v-for="item in cartItems"
                            :key="item.id"
                            class="bg-card border border-border rounded-lg p-4 lg:p-6"
                        >
                            <div class="flex flex-col sm:flex-row gap-4">
                                <!-- Product Image -->
                                <div class="flex-shrink-0">
                                    <div
                                        class="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-muted rounded-lg overflow-hidden"
                                    >
                                        <img
                                            :src="item.image"
                                            :alt="item.name"
                                            class="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <!-- Product Details -->
                                <div class="flex-1 min-w-0">
                                    <div class="flex flex-col lg:flex-row lg:items-start gap-4">
                                        <div class="flex-1">
                                            <h3
                                                class="text-base lg:text-lg font-semibold text-foreground mb-2 line-clamp-2"
                                            >
                                                {{ item.name }}
                                            </h3>
                                            <p
                                                v-if="item.category"
                                                class="text-sm text-muted-foreground mb-3"
                                            >
                                                {{ item.category }}
                                            </p>
                                            <PriceDisplay
                                                :price="item.price"
                                                :original-price="item.originalPrice"
                                                class="text-lg lg:text-xl"
                                            />
                                        </div>

                                        <!-- Quantity and Actions -->
                                        <div
                                            class="flex items-center justify-between sm:justify-end gap-4"
                                        >
                                            <!-- Quantity Controls -->
                                            <div class="flex items-center gap-2">
                                                <span
                                                    class="text-sm font-medium text-muted-foreground mr-2"
                                                >
                                                    {{ t('productDetail.quantity') }}:
                                                </span>
                                                <div
                                                    class="flex items-center border border-border rounded-lg bg-background"
                                                >
                                                    <button
                                                        @click="
                                                            handleQuantityChange(
                                                                item.id,
                                                                item.quantity - 1,
                                                            )
                                                        "
                                                        :disabled="item.quantity <= 1"
                                                        class="p-2 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus class="w-4 h-4" />
                                                    </button>
                                                    <input
                                                        :value="item.quantity"
                                                        @change="
                                                            handleQuantityChange(
                                                                item.id,
                                                                parseInt(
                                                                    (
                                                                        $event.target as HTMLInputElement
                                                                    ).value,
                                                                ) || 1,
                                                            )
                                                        "
                                                        type="number"
                                                        min="1"
                                                        class="w-16 text-center border-0 outline-none bg-transparent text-sm font-medium"
                                                    />
                                                    <button
                                                        @click="
                                                            handleQuantityChange(
                                                                item.id,
                                                                item.quantity + 1,
                                                            )
                                                        "
                                                        class="p-2 hover:bg-accent transition-colors"
                                                    >
                                                        <Plus class="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- Remove Button -->
                                            <button
                                                @click="handleRemoveItem(item.id)"
                                                class="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                :title="t('cart.remove')"
                                            >
                                                <Trash2 class="w-4 h-4" />
                                                <span class="hidden sm:inline">{{
                                                    t('cart.remove')
                                                }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Actions -->
                    <div class="pt-6 border-t border-border">
                        <div class="flex flex-col sm:flex-row gap-4 justify-between">
                            <button
                                @click="handleContinueShopping"
                                class="inline-flex items-center justify-center gap-2 border border-border bg-background hover:bg-accent text-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <ArrowLeft class="w-4 h-4" />
                                {{ t('cart.continueShopping') }}
                            </button>
                            <button
                                @click="handleProceedToCheckout"
                                class="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                            >
                                {{ t('cart.next') }}
                                <ShoppingCart class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
