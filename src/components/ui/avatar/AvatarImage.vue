<template>
    <img
        :class="cn('aspect-square h-full w-full', props.class)"
        :src="src"
        :alt="alt"
        @error="onError"
    />
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface AvatarImageProps {
    src?: string
    alt?: string
    class?: string
}

const props = defineProps<AvatarImageProps>()

const emit = defineEmits<{
    error: [event: Event]
}>()

const onError = (event: Event) => {
    emit('error', event)
}
</script>
