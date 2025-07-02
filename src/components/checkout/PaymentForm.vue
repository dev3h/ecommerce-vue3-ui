<template>
    <Card class="p-4 sm:p-6">
        <CardHeader class="p-0 mb-4">
            <CardTitle class="text-lg font-medium">
                {{ t('checkout.paymentMethod') }}
            </CardTitle>
        </CardHeader>

        <CardContent class="p-0">
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Payment Method Selection -->
                <div class="space-y-3">
                    <Label class="text-sm font-medium">
                        {{ t('checkout.selectPaymentMethod') }}
                    </Label>
                    <RadioGroup
                        v-model="paymentData.type"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                        <Label
                            for="card"
                            class="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent"
                            :class="{ 'border-primary bg-primary/5': paymentData.type === 'card' }"
                        >
                            <RadioGroupItem id="card" value="card" />
                            <span class="text-sm font-medium">{{ t('checkout.creditCard') }}</span>
                        </Label>
                        <Label
                            for="paypal"
                            class="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent"
                            :class="{
                                'border-primary bg-primary/5': paymentData.type === 'paypal',
                            }"
                        >
                            <RadioGroupItem id="paypal" value="paypal" />
                            <span class="text-sm font-medium">{{ t('checkout.paypal') }}</span>
                        </Label>
                    </RadioGroup>
                </div>

                <!-- Credit Card Form -->
                <div v-if="paymentData.type === 'card'" class="space-y-4">
                    <div class="space-y-2">
                        <Label for="cardNumber">
                            {{ t('checkout.cardNumber') }}<span class="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="cardNumber"
                            v-model="paymentData.cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            required
                            :class="{ 'border-red-500': errors.cardNumber }"
                        />
                        <div v-if="errors.cardNumber" class="mt-1 text-sm text-red-500">
                            {{ errors.cardNumber }}
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="cardExpiry">
                                {{ t('checkout.expiryDate')
                                }}<span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="cardExpiry"
                                v-model="paymentData.cardExpiry"
                                type="text"
                                placeholder="MM/YY"
                                required
                                :class="{ 'border-red-500': errors.cardExpiry }"
                            />
                            <div v-if="errors.cardExpiry" class="mt-1 text-sm text-red-500">
                                {{ errors.cardExpiry }}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <Label for="cardCvc">
                                {{ t('checkout.cvc') }}<span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="cardCvc"
                                v-model="paymentData.cardCvc"
                                type="text"
                                placeholder="123"
                                required
                                :class="{ 'border-red-500': errors.cardCvc }"
                            />
                            <div v-if="errors.cardCvc" class="mt-1 text-sm text-red-500">
                                {{ errors.cardCvc }}
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="cardName">
                            {{ t('checkout.cardName') }}<span class="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="cardName"
                            v-model="paymentData.cardName"
                            type="text"
                            required
                            :class="{ 'border-red-500': errors.cardName }"
                        />
                        <div v-if="errors.cardName" class="mt-1 text-sm text-red-500">
                            {{ errors.cardName }}
                        </div>
                    </div>
                </div>

                <!-- PayPal Info -->
                <div v-else-if="paymentData.type === 'paypal'" class="p-4 bg-accent/50 rounded-lg">
                    <p class="text-sm text-muted-foreground">
                        {{ t('checkout.paypalDescription') }}
                    </p>
                </div>

                <div class="flex justify-between pt-4">
                    <Button type="button" variant="outline" @click="$emit('prev-step')">
                        {{ t('checkout.back') }}
                    </Button>
                    <Button type="submit" :disabled="!isValid" class="min-w-[200px]">
                        {{ t('checkout.reviewOrder') }}
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import type { PaymentMethod } from '@/types/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Props {
    modelValue: PaymentMethod
}

interface Emits {
    'update:modelValue': [value: PaymentMethod]
    'next-step': []
    'prev-step': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useAppI18n()

const paymentData = reactive({ ...props.modelValue })
const errors = ref<Record<string, string>>({})

const validateCardField = (field: string, value: string | undefined) => {
    if (paymentData.type !== 'card') {
        // Clear errors if not using card payment
        errors.value = {}
        return
    }

    const fieldValue = value || ''

    switch (field) {
        case 'cardNumber':
            validateCardNumber(fieldValue)
            break
        case 'cardExpiry':
            validateCardExpiry(fieldValue)
            break
        case 'cardCvc':
            validateCardCvc(fieldValue)
            break
        case 'cardName':
            validateCardName(fieldValue)
            break
    }
}

const validateCardNumber = (value: string) => {
    if (!value.trim()) {
        errors.value.cardNumber = t('validation.required')
    } else if (!/^\d{13,19}$/.test(value.replace(/\s/g, ''))) {
        errors.value.cardNumber = t('validation.invalidCard')
    } else {
        delete errors.value.cardNumber
    }
}

const validateCardExpiry = (value: string) => {
    if (!value.trim()) {
        errors.value.cardExpiry = t('validation.required')
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        errors.value.cardExpiry = t('validation.invalidExpiry')
    } else {
        delete errors.value.cardExpiry
    }
}

const validateCardCvc = (value: string) => {
    if (!value.trim()) {
        errors.value.cardCvc = t('validation.required')
    } else if (!/^\d{3,4}$/.test(value)) {
        errors.value.cardCvc = t('validation.invalidCvc')
    } else {
        delete errors.value.cardCvc
    }
}

const validateCardName = (value: string) => {
    if (!value.trim()) {
        errors.value.cardName = t('validation.required')
    } else {
        delete errors.value.cardName
    }
}

// Watch for changes and validate when using card payment
watch(
    () => paymentData.type,
    () => {
        if (paymentData.type !== 'card') {
            errors.value = {}
        }
    },
)
watch(
    () => paymentData.cardNumber,
    (value) => validateCardField('cardNumber', value),
)
watch(
    () => paymentData.cardExpiry,
    (value) => validateCardField('cardExpiry', value),
)
watch(
    () => paymentData.cardCvc,
    (value) => validateCardField('cardCvc', value),
)
watch(
    () => paymentData.cardName,
    (value) => validateCardField('cardName', value),
)

const isValid = computed(() => {
    if (paymentData.type === 'card') {
        return (
            paymentData.cardNumber &&
            paymentData.cardExpiry &&
            paymentData.cardCvc &&
            paymentData.cardName &&
            Object.keys(errors.value).length === 0
        )
    }
    return true // PayPal doesn't require additional fields in this step
})

const handleSubmit = () => {
    if (paymentData.type === 'card') {
        // Validate all card fields
        validateCardField('cardNumber', paymentData.cardNumber)
        validateCardField('cardExpiry', paymentData.cardExpiry)
        validateCardField('cardCvc', paymentData.cardCvc)
        validateCardField('cardName', paymentData.cardName)
    }

    if (isValid.value) {
        emit('update:modelValue', { ...paymentData })
        emit('next-step')
    }
}
</script>
