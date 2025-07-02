<template>
    <div
        class="bg-card dark:bg-card rounded-lg border border-border p-2 sm:p-3 md:p-4 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 group relative"
    >
        <!-- Product Image -->
        <div class="relative mb-2 sm:mb-3">
            <router-link :to="`/products/${product.id}`" class="block">
                <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-32 sm:h-36 md:h-40 lg:h-44 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </router-link>

            <!-- Badge -->
            <span
                v-if="product.badge"
                :class="getBadgeClasses(product.tag)"
                class="absolute top-1 sm:top-2 left-1 sm:left-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded text-white"
            >
                {{ product.badge }}
            </span>

            <!-- Discount Badge -->
            <span
                v-if="product.discount"
                class="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded"
            >
                -{{ product.discount }}%
            </span>

            <!-- Quick Actions -->
            <div
                class="absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center"
            >
                <div class="flex gap-2">
                    <button
                        @click="$emit('add-to-wishlist', product)"
                        class="w-8 h-8 sm:w-10 sm:h-10 bg-background/90 dark:bg-card/90 rounded-full flex items-center justify-center hover:bg-background dark:hover:bg-card transition-colors border border-border"
                        :title="t('products.addToWishlist')"
                    >
                        <Heart class="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                    </button>
                    <button
                        @click="quickView"
                        class="w-8 h-8 sm:w-10 sm:h-10 bg-background/90 dark:bg-card/90 rounded-full flex items-center justify-center hover:bg-background dark:hover:bg-card transition-colors border border-border"
                        :title="t('products.quickView')"
                    >
                        <Eye class="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-2">
            <!-- Brand -->
            <p class="text-xs sm:text-sm text-muted-foreground font-medium">{{ product.brand }}</p>

            <!-- Product Name -->
            <router-link :to="`/products/${product.id}`">
                <h3
                    class="font-medium text-foreground text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] hover:text-primary transition-colors"
                >
                    {{ product.name }}
                </h3>
            </router-link>

            <!-- Rating -->
            <div class="flex items-center gap-1">
                <div class="flex text-yellow-400 text-xs sm:text-sm">
                    <Star
                        v-for="i in 5"
                        :key="i"
                        :class="i <= Math.floor(product.rating) ? 'fill-current' : ''"
                        class="w-3 h-3 sm:w-4 sm:h-4"
                    />
                </div>
                <span class="text-xs text-muted-foreground ml-1">({{ product.reviewCount }})</span>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between">
                <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span
                        class="text-green-600 dark:text-green-400 font-bold text-sm sm:text-base lg:text-lg"
                        >${{ product.price.toFixed(2) }}</span
                    >
                    <span
                        v-if="product.originalPrice"
                        class="text-muted-foreground line-through text-xs sm:text-sm"
                    >
                        ${{ product.originalPrice.toFixed(2) }}
                    </span>
                </div>
            </div>
            <!-- Add to Cart Button -->
            <button
                @click="$emit('add-to-cart', product)"
                :disabled="!product.inStock"
                class="w-full mt-2 sm:mt-3 px-3 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-600 dark:hover:bg-green-700 active:bg-green-700 dark:active:bg-green-800 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
                <span v-if="product.inStock">{{ t('products.addToCart') }}</span>
                <span v-else>{{ t('products.outOfStock') }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProductListItem } from '@/types/products'
import { useAppI18n } from '@/composables/useI18n'
import { Heart, Eye, Star } from 'lucide-vue-next'

interface Props {
    product: ProductListItem
}

defineProps<Props>()

const emit = defineEmits<{
    'add-to-cart': [product: ProductListItem]
    'add-to-wishlist': [product: ProductListItem]
}>()

const { t } = useAppI18n()

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

const quickView = () => {
    // Implement quick view modal
    console.log('Quick view')
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
