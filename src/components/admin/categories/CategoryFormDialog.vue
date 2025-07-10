<template>
    <Dialog v-model:open="dialogOpen">
        <DialogContent class="max-w-md sm:m-4 m-2 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {{
                        category
                            ? t('admin.categoriesManagement.form.editTitle')
                            : t('admin.categoriesManagement.form.addTitle')
                    }}
                </DialogTitle>
                <DialogDescription>
                    {{
                        category
                            ? t('admin.categoriesManagement.form.editDescription')
                            : t('admin.categoriesManagement.form.addDescription')
                    }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Name Field -->
                <div class="space-y-2">
                    <Label for="name" class="text-sm font-medium">
                        {{ t('admin.categoriesManagement.form.name') }}
                        <span class="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        v-model="form.name"
                        :placeholder="t('admin.categoriesManagement.form.namePlaceholder')"
                        :class="{ 'border-destructive': errors.name }"
                        @input="handleNameChange"
                    />
                    <p v-if="errors.name" class="text-sm text-destructive">
                        {{ errors.name }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                        {{ t('admin.categoriesManagement.form.nameDescription') }}
                    </p>
                </div>

                <!-- Slug Field -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <Label for="slug" class="text-sm font-medium">
                            {{ t('admin.categoriesManagement.form.slug') }}
                        </Label>
                        <Button
                            v-if="isSlugManuallyEdited && form.name"
                            type="button"
                            variant="ghost"
                            size="sm"
                            @click="resetSlugToAuto"
                            class="h-6 px-2 text-xs"
                        >
                            Auto-generate
                        </Button>
                    </div>
                    <Input
                        id="slug"
                        v-model="form.slug"
                        :placeholder="t('admin.categoriesManagement.form.slugPlaceholder')"
                        :class="{ 'border-destructive': errors.slug }"
                        @input="handleSlugChange"
                    />
                    <p v-if="errors.slug" class="text-sm text-destructive">
                        {{ errors.slug }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                        {{ t('admin.categoriesManagement.form.slugDescription') }}
                    </p>
                </div>

                <!-- Parent Category Field -->
                <div class="space-y-2">
                    <Label for="parent" class="text-sm font-medium">
                        {{ t('admin.categoriesManagement.form.parent') }}
                    </Label>
                    <Select v-model="form.parent_id">
                        <SelectTrigger>
                            <SelectValue
                                :placeholder="
                                    t('admin.categoriesManagement.form.parentPlaceholder')
                                "
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">{{
                                t('admin.categoriesManagement.form.noParent')
                            }}</SelectItem>
                            <SelectItem
                                v-for="parent in availableParents"
                                :key="parent.id"
                                :value="parent.id"
                            >
                                {{ parent.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p class="text-xs text-muted-foreground">
                        {{ t('admin.categoriesManagement.form.parentDescription') }}
                    </p>
                </div>

                <!-- Description Field -->
                <div class="space-y-2">
                    <Label for="description" class="text-sm font-medium">
                        {{ t('admin.categoriesManagement.form.description') }}
                        <span class="text-muted-foreground font-normal"
                            >({{ t('common.optional') }})</span
                        >
                    </Label>
                    <Textarea
                        id="description"
                        v-model="form.description"
                        :placeholder="t('admin.categoriesManagement.form.descriptionPlaceholder')"
                        rows="3"
                        :class="{ 'border-destructive': errors.description }"
                        @input="handleDescriptionChange"
                    />
                    <p v-if="errors.description" class="text-sm text-destructive">
                        {{ errors.description }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                        {{ t('admin.categoriesManagement.form.descriptionDescription') }}
                    </p>
                </div>

                <!-- Icon Field -->
                <div class="space-y-2">
                    <Label for="icon" class="text-sm font-medium">
                        {{ t('admin.categoriesManagement.form.icon') }}
                        <span class="text-destructive">*</span>
                    </Label>
                    <div class="flex gap-2">
                        <Input
                            id="icon"
                            v-model="form.icon"
                            :placeholder="t('admin.categoriesManagement.form.iconPlaceholder')"
                            :class="{ 'border-destructive': errors.icon }"
                            class="flex-1"
                            @input="handleIconChange"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            @click="showIconPreview = !showIconPreview"
                            class="shrink-0"
                        >
                            <Eye v-if="!showIconPreview" class="h-4 w-4" />
                            <EyeOff v-else class="h-4 w-4" />
                        </Button>
                    </div>
                    <p v-if="errors.icon" class="text-sm text-destructive">
                        {{ errors.icon }}
                    </p>

                    <!-- Icon Preview -->
                    <div
                        v-if="showIconPreview && form.icon"
                        class="flex items-center gap-2 p-2 bg-muted rounded"
                    >
                        <component :is="iconPreview" v-if="iconPreview" class="h-5 w-5" />
                        <span v-else class="text-sm text-muted-foreground">
                            {{ t('admin.categoriesManagement.form.iconNotFound') }}: {{ form.icon }}
                        </span>
                        <span class="text-sm text-muted-foreground">{{
                            t('admin.categoriesManagement.form.previewIcon')
                        }}</span>
                    </div>

                    <p class="text-xs text-muted-foreground">
                        {{ t('admin.categoriesManagement.form.iconDescription') }}
                        <Button
                            type="button"
                            variant="link"
                            class="p-0 h-auto text-xs"
                            @click="openLucideReference"
                        >
                            {{ t('admin.categoriesManagement.form.viewIcons') }}
                        </Button>
                    </p>
                </div>

                <!-- Order Field -->
                <div class="space-y-2">
                    <Label for="order" class="text-sm font-medium">
                        {{ t('admin.categoriesManagement.form.order') }}
                    </Label>
                    <Input
                        id="order"
                        v-model.number="form.order"
                        type="number"
                        min="1"
                        :placeholder="t('admin.categoriesManagement.form.orderPlaceholder')"
                    />
                    <p class="text-xs text-muted-foreground">
                        {{ t('admin.categoriesManagement.form.orderDescription') }}
                    </p>
                </div>

                <!-- Error Message -->
                <div
                    v-if="submitError"
                    class="p-3 rounded-md bg-destructive/10 border border-destructive/20"
                >
                    <p class="text-sm text-destructive">
                        {{ submitError }}
                    </p>
                </div>

                <!-- Form Actions -->
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        @click="handleCancel"
                        :disabled="isSubmitting"
                    >
                        {{ t('admin.categoriesManagement.form.cancel') }}
                    </Button>
                    <Button
                        type="submit"
                        :disabled="isSubmitting || !isFormValid || props.success"
                        :class="props.success ? 'bg-green-600 hover:bg-green-700' : ''"
                    >
                        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                        <CheckCircle v-else-if="props.success" class="mr-2 h-4 w-4" />
                        {{
                            props.success
                                ? t('common.success')
                                : isSubmitting
                                  ? category
                                      ? t('admin.categoriesManagement.form.updating')
                                      : t('admin.categoriesManagement.form.creating')
                                  : category
                                    ? t('admin.categoriesManagement.form.update')
                                    : t('admin.categoriesManagement.form.create')
                        }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Category } from '@/services/category.service'
import { useAppI18n } from '@/composables/useI18n'

// UI Components
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

// Icons
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-vue-next'

// Composables
const { t } = useAppI18n()

// Props
interface Props {
    open: boolean
    category?: Category | null
    parentCategories: Category[]
    loading?: boolean
    success?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    category: null,
    parentCategories: () => [],
    loading: false,
    success: false,
})

// Emits
const emit = defineEmits<{
    close: []
    save: [data: any]
    'update:open': [value: boolean]
}>()

// Form state
const form = ref({
    name: '',
    slug: '',
    description: '',
    icon: '',
    parent_id: 'none',
    order: 1,
})

const errors = ref({
    name: '',
    slug: '',
    description: '',
    icon: '',
})

const submitError = ref('')
const isSubmitting = computed(() => props.loading)
const showIconPreview = ref(false)
const iconPreview = ref<any>(null)
const isSlugManuallyEdited = ref(false)

// Computed
const availableParents = computed(() => {
    // Exclude current category to prevent circular reference
    return props.parentCategories.filter(
        (parent) => !props.category || parent.id !== props.category.id,
    )
})

const isFormValid = computed(() => {
    return (
        form.value.name.trim() !== '' &&
        form.value.icon.trim() !== '' &&
        !Object.values(errors.value).some((error) => error !== '')
    )
})

const dialogOpen = computed({
    get: () => props.open,
    set: (value: boolean) => {
        // Don't allow closing dialog while submitting
        if (!value && isSubmitting.value) {
            return
        }

        if (!value) {
            emit('close')
            emit('update:open', false)
        } else {
            emit('update:open', true)
        }
    },
})

// Slug generation
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-+|-+$)/g, '')
}

