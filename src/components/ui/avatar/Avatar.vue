<template>
    <div :class="cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', props.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

interface AvatarProps {
    class?: string
}

const props = defineProps<AvatarProps>()
</script>
