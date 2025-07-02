<template>
    <div
        :class="`${getAdaptiveBackgroundClass(promo.bgColor)} rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4`"
    >
        <div class="flex-1">
            <h3
                :class="`text-lg sm:text-xl font-bold mb-2 sm:mb-3 leading-tight ${getTextColorClass(promo.bgColor)}`"
            >
                {{ promo.title }}
            </h3>
            <Button @click="$emit('promo-click', promo)" class="w-full sm:w-auto" size="sm">
                {{ promo.buttonText }}
            </Button>
        </div>
        <div class="flex-shrink-0 self-center sm:ml-4">
            <img
                :src="promo.image"
                :alt="promo.title"
                class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-lg mx-auto sm:mx-0"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { PromoSection } from '@/types/home'

interface Props {
    promo: PromoSection
}

defineProps<Props>()

defineEmits<{
    'promo-click': [promo: PromoSection]
}>()

// Tạo màu nền thích ứng với dark mode
const getAdaptiveBackgroundClass = (originalBgColor: string) => {
    const colorMap: Record<string, string> = {
        'bg-orange-50': 'bg-orange-50 dark:bg-orange-900/20',
        'bg-red-50': 'bg-red-50 dark:bg-red-900/20',
        'bg-green-50': 'bg-green-50 dark:bg-green-900/20',
        'bg-blue-50': 'bg-blue-50 dark:bg-blue-900/20',
        'bg-purple-50': 'bg-purple-50 dark:bg-purple-900/20',
        'bg-yellow-50': 'bg-yellow-50 dark:bg-yellow-900/20',
    }

    return colorMap[originalBgColor] || 'bg-accent/50'
}

// Tạo màu chữ tương ứng
const getTextColorClass = (originalBgColor: string) => {
    const textColorMap: Record<string, string> = {
        'bg-orange-50': 'text-orange-900 dark:text-orange-100',
        'bg-red-50': 'text-red-900 dark:text-red-100',
        'bg-green-50': 'text-green-900 dark:text-green-100',
        'bg-blue-50': 'text-blue-900 dark:text-blue-100',
        'bg-purple-50': 'text-purple-900 dark:text-purple-100',
        'bg-yellow-50': 'text-yellow-900 dark:text-yellow-100',
    }

    return textColorMap[originalBgColor] || 'text-foreground'
}
</script>
