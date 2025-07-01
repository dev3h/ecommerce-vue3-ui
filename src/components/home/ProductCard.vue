<template>
    <div
        class="bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 hover:shadow-md transition-shadow group"
    >
        <div class="relative mb-2 sm:mb-3">
            <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-24 sm:h-28 md:h-32 lg:h-36 object-cover rounded-lg"
            />
            <span
                v-if="product.badge"
                :class="getBadgeClasses(product.tag)"
                class="absolute top-1 sm:top-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded text-white"
            >
                {{ product.badge }}
            </span>
        </div>

        <h3
            class="font-medium text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm line-clamp-2"
        >
            {{ product.name }}
        </h3>

        <div class="flex items-center mb-1 sm:mb-2">
            <div class="flex text-yellow-400 text-xs">
                <span v-for="i in 5" :key="i">★</span>
            </div>
            <span class="text-xs text-gray-500 ml-1">({{ product.rating }})</span>
        </div>

        <div class="flex items-center justify-between">
            <div class="flex flex-col sm:flex-row sm:items-center">
                <span class="text-green-600 font-bold text-sm sm:text-base"
                    >${{ product.price }}</span
                >
                <span
                    v-if="product.originalPrice"
                    class="text-gray-400 line-through text-xs sm:text-sm sm:ml-2"
                >
                    ${{ product.originalPrice }}
                </span>
            </div>
            <button
                @click="$emit('add-to-cart', product)"
                class="opacity-70 active:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-green-500 text-white p-1.5 sm:p-2 rounded-lg hover:bg-green-600 active:bg-green-700 transition-all touch-manipulation"
                aria-label="Add to cart"
            >
                <svg
                    class="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/home'

interface Props {
    product: Product
}

defineProps<Props>()

const emit = defineEmits<{
    'add-to-cart': [product: Product]
}>()

const getBadgeClasses = (tag?: string) => {
    switch (tag) {
        case 'pink':
            return 'bg-pink-500'
        case 'blue':
            return 'bg-blue-500'
        case 'green':
            return 'bg-green-500'
        case 'orange':
            return 'bg-orange-500'
        default:
            return 'bg-gray-500'
    }
}
</script>
