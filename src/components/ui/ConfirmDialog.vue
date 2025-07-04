<script setup lang="ts">
import { computed } from 'vue'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-vue-next'
import { useAppI18n } from '@/composables/useI18n'

interface ConfirmDialogProps {
    open: boolean
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'destructive'
    loading?: boolean
}

interface ConfirmDialogEmits {
    (e: 'update:open', value: boolean): void
    (e: 'confirm'): void
    (e: 'cancel'): void
}

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
    title: '',
    description: '',
    confirmText: '',
    cancelText: '',
    variant: 'default',
    loading: false,
})

const emits = defineEmits<ConfirmDialogEmits>()

const { t } = useAppI18n()

const handleCancel = () => {
    emits('update:open', false)
    emits('cancel')
}

const handleConfirm = () => {
    emits('confirm')
}

const displayTitle = computed(() => props.title || t('common.confirm'))
const displayDescription = computed(() => props.description || t('common.confirmMessage'))
const displayConfirmText = computed(() => props.confirmText || t('common.confirm'))
const displayCancelText = computed(() => props.cancelText || t('common.cancel'))
</script>

<template>
    <Dialog :open="open" @update:open="emits('update:open', $event)">
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2">
                    <AlertTriangle
                        v-if="variant === 'destructive'"
                        class="h-5 w-5 text-destructive"
                    />
                    {{ displayTitle }}
                </DialogTitle>
                <DialogDescription>
                    {{ displayDescription }}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <Button variant="outline" @click="handleCancel" :disabled="loading">
                    {{ displayCancelText }}
                </Button>
                <Button
                    :variant="variant"
                    @click="handleConfirm"
                    :disabled="loading"
                    class="relative"
                >
                    <div
                        v-if="loading"
                        class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
                    ></div>
                    {{ displayConfirmText }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
