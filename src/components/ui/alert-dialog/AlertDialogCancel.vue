<template>
    <Button variant="outline" v-bind="$attrs" @click="handleClick">
        <slot />
    </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
    emit('click', event)
}
</script>
