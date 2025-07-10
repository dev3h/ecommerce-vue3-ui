<template>
    <!-- Header Section -->
    <div class="mb-6">
        <!-- Category Banner -->
        <div
            v-if="filters.category"
            class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg p-4 sm:p-6 mb-6 border border-border"
        >
            <div class="flex items-center gap-4">
                <div
                    class="w-12 h-12 sm:w-16 sm:h-16 bg-background dark:bg-card rounded-lg flex items-center justify-center shadow-sm border border-border"
                >
                    <IconRenderer :icon-name="getCategoryIcon(filters.category)" size="lg" />
                </div>
                <div>
                    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
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
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <!-- Left: Results count and filters -->
            <div class="flex items-center gap-3 flex-wrap">
                <div class="text-sm text-muted-foreground">
                    <span v-if="loading.products">{{ t('products.loading') }}</span>
                    <span v-else-if="totalProducts > 0">
                        {{ t('common.showing') }}
                        {{ (currentPage - 1) * productsPerPage + 1 }}-{{
                            Math.min(currentPage * productsPerPage, totalProducts)
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

            <!-- Right: Sort and View Options -->
            <div class="flex items-center gap-3">
                <!-- Sort Select -->
                <div class="flex items-center gap-2">
                    <span class="text-sm font-medium hidden sm:block">{{
                        t('products.sortBy')
                    }}</span>
                    <Select :value="sortBy" @update:value="handleSortChange">
                        <SelectTrigger class="w-48">
                            <SelectValue :placeholder="t('products.sortBy')" />
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

                <!-- View Mode Toggle -->
                <div class="flex border border-border rounded-lg overflow-hidden">
                    <Button
                        @click="setViewMode('grid')"
                        variant="ghost"
                        size="sm"
                        :class="{
                            'bg-accent text-accent-foreground': viewMode === 'grid',
                            'hover:bg-accent/50': viewMode !== 'grid',
                        }"
                    >
                        <Grid3X3 class="w-4 h-4" />
                    </Button>
                    <Button
                        @click="setViewMode('list')"
                        variant="ghost"
                        size="sm"
                        :class="{
                            'bg-accent text-accent-foreground': viewMode === 'list',
                            'hover:bg-accent/50': viewMode !== 'list',
                        }"
                    >
                        <List class="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <!-- Content Section -->
    <div>
        <!-- Loading State -->
        <div v-if="loading.products" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
            <AlertCircle class="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h3 class="text-lg font-medium text-foreground mb-2">
                {{ t('common.error') }}
            </h3>
            <p class="text-muted-foreground mb-4">{{ error }}</p>
            <Button @click="loadProducts">{{ t('common.tryAgain') }}</Button>
        </div>

        <!-- No Products State -->
        <div v-else-if="!hasProducts" class="text-center py-16">
            <Package class="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 class="text-lg font-medium text-foreground mb-2">
                {{ t('products.noProductsFound') }}
            </h3>
            <p class="text-muted-foreground mb-4">
                {{ t('products.tryDifferentFilters') }}
            </p>
            <Button v-if="activeFiltersCount > 0" @click="clearFilters">
                {{ t('products.clearAllFilters') }}
            </Button>
        </div>

        <!-- Products Grid/List -->
        <div v-else>
            <!-- Grid View -->
            <div
                v-if="viewMode === 'grid'"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
                <ProductGridCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    @add-to-cart="handleAddToCart"
                />
            </div>

            <!-- List View -->
            <div v-else class="space-y-4">
                <ProductListCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    @add-to-cart="handleAddToCart"
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
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCart } from '@/composables/useCart'
import { useAppI18n } from '@/composables/useI18n'
import type { ProductListItem } from '@/types/products'

// Components
import ProductGridCard from '@/components/products/ProductGridCard.vue'
import ProductListCard from '@/components/products/ProductListCard.vue'
import ProductPagination from '@/components/products/ProductPagination.vue'
import IconRenderer from '@/components/admin/categories/IconRenderer.vue'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

// Icons
import { Grid3X3, List, AlertCircle, Package } from 'lucide-vue-next'

// Define props for category slug from route
interface Props {
    slug?: string
}

const props = defineProps<Props>()
const route = useRoute()

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
    clearCategoryFilter,
    setSortBy,
    setViewMode,
    goToPage,
    nextPage,
    prevPage,
    initialize,
    applyFilters,
} = useProducts()

const { t } = useAppI18n()
const { addToCart } = useCart()

// Methods
const handleAddToCart = (product: ProductListItem) => {
    addToCart(product, 1)
    console.log('Added to cart:', product)
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
    return category?.icon || 'Package'
}

// Watch for route changes to handle category filtering
watch(
    () => [route.name, route.params.slug],
    ([newRouteName, newSlug]) => {
        if (newRouteName === 'category-products' && newSlug) {
            // Apply category filter when slug is provided
            applyFilters({ category: newSlug as string })
        } else if (newRouteName === 'products' && !newSlug) {
            // Clear category filter when on general products page
            clearCategoryFilter()
        }
    },
    { immediate: true },
)

// Lifecycle
onMounted(() => {
    initialize()
})
</script>
