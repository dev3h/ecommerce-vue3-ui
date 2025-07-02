<template>
    <Card class="sticky top-4">
        <CardHeader>
            <CardTitle class="text-base sm:text-lg">
                {{ t('cart.orderSummary') }}
            </CardTitle>
        </CardHeader>

        <CardContent>
            <!-- Order Items Summary -->
            <div class="space-y-2 mb-3 sm:mb-4">
                <div
                    v-for="item in cartItems"
                    :key="item.id"
                    class="flex justify-between text-sm gap-2"
                >
                    <span class="text-muted-foreground truncate flex-1 min-w-0">
                        {{ item.name }} × {{ item.quantity }}
                    </span>
                    <span class="font-medium whitespace-nowrap">
                        <PriceDisplay :price="item.price * item.quantity" />
                    </span>
                </div>
            </div>

            <!-- Coupon Section -->
            <Card class="mb-3 sm:mb-4 bg-accent/30">
                <CardContent class="p-2 sm:p-3">
                    <div v-if="!appliedCoupon">
                        <Label for="couponCode" class="text-sm font-medium mb-2 block">
                            {{ t('checkout.coupon.title') }}
                        </Label>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <Input
                                id="couponCode"
                                v-model="couponCode"
                                type="text"
                                :placeholder="t('checkout.coupon.placeholder')"
                                class="flex-1 min-w-0"
                            />
                            <Button
                                @click="applyCoupon"
                                :disabled="!couponCode || isApplyingCoupon"
                                size="sm"
                                class="w-full sm:w-auto whitespace-nowrap"
                            >
                                {{
                                    isApplyingCoupon
                                        ? t('checkout.coupon.applying')
                                        : t('checkout.coupon.apply')
                                }}
                            </Button>
                        </div>
                        <div v-if="couponError" class="mt-2 text-xs sm:text-sm text-destructive">
                            {{ couponError }}
                        </div>
                    </div>
                    <div
                        v-else
                        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-foreground truncate">
                                {{ appliedCoupon.code }}
                            </div>
                            <div class="text-xs text-muted-foreground line-clamp-2 break-words">
                                {{ appliedCoupon.description }}
                            </div>
                        </div>
                        <Button
                            @click="removeCoupon"
                            variant="destructive"
                            size="sm"
                            class="self-start sm:self-auto"
                        >
                            {{ t('checkout.coupon.remove') }}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <!-- Order Totals -->
            <div class="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div class="flex justify-between text-sm gap-2">
                    <span class="text-muted-foreground">{{ t('cart.subtotal') }}</span>
                    <span class="font-medium whitespace-nowrap">
                        <PriceDisplay :price="cartSummary.subtotal" />
                    </span>
                </div>

                <div v-if="appliedCoupon" class="flex justify-between text-sm gap-2">
                    <span class="text-muted-foreground truncate">
                        {{ t('checkout.coupon.discount') }} ({{ appliedCoupon.code }})
                    </span>
                    <span class="font-medium text-green-600 whitespace-nowrap">
                        -<PriceDisplay :price="couponDiscount" />
                    </span>
                </div>

                <div class="flex justify-between text-sm gap-2">
                    <span class="text-muted-foreground">{{ t('cart.shipping') }}</span>
                    <span class="font-medium whitespace-nowrap">
                        {{
                            cartSummary.shipping === 0
                                ? t('cart.free')
                                : formatCurrency(cartSummary.shipping)
                        }}
                    </span>
                </div>
                <div class="flex justify-between text-sm gap-2">
                    <span class="text-muted-foreground">{{ t('cart.tax') }}</span>
                    <span class="font-medium whitespace-nowrap">
                        <PriceDisplay :price="cartSummary.tax" />
                    </span>
                </div>
            </div>

            <div class="border-t border-border pt-2 sm:pt-3">
                <div class="flex justify-between gap-2">
                    <span class="text-sm sm:text-base font-medium text-foreground">{{
                        t('cart.total')
                    }}</span>
                    <span class="text-base sm:text-lg font-bold text-foreground whitespace-nowrap">
                        <PriceDisplay :price="finalTotal" />
                    </span>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import PriceDisplay from '@/components/PriceDisplay.vue'
import type { CartItem, CartSummary } from '@/types/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Coupon {
    code: string
    description: string
    type: 'percentage' | 'fixed'
    value: number
    minimumAmount?: number
}

interface Props {
    cartItems: CartItem[]
    cartSummary: CartSummary
}

const props = defineProps<Props>()
const { t } = useAppI18n()

// Coupon state
const couponCode = ref('')
const appliedCoupon = ref<Coupon | null>(null)
const isApplyingCoupon = ref(false)
const couponError = ref('')

// Mock coupons for demo
const availableCoupons: Coupon[] = [
    {
        code: 'SAVE10',
        description: t('checkout.coupon.save10'),
        type: 'percentage',
        value: 10,
        minimumAmount: 50,
    },
    {
        code: 'WELCOME',
        description: t('checkout.coupon.welcome'),
        type: 'fixed',
        value: 15,
        minimumAmount: 100,
    },
    {
        code: 'FREESHIP',
        description: t('checkout.coupon.freeShip'),
        type: 'fixed',
        value: 0, // Will be handled specially for free shipping
        minimumAmount: 75,
    },
]

const couponDiscount = computed(() => {
    if (!appliedCoupon.value) return 0

    const coupon = appliedCoupon.value
    if (coupon.type === 'percentage') {
        return (props.cartSummary.subtotal * coupon.value) / 100
    } else {
        return coupon.value
    }
})

const finalTotal = computed(() => {
    let total = props.cartSummary.total
    if (appliedCoupon.value) {
        total -= couponDiscount.value
        // Special handling for free shipping coupon
        if (appliedCoupon.value.code === 'FREESHIP') {
            total -= props.cartSummary.shipping
        }
    }
    return Math.max(0, total)
})

const applyCoupon = async () => {
    if (!couponCode.value) return

    isApplyingCoupon.value = true
    couponError.value = ''

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const coupon = availableCoupons.find(
        (c) => c.code.toLowerCase() === couponCode.value.toLowerCase(),
    )

    if (!coupon) {
        couponError.value = t('checkout.coupon.invalid')
    } else if (coupon.minimumAmount && props.cartSummary.subtotal < coupon.minimumAmount) {
        couponError.value = t('checkout.coupon.minimumNotMet').replace(
            '{amount}',
            formatCurrency(coupon.minimumAmount),
        )
    } else {
        appliedCoupon.value = coupon
        couponCode.value = ''
    }

    isApplyingCoupon.value = false
}

const removeCoupon = () => {
    appliedCoupon.value = null
    couponError.value = ''
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount)
}
</script>
