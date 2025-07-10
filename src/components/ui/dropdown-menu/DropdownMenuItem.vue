<template>
    <Button
        v-bind="$attrs"
        :class="[
            'justify-start gap-2 text-sm font-normal h-8 px-2',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:bg-accent focus:text-accent-foreground',
            destructive && 'text-destructive hover:text-destructive',
            $attrs.class,
        ]"
        variant="ghost"
        size="sm"
        @click="handleClick"
    >
        <slot />
    </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface Props {
    destructive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    destructive: false,
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
    emit('click', event)
}
</script>
