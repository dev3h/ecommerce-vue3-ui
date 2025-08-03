<template>
    <Dialog v-model:open="dialogOpen">
        <DialogContent class="max-w-lg sm:m-4 m-2 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {{
                        admin
                            ? t('admin.adminsManagement.form.editTitle')
                            : t('admin.adminsManagement.form.addTitle')
                    }}
                </DialogTitle>
                <DialogDescription>
                    {{
                        admin
                            ? t('admin.adminsManagement.form.editDescription')
                            : t('admin.adminsManagement.form.addDescription')
                    }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Basic Information -->
                <div class="space-y-4">
                    <h3 class="text-sm font-medium">{{ t('admin.adminsManagement.form.basicInfo') }}</h3>
                    
                    <!-- Full Name -->
                    <div class="space-y-2">
                        <Label for="name" class="text-sm font-medium">
                            {{ t('admin.adminsManagement.form.name') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            v-model="form.name"
                            :placeholder="t('admin.adminsManagement.form.namePlaceholder')"
                            :class="{ 'border-destructive': errors.name }"
                            @blur="validateField('name')"
                        />
                        <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
                    </div>

                    <!-- Email -->
                    <div class="space-y-2">
                        <Label for="email" class="text-sm font-medium">
                            {{ t('admin.adminsManagement.form.email') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            v-model="form.email"
                            type="email"
                            :placeholder="t('admin.adminsManagement.form.emailPlaceholder')"
                            :class="{ 'border-destructive': errors.email }"
                            @blur="validateField('email')"
                        />
                        <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
                    </div>

                    <!-- Status (only show when editing) -->
                    <div v-if="isEdit" class="space-y-2">
                        <Label for="status" class="text-sm font-medium">
                            {{ t('admin.adminsManagement.form.status') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Select v-model="form.status">
                            <SelectTrigger id="status" :class="{ 'border-destructive': errors.status }">
                                <SelectValue :placeholder="t('admin.adminsManagement.form.selectStatus')" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">{{ t('admin.adminsManagement.status.active') }}</SelectItem>
                                <SelectItem value="banned">{{ t('admin.adminsManagement.status.banned') }}</SelectItem>
                                <SelectItem value="temporarily_locked">{{ t('admin.adminsManagement.status.temporarily_locked') }}</SelectItem>
                            </SelectContent>
                        </Select>
                        <p v-if="errors.status" class="text-sm text-destructive">{{ errors.status }}</p>
                    </div>
                </div>

                <!-- Permissions -->
                <div class="space-y-4">
                    <h3 class="text-sm font-medium">{{ t('admin.adminsManagement.form.permissions') }}</h3>
                    
                    <!-- Role -->
                    <div class="space-y-2">
                        <Label for="role" class="text-sm font-medium">
                            {{ t('admin.adminsManagement.form.role') }}
                            <span class="text-destructive">*</span>
                        </Label>
                        <Select v-model="form.role" :disabled="loadingRoles">
                            <SelectTrigger id="role" :class="{ 'border-destructive': errors.role }">
                                <SelectValue :placeholder="loadingRoles ? t('common.loading') : t('admin.adminsManagement.form.selectRole')" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem 
                                    v-for="role in roles" 
                                    :key="role.id" 
                                    :value="role.id"
                                >
                                    <div class="flex flex-col">
                                        <span>{{ t(`admin.adminsManagement.roles.${role.id}`) }}</span>
                                        <span class="text-xs text-muted-foreground">{{ role.description }}</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p v-if="errors.role" class="text-sm text-destructive">{{ errors.role }}</p>
                        
                        <!-- Role Description -->
                        <div v-if="selectedRole" class="p-3 bg-muted rounded-md">
                            <p class="text-sm text-muted-foreground">
                                <strong>{{ selectedRole.display_name }}:</strong> {{ selectedRole.description }}
                            </p>
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
                            {{ admin ? t('admin.adminsManagement.form.updating') : t('admin.adminsManagement.form.creating') }}
                        </div>
                        <span v-else>
                            {{ admin ? t('admin.adminsManagement.form.update') : t('admin.adminsManagement.form.create') }}
                        </span>
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { Admin, AdminFormData } from '@/types/admin'

// Composables
import { useAdmins, useRoles } from '@/composables/useAdmins'
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
    admin?: Admin | null
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    admin: null,
})

// Emits
const emit = defineEmits<{
    'update:open': [value: boolean]
    'saved': []
}>()

// Composables
const { success, error: errorToast } = useToast()
const { createAdmin, updateAdmin, validateEmail } = useAdmins()
const { roles, loading: loadingRoles, loadRoles } = useRoles()
const { t } = useAppI18n()

// Component state
const loading = ref(false)
const dialogOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

// Form data
const defaultForm: AdminFormData = {
    name: '',
    email: '',
    status: 'active',
    role: '',
}

const form = reactive<AdminFormData>({ ...defaultForm })

// Validation errors
const errors = reactive<Record<string, string>>({})

// Computed properties
const isEdit = computed(() => !!props.admin)

const selectedRole = computed(() => {
    return roles.value.find(role => role.id === form.role)
})

// Validation rules
const validationRules = {
    name: (value: string) => {
        if (!value?.trim()) {
            return t('admin.adminsManagement.validation.nameRequired')
        }
        if (value.length < 2 || value.length > 100) {
            return t('admin.adminsManagement.validation.nameLength')
        }
        return ''
    },
    email: (value: string) => {
        if (!value?.trim()) {
            return t('admin.adminsManagement.validation.emailRequired')
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
            return t('admin.adminsManagement.validation.emailInvalid')
        }
        return ''
    },
    role: (value: string) => {
        if (!value) {
            return t('admin.adminsManagement.validation.roleRequired')
        }
        return ''
    },
    status: (value: string) => {
        if (!value) {
            return t('admin.adminsManagement.validation.statusRequired')
        }
        return ''
    },
}

// Validation methods
const validateField = (field: keyof typeof validationRules) => {
    const rule = validationRules[field]
    if (rule) {
        const error = rule(form[field] as string)
        if (error) {
            errors[field] = error
        } else {
            delete errors[field]
        }
    }
}

const validateForm = () => {
    // Always validate name, email, role
    ['name', 'email', 'role'].forEach(field => {
        validateField(field as keyof typeof validationRules)
    })
    
    // Only validate status when editing
    if (isEdit.value) {
        validateField('status')
    }
    
    return Object.keys(errors).length === 0
}

// Computed properties
const isFormValid = computed(() => {
    const baseValid = Object.keys(errors).length === 0 && 
           form.name && 
           form.email && 
           form.role
    
    // For edit mode, also require status
    if (isEdit.value) {
        return baseValid && form.status
    }
    
    // For create mode, status will be set to 'active' by default
    return baseValid
})

const resetForm = () => {
    Object.assign(form, { ...defaultForm })
    Object.keys(errors).forEach(key => delete errors[key])
}

const closeDialog = () => {
    dialogOpen.value = false
}

// CRUD operations
const handleSubmit = async () => {
    if (!validateForm()) {
        errorToast(t('admin.adminsManagement.messages.validationError'), '')
        return
    }

    // Check if email already exists (only for create or when email changed)
    if (!props.admin || form.email !== props.admin.email) {
        const isEmailValid = await validateEmail(form.email, props.admin?.id)
        if (!isEmailValid) {
            errors.email = t('admin.adminsManagement.messages.emailExists')
            errorToast(t('admin.adminsManagement.messages.validationError'), '')
            return
        }
    }

    loading.value = true
    try {
        if (props.admin) {
            await updateAdmin(props.admin.id, form)
            success(t('admin.adminsManagement.messages.updateSuccess'), '')
        } else {
            // For create mode, ensure status is set to 'active'
            const createData = { ...form, status: 'active' as const }
            await createAdmin(createData)
            success(t('admin.adminsManagement.messages.createSuccess'), '')
        }
        
        emit('saved')
        closeDialog()
    } catch (err) {
        const message = err instanceof Error ? err.message : 
            (props.admin ? t('admin.adminsManagement.messages.updateError') : t('admin.adminsManagement.messages.createError'))
        errorToast(t('common.error'), message)
    } finally {
        loading.value = false
    }
}

// Watch for prop changes
watch(() => props.open, (newOpen) => {
    if (newOpen) {
        if (props.admin) {
            // Edit mode - populate form
            Object.assign(form, {
                name: props.admin.name,
                email: props.admin.email,
                status: props.admin.status,
                role: props.admin.role,
            })
        } else {
            // Create mode - reset form
            resetForm()
        }
        // Clear errors
        Object.keys(errors).forEach(key => delete errors[key])
    }
})

// Load roles on mount
onMounted(async () => {
    await loadRoles()
})
</script>
