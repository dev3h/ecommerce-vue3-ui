<template>
    <div
        class="relative group"
        @mouseenter="updateTooltipPosition"
        @mouseleave="hideTooltip"
        ref="itemElement"
    >
        <RouterLink
            :to="to"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
            :class="{
                'bg-primary text-primary-foreground': active && variant === 'default',
                'bg-secondary text-secondary-foreground': active && variant === 'secondary',
                'bg-destructive text-destructive-foreground': active && variant === 'destructive',
                'bg-accent text-accent-foreground': active && variant === 'accent',
                'text-muted-foreground': !active,
                'justify-center': props.isCollapsed,
                'justify-start': !props.isCollapsed,
            }"
        >
            <component :is="iconComponent" class="h-4 w-4 flex-shrink-0" />
            <span v-if="!props.isCollapsed" class="flex-1 transition-opacity duration-300">
                {{ label }}
            </span>
        </RouterLink>

        <!-- Tooltip with dynamic positioning -->
        <div
            v-if="props.isCollapsed && showTooltip"
            class="tooltip-popup px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-xl border border-border transition-all duration-200 pointer-events-none whitespace-nowrap"
            :style="tooltipStyle"
        >
            {{ label }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as LucideIcons from 'lucide-vue-next'

interface Props {
    to: string
    icon: string
    label: string
    badge?: number | string
    variant?: 'default' | 'secondary' | 'destructive' | 'accent'
    active?: boolean
    isCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    active: false,
    isCollapsed: false,
})

// Tooltip state
const showTooltip = ref(false)
const itemElement = ref<HTMLElement>()
const tooltipPosition = ref({ top: 0, left: 0 })

// Helper computed for badge validation
const badgeCount = computed(() => {
    if (!props.badge) return 0
    return typeof props.badge === 'number' ? props.badge : parseInt(props.badge) || 0
})

const iconComponent = computed(() => {
    // @ts-ignore - Dynamic icon import
    return LucideIcons[props.icon] || LucideIcons.Circle
})

const badgeClasses = computed(() => {
    const baseClasses = 'font-medium'

    if (props.active) {
        switch (props.variant) {
            case 'secondary':
                return `${baseClasses} bg-secondary-foreground text-secondary`
            case 'destructive':
                return `${baseClasses} bg-destructive-foreground text-destructive`
            case 'accent':
                return `${baseClasses} bg-accent-foreground text-accent`
            default:
                return `${baseClasses} bg-primary-foreground text-primary`
        }
    }

    // Badge colors for non-active state
    switch (props.variant) {
        case 'secondary':
            return `${baseClasses} bg-secondary text-secondary-foreground`
        case 'destructive':
            return `${baseClasses} bg-destructive text-destructive-foreground`
        case 'accent':
            return `${baseClasses} bg-accent text-accent-foreground`
        default:
            return `${baseClasses} bg-primary text-primary-foreground`
    }
})

// Tooltip positioning
const tooltipStyle = computed(() => ({
    position: 'fixed' as const,
    top: `${tooltipPosition.value.top}px`,
    left: `${tooltipPosition.value.left}px`,
    zIndex: 999999,
    opacity: showTooltip.value ? 1 : 0,
    transform: showTooltip.value ? 'scale(1)' : 'scale(0.95)',
}))

// Methods
const updateTooltipPosition = () => {
    if (itemElement.value) {
        const rect = itemElement.value.getBoundingClientRect()
        tooltipPosition.value = {
            top: rect.top + rect.height / 2 - 20, // Center vertically, adjust for tooltip height
            left: rect.right + 8, // 8px to the right
        }
        showTooltip.value = true
    }
}

const hideTooltip = () => {
    showTooltip.value = false
}
</script>
