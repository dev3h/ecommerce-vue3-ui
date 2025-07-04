<template>
    <div
        class="bg-card rounded-lg border border-border p-2 sm:p-3 md:p-4 hover:shadow-md transition-shadow group cursor-pointer"
        @click="goToProduct"
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

        <h3 class="font-medium text-foreground mb-1 sm:mb-2 text-xs sm:text-sm line-clamp-2">
            {{ product.name }}
        </h3>

        <div class="flex items-center mb-1 sm:mb-2">
            <div class="flex text-yellow-400 text-xs">
                <span v-for="i in 5" :key="i">★</span>
            </div>
            <span class="text-xs text-muted-foreground ml-1">({{ product.rating }})</span>
        </div>

        <div class="flex items-center justify-between">
            <PriceDisplay
                :price="product.price"
                :original-price="product.originalPrice"
                class="text-sm sm:text-base"
            />
            <div class="flex items-center gap-1">
                <button
                    @click.stop="handleToggleWishlist"
                    :class="[
                        'opacity-70 active:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-2 rounded-lg transition-all touch-manipulation shadow-sm border',
                        isProductInWishlist
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-800'
                            : 'bg-background dark:bg-card text-foreground border-border hover:bg-accent',
                    ]"
                    :aria-label="
                        isProductInWishlist
                            ? t('wishlist.removeFromWishlist')
                            : t('wishlist.addToWishlist')
                    "
                >
                    <Heart
                        :class="[
                            'w-3 h-3 sm:w-4 sm:h-4 transition-colors',
                            isProductInWishlist ? 'fill-current' : '',
                        ]"
                    />
                </button>
                <button
                    @click.stop="handleAddToCart"
                    class="opacity-70 active:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-all touch-manipulation shadow-sm"
                    :aria-label="t('productDetail.addToCart')"
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
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useWishlist } from '@/composables/useWishlist'
import { computed } from 'vue'
import PriceDisplay from '@/components/PriceDisplay.vue'
import { Heart } from 'lucide-vue-next'
import type { Product } from '@/types/home'

interface Props {
    product: Product
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'add-to-cart': [product: Product]
}>()

const { t } = useAppI18n()
const router = useRouter()
const { isInWishlist, toggleWishlist } = useWishlist()

const isProductInWishlist = computed(() => isInWishlist.value(props.product.id.toString()))

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
            return 'bg-muted'
    }
}

const goToProduct = () => {
    router.push(`/products/${props.product.id}`)
}

const handleAddToCart = () => {
    emit('add-to-cart', props.product)
}

const handleToggleWishlist = () => {
    const wishlistItem = {
        productId: props.product.id.toString(),
        name: props.product.name,
        price: props.product.price,
        originalPrice: props.product.originalPrice,
        image: props.product.image,
    }
    toggleWishlist(wishlistItem)
}
</script>
