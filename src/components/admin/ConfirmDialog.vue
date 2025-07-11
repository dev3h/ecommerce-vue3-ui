<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription v-if="description">
                    {{ description }}
                </DialogDescription>
            </DialogHeader>

            <div class="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    variant="ghost"
                    @click="$emit('update:open', false)"
                    :disabled="loading"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    @click="handleConfirm"
                    :disabled="loading"
                >
                    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                    {{ confirmLabel }}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps<{
    open: boolean
    title: string
    description?: string
    confirmLabel?: string
}>()

const emit = defineEmits(['update:open', 'confirm', 'loading'])
const loading = ref(false)

const handleConfirm = () => {
    loading.value = true
    emit('loading', true)
    emit('confirm')
    // We don't close the dialog here - the parent component must do it
}
</script>
