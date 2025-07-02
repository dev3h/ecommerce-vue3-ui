<template>
    <div class="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-all group">
        <div class="relative mb-3">
            <router-link :to="`/products/${product.id}`" class="block">
                <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
            </router-link>

            <!-- Badge -->
            <span
                v-if="product.badge"
                :class="getBadgeClasses(product.tag)"
                class="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white rounded"
            >
                {{ product.badge }}
            </span>
        </div>

        <div class="space-y-2">
            <!-- Product Name -->
            <router-link :to="`/products/${product.id}`">
                <h3
                    class="font-medium text-foreground text-sm line-clamp-2 hover:text-primary transition-colors"
                >
                    {{ product.name }}
                </h3>
            </router-link>

            <!-- Rating -->
            <div class="flex items-center gap-1">
                <div class="flex text-yellow-400 text-xs">
                    <Star
                        v-for="i in 5"
                        :key="i"
                        :class="i <= Math.floor(product.rating) ? 'fill-current' : ''"
                        class="w-3 h-3"
                    />
                </div>
                <span class="text-xs text-muted-foreground">({{ product.reviewCount }})</span>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-green-600 dark:text-green-400 font-bold text-sm">
                        ${{ product.price.toFixed(2) }}
                    </span>
                    <span
                        v-if="product.originalPrice"
                        class="text-muted-foreground line-through text-xs"
                    >
                        ${{ product.originalPrice.toFixed(2) }}
                    </span>
                </div>

                <button
                    @click="$emit('add-to-cart', product)"
                    class="opacity-0 group-hover:opacity-100 bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition-all"
                    :title="t('productDetail.addToCart')"
                >
                    <Plus class="w-3 h-3" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppI18n } from '@/composables/useI18n'
import type { RelatedProduct } from '@/types/product-detail'

// Icons
import { Star, Plus } from 'lucide-vue-next'

interface Props {
    product: RelatedProduct
}

defineProps<Props>()

const emit = defineEmits<{
    'add-to-cart': [product: RelatedProduct]
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
