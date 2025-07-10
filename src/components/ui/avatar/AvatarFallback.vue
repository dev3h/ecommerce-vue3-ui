<template>
    <span
        :class="
            cn('flex h-full w-full items-center justify-center rounded-full bg-muted', props.class)
        "
    >
        <slot />
    </span>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface AvatarFallbackProps {
    class?: string
}

const props = defineProps<AvatarFallbackProps>()
</script>
