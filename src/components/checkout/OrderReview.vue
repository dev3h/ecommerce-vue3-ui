<template>
    <div class="bg-card rounded-lg border border-border p-4 sm:p-6">
        <h2 class="text-lg font-medium text-foreground mb-4">
            {{ t('checkout.orderReview') }}
        </h2>

        <div class="space-y-6">
            <!-- Shipping Address Review -->
            <div>
                <h3 class="font-medium text-foreground mb-3">
                    {{ t('checkout.shippingAddress') }}
                </h3>
                <div class="p-3 bg-accent/50 rounded-lg">
                    <div class="text-sm space-y-1">
                        <div class="font-medium">
                            {{ shippingAddress.firstName }} {{ shippingAddress.lastName }}
                        </div>
                        <div>{{ shippingAddress.email }}</div>
                        <div v-if="shippingAddress.phone">{{ shippingAddress.phone }}</div>
                        <div>{{ shippingAddress.address }}</div>
                        <div>
                            {{ shippingAddress.city
                            }}<span v-if="shippingAddress.state"
                                >, {{ shippingAddress.state }}</span
                            >
                            {{ shippingAddress.zipCode }}
                        </div>
                        <div>{{ shippingAddress.country }}</div>
                    </div>
                </div>
            </div>

            <!-- Payment Method Review -->
            <div>
                <h3 class="font-medium text-foreground mb-3">
                    {{ t('checkout.paymentMethod') }}
                </h3>
                <div class="p-3 bg-accent/50 rounded-lg">
                    <div class="text-sm">
                        <div v-if="paymentMethod.type === 'card'" class="flex items-center gap-2">
                            <span class="font-medium">{{ t('checkout.creditCard') }}</span>
                            <span v-if="paymentMethod.cardNumber" class="text-muted-foreground">
                                **** **** **** {{ paymentMethod.cardNumber.slice(-4) }}
                            </span>
                        </div>
                        <div
                            v-else-if="paymentMethod.type === 'paypal'"
                            class="flex items-center gap-2"
                        >
                            <span class="font-medium">{{ t('checkout.paypal') }}</span>
                        </div>
                    </div>
                </div>
            </div>

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
                            <PriceDisplay :price="item.price * item.quantity" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="space-y-3">
                <div class="flex items-start gap-2">
                    <Checkbox id="terms" v-model="agreedToTerms" class="mt-1" />
                    <Label for="terms" class="text-sm text-muted-foreground cursor-pointer">
                        {{ t('checkout.agreeToTerms') }}
                        <a href="#" class="text-primary hover:underline">
                            {{ t('checkout.termsAndConditions') }}
                        </a>
                        {{ t('checkout.and') }}
                        <a href="#" class="text-primary hover:underline">
                            {{ t('checkout.privacyPolicy') }}
                        </a>
                    </Label>
                </div>

                <div class="flex items-start gap-2">
                    <Checkbox id="newsletter" v-model:checked="subscribeNewsletter" class="mt-1" />
                    <Label for="newsletter" class="text-sm text-muted-foreground cursor-pointer">
                        {{ t('checkout.subscribeNewsletter') }}
                    </Label>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between pt-4">
                <Button type="button" variant="outline" @click="$emit('prev-step')">
                    {{ t('checkout.back') }}
                </Button>
                <Button
                    @click="handlePlaceOrder"
                    :disabled="isSubmitting || !agreedToTerms"
                    class="flex items-center gap-2"
                    size="lg"
                >
                    <span
                        v-if="isSubmitting"
                        class="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"
                    ></span>
                    {{ isSubmitting ? t('checkout.placing') : t('checkout.placeOrder') }}
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import PriceDisplay from '@/components/PriceDisplay.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { CartItem, ShippingAddress, PaymentMethod } from '@/types/cart'

interface Props {
    cartItems: CartItem[]
    shippingAddress: ShippingAddress
    paymentMethod: PaymentMethod
    isSubmitting: boolean
}

interface Emits {
    'prev-step': []
    'place-order': [options: { agreedToTerms: boolean; subscribeNewsletter: boolean }]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useAppI18n()

const agreedToTerms = ref(false)
const subscribeNewsletter = ref(false)

const handlePlaceOrder = () => {
    if (!agreedToTerms.value) return

    emit('place-order', {
        agreedToTerms: agreedToTerms.value,
        subscribeNewsletter: subscribeNewsletter.value,
    })
}
</script>
