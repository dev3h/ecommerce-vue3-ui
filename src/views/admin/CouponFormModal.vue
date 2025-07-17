<template>
    <Dialog v-model:open="dialogOpen">
        <DialogContent>
            <DialogTitle>
                {{ editCoupon ? t('admin.coupons.editTitle') : t('admin.coupons.addTitle') }}
            </DialogTitle>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Coupon Code -->
                <div class="space-y-2">
                    <Label for="coupon-code" class="text-sm font-medium">
                        {{ t('admin.coupons.code') }}
                        <span class="text-destructive">*</span>
                    </Label>
                    <Input
                        id="coupon-code"
                        v-model="form.code"
                        :placeholder="t('admin.coupons.code')"
                        @input="handleCodeChange"
                        :class="{ 'border-destructive': errors.code }"
                    />
                    <p v-if="errors.code" class="text-sm text-destructive">{{ errors.code }}</p>
                </div>
                <!-- Coupon Description -->
                <div class="space-y-2">
                    <Label for="coupon-description" class="text-sm font-medium">
                        {{ t('admin.coupons.description') }}
                        <span class="text-destructive">*</span>
                    </Label>
                    <Input
                        id="coupon-description"
                        v-model="form.description"
                        :placeholder="t('admin.coupons.description')"
                        @input="handleDescriptionChange"
                        :class="{ 'border-destructive': errors.description }"
                    />
                    <p v-if="errors.description" class="text-sm text-destructive">
                        {{ errors.description }}
                    </p>
                </div>
                <!-- Coupon Type and Discount -->
                <div class="flex gap-4">
                    <div class="flex-1 space-y-2">
                        <Label for="coupon-type" class="text-sm font-medium">
                            {{ t('admin.coupons.type') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Select v-model="form.type">
                            <SelectTrigger id="coupon-type" class="w-32">
                                <SelectValue :placeholder="t('admin.coupons.type')" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percent">{{ t('admin.coupons.percent') }}</SelectItem>
                                <SelectItem value="amount">{{ t('admin.coupons.amount') }}</SelectItem>
                                <SelectItem value="freeship">{{ t('admin.coupons.freeship') }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex-1 space-y-2">
                        <Label for="coupon-discount" class="text-sm font-medium">
                            {{ t('admin.coupons.discount') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            id="coupon-discount"
                            v-model.number="form.discount"
                            type="number"
                            :placeholder="t('admin.coupons.discount')"
                            min="0"
                            @input="handleDiscountChange"
                            :class="{ 'border-destructive': errors.discount }"
                        />
                        <p v-if="errors.discount" class="text-sm text-destructive">
                            {{ errors.discount }}
                        </p>
                    </div>
                </div>
                <!-- Active Checkbox -->
                <div class="flex items-center gap-2">
                    <Checkbox v-model:checked="form.active" id="active-checkbox" />
                    <label for="active-checkbox" class="cursor-pointer select-none">
                        {{ t('admin.coupons.active') }}
                    </label>
                </div>
                <!-- Submit Error -->
                <div
                    v-if="submitError"
                    class="p-3 rounded-md bg-destructive/10 border border-destructive/20 mt-4"
                >
                    <p class="text-sm text-destructive">{{ submitError }}</p>
                </div>
                <div class="flex justify-end gap-2 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        @click="handleCancel"
                        :disabled="loading"
                    >{{ t('common.cancel') }}</Button>
                    <Button type="submit" :disabled="loading || !isFormValid" :loading="loading">
                        {{ t('common.save') }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { useCoupons } from '@/composables/useCoupons'
import { useToast } from '@/composables/useToast'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input/Input.vue'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const props = defineProps<{ open: boolean; editCoupon?: any }>()
const emit = defineEmits(['update:open', 'save', 'close'])

const dialogOpen = computed({
    get: () => props.open,
    set: (val: boolean) => emit('update:open', val),
})
const { t } = useAppI18n()
const { createCoupon, updateCoupon } = useCoupons()
const toast = useToast()
const loading = ref(false)

const form = ref({
    code: '',
    description: '',
    discount: 0,
    type: 'percent',
    active: true,
})

const errors = ref({
    code: '',
    description: '',
    discount: '',
})
const submitError = ref('')

const isFormValid = computed(() => {
    return (
        form.value.code.trim() !== '' &&
        form.value.description.trim() !== '' &&
        (form.value.type === 'freeship' ||
            (form.value.discount !== null &&
                form.value.discount !== undefined &&
                errors.value.discount === '')) &&
        errors.value.code === '' &&
        errors.value.description === ''
    )
})

watch(
    () => props.open,
    (val) => {
        if (val && props.editCoupon) {
            populateForm(props.editCoupon)
        } else if (val) {
            resetForm()
        }
    },
    { immediate: true },
)

function resetForm() {
    form.value = { code: '', description: '', discount: 0, type: 'percent', active: true }
    errors.value = { code: '', description: '', discount: '' }
    submitError.value = ''
}

function populateForm(coupon: any) {
    form.value = { ...coupon }
    errors.value = { code: '', description: '', discount: '' }
    submitError.value = ''
}

function handleCodeChange() {
    errors.value.code = validateCode(form.value.code)
}
function handleDescriptionChange() {
    errors.value.description = validateDescription(form.value.description)
}
function handleDiscountChange() {
    errors.value.discount = validateDiscount(form.value.discount)
}

function handleCancel() {
    if (loading.value) return
    emit('close')
    emit('update:open', false)
}

function validateCode(code: string): string {
    if (!code.trim()) return t('admin.coupons.validation.codeRequired')
    if (code.length < 2) return t('admin.coupons.validation.codeMinLength')
    if (code.length > 50) return t('admin.coupons.validation.codeMaxLength')
    return ''
}
function validateDescription(description: string): string {
    if (!description.trim()) return t('admin.coupons.validation.descriptionRequired')
    return ''
}
function validateDiscount(discount: number): string {
    if (form.value.type === 'freeship') return ''
    if (discount === null || discount === undefined || discount === '')
        return t('admin.coupons.validation.discountRequired')
    if (typeof discount !== 'number' || isNaN(discount))
        return t('admin.coupons.validation.discountInvalid')
    if (discount < 0) return t('admin.coupons.validation.discountMin')
    if (form.value.type === 'percent' && discount > 100)
        return t('admin.coupons.validation.discountMaxPercent')
    if (form.value.type === 'amount' && discount > 10000000)
        return t('admin.coupons.validation.discountMaxAmount')
    return ''
}

async function handleSubmit() {
    if (!validateForm()) {
        return
    }
    submitError.value = ''
    loading.value = true
    try {
        const formData = {
            code: form.value.code.trim(),
            description: form.value.description.trim(),
            discount: form.value.type === 'freeship' ? 0 : form.value.discount,
            type: form.value.type,
            active: form.value.active,
        }
        let ok = false
        if (props.editCoupon) {
            ok = await updateCoupon(formData)
        } else {
            ok = await createCoupon(formData)
        }
        loading.value = false
        if (ok) {
            emit('save', formData)
        } else {
            submitError.value = t('admin.coupons.saveError')
        }
    } catch (error: any) {
        loading.value = false
        submitError.value = error?.message || t('admin.coupons.saveError')
    }
}

function validateForm(): boolean {
    errors.value.code = validateCode(form.value.code)
    errors.value.description = validateDescription(form.value.description)
    errors.value.discount = validateDiscount(form.value.discount)
    return Object.values(errors.value).every((e) => e === '')
}
</script>
