<script setup lang="ts">
import { ref } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { useHomeData } from '@/composables/useHomeData'
import type { Product, Category, PromoSection } from '@/types/home'

// Components
import HeroBanner from '@/components/home/HeroBanner.vue'
import ProductSection from '@/components/home/ProductSection.vue'
import DealCard from '@/components/home/DealCard.vue'
import CategoryCard from '@/components/home/CategoryCard.vue'
import PromoCard from '@/components/home/PromoCard.vue'

const { t } = useAppI18n()

// Use home data composable
const { popularProducts, newProducts, dealsOfDay, categories, promoSections, loading, errors } =
    useHomeData()

// Local state
const activeTab = ref('all')

// Tab configuration
const productTabs = [
    { key: 'all', label: 'All' },
    { key: 'milks', label: 'Milks & Dairies' },
    { key: 'coffees', label: 'Coffees & Teas' },
    { key: 'pet-foods', label: 'Pet Foods' },
    { key: 'meats', label: 'Meats' },
    { key: 'vegetables', label: 'Vegetables' },
    { key: 'fruits', label: 'Fruits' },
]

// Event handlers
const handleSubscribe = (email: string) => {
    console.log('Newsletter subscription:', email)
    // Implement newsletter subscription logic here
}

const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product)
    // Implement add to cart functionality here
}

const handleTabChange = (tabKey: string) => {
    activeTab.value = tabKey
    // Implement product filtering based on tab here
}

const handleCategoryClick = (category: Category) => {
    console.log('Category clicked:', category)
    // Implement navigation to category page here
}

const handlePromoClick = (promo: PromoSection) => {
    console.log('Promo clicked:', promo)
    // Implement navigation to promo page here
}
</script>

<template>
    <div class="min-h-screen bg-background px-3 sm:px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto py-3 sm:py-4 md:py-6 lg:py-8">
            <!-- Hero Banner -->
            <HeroBanner @subscribe="handleSubscribe" />

            <!-- Popular Products -->
            <ProductSection
                title="Popular Products"
                :products="popularProducts"
                :loading="loading.products"
                :show-tabs="true"
                :tabs="productTabs"
                :active-tab="activeTab"
                @add-to-cart="handleAddToCart"
                @tab-change="handleTabChange"
            />

            <!-- New Products -->
            <ProductSection
                title="New products"
                :products="newProducts"
                :loading="loading.products"
                @add-to-cart="handleAddToCart"
            />

            <!-- Deals of The Day -->
            <section class="mb-8 sm:mb-12">
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6"
                >
                    <h2 class="text-xl md:text-2xl font-bold text-gray-800">Deals Of The Day</h2>
                    <a
                        href="#"
                        class="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
                    >
                        All Deals →
                    </a>
                </div>

                <div v-if="loading.deals" class="flex justify-center items-center h-32">
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"
                    ></div>
                </div>

                <div
                    v-else
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
                >
                    <DealCard v-for="deal in dealsOfDay" :key="deal.id" :deal="deal" />
                </div>
            </section>

            <!-- Promotional Banners -->
            <section class="mb-8 sm:mb-12">
                <div v-if="loading.home" class="flex justify-center items-center h-32">
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"
                    ></div>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    <PromoCard
                        v-for="(promo, index) in promoSections"
                        :key="index"
                        :promo="promo"
                        @promo-click="handlePromoClick"
                    />
                </div>
            </section>

            <!-- Shop by Categories -->
            <section class="mb-8 sm:mb-12">
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6"
                >
                    <h2 class="text-xl md:text-2xl font-bold text-gray-800">Shop by Categories</h2>
                    <span class="text-gray-500 text-sm sm:text-base">All categories</span>
                </div>

                <div v-if="loading.home" class="flex justify-center items-center h-32">
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"
                    ></div>
                </div>

                <div
                    v-else
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2 sm:gap-3 md:gap-4"
                >
                    <CategoryCard
                        v-for="category in categories"
                        :key="category.name"
                        :category="category"
                        @category-click="handleCategoryClick"
                    />
                </div>
            </section>

            <!-- Newsletter Section -->
            <section class="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
                <div class="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6 lg:gap-8">
                    <div class="flex-1">
                        <h2
                            class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4"
                        >
                            Stay home & get your daily needs from our shop
                        </h2>
                        <p class="text-gray-600 mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base">
                            Start You'r Daily Shopping with Nest Mart
                        </p>
                        <div
                            class="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-full sm:max-w-md"
                        >
                            <input
                                type="email"
                                placeholder="Your email address"
                                class="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                            />
                            <button
                                class="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                    <div class="hidden lg:block lg:ml-8">
                        <img
                            src="https://picsum.photos/400/300"
                            alt="Delivery person"
                            class="w-64 h-48 lg:w-80 lg:h-60 xl:w-96 xl:h-72 object-cover rounded-lg"
                        />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
