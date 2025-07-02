<template>
    <div class="min-h-screen bg-background">
        <div class="px-3 sm:px-4 md:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div class="flex gap-6 py-4 md:py-6">
                    <!-- Sidebar -->
                    <AppSidebar
                        :is-open="sidebarOpen"
                        @close="sidebarOpen = false"
                        class="hidden lg:block"
                    />

                    <!-- Main Content -->
                    <main class="flex-1">
                        <!-- Header Section -->
                        <div class="mb-6">
                            <!-- Category Banner -->
                            <div
                                v-if="filters.category"
                                class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg p-4 sm:p-6 mb-6 border border-border"
                            >
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-12 h-12 sm:w-16 sm:h-16 bg-background dark:bg-card rounded-lg flex items-center justify-center text-2xl sm:text-3xl shadow-sm border border-border"
                                    >
                                        {{ getCategoryIcon(filters.category) }}
                                    </div>
                                    <div>
                                        <h1
                                            class="text-xl sm:text-2xl md:text-3xl font-bold text-foreground"
                                        >
                                            {{ getCategoryName(filters.category) }}
                                        </h1>
                                        <p class="text-sm sm:text-base text-muted-foreground mt-1">
                                            {{ totalProducts }}
                                            {{ t('navigation.products').toLowerCase() }}
                                            {{ t('common.found') }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Products Header -->
                            <div v-else class="mb-6">
                                <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                                    {{ t('products.allProducts') }}
                                </h1>
                                <p class="text-muted-foreground">
                                    {{ t('products.discoverProducts') }}
                                </p>
                            </div>

                            <!-- Toolbar -->
                            <div
                                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
                            >
                                <!-- Left: Results count and filters -->
                                <div class="flex items-center gap-3 flex-wrap">
                                    <Button
                                        @click="sidebarOpen = true"
                                        variant="outline"
                                        class="lg:hidden flex items-center gap-2"
                                    >
                                        <Filter class="w-4 h-4" />
                                        {{ t('products.filters') }}
                                        <span
                                            v-if="activeFiltersCount > 0"
                                            class="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full"
                                        >
                                            {{ activeFiltersCount }}
                                        </span>
                                    </Button>

                                    <div class="text-sm text-muted-foreground">
                                        <span v-if="loading.products">{{
                                            t('products.loading')
                                        }}</span>
                                        <span v-else-if="totalProducts > 0">
                                            {{ t('common.showing') }}
                                            {{ (currentPage - 1) * productsPerPage + 1 }}-{{
                                                Math.min(
                                                    currentPage * productsPerPage,
                                                    totalProducts,
                                                )
                                            }}
                                            {{ t('common.of') }} {{ totalProducts }}
                                            {{ t('navigation.products').toLowerCase() }}
                                        </span>
                                        <span v-else>{{ t('products.noProductsFound') }}</span>
                                    </div>

                                    <Button
                                        v-if="activeFiltersCount > 0"
                                        @click="clearFilters"
                                        variant="ghost"
                                        size="sm"
                                        class="text-primary hover:text-primary/80"
                                    >
                                        {{ t('products.clearAllFilters') }}
                                    </Button>
                                </div>

                                <!-- Right: Sort and view options -->
                                <div class="flex items-center gap-3">
                                    <!-- Sort -->
                                    <div class="flex items-center gap-2">
                                        <Label
                                            for="sort-select"
                                            class="text-sm text-muted-foreground hidden sm:block"
                                        >
                                            {{ t('products.sortBy') }}:
                                        </Label>
                                        <Select
                                            :model-value="sortBy"
                                            @update:model-value="handleSortChange"
                                        >
                                            <SelectTrigger class="w-[180px]">
                                                <SelectValue :placeholder="t('products.sortBy')">
                                                    {{
                                                        sortOptions.find(
                                                            (opt) => opt.value === sortBy,
                                                        )?.label
                                                    }}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    v-for="option in sortOptions"
                                                    :key="option.value"
                                                    :value="option.value"
                                                >
                                                    {{ option.label }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <!-- View Toggle -->
                                    <div
                                        class="flex items-center border border-border rounded-md overflow-hidden"
                                    >
                                        <Button
                                            @click="setViewMode('grid')"
                                            variant="ghost"
                                            size="sm"
                                            :class="[
                                                'rounded-none',
                                                viewMode === 'grid'
                                                    ? 'bg-primary text-primary-foreground hover:bg-primary'
                                                    : 'hover:bg-accent',
                                            ]"
                                        >
                                            <Grid3X3 class="w-4 h-4" />
                                        </Button>
                                        <Button
                                            @click="setViewMode('list')"
                                            variant="ghost"
                                            size="sm"
                                            :class="[
                                                'rounded-none',
                                                viewMode === 'list'
                                                    ? 'bg-primary text-primary-foreground hover:bg-primary'
                                                    : 'hover:bg-accent',
                                            ]"
                                        >
                                            <List class="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Products Grid/List -->
                        <div class="mb-8">
                            <!-- Loading State -->
                            <div
                                v-if="loading.products"
                                class="flex justify-center items-center h-64"
                            >
                                <div
                                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
                                ></div>
                            </div>

                            <!-- Error State -->
                            <div v-else-if="error" class="text-center py-16">
                                <div class="text-red-500 mb-4">
                                    <AlertCircle class="w-12 h-12 mx-auto mb-2" />
                                    <p class="text-lg font-medium">{{ error }}</p>
                                </div>
                                <Button
                                    @click="loadProducts(currentPage)"
                                    class="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {{ t('common.tryAgain') }}
                                </Button>
                            </div>

                            <!-- Empty State -->
                            <div v-else-if="!hasProducts" class="text-center py-16">
                                <div class="text-muted-foreground mb-4">
                                    <Package class="w-12 h-12 mx-auto mb-2" />
                                    <p class="text-lg font-medium">
                                        {{ t('products.noProductsFound') }}
                                    </p>
                                    <p class="text-sm">
                                        {{ t('products.tryAdjustingFilters') }}
                                    </p>
                                </div>
                                <Button
                                    v-if="activeFiltersCount > 0"
                                    @click="clearFilters"
                                    class="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {{ t('products.clearAllFilters') }}
                                </Button>
                            </div>

                            <!-- Products Grid -->
                            <div
                                v-else-if="viewMode === 'grid'"
                                class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                            >
                                <ProductGridCard
                                    v-for="product in products"
                                    :key="product.id"
                                    :product="product"
                                    @add-to-cart="handleAddToCart"
                                    @add-to-wishlist="handleAddToWishlist"
                                />
                            </div>

                            <!-- Products List -->
                            <div v-else class="space-y-4">
                                <ProductListCard
                                    v-for="product in products"
                                    :key="product.id"
                                    :product="product"
                                    @add-to-cart="handleAddToCart"
                                    @add-to-wishlist="handleAddToWishlist"
                                />
                            </div>
                        </div>

                        <!-- Pagination -->
                        <ProductPagination
                            v-if="hasProducts && totalPages > 1"
                            :current-page="currentPage"
                            :total-pages="totalPages"
                            :total-products="totalProducts"
                            :products-per-page="productsPerPage"
                            @page-change="goToPage"
                            @prev-page="prevPage"
                            @next-page="nextPage"
                        />
                    </main>
                </div>
            </div>
        </div>

        <!-- Mobile Sidebar -->
        <AppSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" class="lg:hidden" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import { useAppI18n } from '@/composables/useI18n'
