<template>
    <div class="bg-card border border-border rounded-lg">
        <!-- Tab Headers -->
        <div class="border-b border-border">
            <nav class="flex overflow-x-auto">
                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    @click="$emit('tab-change', tab.key)"
                    :class="[
                        'flex-shrink-0 px-6 py-4 font-medium text-sm transition-colors border-b-2',
                        activeTab === tab.key
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground',
                    ]"
                >
                    {{ tab.label }}
                </button>
            </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
            <!-- Description Tab -->
            <div v-if="activeTab === 'description'" class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-foreground mb-4">
                        {{ t('productDetail.description') }}
                    </h3>
                    <div class="prose prose-gray dark:prose-invert max-w-none">
                        <p class="text-muted-foreground leading-relaxed">
                            {{ product.description }}
                        </p>
                    </div>
                </div>

                <div v-if="product.weight">
                    <h4 class="font-medium text-foreground mb-2">
                        {{ t('productDetail.weight') }}
                    </h4>
                    <p class="text-muted-foreground">{{ product.weight }}</p>
                </div>
            </div>

            <!-- Additional Info Tab -->
            <div v-else-if="activeTab === 'additional-info'" class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold text-foreground mb-4">
                        {{ t('productDetail.specifications') }}
                    </h3>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="sr-only">
                                <tr>
                                    <th>{{ t('productDetail.specification') }}</th>
                                    <th>{{ t('productDetail.value') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border">
                                <tr
                                    v-for="spec in product.specifications"
                                    :key="spec.label"
                                    class="hover:bg-accent/50"
                                >
                                    <td class="py-3 pr-6 font-medium text-foreground">
                                        {{ spec.label }}
                                    </td>
                                    <td class="py-3 text-muted-foreground">{{ spec.value }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="product.ingredients?.length">
                    <h4 class="font-medium text-foreground mb-3">
                        {{ t('productDetail.ingredients') }}
                    </h4>
                    <ul class="space-y-1">
                        <li
                            v-for="ingredient in product.ingredients"
                            :key="ingredient"
                            class="text-muted-foreground"
                        >
                            • {{ ingredient }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Vendor Tab -->
            <div v-else-if="activeTab === 'vendor'" class="space-y-6">
                <div class="flex items-start gap-4">
                    <div
                        class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center"
                    >
                        <Store class="w-8 h-8 text-primary" />
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-foreground mb-2">
                            {{ product.brand }}
                        </h3>
                        <p class="text-muted-foreground mb-4">
                            {{
                                t('productDetail.vendorDescription').replace(
                                    '{brand}',
                                    product.brand,
                                )
                            }}
                        </p>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="font-medium text-foreground"
                                    >{{ t('productDetail.rating') }}:</span
                                >
                                <span class="text-muted-foreground ml-2">4.8/5.0</span>
                            </div>
                            <div>
                                <span class="font-medium text-foreground"
                                    >{{ t('productDetail.products') }}:</span
                                >
                                <span class="text-muted-foreground ml-2">245</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reviews Tab -->
            <div v-else-if="activeTab === 'reviews'">
                <ReviewSection :product-id="product.id" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import type { ProductDetail } from '@/types/product-detail'

// Components
import ReviewSection from '@/components/reviews/ReviewSection.vue'

// Icons
import { Store } from 'lucide-vue-next'

interface Props {
    product: ProductDetail
    activeTab: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'tab-change': [tab: string]
    'load-more-reviews': []
}>()

const { t } = useAppI18n()

const tabs = computed(() => [
    { key: 'description', label: t('productDetail.description') },
    { key: 'additional-info', label: t('productDetail.additionalInfo') },
    { key: 'vendor', label: t('productDetail.vendor') },
    { key: 'reviews', label: t('productDetail.reviews') },
])
</script>
