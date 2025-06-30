<template>
    <div
        :class="`${promo.bgColor} rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4`"
    >
        <div class="flex-1">
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight">
                {{ promo.title }}
            </h3>
            <button
                @click="$emit('promo-click', promo)"
                class="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            >
                {{ promo.buttonText }}
            </button>
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
import type { PromoSection } from '@/types/home'

interface Props {
    promo: PromoSection
}

defineProps<Props>()

const emit = defineEmits<{
    'promo-click': [promo: PromoSection]
}>()
</script>
