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

                <RadioGroup v-model="selectedAddressId" class="space-y-3">
                    <div
                        v-for="address in addresses"
                        :key="address.id"
                        class="border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-muted/50"
                        :class="{
                            'border-primary bg-primary/5 ring-2 ring-primary/20':
                                selectedAddressId === address.id,
                            'border-border': selectedAddressId !== address.id,
                        }"
                        @click="selectAddress(address)"
                    >
                        <div class="flex items-start gap-3">
                            <RadioGroupItem
                                :id="`address-${address.id}`"
                                :value="address.id"
                                class="mt-0.5"
                            />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <label
                                        :for="`address-${address.id}`"
                                        class="font-medium text-sm cursor-pointer"
                                    >
                                        {{ address.firstName }} {{ address.lastName }}
                                    </label>
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
                </RadioGroup>

                <div class="mt-4">
                    <Button variant="outline" @click="openNewAddressForm" class="w-full sm:w-auto">
                        <Plus class="w-4 h-4 mr-2" />
                        {{ t('checkout.useNewAddress') }}
                    </Button>
                </div>
            </div>

            <!-- New Address Form (only when no addresses exist) -->
            <div v-if="addresses.length === 0">
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

        <!-- Address Form Modal -->
        <AddressForm
            v-if="showAddressForm"
            :is-open="showAddressForm"
            @close="closeAddressForm"
            @success="handleAddressCreated"
        />
    </Card>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppI18n } from '@/composables/useI18n'
import { useAddressStore, type Address } from '@/stores/addresses'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import type { ShippingAddress } from '@/types/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-vue-next'
import AddressForm from '@/components/address/AddressForm.vue'

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
const authStore = useAuthStore()
const { addresses } = storeToRefs(addressStore)
const { success } = useToast()

const shippingData = reactive({ ...props.modelValue })
const errors = ref<Record<string, string>>({})
const selectedAddressId = ref<string | null>(null)
const showAddressForm = ref(false)

// Load addresses on mount and when user changes
onMounted(async () => {
    if (authStore.isAuthenticated) {
        await addressStore.loadAddresses()

        // If there are addresses and no shipping data, auto-select default address
        if (addresses.value.length > 0 && !shippingData.firstName) {
            const defaultAddress =
                addresses.value.find((addr) => addr.isDefault) || addresses.value[0]
            if (defaultAddress) {
                selectAddress(defaultAddress)
            }
        }
    }
})

// Watch for auth changes to reload addresses
watch(
    () => authStore.user?.id,
    async (newUserId) => {
        if (newUserId) {
            await addressStore.loadAddresses()
            selectedAddressId.value = null

            // Auto-select default address if available
            if (addresses.value.length > 0) {
                const defaultAddress =
                    addresses.value.find((addr) => addr.isDefault) || addresses.value[0]
                if (defaultAddress) {
                    selectAddress(defaultAddress)
                }
            }
        } else {
            // Clear addresses when logged out
            selectedAddressId.value = null
        }
    },
)

const selectAddress = (address: Address) => {
    selectedAddressId.value = address.id

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

const openNewAddressForm = () => {
    showAddressForm.value = true
}

const closeAddressForm = () => {
    showAddressForm.value = false
}

const handleAddressCreated = async () => {
    // Reload addresses after creating new one
    await addressStore.loadAddresses()

    // Auto-select the newly created address (should be the latest one)
    if (addresses.value.length > 0) {
        const latestAddress = addresses.value[addresses.value.length - 1]
        selectAddress(latestAddress)
    }

    closeAddressForm()
    success(t('checkout.addressCreated', 'Address created successfully'))
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
        if (addresses.value.length === 0) validateField('firstName', value)
    },
)
watch(
    () => shippingData.lastName,
    (value) => {
        if (addresses.value.length === 0) validateField('lastName', value)
    },
)
watch(
    () => shippingData.email,
    (value) => validateField('email', value),
)
watch(
    () => shippingData.phone,
    (value) => {
        if (addresses.value.length === 0) validateField('phone', value)
    },
)
watch(
    () => shippingData.address,
    (value) => {
        if (addresses.value.length === 0) validateField('address', value)
    },
)
watch(
    () => shippingData.city,
    (value) => {
        if (addresses.value.length === 0) validateField('city', value)
    },
)
watch(
    () => shippingData.zipCode,
    (value) => {
        if (addresses.value.length === 0) validateField('zipCode', value)
    },
)
watch(
    () => shippingData.country,
    (value) => {
        if (addresses.value.length === 0) validateField('country', value)
    },
)

const isValid = computed(() => {
    // If a saved address is selected, form is valid if we have address data
    if (selectedAddressId.value) {
        return (
            shippingData.firstName &&
            shippingData.lastName &&
            shippingData.phone &&
            shippingData.address &&
            shippingData.city &&
            shippingData.zipCode &&
            shippingData.country
        )
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
    if (selectedAddressId.value) {
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