import type { ProductListItem } from '@/types/products'

// Components
import AppSidebar from '@/components/layout/AppSidebar.vue'
import ProductGridCard from '@/components/products/ProductGridCard.vue'
import ProductListCard from '@/components/products/ProductListCard.vue'
import ProductPagination from '@/components/products/ProductPagination.vue'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

// Icons
import { Filter, Grid3X3, List, AlertCircle, Package } from 'lucide-vue-next'

// Composables
const {
    products,
    categories,
    loading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    productsPerPage,
    filters,
    sortBy,
    sortOptions,
    viewMode,
    hasProducts,
    activeFiltersCount,
    loadProducts,
    clearFilters,
    setSortBy,
    setViewMode,
    goToPage,
    nextPage,
    prevPage,
    initialize,
} = useProducts()

const { t } = useAppI18n()
const { addToCart } = useCart()

// Local state
const sidebarOpen = ref(false)

// Methods
const handleAddToCart = (product: ProductListItem) => {
    addToCart(product, 1)
    console.log('Added to cart:', product)
}

const handleAddToWishlist = (product: ProductListItem) => {
    console.log('Add to wishlist:', product)
    // Implement add to wishlist functionality
}

const handleSortChange = (value: any) => {
    console.log('Sort changing to:', value, 'type:', typeof value)
    if (value && typeof value === 'string') {
        setSortBy(value)
    }
}

const getCategoryName = (slug: string) => {
    const category = categories.value.categories.find((cat) => cat.slug === slug)
    return category?.name || slug
}

const getCategoryIcon = (slug: string) => {
    const category = categories.value.categories.find((cat) => cat.slug === slug)
    return category?.icon || '📦'
}

// Lifecycle
onMounted(() => {
    initialize()
})
</script>