// Validation functions
const validateName = (name: string): string => {
    const trimmedName = name.trim()
    if (!trimmedName) return t('admin.categoriesManagement.validation.nameRequired')
    if (trimmedName.length < 2) return t('admin.categoriesManagement.validation.nameMinLength')
    if (trimmedName.length > 100) return t('admin.categoriesManagement.validation.nameMaxLength')
    return ''
}

const validateSlug = (slug: string): string => {
    const trimmedSlug = slug.trim()
    if (!trimmedSlug) return '' // Slug is auto-generated, so empty is OK
    if (!/^[a-z0-9-]+$/.test(trimmedSlug))
        return t('admin.categoriesManagement.validation.slugInvalid')
    if (trimmedSlug.length < 2) return t('admin.categoriesManagement.validation.slugMinLength')
    if (trimmedSlug.length > 100) return t('admin.categoriesManagement.validation.slugMaxLength')
    return ''
}

const validateDescription = (description: string): string => {
    const trimmedDesc = description.trim()
    if (trimmedDesc.length > 500)
        return t('admin.categoriesManagement.validation.descriptionMaxLength')
    return ''
}

const validateIcon = (icon: string): string => {
    const trimmedIcon = icon.trim()
    if (!trimmedIcon) return t('admin.categoriesManagement.validation.nameRequired') // Reuse name required
    // Simple validation - just check it's not empty and contains valid characters
    if (trimmedIcon.length < 2) return t('admin.categoriesManagement.validation.iconInvalid')
    if (trimmedIcon.length > 50) return t('admin.categoriesManagement.validation.iconInvalid')
    return ''
}

