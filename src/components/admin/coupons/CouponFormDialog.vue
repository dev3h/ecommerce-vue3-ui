<template>
    <Dialog v-model:open="dialogOpen">
        <DialogContent class="max-w-2xl sm:m-4 m-2 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {{
                        coupon
                            ? t('admin.couponsManagement.form.editTitle')
                            : t('admin.couponsManagement.form.addTitle')
                    }}
                </DialogTitle>
                <DialogDescription>
                    {{
                        coupon
                            ? t('admin.couponsManagement.form.editDescription')
                            : t('admin.couponsManagement.form.addDescription')
                    }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Basic Information -->
                <div class="space-y-4">
                    <h3 class="text-sm font-medium">{{ t('admin.couponsManagement.form.basicInfo') }}</h3>
                    
                    <!-- Coupon Name -->
                    <div class="space-y-2">
                        <Label for="name" class="text-sm font-medium">
                            {{ t('admin.couponsManagement.form.name') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            v-model="form.name"
                            :placeholder="t('admin.couponsManagement.form.namePlaceholder')"
                            :class="{ 'border-destructive': errors.name }"
                            @blur="validateField('name')"
                        />
                        <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
                    </div>

                    <!-- Description -->
                    <div class="space-y-2">
                        <Label for="description" class="text-sm font-medium">
                            {{ t('admin.couponsManagement.form.description') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            v-model="form.description"
                            :placeholder="t('admin.couponsManagement.form.descriptionPlaceholder')"
                            rows="3"
                            :class="{ 'border-destructive': errors.description }"
                            @blur="validateField('description')"
                        />
                        <p v-if="errors.description" class="text-sm text-destructive">{{ errors.description }}</p>
                    </div>

                    <!-- Usage Limit -->
                    <div class="space-y-3">
                        <div class="flex items-center space-x-2">
                            <Checkbox
                                id="has_limit"
                                v-model:checked="form.has_limit"
                                @update:checked="handleLimitChange"
                            />
                            <Label for="has_limit" class="text-sm font-medium">{{ t('admin.couponsManagement.form.hasLimit') }}</Label>
                        </div>

                        <div v-if="form.has_limit" class="space-y-2">
                            <Label for="usage_limit" class="text-sm font-medium">
                                {{ t('admin.couponsManagement.form.usageLimit') }}
                                <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="usage_limit"
                                v-model.number="form.usage_limit"
                                type="number"
                                min="1"
                                :placeholder="t('admin.couponsManagement.form.usageLimitPlaceholder')"
                                :class="{ 'border-destructive': errors.usage_limit }"
                                @blur="validateField('usage_limit')"
                            />
                            <p v-if="errors.usage_limit" class="text-sm text-destructive">{{ errors.usage_limit }}</p>
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="space-y-2">
                        <Label for="status" class="text-sm font-medium">
                            {{ t('admin.couponsManagement.form.status') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Select v-model="form.status">
                            <SelectTrigger id="status" :class="{ 'border-destructive': errors.status }">
                                <SelectValue :placeholder="t('admin.couponsManagement.form.selectStatus')" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">{{ t('admin.couponsManagement.status.active') }}</SelectItem>
                                <SelectItem value="inactive">{{ t('admin.couponsManagement.status.inactive') }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <p v-if="errors.status" class="text-sm text-destructive">{{ errors.status }}</p>
                    </div>
                </div>

                <!-- Discount Settings -->
                <div class="space-y-4">
                    <h3 class="text-sm font-medium">{{ t('admin.couponsManagement.form.discountSettings') }}</h3>
                    
                    <!-- Discount Type -->
                    <div class="space-y-2">
                        <Label for="discount_type" class="text-sm font-medium">
                            {{ t('admin.couponsManagement.form.discountType') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Select v-model="form.discount_type" @update:model-value="handleDiscountTypeChange">
                            <SelectTrigger id="discount_type" :class="{ 'border-destructive': errors.discount_type }">
                                <SelectValue :placeholder="t('admin.couponsManagement.form.selectDiscountType')" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed">{{ t('admin.couponsManagement.discountType.fixed') }}</SelectItem>
                                <SelectItem value="percentage">{{ t('admin.couponsManagement.discountType.percentage') }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <p v-if="errors.discount_type" class="text-sm text-destructive">{{ errors.discount_type }}</p>
                    </div>

                    <!-- Discount Value -->
                    <div class="space-y-2">
                        <Label for="discount_value" class="text-sm font-medium">
                            {{ t('admin.couponsManagement.form.discountValue') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <div class="relative">
                            <Input
                                id="discount_value"
                                v-model.number="form.discount_value"
                                type="number"
                                :min="form.discount_type === 'percentage' ? 1 : 1000"
                                :max="form.discount_type === 'percentage' ? 100 : undefined"
                                :step="form.discount_type === 'percentage' ? 1 : 1000"
                                :placeholder="t('admin.couponsManagement.form.discountValuePlaceholder')"
                                :class="{ 'border-destructive': errors.discount_value, 'pr-12': form.discount_type === 'percentage' }"
                                @blur="validateField('discount_value')"
                            />
                            <div v-if="form.discount_type === 'percentage'" 
                                 class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span class="text-muted-foreground text-sm">%</span>
                            </div>
                        </div>
                        <p v-if="errors.discount_value" class="text-sm text-destructive">{{ errors.discount_value }}</p>
                        <p class="text-xs text-muted-foreground">
                            {{ form.discount_type === 'fixed' 
                                ? t('admin.couponsManagement.form.fixedDiscountHint') 
                                : t('admin.couponsManagement.form.percentageDiscountHint') 
                            }}
                        </p>
                    </div>
                </div>

                <!-- Validity Period -->
                <div class="space-y-4">
                    <h3 class="text-sm font-medium">{{ t('admin.couponsManagement.form.validityPeriod') }}</h3>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Start Date -->
                        <div class="space-y-2">
                            <Label for="start_date" class="text-sm font-medium">
                                {{ t('admin.couponsManagement.form.startDate') }}
                                <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="start_date"
                                v-model="form.start_date"
                                type="date"
                                :class="{ 'border-destructive': errors.start_date }"
                                @blur="validateField('start_date')"
                            />
                            <p v-if="errors.start_date" class="text-sm text-destructive">{{ errors.start_date }}</p>
                        </div>

                        <!-- End Date -->
                        <div class="space-y-2">
                            <Label for="end_date" class="text-sm font-medium">
                                {{ t('admin.couponsManagement.form.endDate') }}
                                <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="end_date"
                                v-model="form.end_date"
                                type="date"
                                :class="{ 'border-destructive': errors.end_date }"
                                @blur="validateField('end_date')"
                            />
                            <p v-if="errors.end_date" class="text-sm text-destructive">{{ errors.end_date }}</p>
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <DialogFooter class="flex items-center justify-end gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        @click="closeDialog"
                        :disabled="loading"
                    >
                        {{ t('common.cancel') }}
                    </Button>
                    
                    <Button
                        type="submit"
                        :disabled="loading || !isFormValid"
                        class="min-w-[100px]"
                    >
                        <div v-if="loading" class="flex items-center gap-2">
                            <div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            {{ coupon ? t('admin.couponsManagement.form.updating') : t('admin.couponsManagement.form.creating') }}
                        </div>
                        <span v-else>
                            {{ coupon ? t('admin.couponsManagement.form.update') : t('admin.couponsManagement.form.create') }}
                        </span>
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Coupon, CouponFormData } from '@/types/coupon'

// Composables
import { useCoupons } from '@/composables/useCoupons'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

// Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

// Props
interface Props {
    open: boolean
    coupon?: Coupon | null
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    coupon: null,
})

// Emits
const emit = defineEmits<{
    'update:open': [value: boolean]
    'saved': []
}>()

// Composables
const { success, error: errorToast } = useToast()
const { createCoupon, updateCoupon, validateCouponName } = useCoupons()
const { t } = useAppI18n()

// Component state
const loading = ref(false)
const dialogOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

// Form data
const defaultForm: CouponFormData = {
    name: '',
    description: '',
    has_limit: false,
    usage_limit: undefined,
    discount_type: 'percentage',
    discount_value: 0,
    start_date: '',
    end_date: '',
    status: 'active',
}

const form = reactive<CouponFormData>({ ...defaultForm })

// Validation errors
const errors = reactive<Record<string, string>>({})

// Validation rules
const validationRules = {
    name: (value: string) => {
        if (!value?.trim()) {
            return t('admin.couponsManagement.validation.nameRequired')
        }
        if (value.length < 3 || value.length > 50) {
            return t('admin.couponsManagement.validation.nameLength')
        }
        if (!/^[A-Z0-9-]+$/i.test(value)) {
            return t('admin.couponsManagement.validation.nameFormat')
        }
        return ''
    },
    description: (value: string) => {
        if (!value?.trim()) {
            return t('admin.couponsManagement.validation.descriptionRequired')
        }
        if (value.length < 10 || value.length > 500) {
            return t('admin.couponsManagement.validation.descriptionLength')
        }
        return ''
    },
    usage_limit: (value: number | undefined) => {
        if (form.has_limit) {
            if (!value || value <= 0) {
                return t('admin.couponsManagement.validation.usageLimitRequired')
            }
            if (value < 1) {
                return t('admin.couponsManagement.validation.usageLimitMin')
            }
        }
        return ''
    },
    discount_value: (value: number) => {
        if (!value || value <= 0) {
            return t('admin.couponsManagement.validation.discountValueRequired')
        }
        if (value <= 0) {
            return t('admin.couponsManagement.validation.discountValueMin')
        }
        if (form.discount_type === 'percentage' && value > 100) {
            return t('admin.couponsManagement.validation.percentageMax')
        }
        return ''
    },
    start_date: (value: string) => {
        if (!value) {
            return t('admin.couponsManagement.validation.startDateRequired')
        }
        return ''
    },
    end_date: (value: string) => {
        if (!value) {
            return t('admin.couponsManagement.validation.endDateRequired')
        }
        if (form.start_date && new Date(value) <= new Date(form.start_date)) {
            return t('admin.couponsManagement.validation.endDateAfterStart')
        }
        return ''
    },
    status: (value: string) => {
        if (!value) {
            return t('admin.couponsManagement.validation.statusRequired')
        }
        return ''
    },
}

// Validation methods
const validateField = (field: keyof typeof validationRules) => {
    const rule = validationRules[field]
    if (rule) {
        let fieldValue: string | number | undefined
        switch (field) {
            case 'name':
            case 'description':
            case 'start_date':
            case 'end_date':
            case 'status':
                fieldValue = form[field] as string
                break
            case 'usage_limit':
            case 'discount_value':
                fieldValue = form[field] as number | undefined
                break
            default:
                fieldValue = form[field] as string | number | undefined
        }
        
        const error = (rule as (value: typeof fieldValue) => string)(fieldValue)
        if (error) {
            errors[field] = error
        } else {
            delete errors[field]
        }
    }
}

const validateForm = () => {
    Object.keys(validationRules).forEach(field => {
        validateField(field as keyof typeof validationRules)
    })
    return Object.keys(errors).length === 0
}

// Computed properties
const isFormValid = computed(() => {
    return Object.keys(errors).length === 0 && 
           form.name && 
           form.description && 
           form.discount_value > 0 && 
           form.start_date && 
           form.end_date &&
           form.status
})

// Event handlers
const handleLimitChange = (checked: boolean) => {
    form.has_limit = checked
    if (!checked) {
        form.usage_limit = undefined
        delete errors.usage_limit
    } else {
        form.usage_limit = 1
    }
}

const handleDiscountTypeChange = () => {
    form.discount_value = 0
    delete errors.discount_value
}

const resetForm = () => {
    Object.assign(form, { ...defaultForm })
    Object.keys(errors).forEach(key => delete errors[key])
    
    // Set default dates for new coupon
    if (!props.coupon) {
        const today = new Date()
        const nextMonth = new Date(today)
        nextMonth.setMonth(today.getMonth() + 1)
        
        form.start_date = today.toISOString().split('T')[0]
        form.end_date = nextMonth.toISOString().split('T')[0]
    }
}

const closeDialog = () => {
    dialogOpen.value = false
}

// CRUD operations
const handleSubmit = async () => {
    if (!validateForm()) {
        errorToast(t('admin.couponsManagement.messages.validationError'), '')
        return
    }

    // Check if coupon name already exists (only for create or when name changed)
    if (!props.coupon || form.name !== props.coupon.name) {
        const isNameValid = await validateCouponName(form.name, props.coupon?.id)
        if (!isNameValid) {
            errors.name = t('admin.couponsManagement.messages.nameExists')
            errorToast(t('admin.couponsManagement.messages.validationError'), '')
            return
        }
    }

    loading.value = true
    try {
        if (props.coupon) {
            await updateCoupon(props.coupon.id, form)
            success(t('admin.couponsManagement.messages.updateSuccess'), '')
        } else {
            await createCoupon(form)
            success(t('admin.couponsManagement.messages.createSuccess'), '')
        }
        
        emit('saved')
        closeDialog()
    } catch (err) {
        const message = err instanceof Error ? err.message : 
            (props.coupon ? t('admin.couponsManagement.messages.updateError') : t('admin.couponsManagement.messages.createError'))
        errorToast(t('common.error'), message)
    } finally {
        loading.value = false
    }
}

// Watch for prop changes
watch(() => props.open, (newOpen) => {
    if (newOpen) {
        if (props.coupon) {
            // Edit mode - populate form
            Object.assign(form, {
                name: props.coupon.name,
                description: props.coupon.description,
                has_limit: props.coupon.has_limit,
                usage_limit: props.coupon.usage_limit,
                discount_type: props.coupon.discount_type,
                discount_value: props.coupon.discount_value,
                start_date: props.coupon.start_date,
                end_date: props.coupon.end_date,
                status: props.coupon.status === 'expired' ? 'inactive' : props.coupon.status, // Don't allow editing to expired
            })
        } else {
            // Create mode - reset form
            resetForm()
        }
        // Clear errors
        Object.keys(errors).forEach(key => delete errors[key])
    }
})

// Watch for cross-field validation
watch(() => form.start_date, () => {
    if (form.end_date) {
        validateField('end_date')
    }
})

watch(() => form.end_date, () => {
    if (form.start_date) {
        validateField('end_date')
    }
})
</script>
