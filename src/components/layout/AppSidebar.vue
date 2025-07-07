<template>
    <!-- Overlay for mobile -->
    <div v-if="isOpen" class="fixed inset-0 z-30 bg-black/50 lg:hidden" @click="$emit('close')" />

    <aside
        class="w-64 border-r border-border bg-background transition-transform duration-300 ease-in-out fixed left-0 z-40 lg:absolute lg:left-0 rounded-lg shadow-lg"
        :class="{
            '-translate-x-full lg:translate-x-0': !isOpen,
            'translate-x-0': isOpen,
        }"
        :style="{
            height: sidebarHeight,
            '--sidebar-height': 'calc(100vh - 3.5rem)',
            top: '4.5rem',
            marginTop: '0.5rem',
            marginBottom: '1rem',
        }"
    >
        <div class="flex h-full flex-col overflow-y-auto px-3 py-4 pb-8 pt-6 scrollbar-thin">
            <!-- Categories Section -->
            <div class="mb-6">
                <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
                    {{ t('navigation.categories') }}
                </h2>
                <div v-if="loading" class="px-4">
                    <div class="animate-pulse space-y-2">
                        <div v-for="i in 6" :key="i" class="h-8 bg-muted rounded"></div>
                    </div>
                </div>
                <div v-else class="space-y-1">
                    <!-- All Products Link -->
                    <SidebarItem
                        to="/products"
                        icon="Package"
                        :label="t('products.allProducts')"
                        :active="route.name === 'products' && !route.params.slug"
                    />

                    <!-- Category Links -->
                    <SidebarItem
                        v-for="category in categories"
                        :key="category.slug"
                        :to="`/categories/${category.slug}`"
                        :icon="category.icon"
                        :label="category.name"
                        :badge="category.count"
                        :active="isCurrentCategory(category.slug)"
                    />
                </div>
            </div>

            <!-- Quick Links Section -->
            <div class="mb-6">
                <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
                    {{ t('common.quickLinks') }}
                </h2>
                <div class="space-y-1">
                    <SidebarItem to="/products" icon="Package" :label="t('navigation.products')" />
                    <SidebarItem
                        to="/cart"
                        icon="ShoppingCart"
                        :label="t('navigation.cart')"
                        :badge="cartItemsCount"
                    />
                    <SidebarItem
                        to="/account/wishlist"
                        icon="Heart"
                        :label="t('account.wishlist')"
                        :badge="wishlistItemsCount"
                    />
                    <SidebarItem to="/account/orders" icon="Package" :label="t('account.orders')" />
                </div>
            </div>

            <!-- Price Filter -->
            <div class="mb-6">
                <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
                    {{ t('products.priceRange') }}
                </h2>
                <div class="px-4 space-y-4">
                    <!-- Price Range Display -->
                    <div class="flex justify-between text-sm text-muted-foreground">
                        <span>{{ formatCurrency(priceRange[0]) }}</span>
                        <span>{{ formatCurrency(priceRange[1]) }}</span>
                    </div>

                    <!-- Price Slider -->
                    <div class="py-2">
                        <Slider
                            v-model="priceRange"
                            :min="0"
                            :max="1000"
                            :step="10"
                            class="w-full"
                            @update:model-value="onPriceRangeChange"
                        />
                    </div>
                    <!-- Current Selected Range -->
                    <div class="text-center text-sm text-muted-foreground">
                        {{ formatCurrency(priceRange[0]) }} - {{ formatCurrency(priceRange[1]) }}
                    </div>
                </div>
            </div>

            <!-- Brand Filter -->
            <div class="mb-6">
                <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
                    {{ t('products.brands') }}
                </h2>
                <div v-if="loading" class="px-4">
                    <div class="animate-pulse space-y-2">
                        <div v-for="i in 5" :key="i" class="h-6 bg-muted rounded"></div>
                    </div>
                </div>
                <div v-else class="px-4 space-y-2">
                    <div
                        v-for="brand in brands"
                        :key="brand.id"
                        class="flex items-center space-x-2"
                    >
                        <Checkbox
                            :id="`brand-${brand.id}`"
                            :model-value="selectedBrands.includes(brand.name)"
                            @update:model-value="
                                (checked: boolean) => {
                                    console.log(
                                        'Checkbox clicked:',
                                        checked,
                                        'for brand:',
                                        brand.name,
                                    )
                                    if (checked) {
                                        selectedBrands.push(brand.name)
                                        console.log(
                                            'Added brand, current selectedBrands:',
                                            selectedBrands,
                                        )
                                    } else {
                                        const index = selectedBrands.indexOf(brand.name)
                                        if (index > -1) {
                                            selectedBrands.splice(index, 1)
                                            console.log(
                                                'Removed brand, current selectedBrands:',
                                                selectedBrands,
                                            )
                                        }
                                    }
                                    handleBrandChange()
                                }
                            "
                        />
                        <Label :for="`brand-${brand.id}`" class="text-sm cursor-pointer flex-1">
                            {{ brand.name }}
                            <span class="text-muted-foreground">({{ brand.count }})</span>
                        </Label>
                    </div>
                </div>
            </div>

            <!-- Rating Filter -->
            <div class="mb-6">
                <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
                    {{ t('products.rating') }}
                </h2>
                <div class="px-4">
                    <RadioGroup
                        :model-value="selectedRating?.toString()"
                        @update:model-value="
                            (value: string | null) => {
                                selectedRating = value ? Number(value) : null
                                handleRatingChange()
                            }
                        "
                        class="space-y-2"
                    >
                        <div
                            v-for="rating in [5, 4, 3, 2, 1]"
                            :key="rating"
                            class="flex items-center space-x-2"
                        >
                            <RadioGroupItem :id="`rating-${rating}`" :value="rating.toString()" />
                            <Label
                                :for="`rating-${rating}`"
                                class="text-sm cursor-pointer flex items-center space-x-1 flex-1"
                            >
                                <div class="flex items-center space-x-1">
                                    <div class="flex">
                                        <Star
                                            v-for="i in 5"
                                            :key="i"
                                            class="w-3 h-3"
                                            :class="{
                                                'text-yellow-400 fill-yellow-400': i <= rating,
                                                'text-muted-foreground': i > rating,
                                            }"
                                        />
                                    </div>
                                    <span>{{ t('products.andUp') }}</span>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <!-- Apply Changes Button (shown when there are pending changes) -->
            <div v-if="hasPendingChanges" class="px-4 mb-4">
                <Button @click="applyAllFilters" class="w-full" variant="default">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                        {{ t('common.applyChanges') }}
                    </div>
                </Button>
            </div>

            <!-- Clear Filters -->
            <div class="px-4 mb-4">
                <Button @click="clearFilters" variant="outline" class="w-full">
                    {{ t('common.clearFilters') }}
                </Button>
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useCart } from '@/composables/useCart'
import { useWishlist } from '@/composables/useWishlist'
import { productsService } from '@/services/products.service'
import SidebarItem from './SidebarItem.vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Star } from 'lucide-vue-next'
import type { ProductCategory, ProductBrand } from '@/types/products'

