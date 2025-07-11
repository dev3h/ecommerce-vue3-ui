<template>
    <div class="border rounded-lg p-4 text-center hover:shadow-lg transition-shadow relative group">
        <div class="flex justify-center items-center h-24 mb-4">
            <img :src="brand.logo" :alt="brand.name" class="max-h-full max-w-full" />
        </div>
        <h3 class="font-semibold">{{ brand.name }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {{ brand.items }} {{ t('admin.brandsManagement.pagination.items') }}
        </p>

        <!-- Action buttons at the bottom -->
        <div class="flex justify-center gap-3 mt-4 pt-3 border-t">
            <Button
                size="icon"
                variant="ghost"
                class="h-8 w-8 text-gray-500 hover:text-blue-500"
                @click.stop="$emit('edit', brand)"
                :aria-label="t('admin.brandsManagement.actions.edit')"
            >
                <Pencil class="h-4 w-4" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                class="h-8 w-8 text-gray-500 hover:text-red-500"
                @click.stop="showDeleteDialog = true"
                :aria-label="t('admin.brandsManagement.actions.delete')"
            >
                <Trash2 class="h-4 w-4" />
            </Button>
        </div>

        <!-- Delete confirmation dialog -->
        <ConfirmDialog
            v-model:open="showDeleteDialog"
            :title="t('admin.brandsManagement.messages.deleteConfirmTitle')"
            :description="`${t('admin.brandsManagement.messages.deleteConfirmMessage')} ${brand.name}?`"
            :confirm-label="t('admin.brandsManagement.messages.deleteConfirmYes')"
            @confirm="handleDelete"
            @loading="setLoading"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Brand } from '@/services/brand.service'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'

const props = defineProps<{
    brand: Brand
}>()

const emit = defineEmits(['edit', 'delete'])
const toast = useToast()
const { t } = useAppI18n()
const showDeleteDialog = ref(false)
const isDeleting = ref(false)

const setLoading = (loading: boolean) => {
    isDeleting.value = loading
}

const handleDelete = async () => {
    // Start the loading state
    setLoading(true)

    // Emit the delete event - the parent component will handle the actual deletion
    emit('delete', props.brand.id)

    // Wait for a moment to show the loading state before closing the dialog
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Close the dialog
    showDeleteDialog.value = false
}
</script>
