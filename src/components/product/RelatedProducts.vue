<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h2 class="text-xl md:text-2xl font-bold text-foreground">
                {{ t('productDetail.relatedProducts') }}
            </h2>
            <router-link
                to="/products"
                class="text-primary hover:text-primary/80 font-medium text-sm"
            >
                {{ t('productDetail.viewAll') }} →
            </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <RelatedProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                @add-to-cart="$emit('add-to-cart', product)"
            />
        </div>

        <!-- Empty State -->
        <div v-if="!loading && !products.length" class="text-center py-8">
            <Package class="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p class="text-muted-foreground">{{ t('productDetail.noRelatedProducts') }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppI18n } from '@/composables/useI18n'
import type { RelatedProduct } from '@/types/product-detail'

// Components
import RelatedProductCard from '@/components/product/RelatedProductCard.vue'

// Icons
import { Package } from 'lucide-vue-next'

interface Props {
    products: RelatedProduct[]
    loading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
    'add-to-cart': [product: RelatedProduct]
}>()

const { t } = useAppI18n()
</script>
