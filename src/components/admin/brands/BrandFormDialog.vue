<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{
                    brand
                        ? t('admin.brandsManagement.editBrand')
                        : t('admin.brandsManagement.addBrand')
                }}</DialogTitle>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                    <Label for="brand-name" class="flex items-center">
                        {{ t('admin.brandsManagement.form.name') }}
                        <span class="text-red-500 ml-1">*</span>
                    </Label>
                    <Input id="brand-name" v-model="form.name" required />
                </div>
                <div class="space-y-2">
                    <Label for="brand-image">{{ t('admin.brandsManagement.form.logo') }}</Label>

                    <!-- Logo upload area -->
                    <div
                        class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer"
                        @click="triggerFileInput"
                        @dragover.prevent
                        @drop.prevent="onDrop"
                    >
                        <input
                            ref="fileInput"
                            type="file"
                            @change="onFileChange"
                            accept="image/*"
                            class="hidden"
                        />

                        <!-- Show image if exists -->
                        <div v-if="form.imagePreview" class="flex flex-col items-center">
                            <img
                                :src="form.imagePreview"
                                :alt="form.name + ' logo'"
                                class="h-24 w-24 object-contain mb-2"
                            />
                            <p
                                v-if="brand && !form.image"
                                class="text-xs text-gray-500 dark:text-gray-400"
                            >
                                {{ t('admin.brandsManagement.form.currentLogo') }}
                            </p>
                            <p
                                v-else-if="form.image"
                                class="text-xs text-gray-500 dark:text-gray-400"
                            >
                                {{ t('admin.brandsManagement.form.newLogoSelected') }}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                class="mt-2"
                                @click.stop="removeLogo"
                            >
                                {{ t('admin.brandsManagement.form.removeLogo') }}
                            </Button>
                        </div>

                        <!-- Show upload placeholder if no image -->
                        <div
                            v-else
                            class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
                        >
                            <div
                                class="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-2"
                            >
                                <Plus class="h-6 w-6" />
                            </div>
                            <p class="text-sm">{{ t('admin.brandsManagement.form.uploadLogo') }}</p>
                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {{ t('admin.brandsManagement.form.logoDescription') }}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        @click="$emit('update:open', false)"
                        :disabled="isSubmitting"
                        >{{ t('common.cancel') }}</Button
                    >
                    <Button type="submit" :disabled="isSubmitting">
                        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                        {{
                            brand
                                ? t('admin.brandsManagement.form.update')
                                : t('admin.brandsManagement.form.create')
                        }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { watch, reactive, ref } from 'vue'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { brandService } from '@/services/brand.service'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'
import { Loader2, Plus } from 'lucide-vue-next'

const props = defineProps<{ open: boolean; brand?: any }>()
const emit = defineEmits(['update:open', 'saved'])
const toast = useToast()
const { t } = useAppI18n()
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement>()

const form = reactive({
    name: '',
    image: '',
    imagePreview: '',
})

watch(
    () => props.brand,
    (val) => {
        if (val) {
            form.name = val.name
            // When editing, the image is stored in the logo field
            form.image = '' // Reset image field so we know if a new file was selected
            form.imagePreview = val.logo // Use logo field for preview
        } else {
            form.name = ''
            form.image = ''
            form.imagePreview = ''
        }
    },
    { immediate: true },
)

const onFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
            form.image = ev.target?.result as string
            form.imagePreview = form.image
        }
        reader.readAsDataURL(file)
    }
}

// New methods for improved file input UI
const triggerFileInput = () => {
    fileInput.value?.click()
}

const onDrop = (event: DragEvent) => {
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
        const file = files[0]
        if (file.type.startsWith('image/')) {
            onFileChange({ target: { files } } as any)
        }
    }
}

const removeLogo = () => {
    form.image = ''
    form.imagePreview = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const handleSubmit = async () => {
    try {
        isSubmitting.value = true

        // For new brand, always include all fields
        if (!props.brand) {
            const brandData = {
                name: form.name,
                logo: form.image,
                slug: '', // slug will be generated by the service
            }
            await brandService.createBrand(brandData)
            toast.success(t('admin.brandsManagement.messages.createSuccess'))
        }
        // For updates, only include changed fields
        else {
            const updateData: any = {
                name: form.name,
                // Only include logo if a new image was selected
                // otherwise leave the original logo unchanged
                ...(form.image ? { logo: form.image } : {}),
            }
            await brandService.updateBrand(props.brand.id, updateData)
            toast.success(t('admin.brandsManagement.messages.updateSuccess'))
        }

        emit('update:open', false)
        emit('saved')
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        const errorKey = props.brand
            ? 'admin.brandsManagement.messages.updateError'
            : 'admin.brandsManagement.messages.createError'
        toast.error(t(errorKey), errorMessage)
    } finally {
        isSubmitting.value = false
    }
}
</script>
