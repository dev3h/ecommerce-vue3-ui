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
                    <SidebarItem
                        v-for="category in categories"
                        :key="category.slug"
                        :to="`/categories/${category.slug}`"
                        :icon="category.icon"
                        :label="category.name"
                        :badge="category.count"
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
                        :badge="wishlistCount"
                    />
                    <SidebarItem to="/account/orders" icon="Package" :label="t('account.orders')" />
                </div>
            </div>

            <!-- Price Filter -->
            <div class="mb-6">
                <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">
                    {{ t('products.priceRange') }}
                </h2>
                <div class="px-4 space-y-3">
                    <div class="space-y-2">
                        <Label for="min-price">{{ t('products.minPrice') }}</Label>
                        <Input
                            id="min-price"
                            v-model.number="priceFilter.min"
                            type="number"
                            :placeholder="formatCurrency(0)"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label for="max-price">{{ t('products.maxPrice') }}</Label>
                        <Input
                            id="max-price"
                            v-model.number="priceFilter.max"
                            type="number"
                            :placeholder="formatCurrency(1000)"
                        />
                    </div>
                    <Button @click="applyPriceFilter" class="w-full">
                        {{ t('common.apply') }}
                    </Button>
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
                            :checked="selectedBrands.includes(brand.id)"
                            @update:checked="
                                (checked: boolean) => {
                                    if (checked) {
                                        selectedBrands.push(brand.id)
                                    } else {
                                        const index = selectedBrands.indexOf(brand.id)
                                        if (index > -1) selectedBrands.splice(index, 1)
                                    }
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
                            (value: string | null) =>
                                (selectedRating = value ? Number(value) : null)
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
                                class="text-sm cursor-pointer flex items-center space-x-1"
                            >
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
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
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
import { productsService } from '@/services/products.service'
import SidebarItem from './SidebarItem.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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

const selectedBrands = ref<string[]>([])
const selectedRating = ref<number | null>(null)

// Data from API
const categories = ref<ProductCategory[]>([])
const brands = ref<ProductBrand[]>([])
const loading = ref(false)

// Load data from service
const loadData = async () => {
    loading.value = true
    try {
        const data = await productsService.getCategories()
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
    // Get from cart store when implemented
    return 3
})

const wishlistCount = computed(() => {
    // Get from wishlist store when implemented
    return 5
})

// Methods
const applyPriceFilter = () => {
    const query = { ...route.query }

    if (priceFilter.value.min) {
        query.minPrice = priceFilter.value.min.toString()
    } else {
        delete query.minPrice
    }

    if (priceFilter.value.max) {
        query.maxPrice = priceFilter.value.max.toString()
    } else {
        delete query.maxPrice
    }

    router.push({ query })
}

const clearFilters = () => {
    priceFilter.value.min = undefined
    priceFilter.value.max = undefined
    selectedBrands.value = []
    selectedRating.value = null

    // Clear query parameters
    router.push({ query: {} })
}

// Initialize data
onMounted(() => {
    loadData()
})
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
