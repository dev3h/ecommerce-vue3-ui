<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import type { Product } from '@/types/home'
import ProductCard from './ProductCard.vue'

interface Props {
    products: Product[]
    endTime?: Date
}

const props = withDefaults(defineProps<Props>(), {
    endTime: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hours from now
})

const emit = defineEmits<{
    addToCart: [product: Product]
}>()

const { t } = useAppI18n()

const currentTime = ref(Date.now())
let timer: number | null = null

onMounted(() => {
    timer = globalThis.setInterval(() => {
        currentTime.value = Date.now()
    }, 1000)
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
    }
})

const timeRemaining = computed(() => {
    const diff = props.endTime.getTime() - currentTime.value
    if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 }
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { hours, minutes, seconds }
})

const handleAddToCart = (product: Product) => {
    emit('addToCart', product)
}
</script>

<template>
    <section
        class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 border-b border-border"
    >
        <!-- Flash Sale Header -->
        <div class="flex items-center justify-between mb-4 sm:mb-6 gap-2">
            <div class="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <h2
                    class="text-base sm:text-xl md:text-2xl font-bold text-[#ee4d2d] dark:text-[#ee4d2d] flex items-center gap-1 sm:gap-2 flex-shrink-0"
                >
                    <svg
                        class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                    </svg>
                    <span class="hidden xs:inline">{{ t('home.flashSale.title') }}</span>
                    <span class="xs:hidden">FLASH</span>
                </h2>
                <div
                    class="flex items-center gap-1 sm:gap-2 bg-[#ee4d2d] dark:bg-[#ee4d2d] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded text-xs sm:text-sm md:text-base"
                >
                    <span class="font-bold">{{
                        String(timeRemaining.hours).padStart(2, '0')
                    }}</span>
                    <span>:</span>
                    <span class="font-bold">{{
                        String(timeRemaining.minutes).padStart(2, '0')
                    }}</span>
                    <span>:</span>
                    <span class="font-bold">{{
                        String(timeRemaining.seconds).padStart(2, '0')
                    }}</span>
                </div>
            </div>
            <a
                href="#"
                class="text-[#ee4d2d] dark:text-[#ee4d2d] hover:opacity-80 font-medium flex items-center gap-1 text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
            >
                <span class="hidden sm:inline">{{ t('home.flashSale.viewAll') }}</span>
                <svg
                    class="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </a>
        </div>

        <!-- Flash Sale Products -->
        <div class="overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
            <div class="flex gap-2 sm:gap-3 pb-2">
                <div
                    v-for="product in products.slice(0, 6)"
                    :key="product.id"
                    class="w-36 sm:w-44 md:w-48 flex-shrink-0"
                >
                    <ProductCard
                        :product="product"
                        @add-to-cart="handleAddToCart"
                        :show-flash-badge="true"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
