<template>
    <div
        class="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        @click="goToProduct"
    >
        <div class="relative">
            <img
                :src="deal.image"
                :alt="deal.name"
                class="w-full h-32 sm:h-36 md:h-40 lg:h-44 object-cover"
            />
            <span
                class="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded"
            >
                {{ deal.discount }}% {{ t('home.deals.off') }}
            </span>
        </div>
        <div class="p-2 sm:p-3 md:p-4">
            <h3
                class="font-medium text-foreground mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base min-h-[2.5rem] sm:min-h-[3rem]"
            >
                {{ deal.name }}
            </h3>
            <div class="flex items-center justify-between">
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span class="text-primary font-bold text-sm sm:text-base lg:text-lg">
                        ${{ deal.price }}
                    </span>
                    <span class="text-muted-foreground line-through text-xs sm:text-sm">
                        ${{ deal.originalPrice }}
                    </span>
                </div>
                <div class="text-xs sm:text-sm text-muted-foreground">
                    {{ t('home.deals.save') }} ${{ (deal.originalPrice - deal.price).toFixed(2) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Deal } from '@/types/home'
import { useAppI18n } from '@/composables/useI18n'

interface Props {
    deal: Deal
}

const props = defineProps<Props>()
const { t } = useAppI18n()
const router = useRouter()

const goToProduct = () => {
    router.push(`/products/${props.deal.id}`)
}
</script>
