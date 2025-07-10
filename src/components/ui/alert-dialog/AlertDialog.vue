<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-lg">
            <slot />
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Props {
    open: boolean
}

defineProps<Props>()

defineEmits<{
    'update:open': [value: boolean]
}>()
</script>
