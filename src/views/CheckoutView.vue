<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useCart } from '@/composables/useCart'
import type { ShippingAddress, PaymentMethod } from '@/types/cart'

// Components
import CheckoutProgress from '@/components/checkout/CheckoutProgress.vue'
import ShippingForm from '@/components/checkout/ShippingForm.vue'
import PaymentForm from '@/components/checkout/PaymentForm.vue'
import OrderReview from '@/components/checkout/OrderReview.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'

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

const handlePlaceOrder = async (options: {
    agreedToTerms: boolean
    subscribeNewsletter: boolean
}) => {
    if (isEmpty.value) {
        router.push('/cart')
        return
    }

    isSubmitting.value = true
    errors.value = {}

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Here you would send the order data to your API
        const orderData = {
            shipping: shippingAddress.value,
            payment: paymentMethod.value,
            items: cartItems.value,
            summary: cartSummary.value,
            agreedToTerms: options.agreedToTerms,
            subscribeNewsletter: options.subscribeNewsletter,
        }

        console.log('Order submitted:', orderData)

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

// Redirect to cart if empty
if (isEmpty.value) {
    router.push('/cart')
}
</script>

<template>
    <div class="min-h-screen bg-background px-3 sm:px-4 md:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto py-3 sm:py-4 md:py-6 lg:py-8">
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
            <CheckoutProgress :current-step="currentStep" />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <!-- Form Section -->
                <div class="lg:col-span-2">
                    <!-- Step 1: Shipping Address -->
                    <ShippingForm
                        v-if="currentStep === 1"
                        v-model="shippingAddress"
                        @next-step="nextStep"
                    />

                    <!-- Step 2: Payment Method -->
                    <PaymentForm
                        v-else-if="currentStep === 2"
                        v-model="paymentMethod"
                        @next-step="nextStep"
                        @prev-step="prevStep"
                    />

                    <!-- Step 3: Order Review -->
                    <OrderReview
                        v-else
                        :cart-items="cartItems"
                        :shipping-address="shippingAddress"
                        :payment-method="paymentMethod"
                        :is-submitting="isSubmitting"
                        @prev-step="prevStep"
                        @place-order="handlePlaceOrder"
                    />
                </div>

                <!-- Order Summary Sidebar -->
                <div class="lg:col-span-1">
                    <OrderSummary :cart-items="cartItems" :cart-summary="cartSummary" />
                </div>
            </div>
        </div>
    </div>
</template>
