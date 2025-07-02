<template>
    <div class="bg-card rounded-lg border border-border p-4 sm:p-6">
        <h2 class="text-lg font-medium text-foreground mb-4">
            {{ t('checkout.shippingAddress') }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="firstName" class="block text-sm font-medium text-foreground mb-1">
                        {{ t('checkout.firstName') }}<span class="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        id="firstName"
                        v-model="shippingData.firstName"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        :class="{ 'border-red-500': errors.firstName }"
                    />
                    <div v-if="errors.firstName" class="mt-1 text-sm text-red-500">
                        {{ errors.firstName }}
                    </div>
                </div>
                <div>
                    <label for="lastName" class="block text-sm font-medium text-foreground mb-1">
                        {{ t('checkout.lastName') }}<span class="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        id="lastName"
                        v-model="shippingData.lastName"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        :class="{ 'border-red-500': errors.lastName }"
                    />
                    <div v-if="errors.lastName" class="mt-1 text-sm text-red-500">
                        {{ errors.lastName }}
                    </div>
                </div>
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-foreground mb-1">
                    {{ t('checkout.email') }}<span class="text-red-500 ml-1">*</span>
                </label>
                <input
                    id="email"
                    v-model="shippingData.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    :class="{ 'border-red-500': errors.email }"
                />
                <div v-if="errors.email" class="mt-1 text-sm text-red-500">
                    {{ errors.email }}
                </div>
            </div>

            <div>
                <label for="phone" class="block text-sm font-medium text-foreground mb-1">
                    {{ t('checkout.phone') }}
                </label>
                <input
                    id="phone"
                    v-model="shippingData.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            <div>
                <label for="address" class="block text-sm font-medium text-foreground mb-1">
                    {{ t('checkout.address') }}<span class="text-red-500 ml-1">*</span>
                </label>
                <input
                    id="address"
                    v-model="shippingData.address"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    :class="{ 'border-red-500': errors.address }"
                />
                <div v-if="errors.address" class="mt-1 text-sm text-red-500">
                    {{ errors.address }}
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label for="city" class="block text-sm font-medium text-foreground mb-1">
                        {{ t('checkout.city') }}<span class="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        id="city"
                        v-model="shippingData.city"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        :class="{ 'border-red-500': errors.city }"
                    />
                    <div v-if="errors.city" class="mt-1 text-sm text-red-500">
                        {{ errors.city }}
                    </div>
                </div>
                <div>
                    <label for="state" class="block text-sm font-medium text-foreground mb-1">
                        {{ t('checkout.state') }}
                    </label>
                    <input
                        id="state"
                        v-model="shippingData.state"
                        type="text"
                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </div>
                <div>
                    <label for="zipCode" class="block text-sm font-medium text-foreground mb-1">
                        {{ t('checkout.zipCode') }}<span class="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        id="zipCode"
                        v-model="shippingData.zipCode"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        :class="{ 'border-red-500': errors.zipCode }"
                    />
                    <div v-if="errors.zipCode" class="mt-1 text-sm text-red-500">
                        {{ errors.zipCode }}
                    </div>
                </div>
            </div>

            <div>
                <label for="country" class="block text-sm font-medium text-foreground mb-1">
                    {{ t('checkout.country') }}<span class="text-red-500 ml-1">*</span>
                </label>
                <select
                    id="country"
                    v-model="shippingData.country"
                    required
                    class="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    :class="{ 'border-red-500': errors.country }"
                >
                    <option value="United States">{{ t('checkout.countries.us') }}</option>
                    <option value="Vietnam">{{ t('checkout.countries.vn') }}</option>
                    <option value="Canada">{{ t('checkout.countries.ca') }}</option>
                    <option value="United Kingdom">{{ t('checkout.countries.uk') }}</option>
                </select>
                <div v-if="errors.country" class="mt-1 text-sm text-red-500">
                    {{ errors.country }}
                </div>
            </div>

            <div class="flex justify-end pt-4">
                <button
                    type="submit"
                    :disabled="!isValid"
                    class="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {{ t('checkout.continueToPayment') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import type { ShippingAddress } from '@/types/cart'

interface Props {
    modelValue: ShippingAddress
}

interface Emits {
    'update:modelValue': [value: ShippingAddress]
    'next-step': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useAppI18n()

const shippingData = reactive({ ...props.modelValue })
const errors = ref<Record<string, string>>({})

const validateField = (field: string, value: string) => {
    switch (field) {
        case 'firstName':
            validateFirstName(value)
            break
        case 'lastName':
            validateLastName(value)
            break
        case 'email':
            validateEmail(value)
            break
        case 'address':
            validateAddress(value)
            break
        case 'city':
            validateCity(value)
            break
        case 'zipCode':
            validateZipCode(value)
            break
        case 'country':
            validateCountry(value)
            break
    }
}

const validateFirstName = (value: string) => {
    if (!value.trim()) {
        errors.value.firstName = t('validation.required', 'First name is required')
    } else {
        delete errors.value.firstName
    }
}

const validateLastName = (value: string) => {
    if (!value.trim()) {
        errors.value.lastName = t('validation.required', 'Last name is required')
    } else {
        delete errors.value.lastName
    }
}

const validateEmail = (value: string) => {
    if (!value.trim()) {
        errors.value.email = t('validation.required', 'Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.value.email = t('validation.invalidEmail', 'Please enter a valid email address')
    } else {
        delete errors.value.email
    }
}

const validateAddress = (value: string) => {
    if (!value.trim()) {
        errors.value.address = t('validation.required', 'Address is required')
    } else {
        delete errors.value.address
    }
}

const validateCity = (value: string) => {
    if (!value.trim()) {
        errors.value.city = t('validation.required', 'City is required')
    } else {
        delete errors.value.city
    }
}

const validateZipCode = (value: string) => {
    if (!value.trim()) {
        errors.value.zipCode = t('validation.required', 'ZIP code is required')
    } else {
        delete errors.value.zipCode
    }
}

const validateCountry = (value: string) => {
    if (!value.trim()) {
        errors.value.country = t('validation.required', 'Country is required')
    } else {
        delete errors.value.country
    }
}

// Watch for changes and validate
watch(
    () => shippingData.firstName,
    (value) => validateField('firstName', value),
)
watch(
    () => shippingData.lastName,
    (value) => validateField('lastName', value),
)
watch(
    () => shippingData.email,
    (value) => validateField('email', value),
)
watch(
    () => shippingData.address,
    (value) => validateField('address', value),
)
watch(
    () => shippingData.city,
    (value) => validateField('city', value),
)
watch(
    () => shippingData.zipCode,
    (value) => validateField('zipCode', value),
)
watch(
    () => shippingData.country,
    (value) => validateField('country', value),
)

const isValid = computed(() => {
    return (
        shippingData.firstName &&
        shippingData.lastName &&
        shippingData.email &&
        shippingData.address &&
        shippingData.city &&
        shippingData.zipCode &&
        shippingData.country &&
        Object.keys(errors.value).length === 0
    )
})

const handleSubmit = () => {
    // Validate all required fields
    validateField('firstName', shippingData.firstName)
    validateField('lastName', shippingData.lastName)
    validateField('email', shippingData.email)
    validateField('address', shippingData.address)
    validateField('city', shippingData.city)
    validateField('zipCode', shippingData.zipCode)
    validateField('country', shippingData.country)

    if (isValid.value) {
        emit('update:modelValue', { ...shippingData })
        emit('next-step')
    }
}
</script>
