<template>
    <div class="min-h-screen bg-background">
        <!-- Breadcrumb -->
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 py-3 border-b border-border">
            <div class="max-w-7xl mx-auto">
                <nav class="flex items-center space-x-2 text-sm text-muted-foreground">
                    <router-link to="/" class="hover:text-foreground">{{
                        t('common.home')
                    }}</router-link>
                    <span>/</span>
                    <router-link to="/products" class="hover:text-foreground">{{
                        t('navigation.products')
                    }}</router-link>
                    <span>/</span>
                    <span v-if="product?.category" class="hover:text-foreground">{{
                        product.category
                    }}</span>
                    <span>/</span>
                    <span class="text-foreground font-medium">{{ product?.name }}</span>
                </nav>
            </div>
        </div>

        <div class="px-3 sm:px-4 md:px-6 lg:px-8 py-6">
            <div class="max-w-7xl mx-auto">
                <!-- Loading State -->
                <div v-if="loading.product" class="flex justify-center items-center h-96">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                    ></div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="text-center py-16">
                    <div class="text-red-500 mb-4">
                        <AlertCircle class="w-16 h-16 mx-auto mb-4" />
                        <p class="text-lg font-medium">{{ error }}</p>
                    </div>
                    <button
                        @click="initialize"
                        class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        {{ t('common.tryAgain') }}
                    </button>
                </div>

                <!-- Product Detail Content -->
                <div v-else-if="product" class="space-y-8">
                    <!-- Product Main Section -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <!-- Product Images -->
                        <div class="space-y-4">
                            <!-- Main Image -->
                            <div
                                class="aspect-square bg-card rounded-lg overflow-hidden border border-border"
                            >
                                <img
                                    :src="selectedImage"
                                    :alt="product.name"
                                    class="w-full h-full object-cover"
                                />
                            </div>

                            <!-- Thumbnail Images -->
                            <div class="flex gap-2 overflow-x-auto">
                                <button
                                    v-for="(image, index) in product.images"
                                    :key="index"
                                    @click="selectImage(index)"
                                    :class="[
                                        'flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors',
                                        selectedImageIndex === index
                                            ? 'border-primary'
                                            : 'border-border hover:border-primary/50',
                                    ]"
                                >
                                    <img
                                        :src="image"
                                        :alt="`${product.name} ${index + 1}`"
                                        class="w-full h-full object-cover"
                                    />
                                </button>
                            </div>
                        </div>

                        <!-- Product Info -->
                        <div class="space-y-6">
                            <!-- Badge -->
                            <div v-if="product.badge" class="flex">
                                <span
                                    :class="getBadgeClasses(product.tag)"
                                    class="px-3 py-1 text-sm font-medium text-white rounded-full"
                                >
                                    {{ product.badge }}
                                </span>
                            </div>

                            <!-- Title and Brand -->
                            <div>
                                <h1
                                    class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2"
                                >
                                    {{ product.name }}
                                </h1>
                                <p class="text-lg text-muted-foreground">
                                    {{ t('productDetail.by') }} {{ product.brand }}
                                </p>
                            </div>

                            <!-- Rating -->
                            <div class="flex items-center gap-4">
                                <div class="flex items-center gap-2">
                                    <div class="flex text-yellow-400">
                                        <Star
                                            v-for="i in 5"
                                            :key="i"
                                            :class="
                                                i <= Math.floor(averageRating) ? 'fill-current' : ''
                                            "
                                            class="w-5 h-5"
                                        />
                                    </div>
                                    <span class="text-sm text-muted-foreground">
                                        ({{ reviewsTotal }} {{ t('productDetail.reviewsCount') }})
                                    </span>
                                </div>
                                <span class="text-sm text-muted-foreground">•</span>
                                <span class="text-sm text-muted-foreground">
                                    {{ t('productDetail.sku') }}: {{ product.sku }}
                                </span>
                            </div>

                            <!-- Price -->
                            <div class="space-y-2">
                                <div class="flex items-center gap-4">
                                    <span
                                        class="text-3xl font-bold text-green-600 dark:text-green-400"
                                    >
                                        ${{ product.price.toFixed(2) }}
                                    </span>
                                    <span
                                        v-if="product.originalPrice"
                                        class="text-xl text-muted-foreground line-through"
                                    >
                                        ${{ product.originalPrice.toFixed(2) }}
                                    </span>
                                    <span
                                        v-if="discountPercentage > 0"
                                        class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded"
                                    >
                                        {{ discountPercentage }}% {{ t('productDetail.off') }}
                                    </span>
                                </div>
                                <p
                                    v-if="discountAmount > 0"
                                    class="text-sm text-green-600 dark:text-green-400"
                                >
                                    {{ t('productDetail.youSave') }} ${{
                                        discountAmount.toFixed(2)
                                    }}
                                </p>
                            </div>

                            <!-- Stock Status -->
                            <div class="flex items-center gap-2">
                                <div
                                    :class="[
                                        isInStock
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
                                    ]"
                                    class="px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {{
                                        isInStock
                                            ? t('productDetail.inStock')
                                            : t('productDetail.outOfStock')
                                    }}
                                </div>
                                <span
                                    v-if="isInStock && product.quantity"
                                    class="text-sm text-muted-foreground"
                                >
                                    {{ product.quantity }} {{ t('productDetail.available') }}
                                </span>
                            </div>

                            <!-- Short Description -->
                            <p class="text-muted-foreground leading-relaxed">
                                {{ product.shortDescription }}
                            </p>

                            <!-- Quantity and Add to Cart -->
                            <div class="space-y-4">
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center">
                                        <span class="text-sm font-medium text-foreground mr-3">
                                            {{ t('productDetail.quantity') }}:
                                        </span>
                                        <div
                                            class="flex items-center border border-border rounded-lg"
                                        >
                                            <button
                                                @click="updateQuantity(quantity - 1)"
                                                :disabled="quantity <= 1"
                                                class="p-2 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Minus class="w-4 h-4" />
                                            </button>
                                            <input
                                                v-model.number="quantity"
                                                type="number"
                                                min="1"
                                                :max="product.quantity"
                                                class="w-16 text-center border-0 outline-none bg-transparent"
                                                @change="updateQuantity(quantity)"
                                            />
                                            <button
                                                @click="updateQuantity(quantity + 1)"
                                                :disabled="quantity >= (product.quantity ?? 0)"
                                                class="p-2 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex gap-4">
                                    <button
                                        @click="addToCart"
                                        :disabled="!canAddToCart"
                                        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 dark:bg-green-600 text-white rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ShoppingCart class="w-5 h-5" />
                                        {{ t('productDetail.addToCart') }}
                                    </button>
                                    <button
                                        @click="addToWishlist"
                                        class="p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                                        :title="t('productDetail.addToWishlist')"
                                    >
                                        <Heart class="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <!-- Product Tags -->
                            <div v-if="product.tags?.length" class="space-y-2">
                                <p class="text-sm font-medium text-foreground">
                                    {{ t('productDetail.tags') }}:
                                </p>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="tag in product.tags"
                                        :key="tag"
                                        class="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md"
                                    >
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Product Details Tabs -->
                    <ProductDetailTabs
                        :product="product"
                        :reviews="reviews"
                        :reviews-total="reviewsTotal"
                        :has-more-reviews="hasMoreReviews"
                        :loading-reviews="loading.reviews"
                        :active-tab="activeTab"
                        @tab-change="setActiveTab"
                        @load-more-reviews="loadMoreReviews"
                    />

                    <!-- Related Products -->
                    <RelatedProducts
                        :products="relatedProducts"
                        :loading="loading.relatedProducts"
                        @add-to-cart="handleAddToCart"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useProductDetail } from '@/composables/useProductDetail'
import type { ProductListItem } from '@/types/products'

// Components
import ProductDetailTabs from '@/components/product/ProductDetailTabs.vue'
import RelatedProducts from '@/components/product/RelatedProducts.vue'

// Icons
import { Star, ShoppingCart, Heart, Plus, Minus, AlertCircle } from 'lucide-vue-next'

const { t } = useAppI18n()
const route = useRoute()

const {
    // State
    product,
    reviews,
    relatedProducts,
    loading,
    error,
    selectedImageIndex,
    quantity,
    activeTab,
    reviewsTotal,
    hasMoreReviews,

    // Computed
    selectedImage,
    discountAmount,
    discountPercentage,
    averageRating,
    isInStock,
    canAddToCart,

    // Methods
    selectImage,
    updateQuantity,
    setActiveTab,
    addToCart,
    addToWishlist,
    loadMoreReviews,
    initialize,
} = useProductDetail()

// Methods
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

const handleAddToCart = (product: ProductListItem) => {
    console.log('Add to cart:', product)
    // Implement add to cart functionality
}

// Lifecycle
onMounted(() => {
    initialize()
})
</script>