interface Props {
    isOpen: boolean
    maxHeight?: string
}

interface Category {
    id: string
    slug: string
    name: string
    icon: string
    count: number
}

interface Brand {
    id: string
    name: string
    count: number
}

const props = withDefaults(defineProps<Props>(), {
    maxHeight: 'calc(100vh - 3.5rem)',
})

defineEmits<{
    close: []
}>()

const router = useRouter()
const route = useRoute()
const { t, formatCurrency } = useAppI18n()
const { totalQuantity } = useCart()
const { wishlistCount } = useWishlist()

// Computed
const sidebarHeight = computed(() => {
    // On desktop (lg+), use 100% of parent container
    // On mobile, use viewport height minus header
    return 'calc(100vh - 3.5rem)'
})

// State
const priceFilter = ref({
    min: undefined as number | undefined,
    max: undefined as number | undefined,
})

// Price range for slider (default range 0-1000)
const priceRange = ref<[number, number]>([0, 1000])

const selectedBrands = ref<string[]>([])
const selectedRating = ref<number | null>(null)

// Track pending changes for better UX
const hasPendingChanges = ref(false)
let priceChangeTimeout: ReturnType<typeof setTimeout> | null = null

// Data from API
const categories = ref<ProductCategory[]>([])
const brands = ref<ProductBrand[]>([])
const loading = ref(false)

// Load data from service
const loadData = async () => {
    loading.value = true
    try {
        const data = await productsService.getCategoriesWithProductCount()
        categories.value = data.categories
        brands.value = data.brands
    } catch (error) {
        console.error('Failed to load sidebar data:', error)
    } finally {
        loading.value = false
    }
}

// Computed
const cartItemsCount = computed(() => {
    return totalQuantity.value
})

const wishlistItemsCount = computed(() => {
    return wishlistCount.value
})

// Methods for improved UX
const debounceApplyFilters = () => {
    hasPendingChanges.value = true

    // Clear existing timeout
    if (priceChangeTimeout) {
        clearTimeout(priceChangeTimeout)
    }

    // Set new timeout for debounced apply
    priceChangeTimeout = setTimeout(() => {
        applyAllFilters()
        hasPendingChanges.value = false
    }, 800) // 800ms delay
}

