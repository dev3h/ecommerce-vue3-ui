<template>
    <div
        class="bg-card dark:bg-card rounded-lg border border-border hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 group relative overflow-hidden"
    >
        <!-- Remove Button -->
        <Button
            @click="$emit('remove-from-wishlist', item)"
            :disabled="isProcessing"
            variant="ghost"
            size="sm"
            class="absolute top-2 right-2 z-10 w-8 h-8 p-0 bg-background/80 hover:bg-background rounded-full shadow-sm"
            :title="t('wishlist.removeFromWishlist')"
        >
            <X class="w-4 h-4" />
        </Button>

        <!-- Product Image -->
        <div class="relative aspect-square overflow-hidden rounded-t-lg">
            <router-link :to="`/products/${item.productId}`" class="block">
                <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                />
            </router-link>

            <!-- Stock Badge -->
            <div
                v-if="item.inStock === false"
                class="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
                <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {{ t('products.outOfStock') }}
                </span>
            </div>
        </div>

        <!-- Product Info -->
        <div class="p-4 space-y-3">
            <!-- Category -->
            <p
                v-if="item.category"
                class="text-xs text-muted-foreground font-medium uppercase tracking-wide"
            >
                {{ item.category }}
            </p>

            <!-- Product Name -->
            <router-link :to="`/products/${item.productId}`">
                <h3
                    class="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                >
                    {{ item.name }}
                </h3>
            </router-link>

            <!-- Description -->
            <p v-if="item.description" class="text-sm text-muted-foreground line-clamp-2">
                {{ item.description }}
            </p>

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
                <span class="text-sm text-muted-foreground"> ({{ item.reviewCount || 0 }}) </span>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-green-600 dark:text-green-400">
                        ${{ item.price.toFixed(2) }}
                    </span>
                    <span
                        v-if="item.originalPrice"
                        class="text-sm text-muted-foreground line-through"
                    >
                        ${{ item.originalPrice.toFixed(2) }}
                    </span>
                </div>

                <!-- Discount Badge -->
                <span
                    v-if="item.originalPrice && item.originalPrice > item.price"
                    class="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium"
                >
                    -{{
                        Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    }}%
                </span>
            </div>

            <!-- Added Date -->
            <p class="text-xs text-muted-foreground">
                {{ t('wishlist.addedOn') }} {{ formatDate(item.addedAt) }}
            </p>

            <!-- Add to Cart Button -->
            <Button
                @click="$emit('add-to-cart', item)"
                :disabled="item.inStock === false || isProcessing"
                class="w-full flex items-center justify-center gap-2"
                :variant="item.inStock === false ? 'outline' : 'default'"
            >
                <ShoppingCart class="w-4 h-4" />
                <span v-if="item.inStock === false">{{ t('products.outOfStock') }}</span>
                <span v-else>{{ t('wishlist.addToCart') }}</span>
            </Button>
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
