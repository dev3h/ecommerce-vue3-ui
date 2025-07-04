<template>
    <div class="min-h-screen bg-background">
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 py-6 lg:py-8">
            <div class="max-w-6xl mx-auto">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                        {{ t('account.wishlist') }}
                    </h1>
                    <p class="text-muted-foreground">
                        {{ t('wishlist.subtitle') }}
                    </p>
                    <div v-if="!isEmpty" class="mt-4 flex items-center justify-between">
                        <p class="text-sm text-muted-foreground">
                            {{ t('wishlist.itemCount', { count: wishlistCount }) }}
                        </p>
                        <Button
                            @click="handleClearWishlist"
                            variant="outline"
                            size="sm"
                            :disabled="isProcessing"
                        >
                            {{ t('wishlist.clearAll') }}
                        </Button>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="flex justify-center py-12">
                    <div
                        class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
                    ></div>
                </div>

                <!-- Empty Wishlist -->
                <div v-else-if="isEmpty" class="text-center py-16 lg:py-24">
                    <div class="mb-8">
                        <div
                            class="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center"
                        >
                            <Heart class="w-10 h-10 lg:w-12 lg:h-12 text-muted-foreground" />
                        </div>
                        <h2 class="text-xl lg:text-2xl font-semibold text-foreground mb-3">
                            {{ t('wishlist.emptyWishlist') }}
                        </h2>
                        <p class="text-muted-foreground mb-8 max-w-md mx-auto">
                            {{ t('wishlist.emptyWishlistDescription') }}
                        </p>
                    </div>
                    <Button
                        @click="handleContinueShopping"
                        class="inline-flex items-center gap-2"
                        size="lg"
                    >
                        <ShoppingBag class="w-4 h-4" />
                        {{ t('wishlist.startShopping') }}
                    </Button>
                </div>

                <!-- Wishlist Content -->
                <div v-else class="space-y-6">
                    <!-- Action Bar -->
                    <div
                        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border"
                    >
                        <div class="flex items-center gap-4">
                            <h2 class="text-lg font-semibold text-foreground">
                                {{ t('wishlist.yourWishlist') }}
                            </h2>
                            <div class="text-sm text-muted-foreground">
                                ({{ wishlistCount }} {{ t('common.items') }})
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <!-- View Mode Toggle -->
                            <div class="flex border border-border rounded-lg">
                                <Button
                                    @click="viewMode = 'grid'"
                                    :variant="viewMode === 'grid' ? 'default' : 'ghost'"
                                    size="sm"
                                    class="rounded-r-none"
                                >
                                    <Grid3X3 class="w-4 h-4" />
                                </Button>
                                <Button
                                    @click="viewMode = 'list'"
                                    :variant="viewMode === 'list' ? 'default' : 'ghost'"
                                    size="sm"
                                    class="rounded-l-none"
                                >
                                    <List class="w-4 h-4" />
                                </Button>
                            </div>

                            <!-- Sort Dropdown -->
                            <Select v-model="sortBy">
                                <SelectTrigger class="w-40">
                                    <SelectValue :placeholder="t('wishlist.sortBy')" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">{{
                                        t('wishlist.newest')
                                    }}</SelectItem>
                                    <SelectItem value="oldest">{{
                                        t('wishlist.oldest')
                                    }}</SelectItem>
                                    <SelectItem value="name">{{ t('wishlist.name') }}</SelectItem>
                                    <SelectItem value="price-low">{{
                                        t('wishlist.priceLowToHigh')
                                    }}</SelectItem>
                                    <SelectItem value="price-high">{{
                                        t('wishlist.priceHighToLow')
                                    }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <!-- Wishlist Items -->
                    <div class="space-y-4">
                        <!-- Grid View -->
                        <div
                            v-if="viewMode === 'grid'"
                            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                        >
                            <WishlistGridCard
                                v-for="item in sortedWishlistItems"
                                :key="item.id"
                                :item="item"
                                :is-processing="isProcessing"
                                @add-to-cart="handleAddToCart"
                                @remove-from-wishlist="handleRemoveFromWishlist"
                            />
                        </div>

                        <!-- List View -->
                        <div v-else class="space-y-4">
                            <WishlistListCard
                                v-for="item in sortedWishlistItems"
                                :key="item.id"
                                :item="item"
                                :is-processing="isProcessing"
                                @add-to-cart="handleAddToCart"
                                @remove-from-wishlist="handleRemoveFromWishlist"
                            />
                        </div>
                    </div>

                    <!-- Bulk Actions -->
                    <div v-if="!isEmpty" class="pt-6 border-t border-border">
                        <div class="flex flex-col sm:flex-row gap-4 justify-between">
                            <Button
                                @click="handleContinueShopping"
                                variant="outline"
                                class="inline-flex items-center justify-center gap-2"
                            >
                                <ArrowLeft class="w-4 h-4" />
                                {{ t('wishlist.continueShopping') }}
                            </Button>
                            <div class="flex gap-2">
                                <Button
                                    @click="handleAddAllToCart"
                                    :disabled="isProcessing || !hasInStockItems"
                                    class="inline-flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart class="w-4 h-4" />
                                    {{ t('wishlist.addAllToCart') }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Clear Confirmation Dialog -->
        <ConfirmDialog
            v-model:open="showClearDialog"
            :title="t('wishlist.clearWishlist')"
            :description="t('wishlist.clearConfirmation')"
            :confirm-text="t('wishlist.clearAll')"
            :cancel-text="t('common.cancel')"
            variant="destructive"
            :loading="isProcessing"
            @confirm="handleClearConfirm"
            @cancel="handleClearCancel"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useCart } from '@/composables/useCart'
import { useToast } from '@/composables/useToast'
import { useWishlistStore } from '@/stores/wishlist'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import WishlistGridCard from '@/components/wishlist/WishlistGridCard.vue'
import WishlistListCard from '@/components/wishlist/WishlistListCard.vue'
import { Heart, ShoppingBag, ShoppingCart, ArrowLeft, Grid3X3, List } from 'lucide-vue-next'
import type { WishlistItem } from '@/stores/wishlist'

const { t } = useAppI18n()
const router = useRouter()
const { addToCart } = useCart()
const { success, error: showError } = useToast()
const wishlistStore = useWishlistStore()

// Local state
const isProcessing = ref(false)
const showClearDialog = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('newest')

// Computed
const wishlistItems = computed(() => wishlistStore.userWishlist)
const wishlistCount = computed(() => wishlistStore.wishlistCount)
const isEmpty = computed(() => wishlistStore.isEmpty)
const isLoading = computed(() => wishlistStore.isLoading)

const hasInStockItems = computed(() => {
    return wishlistItems.value.some((item) => item.inStock !== false)
})

const sortedWishlistItems = computed(() => {
    const items = [...wishlistItems.value]

    switch (sortBy.value) {
        case 'newest':
            return items.sort(
                (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
            )
        case 'oldest':
            return items.sort(
                (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
            )
        case 'name':
            return items.sort((a, b) => a.name.localeCompare(b.name))
        case 'price-low':
            return items.sort((a, b) => a.price - b.price)
        case 'price-high':
            return items.sort((a, b) => b.price - a.price)
        default:
            return items
    }
})

// Methods
const handleAddToCart = async (item: WishlistItem) => {
    if (isProcessing.value) return

    try {
        addToCart(
            {
                id: item.productId,
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice,
                image: item.image,
                category: item.category,
                description: item.description,
            },
            1,
        )

        success(t('wishlist.addedToCart'))
    } catch (err: any) {
        console.error('Failed to add to cart:', err)
        showError(err.message || t('wishlist.addToCartError'))
    }
}

const handleRemoveFromWishlist = async (item: WishlistItem) => {
    if (isProcessing.value) return

    try {
        wishlistStore.removeFromWishlist(item.productId)
        success(t('wishlist.removedFromWishlist'))
    } catch (err: any) {
        console.error('Failed to remove from wishlist:', err)
        showError(err.message || t('wishlist.removeError'))
    }
}

const handleAddAllToCart = async () => {
    if (isProcessing.value || !hasInStockItems.value) return

    isProcessing.value = true
    try {
        let addedCount = 0

        for (const item of wishlistItems.value) {
            if (item.inStock !== false) {
                addToCart(
                    {
                        id: item.productId,
                        name: item.name,
                        price: item.price,
                        originalPrice: item.originalPrice,
                        image: item.image,
                        category: item.category,
                        description: item.description,
                    },
                    1,
                )
                addedCount++
            }
        }

        if (addedCount > 0) {
            success(t('wishlist.addedAllToCart', { count: addedCount }))
            setTimeout(() => {
                router.push('/cart')
            }, 1500)
        }
    } catch (err: any) {
        console.error('Failed to add all to cart:', err)
        showError(err.message || t('wishlist.addAllToCartError'))
    } finally {
        isProcessing.value = false
    }
}

const handleClearWishlist = () => {
    showClearDialog.value = true
}

const handleClearConfirm = async () => {
    isProcessing.value = true
    showClearDialog.value = false

    try {
        wishlistStore.clearWishlist()
        success(t('wishlist.clearedWishlist'))
    } catch (err: any) {
        console.error('Failed to clear wishlist:', err)
        showError(err.message || t('wishlist.clearError'))
    } finally {
        isProcessing.value = false
    }
}

const handleClearCancel = () => {
    showClearDialog.value = false
}

const handleContinueShopping = () => {
    router.push('/products')
}

// Persistence
const saveViewMode = () => {
    localStorage.setItem('wishlist_view_mode', viewMode.value)
}

const loadViewMode = () => {
    const saved = localStorage.getItem('wishlist_view_mode')
    if (saved === 'grid' || saved === 'list') {
        viewMode.value = saved
    }
}

// Watch for view mode changes
watch(viewMode, saveViewMode)

// Lifecycle
onMounted(() => {
    loadViewMode()
    wishlistStore.initializeWishlist()
})
</script>

<style scoped>
/* Custom styles for wishlist */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
