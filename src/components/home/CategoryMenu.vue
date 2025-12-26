<script setup lang="ts">
import type { Category } from '@/types/home'

interface Props {
    categories: Category[]
}

defineProps<Props>()
const emit = defineEmits<{
    categoryClick: [category: Category]
}>()

const handleCategoryClick = (category: Category) => {
    emit('categoryClick', category)
}
</script>

<template>
    <div class="max-w-7xl mx-auto py-3 sm:py-4 md:py-6 border-b border-border">
        <div class="overflow-x-auto scrollbar-hide">
            <div class="flex items-center gap-6 px-4 py-3 min-w-max">
                <button
                    v-for="category in categories"
                    :key="category.name"
                    @click="handleCategoryClick(category)"
                    class="flex flex-col items-center gap-2 group hover:opacity-80 transition-opacity"
                >
                    <div class="w-12 h-12 flex items-center justify-center text-2xl">
                        {{ category.icon }}
                    </div>
                    <span
                        class="text-xs text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap"
                    >
                        {{ category.name }}
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
