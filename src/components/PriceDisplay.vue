<template>
    <div class="price-display">
        <span class="text-lg font-semibold" :class="sizeClasses">
            {{ formattedPrice }}
        </span>
        <span
            v-if="originalPrice && originalPrice !== price"
            class="text-sm text-muted-foreground line-through ml-2"
        >
            {{ formatCurrency(originalPrice) }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppI18n } from '@/composables/useI18n'

interface Props {
    price: number
    originalPrice?: number
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
})

const { formatCurrency } = useAppI18n()

const formattedPrice = computed(() => formatCurrency(props.price))

const sizeClasses = computed(() => {
    const sizes = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
    }
    return sizes[props.size]
})
</script>
