<template>
    <div
        class="bg-card dark:bg-card rounded-lg border border-border p-4 sm:p-6 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 group"
    >
        <div class="flex flex-col sm:flex-row gap-4">
            <!-- Product Image -->
            <div class="relative w-full sm:w-48 md:w-56 flex-shrink-0">
                <router-link :to="`/products/${product.id}`" class="block">
                    <img
                        :src="product.image"
                        :alt="product.name"
                        class="w-full h-48 sm:h-36 md:h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </router-link>

                <!-- Badge -->
                <span
                    v-if="product.badge"
                    :class="getBadgeClasses(product.tag)"
                    class="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded text-white"
                >
                    {{ product.badge }}
                </span>

                <!-- Discount Badge -->
                <span
                    v-if="product.discount"
                    class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded"
                >
                    -{{ product.discount }}%
                </span>
            </div>

            <!-- Product Info -->
            <div class="flex-1 flex flex-col justify-between">
                <div class="space-y-3">
                    <!-- Brand -->
                    <p class="text-sm text-muted-foreground font-medium">{{ product.brand }}</p>

                    <!-- Product Name -->
                    <router-link :to="`/products/${product.id}`">
                        <h3
                            class="font-semibold text-foreground text-lg sm:text-xl hover:text-primary transition-colors line-clamp-2"
                        >
                            {{ product.name }}
                        </h3>
                    </router-link>

                    <!-- Description -->
                    <p class="text-muted-foreground text-sm line-clamp-2">
                        {{ product.description }}
                    </p>

                    <!-- Rating -->
                    <div class="flex items-center gap-2">
                        <div class="flex text-yellow-400">
                            <Star
                                v-for="i in 5"
                                :key="i"
                                :class="i <= Math.floor(product.rating) ? 'fill-current' : ''"
                                class="w-4 h-4"
                            />
                        </div>
                        <span class="text-sm text-muted-foreground"
                            >({{ product.reviewCount }} reviews)</span
                        >
                        <span class="text-sm text-muted-foreground">•</span>
                        <span class="text-sm text-muted-foreground">SKU: {{ product.sku }}</span>
                    </div>

                    <!-- Stock Status -->
                    <div class="flex items-center gap-2">
                        <div
                            :class="
                                product.inStock
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            "
                            class="px-2 py-1 rounded-full text-xs font-medium"
                        >
                            {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
                        </div>
                        <span v-if="product.inStock" class="text-sm text-muted-foreground">
                            {{ product.quantity }} available
                        </span>
                    </div>
                </div>

                <!-- Price and Actions -->
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4"
                >
                    <!-- Price -->
                    <div class="flex items-center gap-3">
                        <span
                            class="text-green-600 dark:text-green-400 font-bold text-xl sm:text-2xl"
                            >${{ product.price.toFixed(2) }}</span
                        >
                        <span
                            v-if="product.originalPrice"
                            class="text-muted-foreground line-through text-lg"
                        >
                            ${{ product.originalPrice.toFixed(2) }}
                        </span>
                        <span
                            v-if="product.originalPrice"
                            class="text-sm text-green-600 dark:text-green-400 font-medium"
                        >
                            Save ${{ (product.originalPrice - product.price).toFixed(2) }}
                        </span>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3">
                        <button
                            @click.stop="handleToggleWishlist"
                            :class="[
                                'p-2 border rounded-lg hover:bg-accent transition-all',
                                isProductInWishlist
                                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                                    : 'border-border',
                            ]"
                            :title="
                                isProductInWishlist
                                    ? t('wishlist.removeFromWishlist')
                                    : t('wishlist.addToWishlist')
                            "
                        >
                            <Heart
                                :class="[
                                    'w-5 h-5 transition-colors',
                                    isProductInWishlist
                                        ? 'text-red-500 fill-current'
                                        : 'text-foreground',
                                ]"
                            />
                        </button>

                        <button
                            @click="$emit('add-to-cart', product)"
                            :disabled="!product.inStock"
                            class="px-6 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-700 active:bg-green-700 dark:active:bg-green-800 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <ShoppingCart class="w-5 h-5" />
                            <span v-if="product.inStock">Add to Cart</span>
                            <span v-else>Out of Stock</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProductListItem } from '@/types/products'
import { useAppI18n } from '@/composables/useI18n'
import { useWishlist } from '@/composables/useWishlist'
import { computed } from 'vue'
import { Heart, Star, ShoppingCart } from 'lucide-vue-next'

interface Props {
    product: ProductListItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'add-to-cart': [product: ProductListItem]
}>()

const { t } = useAppI18n()
const { isInWishlist, toggleWishlist } = useWishlist()

const isProductInWishlist = computed(() => isInWishlist.value(props.product.id))

const handleToggleWishlist = () => {
    const wishlistItem = {
        productId: props.product.id,
        name: props.product.name,
        price: props.product.price,
        originalPrice: props.product.originalPrice,
        image: props.product.image,
        category: props.product.category,
        description: props.product.description,
        rating: props.product.rating,
        reviewCount: props.product.reviewCount,
        inStock: props.product.inStock,
    }
    toggleWishlist(wishlistItem)
}

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