// Icon preview
const loadIconPreview = async (iconName: string) => {
    if (!iconName || validateIcon(iconName)) {
        iconPreview.value = null
        return
    }

    try {
        const icons = await import('lucide-vue-next')
        iconPreview.value = (icons as any)[iconName] || null
    } catch {
        iconPreview.value = null
    }
}

// Event handlers
const handleNameChange = () => {
    errors.value.name = validateName(form.value.name)

    // Auto-generate slug only if user hasn't manually edited it
    if (!isSlugManuallyEdited.value) {
        const newSlug = generateSlug(form.value.name)
        form.value.slug = newSlug
        errors.value.slug = validateSlug(form.value.slug)
    }
}

const handleSlugChange = () => {
    // Mark slug as manually edited when user types in the slug field
    isSlugManuallyEdited.value = true
    errors.value.slug = validateSlug(form.value.slug)
}

const resetSlugToAuto = () => {
    isSlugManuallyEdited.value = false
    form.value.slug = generateSlug(form.value.name)
    errors.value.slug = validateSlug(form.value.slug)
}

const handleDescriptionChange = () => {
    errors.value.description = validateDescription(form.value.description)
}

const handleIconChange = () => {
    errors.value.icon = validateIcon(form.value.icon)
}

const handleOpenChange = (open: boolean) => {
    // Don't allow closing dialog while submitting
    if (!open && isSubmitting.value) {
        return
    }

    if (!open) {
        emit('close')
        emit('update:open', false)
    }
}

const handleCancel = () => {
    // Don't allow closing while submitting
    if (isSubmitting.value) {
        return
    }
    emit('close')
    emit('update:open', false)
}

const openLucideReference = () => {
    window.open('https://lucide.dev/icons/', '_blank')
}

const resetForm = () => {
    form.value = {
        name: '',
        slug: '',
        description: '',
        icon: '',
        parent_id: 'none',
        order: 1,
    }

    errors.value = {
        name: '',
        slug: '',
        description: '',
        icon: '',
    }

    submitError.value = ''
    showIconPreview.value = false
    iconPreview.value = null
    isSlugManuallyEdited.value = false // Reset slug manual edit flag
}

const populateForm = (category: Category) => {
    form.value = {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        parent_id: category.parent_id || 'none',
        order: category.order,
    }

    // Clear any previous errors
    errors.value = {
        name: '',
        slug: '',
        description: '',
        icon: '',
    }

    submitError.value = ''
    isSlugManuallyEdited.value = true // When editing, consider slug as manually set
}

const validateForm = (): boolean => {
    errors.value.name = validateName(form.value.name)
    errors.value.slug = validateSlug(form.value.slug)
    errors.value.description = validateDescription(form.value.description)
    errors.value.icon = validateIcon(form.value.icon)

    return Object.values(errors.value).every((error) => error === '')
}

const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }

    submitError.value = ''

    try {
        const formData = {
            name: form.value.name.trim(),
            slug: form.value.slug.trim() || generateSlug(form.value.name.trim()),
            description: form.value.description.trim(),
            icon: form.value.icon.trim(),
            parent_id: form.value.parent_id === 'none' ? null : form.value.parent_id,
            order: form.value.order,
        }

        // Emit save event but don't close dialog immediately
        emit('save', formData)

        // Note: The parent component will handle closing the dialog after showing toast
    } catch (error) {
        submitError.value =
            error instanceof Error
                ? error.message
                : t('admin.categoriesManagement.messages.unexpectedError')
    }
}

// Watch for category changes
watch(
    () => props.category,
    (newCategory) => {
        if (newCategory) {
            populateForm(newCategory)
        } else {
            resetForm()
        }
    },
    { immediate: true },
)

// Watch for open changes
watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            if (props.category) {
                populateForm(props.category)
            } else {
                resetForm()
            }
            nextTick(() => {
                // Focus on name field when dialog opens
                const nameInput = document.getElementById('name')
                nameInput?.focus()
            })
        }
    },
)

// Watch icon changes for preview
watch(
    () => form.value.icon,
    (newIcon) => {
        if (showIconPreview.value) {
            loadIconPreview(newIcon)
        }
    },
)

// Watch preview toggle
watch(showIconPreview, (show) => {
    if (show) {
        loadIconPreview(form.value.icon)
    } else {
        iconPreview.value = null
    }
})
</script>
