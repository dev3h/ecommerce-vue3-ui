<template>
    <Dialog :open="dialogOpen" @update:open="(value) => (dialogOpen = value)">
        <DialogContent class="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
                <DialogTitle>
                    {{ isEdit ? t('admin.rolesManagement.form.editTitle') : t('admin.rolesManagement.form.addTitle') }}
                </DialogTitle>
                <DialogDescription>
                    {{ isEdit ? t('admin.rolesManagement.form.editDescription') : t('admin.rolesManagement.form.addDescription') }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="flex-1 overflow-hidden flex flex-col">
                <div class="flex-1 overflow-y-auto space-y-6 pr-2">
                    <!-- Basic Information -->
                    <div class="space-y-4">
                        <h3 class="text-sm font-medium">{{ t('admin.rolesManagement.form.basicInfo') }}</h3>
                        
                        <!-- Role Name -->
                        <div class="space-y-2">
                            <Label for="name" class="text-sm font-medium">
                                {{ t('admin.rolesManagement.form.name') }}
                                <span class="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                type="text"
                                :placeholder="t('admin.rolesManagement.form.namePlaceholder')"
                                :class="{ 'border-destructive': errors.name }"
                                :disabled="isEdit && role?.isSystemRole"
                                @blur="validateField('name')"
                            />
                            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
                        </div>

                        <!-- Description -->
                        <div class="space-y-2">
                            <Label for="description" class="text-sm font-medium">
                                {{ t('admin.rolesManagement.form.description') }}
                                <span class="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                v-model="form.description"
                                :placeholder="t('admin.rolesManagement.form.descriptionPlaceholder')"
                                :class="{ 'border-destructive': errors.description }"
                                rows="3"
                                @blur="validateField('description')"
                            />
                            <p v-if="errors.description" class="text-sm text-destructive">{{ errors.description }}</p>
                        </div>

                        <!-- System Role Warning -->
                        <div v-if="isEdit && role?.isSystemRole" class="p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <div class="flex items-center gap-2">
                                <AlertTriangle class="h-4 w-4 text-amber-600" />
                                <p class="text-sm text-amber-800">
                                    {{ t('admin.rolesManagement.detail.systemRoleWarning') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Permissions -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium">
                                {{ t('admin.rolesManagement.form.permissionsSection') }}
                                <span class="text-destructive">*</span>
                            </h3>
                            <div class="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    @click="selectAllPermissions"
                                    :disabled="isEdit && role?.isSystemRole"
                                >
                                    {{ t('admin.rolesManagement.form.selectAllPermissions') }}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    @click="clearAllPermissions"
                                    :disabled="isEdit && role?.isSystemRole"
                                >
                                    {{ t('admin.rolesManagement.form.clearAllPermissions') }}
                                </Button>
                            </div>
                        </div>

                        <p v-if="errors.permissions" class="text-sm text-destructive">{{ errors.permissions }}</p>

                        <!-- Permissions Table -->
                        <div class="border rounded-lg overflow-hidden">
                            <div v-if="loadingPermissions" class="p-8 text-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p class="mt-2 text-sm text-muted-foreground">{{ t('common.loading') }}</p>
                            </div>

                            <div v-else-if="Object.keys(groupedPermissions).length === 0" class="p-8 text-center">
                                <p class="text-sm text-muted-foreground">{{ t('admin.rolesManagement.detail.noPermissions') }}</p>
                            </div>

                            <div v-else>
                                <div 
                                    v-for="(modulePermissions, module) in groupedPermissions" 
                                    :key="module"
                                    class="border-b last:border-b-0"
                                >
                                    <!-- Module Header -->
                                    <div class="bg-muted p-3 border-b">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <Checkbox
                                                    :id="`module-${module}`"
                                                    :checked="isModuleSelected(module)"
                                                    :indeterminate="isModuleIndeterminate(module)"
                                                    @update:checked="(checked: boolean) => handleModuleChange(module, checked)"
                                                    :disabled="isEdit && role?.isSystemRole"
                                                />
                                                <Label 
                                                    :for="`module-${module}`"
                                                    class="text-sm font-medium capitalize cursor-pointer"
                                                >
                                                    {{ t(`admin.permissions.modules.${module}`) }}
                                                </Label>
                                            </div>
                                            <Badge variant="secondary" class="text-xs">
                                                {{ getSelectedPermissionsCount(module) }}/{{ modulePermissions.length }}
                                            </Badge>
                                        </div>
                                    </div>

                                    <!-- Module Permissions -->
                                    <div class="p-3">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div 
                                                v-for="permission in modulePermissions" 
                                                :key="permission.id"
                                                class="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50"
                                            >
                                                <Checkbox
                                                    :id="permission.id"
                                                    :checked="form.permissions.includes(permission.id)"
                                                                                                                @update:checked="(checked: boolean) => handlePermissionChange(permission.id, checked)"
                                                    :disabled="isEdit && role?.isSystemRole"
                                                    class="mt-0.5"
                                                />
                                                <div class="flex-1 min-w-0">
                                                    <Label 
                                                        :for="permission.id"
                                                        class="text-sm font-medium cursor-pointer"
                                                    >
                                                        {{ permission.name }}
                                                    </Label>
                                                    <p class="text-xs text-muted-foreground mt-0.5">
                                                        {{ permission.description }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Selected Permissions Summary -->
                        <div v-if="form.permissions.length > 0" class="p-3 bg-primary/5 rounded-md">
                            <p class="text-sm text-muted-foreground mb-2">
                                {{ t('admin.rolesManagement.form.selectedPermissionsCount') }}: 
                                <span class="font-medium">{{ form.permissions.length }}</span>
                            </p>
                            <div class="flex flex-wrap gap-1">
                                <Badge 
                                    v-for="permissionId in form.permissions.slice(0, 10)" 
                                    :key="permissionId"
                                    variant="secondary"
                                    class="text-xs"
                                >
                                    {{ getPermissionName(permissionId) }}
                                </Badge>
                                <Badge 
                                    v-if="form.permissions.length > 10"
                                    variant="outline"
                                    class="text-xs"
                                >
                                    +{{ form.permissions.length - 10 }} {{ t('common.more') }}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <DialogFooter class="flex items-center justify-end gap-2 pt-4 border-t mt-4">
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
                        :disabled="!isFormValid || loading"
                    >
                        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                        {{ loading 
                            ? (isEdit ? t('admin.rolesManagement.form.updating') : t('admin.rolesManagement.form.creating'))
                            : (isEdit ? t('admin.rolesManagement.form.update') : t('admin.rolesManagement.form.create'))
                        }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, reactive, watch, onMounted } from 'vue'

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
import Badge from '@/components/ui/badge/Badge.vue'

// Icons
import { Loader2, AlertTriangle } from 'lucide-vue-next'

// Composables
import { useRoles, usePermissions } from '@/composables/useRoles'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

// Types
interface Permission {
    id: string
    name: string
    description: string
}

interface Role {
    id?: string
    name: string
    description: string
    permissions: string[]
    isSystemRole?: boolean
    createdAt?: string
    updatedAt?: string
}

// Props
interface Props {
    open: boolean
    role?: Role | null
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    role: null,
})

// Emits
const emit = defineEmits<{
    'update:open': [value: boolean]
    'saved': []
}>()

// Composables
const { success, error: errorToast } = useToast()
const { createRole, updateRole, validateRoleName } = useRoles()
const { 
    groupedPermissions,
    loadGroupedPermissions,
    getPermissionName 
} = usePermissions()
const { t } = useAppI18n()

// Component state
const loading = ref(false)
const loadingPermissions = ref(false)
const dialogOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

// Form data
const form = reactive({
    name: '',
    description: '',
    permissions: [] as string[],
})

// Validation errors
const errors = reactive<Record<string, string>>({})

// Computed properties
const isEdit = computed(() => !!props.role)

// Validation rules
const validationRules = {
    name: (value: string) => {
        if (!value?.trim()) {
            return t('admin.rolesManagement.validation.nameRequired')
        }
        if (value.length < 2 || value.length > 100) {
            return t('admin.rolesManagement.validation.nameLength')
        }
        return ''
    },
    description: (value: string) => {
        if (!value?.trim()) {
            return t('admin.rolesManagement.validation.descriptionRequired')
        }
        if (value.length < 10 || value.length > 500) {
            return t('admin.rolesManagement.validation.descriptionLength')
        }
        return ''
    },
    permissions: (value: string[]) => {
        if (!value || value.length === 0) {
            return t('admin.rolesManagement.validation.permissionsRequired')
        }
        return ''
    },
}

// Validation methods
const validateField = (field: keyof typeof validationRules) => {
    const rule = validationRules[field]
    if (rule) {
        const error = rule(form[field] as string & string[])
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
           form.permissions.length > 0
})

// Permission methods
const handlePermissionChange = (permissionId: string, checked: boolean) => {
    console.log('Permission change:', permissionId, checked)
    const index = form.permissions.indexOf(permissionId)
    
    if (checked && index === -1) {
        form.permissions.push(permissionId)
    } else if (!checked && index > -1) {
        form.permissions.splice(index, 1)
    }
    validateField('permissions')
    console.log('Updated permissions:', form.permissions)
}

const handleModuleChange = (module: string, checked: boolean) => {
    console.log('Module change:', module, checked)
    const modulePermissions = groupedPermissions.value[module] || []
    
    if (checked) {
        // Add all module permissions
        modulePermissions.forEach(p => {
            if (!form.permissions.includes(p.id)) {
                form.permissions.push(p.id)
            }
        })
    } else {
        // Remove all module permissions
        modulePermissions.forEach(p => {
            const index = form.permissions.indexOf(p.id)
            if (index > -1) {
                form.permissions.splice(index, 1)
            }
        })
    }
    validateField('permissions')
    console.log('Updated permissions after module change:', form.permissions)
}

const isModuleSelected = (module: string): boolean => {
    const modulePermissions = groupedPermissions.value[module] || []
    const result = modulePermissions.length > 0 && 
           modulePermissions.every(p => form.permissions.includes(p.id))
    console.log(`Module ${module} selected:`, result, 'permissions:', form.permissions)
    return result
}

const isModuleIndeterminate = (module: string): boolean => {
    const modulePermissions = groupedPermissions.value[module] || []
    const selectedCount = modulePermissions.filter(p => form.permissions.includes(p.id)).length
    const result = selectedCount > 0 && selectedCount < modulePermissions.length
    console.log(`Module ${module} indeterminate:`, result, `${selectedCount}/${modulePermissions.length}`)
    return result
}

const getSelectedPermissionsCount = (module: string): number => {
    const modulePermissions = groupedPermissions.value[module] || []
    return modulePermissions.filter(p => form.permissions.includes(p.id)).length
}

const selectAllPermissions = async () => {
    console.log('Select all permissions clicked')
    console.log('Current form.permissions:', form.permissions)
    console.log('Grouped permissions:', groupedPermissions.value)
    
    // Clear current permissions
    form.permissions.splice(0, form.permissions.length)
    
    // Add all permissions
    Object.values(groupedPermissions.value).forEach(modulePermissions => {
        modulePermissions.forEach(p => {
            form.permissions.push(p.id)
        })
    })
    
    console.log('Form permissions after select all:', form.permissions)
    validateField('permissions')
    await nextTick() // Wait for DOM update
    console.log('DOM should be updated now')
}

const clearAllPermissions = async () => {
    console.log('Clear all permissions clicked')
    console.log('Current form.permissions:', form.permissions)
    form.permissions.splice(0, form.permissions.length) // Clear array
    console.log('Form permissions after clear all:', form.permissions)
    validateField('permissions')
    await nextTick() // Wait for DOM update
    console.log('DOM should be updated now')
}

const resetForm = () => {
    form.name = ''
    form.description = ''
    form.permissions.splice(0, form.permissions.length) // Clear array properly
    Object.keys(errors).forEach(key => delete errors[key])
}

const closeDialog = () => {
    dialogOpen.value = false
}

// CRUD operations
const handleSubmit = async () => {
    if (!validateForm()) {
        errorToast(t('admin.rolesManagement.messages.validationError'), '')
        return
    }

    // Check if role name already exists (only for create or when name changed)
    if (!props.role || form.name !== props.role.name) {
        const isNameValid = await validateRoleName(form.name, props.role?.id)
        if (!isNameValid) {
            errors.name = t('admin.rolesManagement.messages.nameExists')
            errorToast(t('admin.rolesManagement.messages.validationError'), '')
            return
        }
    }

    loading.value = true
    try {
        if (props.role) {
            await updateRole(props.role.id!, form)
            success(t('admin.rolesManagement.messages.updateSuccess'), '')
        } else {
            await createRole(form)
            success(t('admin.rolesManagement.messages.createSuccess'), '')
        }
        
        emit('saved')
        closeDialog()
    } catch (err) {
        const message = err instanceof Error ? err.message : 
            (props.role ? t('admin.rolesManagement.messages.updateError') : t('admin.rolesManagement.messages.createError'))
        errorToast(t('common.error'), message)
    } finally {
        loading.value = false
    }
}

// Watch for prop changes
watch(() => props.open, (newOpen: boolean) => {
    if (newOpen) {
        if (props.role) {
            // Edit mode - populate form
            form.name = props.role.name
            form.description = props.role.description
            form.permissions.splice(0, form.permissions.length, ...props.role.permissions)
        } else {
            // Create mode - reset form
            resetForm()
        }
        // Clear errors
        Object.keys(errors).forEach(key => delete errors[key])
    }
})

// Load permissions on mount
onMounted(async () => {
    loadingPermissions.value = true
    try {
        await loadGroupedPermissions()
        console.log('Loaded grouped permissions:', groupedPermissions.value)
    } finally {
        loadingPermissions.value = false
    }
})
</script>
