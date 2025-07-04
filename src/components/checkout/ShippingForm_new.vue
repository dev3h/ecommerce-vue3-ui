<template>
    <Card class="p-4 sm:p-6">
        <CardHeader class="p-0 mb-4">
            <CardTitle class="text-lg font-medium">
                {{ t('checkout.shippingAddress') }}
            </CardTitle>
        </CardHeader>

        <CardContent class="p-0">
            <!-- Saved Addresses Section -->
            <div v-if="addresses.length > 0" class="mb-6">
                <h3 class="text-sm font-medium text-foreground mb-3">
                    {{ t('checkout.savedAddresses') }}
                </h3>
                <div class="space-y-3">
                    <div
                        v-for="address in addresses"
                        :key="address.id"
                        class="border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50"
                        :class="{
                            'border-primary bg-primary/5': selectedAddressId === address.id,
                            'border-border': selectedAddressId !== address.id,
                        }"
                        @click="selectAddress(address)"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <input
                                        type="radio"
                                        :value="address.id"
                                        v-model="selectedAddressId"
                                        class="text-primary focus:ring-primary"
                                    />
                                    <span class="font-medium text-sm">
                                        {{ address.firstName }} {{ address.lastName }}
                                    </span>
                                    <span
                                        v-if="address.isDefault"
                                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                    >
                                        {{ t('address.default') }}
                                    </span>
                                </div>
                                <div class="text-sm text-muted-foreground">
                                    <p>{{ address.address }}</p>
                                    <p v-if="address.apartment">{{ address.apartment }}</p>
                                    <p>
                                        {{ address.city }}, {{ address.state }}
                                        {{ address.zipCode }}
                                    </p>
                                    <p>{{ address.country }}</p>
                                    <p class="mt-1">{{ address.phone }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <Button
                        variant="outline"
                        @click="toggleNewAddressForm"
                        class="w-full sm:w-auto"
                    >
                        <Plus class="w-4 h-4 mr-2" />
                        {{ t('checkout.useNewAddress') }}
                    </Button>
                </div>
            </div>

            <!-- Email input for saved addresses -->
            <div v-if="selectedAddressId && !showNewAddressForm" class="mb-6">
                <div class="space-y-2">
                    <Label for="email-saved">
                        {{ t('checkout.email') }}<span class="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                        id="email-saved"
                        v-model="shippingData.email"
                        type="email"
                        required
                        :class="{ 'border-red-500': errors.email }"
                        :placeholder="t('checkout.email')"
                    />
                    <div v-if="errors.email" class="mt-1 text-sm text-red-500">
                        {{ errors.email }}
                    </div>
                </div>
            </div>

            <!-- New Address Form -->
            <div v-if="addresses.length === 0 || showNewAddressForm">
                <h3 v-if="addresses.length > 0" class="text-sm font-medium text-foreground mb-3">
                    {{ t('checkout.newAddress') }}
                </h3>

                <div class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="firstName">
                                {{ t('checkout.firstName')
                                }}<span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                v-model="shippingData.firstName"
                                type="text"
                                required
                                :class="{ 'border-red-500': errors.firstName }"
                            />
                            <div v-if="errors.firstName" class="mt-1 text-sm text-red-500">
                                {{ errors.firstName }}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <Label for="lastName">
                                {{ t('checkout.lastName') }}<span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                v-model="shippingData.lastName"
                                type="text"
                                required
                                :class="{ 'border-red-500': errors.lastName }"
                            />
                            <div v-if="errors.lastName" class="mt-1 text-sm text-red-500">
                                {{ errors.lastName }}
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="email">
                            {{ t('checkout.email') }}<span class="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="email"
                            v-model="shippingData.email"
                            type="email"
                            required
                            :class="{ 'border-red-500': errors.email }"
                        />
                        <div v-if="errors.email" class="mt-1 text-sm text-red-500">
                            {{ errors.email }}
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="phone">
                            {{ t('checkout.phone') }}<span class="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="phone"
                            v-model="shippingData.phone"
                            type="tel"
                            required
                            :class="{ 'border-red-500': errors.phone }"
                        />
                        <div v-if="errors.phone" class="mt-1 text-sm text-red-500">
                            {{ errors.phone }}
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="address">
                            {{ t('checkout.address') }}<span class="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            id="address"
                            v-model="shippingData.address"
                            type="text"
                            required
                            :class="{ 'border-red-500': errors.address }"
                        />
                        <div v-if="errors.address" class="mt-1 text-sm text-red-500">
                            {{ errors.address }}
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="space-y-2">
                            <Label for="city">
                                {{ t('checkout.city') }}<span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="city"
                                v-model="shippingData.city"
                                type="text"
                                required
                                :class="{ 'border-red-500': errors.city }"
                            />
                            <div v-if="errors.city" class="mt-1 text-sm text-red-500">
                                {{ errors.city }}
                            </div>
                        </div>
                        <div class="space-y-2">
                            <Label for="state">
                                {{ t('checkout.state') }}
                            </Label>
                            <Input id="state" v-model="shippingData.state" type="text" />
                        </div>
                        <div class="space-y-2">
                            <Label for="zipCode">
                                {{ t('checkout.zipCode') }}<span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="zipCode"
                                v-model="shippingData.zipCode"
                                type="text"
                                required
                                :class="{ 'border-red-500': errors.zipCode }"
                            />
                            <div v-if="errors.zipCode" class="mt-1 text-sm text-red-500">
                                {{ errors.zipCode }}
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="country">
                            {{ t('checkout.country') }}<span class="text-red-500 ml-1">*</span>
                        </Label>
                        <Select v-model="shippingData.country" required>
                            <SelectTrigger :class="{ 'border-red-500': errors.country }">
                                <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="United States">{{
                                    t('checkout.countries.us')
                                }}</SelectItem>
                                <SelectItem value="Vietnam">{{
                                    t('checkout.countries.vn')
                                }}</SelectItem>
                                <SelectItem value="Canada">{{
                                    t('checkout.countries.ca')
                                }}</SelectItem>
                                <SelectItem value="United Kingdom">{{
                                    t('checkout.countries.uk')
                                }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <div v-if="errors.country" class="mt-1 text-sm text-red-500">
                            {{ errors.country }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-4">
                <Button @click="handleSubmit" :disabled="!isValid" class="min-w-[200px]">
                    {{ t('checkout.continueToPayment') }}
                </Button>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppI18n } from '@/composables/useI18n'
import { useAddressStore, type Address } from '@/stores/addresses'
import type { ShippingAddress } from '@/types/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-vue-next'

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
const addressStore = useAddressStore()
const { addresses } = storeToRefs(addressStore)

const shippingData = reactive({ ...props.modelValue })
const errors = ref<Record<string, string>>({})
const selectedAddressId = ref<string | null>(null)
const showNewAddressForm = ref(false)

// Load addresses on mount
onMounted(async () => {
    await addressStore.loadAddresses()

    // If there are addresses and no shipping data, auto-select default address
    if (addresses.value.length > 0 && !shippingData.firstName) {
        const defaultAddress = addresses.value.find((addr) => addr.isDefault) || addresses.value[0]
        if (defaultAddress) {
            selectAddress(defaultAddress)
        }
    }

    // If no addresses, show new address form
    if (addresses.value.length === 0) {
        showNewAddressForm.value = true
    }
})

const selectAddress = (address: Address) => {
    selectedAddressId.value = address.id
    showNewAddressForm.value = false

    // Map address to shipping data format
    Object.assign(shippingData, {
        firstName: address.firstName,
        lastName: address.lastName,
        email: shippingData.email || '', // Keep existing email or empty
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
    })

    // Clear errors when selecting saved address
    errors.value = {}
}

const toggleNewAddressForm = () => {
    showNewAddressForm.value = !showNewAddressForm.value
    selectedAddressId.value = null

    // Clear form when switching to new address
    if (showNewAddressForm.value) {
        Object.assign(shippingData, {
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
    }
}

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
        case 'phone':
            validatePhone(value)
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

const validatePhone = (value: string) => {
    if (!value.trim()) {
        errors.value.phone = t('validation.required', 'Phone number is required')
    } else if (!/^[+]?\d{5,16}$/.test(value.replace(/[\s\-()]/g, ''))) {
        errors.value.phone = t('validation.invalidPhone', 'Please enter a valid phone number')
    } else {
        delete errors.value.phone
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

// Watch for changes and validate (only for new address form)
watch(
    () => shippingData.firstName,
    (value) => {
        if (showNewAddressForm.value) validateField('firstName', value)
    },
)
watch(
    () => shippingData.lastName,
    (value) => {
        if (showNewAddressForm.value) validateField('lastName', value)
    },
)
watch(
    () => shippingData.email,
    (value) => validateField('email', value),
)
watch(
    () => shippingData.phone,
    (value) => {
        if (showNewAddressForm.value) validateField('phone', value)
    },
)
watch(
    () => shippingData.address,
    (value) => {
        if (showNewAddressForm.value) validateField('address', value)
    },
)
watch(
    () => shippingData.city,
    (value) => {
        if (showNewAddressForm.value) validateField('city', value)
    },
)
watch(
    () => shippingData.zipCode,
    (value) => {
        if (showNewAddressForm.value) validateField('zipCode', value)
    },
)
watch(
    () => shippingData.country,
    (value) => {
        if (showNewAddressForm.value) validateField('country', value)
    },
)

const isValid = computed(() => {
    // If a saved address is selected, only email is required
    if (selectedAddressId.value && !showNewAddressForm.value) {
        return shippingData.email?.trim() && !errors.value.email
    }

    // For new address form, all fields are required
    return (
        shippingData.firstName &&
        shippingData.lastName &&
        shippingData.email &&
        shippingData.phone &&
        shippingData.address &&
        shippingData.city &&
        shippingData.zipCode &&
        shippingData.country &&
        Object.keys(errors.value).length === 0
    )
})

const handleSubmit = () => {
    // If using saved address, minimal validation
    if (selectedAddressId.value && !showNewAddressForm.value) {
        validateField('email', shippingData.email)

        if (isValid.value) {
            emit('update:modelValue', { ...shippingData })
            emit('next-step')
        }
        return
    }

    // For new address, validate all required fields
    validateField('firstName', shippingData.firstName)
    validateField('lastName', shippingData.lastName)
    validateField('email', shippingData.email)
    validateField('phone', shippingData.phone)
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