const applyAllFilters = () => {
    const query = { ...route.query }

    // Apply price filter
    if (priceRange.value[0] > 0) {
        query.minPrice = priceRange.value[0].toString()
    } else {
        delete query.minPrice
    }

    if (priceRange.value[1] < 1000) {
        query.maxPrice = priceRange.value[1].toString()
    } else {
        delete query.maxPrice
    }

    // Apply brand filter
    if (selectedBrands.value.length > 0) {
        query.brand = selectedBrands.value.join(',')
        console.log('Applying brand filter:', query.brand)
    } else {
        delete query.brand
    }

    // Apply rating filter
    if (selectedRating.value) {
        query.rating = selectedRating.value.toString()
    } else {
        delete query.rating
    }

    // Clear pending state
    hasPendingChanges.value = false
    if (priceChangeTimeout) {
        clearTimeout(priceChangeTimeout)
    }

    console.log('Final query before router push:', query)
    router.push({ query })
}

const onPriceRangeChange = (newRange: number[] | undefined) => {
    if (!newRange || newRange.length < 2) return

    // Update priceFilter based on slider values
    priceFilter.value.min = newRange[0] > 0 ? newRange[0] : undefined
    priceFilter.value.max = newRange[1] < 1000 ? newRange[1] : undefined

    // Auto-apply with debounce for better UX
    debounceApplyFilters()
}

const handleBrandChange = () => {
    // Auto-apply immediately for checkbox changes
    setTimeout(() => {
        applyAllFilters()
    }, 100) // Small delay to ensure state is updated
}

const handleRatingChange = () => {
    // Auto-apply immediately for radio changes with no delay
    applyAllFilters()
}

const clearFilters = () => {
    priceFilter.value.min = undefined
    priceFilter.value.max = undefined
    priceRange.value = [0, 1000]
    selectedBrands.value = []
    selectedRating.value = null
    hasPendingChanges.value = false

    // Clear any pending timeouts
    if (priceChangeTimeout) {
        clearTimeout(priceChangeTimeout)
    }

    // Clear query parameters
    router.push({ query: {} })
}

const isCurrentCategory = (categorySlug: string) => {
    // Check if current route is a category route with this slug
    return route.name === 'category-products' && route.params.slug === categorySlug
}

// Initialize data
onMounted(() => {
    loadData()
    initializeFiltersFromQuery()
})

// Initialize filters from URL query parameters
const initializeFiltersFromQuery = () => {
    // Price range
    const minPrice = route.query.minPrice ? Number(route.query.minPrice) : 0
    const maxPrice = route.query.maxPrice ? Number(route.query.maxPrice) : 1000

    priceRange.value = [minPrice, maxPrice]
    priceFilter.value.min = minPrice > 0 ? minPrice : undefined
    priceFilter.value.max = maxPrice < 1000 ? maxPrice : undefined

    // Rating
    if (route.query.rating) {
        selectedRating.value = Number(route.query.rating)
    }

    // Brands
    if (route.query.brand) {
        selectedBrands.value = (route.query.brand as string).split(',')
    }
}
</script>

<style scoped>
/* Ensure sidebar height is properly constrained on desktop */
@media (min-width: 1024px) {
    aside {
        height: calc(100% - 3rem) !important;
        max-height: calc(100% - 3rem) !important;
        margin-bottom: 2rem;
        margin-top: 1rem;
        top: 0 !important;
        border-radius: 0.75rem;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
}

/* Mobile positioning and styling */
@media (max-width: 1023px) {
    aside {
        height: calc(100vh - 6rem) !important; /* Space for header and bottom margin */
        top: 4.5rem !important;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        border-radius: 0 0.75rem 0.75rem 0;
        box-shadow:
            4px 0 15px -3px rgba(0, 0, 0, 0.1),
            2px 0 6px -2px rgba(0, 0, 0, 0.05);
        max-height: calc(100vh - 6rem);
    }
}

/* Additional spacing for sidebar content */
.flex.h-full.flex-col {
    padding-bottom: 1rem;
}

/* Enhance shadow on hover for better interaction */
aside:hover {
    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.3s ease-in-out;
}

/* Dark mode specific styling */
.dark aside {
    /* Enhanced contrast for dark mode */
    background: oklch(0.2 0.04 145);
    border-color: oklch(0.3 0.05 148);
}

/* Dark mode mobile sidebar - brighter background */
@media (max-width: 1023px) {
    .dark aside {
        background: oklch(0.22 0.045 145); /* Brighter on mobile */
        box-shadow:
            4px 0 20px -3px rgba(0, 0, 0, 0.3),
            2px 0 10px -2px rgba(0, 0, 0, 0.2);
    }
}

/* Dark mode desktop sidebar */
@media (min-width: 1024px) {
    .dark aside {
        background: oklch(0.19 0.035 148); /* Slightly darker on desktop */
        box-shadow:
            0 15px 25px -5px rgba(0, 0, 0, 0.15),
            0 8px 10px -5px rgba(0, 0, 0, 0.08);
    }
}

/* Dark mode overlay */
.dark .fixed.inset-0.bg-black\/50 {
    background: rgba(0, 0, 0, 0.7); /* Darker overlay in dark mode */
}
</style>
