<template>
    <div
        class="bg-card dark:bg-card rounded-lg border border-border p-4 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300"
    >
        <div class="flex flex-col sm:flex-row gap-4">
            <!-- Product Image -->
            <div class="relative w-full sm:w-32 md:w-40 flex-shrink-0">
                <router-link :to="`/products/${item.productId}`" class="block">
                    <div class="aspect-square overflow-hidden rounded-lg">
                        <img
                            :src="item.image"
                            :alt="item.name"
                            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>
                </router-link>

                <!-- Stock Overlay -->
                <div
                    v-if="item.inStock === false"
                    class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
                >
                    <span class="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {{ t('products.outOfStock') }}
                    </span>
                </div>
            </div>

            <!-- Product Details -->
            <div class="flex-1 min-w-0 space-y-3">
                <!-- Header Row -->
                <div class="flex items-start justify-between gap-4">
                    <div class="flex-1 min-w-0">
                        <!-- Category -->
                        <p
                            v-if="item.category"
                            class="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1"
                        >
                            {{ item.category }}
                        </p>

                        <!-- Product Name -->
                        <router-link :to="`/products/${item.productId}`">
                            <h3
                                class="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2"
                            >
                                {{ item.name }}
                            </h3>
                        </router-link>

                        <!-- Description -->
                        <p
                            v-if="item.description"
                            class="text-sm text-muted-foreground line-clamp-2 mb-3"
                        >
                            {{ item.description }}
                        </p>
                    </div>

                    <!-- Remove Button -->
                    <Button
                        @click="$emit('remove-from-wishlist', item)"
                        :disabled="isProcessing"
                        variant="ghost"
                        size="sm"
                        class="flex-shrink-0"
                        :title="t('wishlist.removeFromWishlist')"
                    >
                        <X class="w-4 h-4" />
                    </Button>
                </div>

                <!-- Rating -->
                <div v-if="item.rating" class="flex items-center gap-2">
                    <div class="flex text-yellow-400">
                        <Star
                            v-for="i in 5"
                            :key="i"
                            :class="i <= Math.floor(item.rating || 0) ? 'fill-current' : ''"
                            class="w-4 h-4"
                        />
                    </div>
                    <span class="text-sm text-muted-foreground">
                        {{ item.rating?.toFixed(1) }} ({{ item.reviewCount || 0 }} reviews)
                    </span>
                </div>

                <!-- Price and Actions Row -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <!-- Price Section -->
                    <div class="space-y-2">
                        <div class="flex items-center gap-3">
                            <span class="text-xl font-bold text-green-600 dark:text-green-400">
                                ${{ item.price.toFixed(2) }}
                            </span>
                            <span
                                v-if="item.originalPrice"
                                class="text-lg text-muted-foreground line-through"
                            >
                                ${{ item.originalPrice.toFixed(2) }}
                            </span>
                            <span
                                v-if="item.originalPrice && item.originalPrice > item.price"
                                class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium"
                            >
                                Save ${{ (item.originalPrice - item.price).toFixed(2) }}
                            </span>
                        </div>
                        <p class="text-xs text-muted-foreground">
                            {{ t('wishlist.addedOn') }} {{ formatDate(item.addedAt) }}
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center gap-3">
                        <Button
                            @click="$emit('add-to-cart', item)"
                            :disabled="item.inStock === false || isProcessing"
                            class="flex items-center gap-2"
                            :variant="item.inStock === false ? 'outline' : 'default'"
                        >
                            <ShoppingCart class="w-4 h-4" />
                            <span v-if="item.inStock === false">{{
                                t('products.outOfStock')
                            }}</span>
                            <span v-else>{{ t('wishlist.addToCart') }}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { X, Star, ShoppingCart } from 'lucide-vue-next'
import type { WishlistItem } from '@/stores/wishlist'

interface Props {
    item: WishlistItem
    isProcessing: boolean
}

defineProps<Props>()

const emit = defineEmits<{
    'add-to-cart': [item: WishlistItem]
    'remove-from-wishlist': [item: WishlistItem]
}>()

const { t } = useAppI18n()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
