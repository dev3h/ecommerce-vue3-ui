<template>
    <RouterLink
        :to="to"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
        :class="{
            'bg-accent text-accent-foreground': isActive,
            'text-muted-foreground': !isActive,
        }"
    >
        <!-- Support both emoji and Lucide icons -->
        <span v-if="isEmoji" class="text-lg">{{ icon }}</span>
        <component v-else :is="iconComponent" class="h-4 w-4" />

        <span class="flex-1">{{ label }}</span>
        <span
            v-if="badge && Number(badge) > 0"
            class="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground"
        >
            {{ badge }}
        </span>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
    to: string
    icon: string
    label: string
    badge?: number | string
    active?: boolean
}

const props = defineProps<Props>()
const route = useRoute()

const isActive = computed(() => {
    // Use explicit active prop if provided
    if (props.active !== undefined) {
        return props.active
    }
    // Fallback to route-based detection
    return route.path === props.to || route.path.startsWith(props.to + '/')
})

const isEmoji = computed(() => {
    // Simple emoji detection - if the icon is not a known Lucide icon name
    // @ts-ignore
    return !LucideIcons[props.icon] && props.icon.length <= 4
})

const iconComponent = computed(() => {
    // @ts-ignore - Dynamic icon import
    return LucideIcons[props.icon] || LucideIcons.Circle
})
</script>
