<script setup lang="ts">
import { useAppI18n } from '@/composables/useI18n'
import PriceDisplay from '@/components/PriceDisplay.vue'

const { t, formatCurrency, currentLocale } = useAppI18n()
</script>

<template>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 mb-8">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-foreground mb-4">
                {{ t('common.welcome') }}
            </h1>
            <p class="text-xl text-muted-foreground mb-6">
                Discover amazing products with great deals
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <RouterLink
                    to="/products"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    {{ t('navigation.products') }}
                </RouterLink>
                <RouterLink
                    to="/categories"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                    {{ t('navigation.categories') }}
                </RouterLink>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section class="mb-8">
        <h2 class="text-2xl font-bold text-foreground mb-6">{{ t('footer.quickLinks') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                class="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
            >
                <div
                    class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
                >
                    <svg
                        class="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                </div>
                <h3 class="font-semibold text-foreground mb-2">{{ t('navigation.products') }}</h3>
                <p class="text-sm text-muted-foreground">{{ t('products.allProducts') }}</p>
            </div>

            <div
                class="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
            >
                <div
                    class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
                >
                    <svg
                        class="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M7 13h10"
                        />
                    </svg>
                </div>
                <h3 class="font-semibold text-foreground mb-2">{{ t('navigation.cart') }}</h3>
                <p class="text-sm text-muted-foreground">{{ t('cart.title') }}</p>
            </div>

            <div
                class="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
            >
                <div
                    class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
                >
                    <svg
                        class="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </div>
                <h3 class="font-semibold text-foreground mb-2">{{ t('navigation.account') }}</h3>
                <p class="text-sm text-muted-foreground">{{ t('account.title') }}</p>
            </div>

            <div
                class="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
            >
                <div
                    class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
                >
                    <svg
                        class="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </div>
                <h3 class="font-semibold text-foreground mb-2">{{ t('account.wishlist') }}</h3>
                <p class="text-sm text-muted-foreground">Save your favorites</p>
            </div>
        </div>
    </section>

    <!-- Demo Section -->
    <section class="mb-8">
        <div class="bg-card border border-border rounded-lg p-6">
            <h2 class="text-xl font-semibold text-card-foreground mb-4">
                {{ t('products.price') }} Demo
            </h2>
            <p class="text-muted-foreground mb-4">
                See how prices are formatted based on your selected language
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-muted rounded-lg">
                    <p class="text-sm text-muted-foreground mb-2">Regular Price</p>
                    <PriceDisplay :price="299.99" size="lg" />
                </div>
                <div class="text-center p-4 bg-muted rounded-lg">
                    <p class="text-sm text-muted-foreground mb-2">Sale Price</p>
                    <PriceDisplay :price="199.99" :originalPrice="299.99" size="lg" />
                </div>
                <div class="text-center p-4 bg-muted rounded-lg">
                    <p class="text-sm text-muted-foreground mb-2">Current Locale</p>
                    <p class="text-lg font-semibold">{{ currentLocale.toUpperCase() }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
