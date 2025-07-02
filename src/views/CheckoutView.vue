<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useCart } from '@/composables/useCart'
import type { ShippingAddress, PaymentMethod } from '@/types/cart'
import PriceDisplay from '@/components/PriceDisplay.vue'

const { t } = useAppI18n()
const router = useRouter()
const { cartItems, cartSummary, clearCart, isEmpty } = useCart()

// Form data
const shippingAddress = ref<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
})

const paymentMethod = ref<PaymentMethod>({
    type: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
})

// State
const currentStep = ref(1) // 1: Shipping, 2: Payment, 3: Review
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

// Computed
const isShippingValid = computed(() => {
    return (
        shippingAddress.value.firstName &&
        shippingAddress.value.lastName &&
        shippingAddress.value.email &&
        shippingAddress.value.address &&
        shippingAddress.value.city &&
        shippingAddress.value.zipCode
    )
})

const isPaymentValid = computed(() => {
    if (paymentMethod.value.type === 'card') {
        return (
            paymentMethod.value.cardNumber &&
            paymentMethod.value.cardExpiry &&
            paymentMethod.value.cardCvc &&
            paymentMethod.value.cardName
        )
    }
    return true
})

// Methods
const nextStep = () => {
    if (currentStep.value < 3) {
        currentStep.value++
    }
}

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}

const handleSubmitOrder = async () => {
    if (isEmpty.value) {
        router.push('/cart')
        return
    }

    isSubmitting.value = true
    errors.value = {}

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Clear cart
        clearCart()

        // Redirect to success page
        router.push('/checkout/success')
    } catch (error) {
        errors.value.submit = 'Failed to place order. Please try again.'
        console.error('Order submission failed:', error)
    } finally {
        isSubmitting.value = false
    }
}

// Format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount)
}

// Redirect to cart if empty
if (isEmpty.value) {
    router.push('/cart')
}
</script>

