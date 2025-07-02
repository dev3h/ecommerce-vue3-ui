<template>
    <div class="bg-card rounded-lg border border-border p-4 sm:p-6">
        <h2 class="text-lg font-medium text-foreground mb-4">
            {{ t('checkout.paymentMethod') }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Payment Method Selection -->
            <div class="space-y-3">
                <h3 class="text-sm font-medium text-foreground">
                    {{ t('checkout.selectPaymentMethod') }}
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                        @click="paymentData.type = 'card'"
                        class="border border-border rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent"
                        :class="{ 'border-primary bg-primary/5': paymentData.type === 'card' }"
                    >
                        <div class="flex items-center gap-2">
                            <input
                                type="radio"
                                v-model="paymentData.type"
                                value="card"
                                class="text-primary"
                            />
                            <span class="text-sm font-medium">{{ t('checkout.creditCard') }}</span>
                        </div>
                    </div>
                    <div
                        @click="paymentData.type = 'paypal'"
                        class="border border-border rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent"
                        :class="{ 'border-primary bg-primary/5': paymentData.type === 'paypal' }"
                    >
                        <div class="flex items-center gap-2">
                            <input
                                type="radio"
                                v-model="paymentData.type"
                                value="paypal"
                                class="text-primary"
                            />
                            <span class="text-sm font-medium">{{ t('checkout.paypal') }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Credit Card Form -->
            <div v-if="paymentData.type === 'card'" class="space-y-4">
                <div>
                    <label for="cardNumber" class="block text-sm font-medium text-foreground mb-1">
                        {{ t('checkout.cardNumber') }}<span class="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        id="cardNumber"
                        v-model="paymentData.cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        required
                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        :class="{ 'border-red-500': errors.cardNumber }"
                    />
                    <div v-if="errors.cardNumber" class="mt-1 text-sm text-red-500">
                        {{ errors.cardNumber }}
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            for="cardExpiry"
                            class="block text-sm font-medium text-foreground mb-1"
                        >
                            {{ t('checkout.expiryDate') }}<span class="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            id="cardExpiry"
                            v-model="paymentData.cardExpiry"
                            type="text"
                            placeholder="MM/YY"
                            required
                            class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            :class="{ 'border-red-500': errors.cardExpiry }"
                        />
                        <div v-if="errors.cardExpiry" class="mt-1 text-sm text-red-500">
                            {{ errors.cardExpiry }}
                        </div>
                    </div>
                    <div>
                        <label for="cardCvc" class="block text-sm font-medium text-foreground mb-1">
                            {{ t('checkout.cvc') }}<span class="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            id="cardCvc"
                            v-model="paymentData.cardCvc"
                            type="text"
                            placeholder="123"
                            required
                            class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            :class="{ 'border-red-500': errors.cardCvc }"
                        />
                        <div v-if="errors.cardCvc" class="mt-1 text-sm text-red-500">
                            {{ errors.cardCvc }}
                        </div>
                    </div>
                </div>

                <div>
                    <label for="cardName" class="block text-sm font-medium text-foreground mb-1">
                        {{ t('checkout.cardName') }}<span class="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        id="cardName"
                        v-model="paymentData.cardName"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                <button
                    type="button"
                    @click="$emit('prev-step')"
                    class="border border-border px-6 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                    {{ t('checkout.back') }}
                </button>
                <button
                    type="submit"
                    :disabled="!isValid"
                    class="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {{ t('checkout.reviewOrder') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import type { PaymentMethod } from '@/types/cart'

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
