<template>
    <component :is="iconComponent" v-if="iconComponent" :class="iconClass" />
    <div v-else :class="placeholderClass">
        <HelpCircle class="w-full h-full text-muted-foreground/50" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { HelpCircle } from 'lucide-vue-next'

interface Props {
    iconName: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    className: '',
})

const iconComponent = ref<any>(null)

const iconClass = computed(() => {
    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    }

    return [sizeClasses[props.size], props.className].filter(Boolean).join(' ')
})

const placeholderClass = computed(() => {
    const sizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    }

    return [sizeClasses[props.size], 'flex items-center justify-center'].join(' ')
})

const loadIcon = async (iconName: string) => {
    if (!iconName) {
        iconComponent.value = null
        return
    }

    try {
        const icons = await import('lucide-vue-next')
        iconComponent.value = (icons as any)[iconName] || null
    } catch (error) {
        console.warn('Failed to load icon:', iconName, error)
        iconComponent.value = null
    }
}

// Watch for icon name changes
watch(
    () => props.iconName,
    (newIconName) => {
        loadIcon(newIconName)
    },
    { immediate: true },
)

// Load icon on mount
onMounted(() => {
    loadIcon(props.iconName)
})
</script>
