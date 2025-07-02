<template>
    <div
        class="text-center p-2 sm:p-3 md:p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
        @click="$emit('category-click', category)"
    >
        <div
            :class="`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3`"
        >
            <span class="text-lg sm:text-xl md:text-2xl">{{ category.icon }}</span>
        </div>
        <h3 class="text-xs sm:text-sm font-medium text-foreground leading-tight">
            {{ category.name }}
        </h3>
    </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types/home'

interface Props {
    category: Category
}

defineProps<Props>()

defineEmits<{
    'category-click': [category: Category]
}>()
</script>
