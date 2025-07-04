<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
        <div
            class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border rounded-lg shadow-lg mx-4"
        >
            <div class="sticky top-0 bg-background border-b px-6 py-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold">
                        {{ isEditing ? t('address.editAddress') : t('address.addAddress') }}
                    </h2>
                    <Button variant="ghost" size="sm" @click="$emit('close')">
                        <X class="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
                <!-- Personal Information -->
                <div class="space-y-4">
                    <h3 class="text-sm font-medium text-foreground">
                        {{ t('address.personalInfo') }}
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="firstName">
                                {{ t('address.firstName') }} <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                v-model="form.firstName"
                                type="text"
                                required
                                :placeholder="t('address.firstNamePlaceholder')"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="lastName">
                                {{ t('address.lastName') }} <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                v-model="form.lastName"
                                type="text"
                                required
                                :placeholder="t('address.lastNamePlaceholder')"
                            />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label for="company">{{ t('address.company') }}</Label>
                        <Input
                            id="company"
                            v-model="form.company"
                            type="text"
                            :placeholder="t('address.companyPlaceholder')"
                        />
                    </div>
                </div>

                <!-- Address Information -->
                <div class="space-y-4">
                    <h3 class="text-sm font-medium text-foreground">
                        {{ t('address.addressInfo') }}
                    </h3>
                    <div class="space-y-2">
                        <Label for="address">
                            {{ t('address.address') }} <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            id="address"
                            v-model="form.address"
                            type="text"
                            required
                            :placeholder="t('address.addressPlaceholder')"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label for="apartment">{{ t('address.apartment') }}</Label>
                        <Input
                            id="apartment"
                            v-model="form.apartment"
                            type="text"
                            :placeholder="t('address.apartmentPlaceholder')"
                        />
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="space-y-2">
                            <Label for="city">
                                {{ t('address.city') }} <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="city"
                                v-model="form.city"
                                type="text"
                                required
                                :placeholder="t('address.cityPlaceholder')"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="state">
                                {{ t('address.state') }} <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="state"
                                v-model="form.state"
                                type="text"
                                required
                                :placeholder="t('address.statePlaceholder')"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="zipCode">
                                {{ t('address.zipCode') }} <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="zipCode"
                                v-model="form.zipCode"
                                type="text"
                                required
                                :placeholder="t('address.zipCodePlaceholder')"
                            />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label for="country">
                            {{ t('address.country') }} <span class="text-destructive">*</span>
                        </Label>
                        <Select v-model="form.country" required>
                            <SelectTrigger>
                                <SelectValue :placeholder="t('address.selectCountry')" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="United States">{{
                                    t('address.countries.us')
                                }}</SelectItem>
                                <SelectItem value="Canada">{{
                                    t('address.countries.ca')
                                }}</SelectItem>
                                <SelectItem value="United Kingdom">{{
                                    t('address.countries.uk')
                                }}</SelectItem>
                                <SelectItem value="Australia">{{
                                    t('address.countries.au')
                                }}</SelectItem>
                                <SelectItem value="Vietnam">{{
                                    t('address.countries.vn')
                                }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="space-y-4">
                    <h3 class="text-sm font-medium text-foreground">
                        {{ t('address.contactInfo') }}
                    </h3>
                    <div class="space-y-2">
                        <Label for="phone">
                            {{ t('address.phone') }} <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            id="phone"
                            v-model="form.phone"
                            type="tel"
                            required
                            :placeholder="t('address.phonePlaceholder')"
                        />
                    </div>
                </div>

                <!-- Default Address -->
                <div class="flex items-center space-x-2">
                    <Checkbox id="isDefault" v-model:checked="form.isDefault" />
                    <Label for="isDefault">
                        {{ t('address.setAsDefault') }}
                    </Label>
                </div>

                <!-- Form Actions -->
                <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        @click="$emit('close')"
                        class="w-full sm:w-auto"
                        :disabled="isLoading"
                    >
                        {{ t('common.cancel') }}
                    </Button>
                    <Button type="submit" class="w-full sm:w-auto" :disabled="isLoading">
                        <div
                            v-if="isLoading"
                            class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
                        ></div>
                        {{ isEditing ? t('address.updateAddress') : t('address.createAddress') }}
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { useAddressStore, type Address } from '@/stores/addresses'
import { useToast } from '@/composables/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-vue-next'

interface Props {
    address?: Address | null
    isOpen: boolean
}

interface Emits {
    (e: 'close'): void
    (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useAppI18n()
const addressStore = useAddressStore()
const { success, error } = useToast()

const isLoading = ref(false)
const isEditing = ref(false)

const form = reactive({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: false,
})

// Reset form
const resetForm = () => {
    Object.assign(form, {
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        isDefault: false,
    })
}

// Load address data for editing
const loadAddress = (address: Address) => {
    Object.assign(form, {
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || '',
        address: address.address,
        apartment: address.apartment || '',
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone,
        isDefault: address.isDefault,
    })
}

// Watch for address prop changes
watch(
    () => props.address,
    (newAddress) => {
        if (newAddress) {
            isEditing.value = true
            loadAddress(newAddress)
        } else {
            isEditing.value = false
            resetForm()
        }
    },
    { immediate: true },
)

// Watch for modal open/close
watch(
    () => props.isOpen,
    (isOpen) => {
        if (!isOpen) {
            resetForm()
            isEditing.value = false
        }
    },
)

// Handle form submission
const handleSubmit = async () => {
    isLoading.value = true

    try {
        if (isEditing.value && props.address) {
            await addressStore.updateAddress(props.address.id, form)
            success(t('toast.success'), t('toast.addressUpdated'))
        } else {
            // If this is the first address being created, set it as default
            const isFirstAddress = addressStore.addresses.length === 0
            const addressData = {
                ...form,
                isDefault: isFirstAddress || form.isDefault,
            }
            await addressStore.createAddress(addressData)
            success(t('toast.success'), t('toast.addressCreated'))
        }

        emit('success')
        emit('close')
    } catch (err) {
        console.error('Error saving address:', err)
        error(
            t('toast.error'),
            isEditing.value ? t('toast.addressUpdateFailed') : t('toast.addressCreateFailed'),
        )
    } finally {
        isLoading.value = false
    }
}
</script>