<template>
    <div class="min-h-screen bg-background px-3 sm:px-4 md:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto py-3 sm:py-4 md:py-6 lg:py-8">
            <!-- Header -->
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {{ t('checkout.title') }}
                </h1>
                <p class="text-muted-foreground">
                    {{ t('checkout.subtitle') }}
                </p>
            </div>

            <!-- Progress Steps -->
            <div class="mb-6 sm:mb-8">
                <div class="flex items-center justify-center space-x-4">
                    <div
                        v-for="step in 3"
                        :key="step"
                        class="flex items-center"
                        :class="{ 'opacity-50': step > currentStep }"
                    >
                        <div
                            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                            :class="
                                step <= currentStep
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            "
                        >
                            {{ step }}
                        </div>
                        <div v-if="step < 3" class="w-12 h-0.5 bg-gray-200 mx-2">
                            <div
                                v-if="step < currentStep"
                                class="h-full bg-green-500 transition-all duration-300"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center mt-2">
                    <div class="text-sm text-muted-foreground">
                        <span v-if="currentStep === 1">{{ t('checkout.shipping') }}</span>
                        <span v-else-if="currentStep === 2">{{ t('checkout.payment') }}</span>
                        <span v-else>{{ t('checkout.review') }}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <!-- Form Section -->
                <div class="lg:col-span-2">
                    <!-- Step 1: Shipping Address -->
                    <div
                        v-if="currentStep === 1"
                        class="bg-card rounded-lg border border-border p-4 sm:p-6"
                    >
                        <h2 class="text-lg font-medium text-foreground mb-4">
                            {{ t('checkout.shippingAddress') }}
                        </h2>

                        <form @submit.prevent="nextStep" class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        for="firstName"
                                        class="block text-sm font-medium text-foreground mb-1"
                                    >
                                        {{ t('checkout.firstName') }}
                                    </label>
                                    <input
                                        id="firstName"
                                        v-model="shippingAddress.firstName"
                                        type="text"
                                        required
                                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label
                                        for="lastName"
                                        class="block text-sm font-medium text-foreground mb-1"
                                    >
                                        {{ t('checkout.lastName') }}
                                    </label>
                                    <input
                                        id="lastName"
                                        v-model="shippingAddress.lastName"
                                        type="text"
                                        required
                                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    for="email"
                                    class="block text-sm font-medium text-foreground mb-1"
                                >
                                    {{ t('checkout.email') }}
                                </label>
                                <input
                                    id="email"
                                    v-model="shippingAddress.email"
                                    type="email"
                                    required
                                    class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label
                                    for="address"
                                    class="block text-sm font-medium text-foreground mb-1"
                                >
                                    {{ t('checkout.address') }}
                                </label>
                                <input
                                    id="address"
                                    v-model="shippingAddress.address"
                                    type="text"
                                    required
                                    class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label
                                        for="city"
                                        class="block text-sm font-medium text-foreground mb-1"
                                    >
                                        {{ t('checkout.city') }}
                                    </label>
                                    <input
                                        id="city"
                                        v-model="shippingAddress.city"
                                        type="text"
                                        required
                                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label
                                        for="state"
                                        class="block text-sm font-medium text-foreground mb-1"
                                    >
                                        {{ t('checkout.state') }}
                                    </label>
                                    <input
                                        id="state"
                                        v-model="shippingAddress.state"
                                        type="text"
                                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label
                                        for="zipCode"
                                        class="block text-sm font-medium text-foreground mb-1"
                                    >
                                        {{ t('checkout.zipCode') }}
                                    </label>
                                    <input
                                        id="zipCode"
                                        v-model="shippingAddress.zipCode"
                                        type="text"
                                        required
                                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div class="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    :disabled="!isShippingValid"
                                    class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {{ t('checkout.continueToPayment') }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Step 2: Payment Method -->
                    <div
                        v-else-if="currentStep === 2"
                        class="bg-card rounded-lg border border-border p-4 sm:p-6"
                    >
                        <h2 class="text-lg font-medium text-foreground mb-4">
                            {{ t('checkout.paymentMethod') }}
                        </h2>

                        <form @submit.prevent="nextStep" class="space-y-4">
                            <div class="space-y-4">
                                <div>
                                    <label
                                        for="cardNumber"
                                        class="block text-sm font-medium text-foreground mb-1"
                                    >
                                        {{ t('checkout.cardNumber') }}
                                    </label>
                                    <input
                                        id="cardNumber"
                                        v-model="paymentMethod.cardNumber"
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        required
                                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            for="cardExpiry"
                                            class="block text-sm font-medium text-foreground mb-1"
                                        >
                                            {{ t('checkout.expiryDate') }}
                                        </label>
                                        <input
                                            id="cardExpiry"
                                            v-model="paymentMethod.cardExpiry"
                                            type="text"
                                            placeholder="MM/YY"
                                            required
                                            class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            for="cardCvc"
                                            class="block text-sm font-medium text-foreground mb-1"
                                        >
                                            {{ t('checkout.cvc') }}
                                        </label>
                                        <input
                                            id="cardCvc"
                                            v-model="paymentMethod.cardCvc"
                                            type="text"
                                            placeholder="123"
                                            required
                                            class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        for="cardName"
                                        class="block text-sm font-medium text-foreground mb-1"
                                    >
                                        {{ t('checkout.cardName') }}
                                    </label>
                                    <input
                                        id="cardName"
                                        v-model="paymentMethod.cardName"
                                        type="text"
                                        required
                                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div class="flex justify-between pt-4">
                                <button
                                    type="button"
                                    @click="prevStep"
                                    class="border border-border px-6 py-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                    {{ t('checkout.back') }}
                                </button>
                                <button
                                    type="submit"
                                    :disabled="!isPaymentValid"
                                    class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {{ t('checkout.reviewOrder') }}
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Step 3: Order Review -->
                    <div v-else class="bg-card rounded-lg border border-border p-4 sm:p-6">
                        <h2 class="text-lg font-medium text-foreground mb-4">
                            {{ t('checkout.orderReview') }}
                        </h2>

                        <div class="space-y-6">
                            <!-- Order Items -->
                            <div>
                                <h3 class="font-medium text-foreground mb-3">
                                    {{ t('checkout.orderItems') }}
                                </h3>
                                <div class="space-y-3">
                                    <div
                                        v-for="item in cartItems"
                                        :key="item.id"
                                        class="flex items-center gap-3 p-3 bg-accent/50 rounded-lg"
                                    >
                                        <img
                                            :src="item.image"
                                            :alt="item.name"
                                            class="w-12 h-12 object-cover rounded"
                                        />
                                        <div class="flex-1">
                                            <h4 class="text-sm font-medium">{{ item.name }}</h4>
                                            <p class="text-xs text-muted-foreground">
                                                {{ t('common.quantity') }}: {{ item.quantity }}
                                            </p>
                                        </div>
                                        <div class="text-right">
                                            <PriceDisplay :price="item.price" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-between pt-4">
                                <button
                                    type="button"
                                    @click="prevStep"
                                    class="border border-border px-6 py-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                    {{ t('checkout.back') }}
                                </button>
                                <button
                                    @click="handleSubmitOrder"
                                    :disabled="isSubmitting"
                                    class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    <span
                                        v-if="isSubmitting"
                                        class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                    ></span>
                                    {{
                                        isSubmitting
                                            ? t('checkout.placing')
                                            : t('checkout.placeOrder')
                                    }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary Sidebar -->
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
                        </div>

                        <div class="border-t border-border pt-3">
                            <div class="flex justify-between">
                                <span class="text-base font-medium text-foreground">{{
                                    t('cart.total')
                                }}</span>
                                <span class="text-lg font-bold text-foreground">{{
                                    formatCurrency(cartSummary.total)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
