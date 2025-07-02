<template>
    <section class="mb-12">
        <!-- Title and Tabs -->
        <div class="flex flex-col gap-4 mb-6">
            <!-- Title -->
            <div class="flex items-center justify-between">
                <h2 class="text-xl md:text-2xl font-bold text-foreground">{{ title }}</h2>
                <!-- Desktop tabs - hidden on mobile -->
                <div
                    v-if="showTabs && tabs && tabs.length > 0"
                    class="hidden lg:flex gap-1 xl:gap-2"
                >
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        @click="$emit('tab-change', tab.key)"
                        :class="[
                            'px-3 xl:px-4 py-2 font-medium text-sm xl:text-base transition-all duration-200 relative rounded-lg',
                            activeTab === tab.key
                                ? 'text-primary bg-primary/10 border border-primary/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                        ]"
                    >
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <!-- Mobile tabs - scrollable -->
            <div v-if="showTabs && tabs && tabs.length > 0" class="lg:hidden">
                <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        @click="$emit('tab-change', tab.key)"
                        :class="[
                            'flex-shrink-0 px-3 sm:px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap rounded-full snap-start border',
                            activeTab === tab.key
                                ? 'bg-primary text-primary-foreground shadow-md border-primary'
                                : 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground border-border',
                        ]"
                    >
                        {{ tab.label }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Products Grid -->
        <div
            v-else
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5"
        >
            <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                @add-to-cart="$emit('add-to-cart', $event)"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import type { Product } from '@/types/home'
import ProductCard from './ProductCard.vue'

interface Tab {
    key: string
    label: string
}

interface Props {
    title: string
    products: Product[]
    loading?: boolean
    showTabs?: boolean
    tabs?: Tab[]
    activeTab?: string
}

defineProps<Props>()

const emit = defineEmits<{
    'add-to-cart': [product: Product]
    'tab-change': [tabKey: string]
}>()
</script>

<style scoped>
/* Hide scrollbar for mobile tabs */
.scrollbar-hide {
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
}

/* Active tab indicator for desktop */
.tab-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #059669; /* green-600 */
}
</style>
