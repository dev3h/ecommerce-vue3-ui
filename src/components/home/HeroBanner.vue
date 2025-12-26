<template>
    <section class="relative mb-6">
        <!-- Banner Slider -->
        <div class="relative overflow-hidden rounded-xl">
            <div class="relative h-64 md:h-80 lg:h-96">
                <transition name="fade" mode="out-in">
                    <div
                        :key="currentSlide"
                        class="absolute inset-0 bg-gradient-to-r from-[#ee4d2d]/10 to-[#ff6a00]/10 dark:from-[#ee4d2d]/20 dark:to-[#ff6a00]/20"
                    >
                        <img
                            :src="banners[currentSlide]"
                            :alt="`Banner ${currentSlide + 1}`"
                            class="w-full h-full object-cover"
                        />
                    </div>
                </transition>
            </div>

            <!-- Navigation Arrows -->
            <button
                @click="prevSlide"
                class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
            <button
                @click="nextSlide"
                class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all z-10"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            <!-- Dots Indicator -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                <button
                    v-for="(_, index) in banners"
                    :key="index"
                    @click="goToSlide(index)"
                    class="w-2 h-2 rounded-full transition-all"
                    :class="
                        currentSlide === index
                            ? 'bg-[#ee4d2d] w-8'
                            : 'bg-white/60 hover:bg-white/80'
                    "
                ></button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
    banners?: string[]
    autoPlayInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
    banners: () => [
        'https://picsum.photos/1200/400?random=1',
        'https://picsum.photos/1200/400?random=2',
        'https://picsum.photos/1200/400?random=3',
        'https://picsum.photos/1200/400?random=4',
    ],
    autoPlayInterval: 3000,
})

const currentSlide = ref(0)
let autoPlayTimer: number | null = null

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % props.banners.length
}

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + props.banners.length) % props.banners.length
}

const goToSlide = (index: number) => {
    currentSlide.value = index
    resetAutoPlay()
}

const startAutoPlay = () => {
    autoPlayTimer = globalThis.setInterval(nextSlide, props.autoPlayInterval)
}

const stopAutoPlay = () => {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer)
        autoPlayTimer = null
    }
}

const resetAutoPlay = () => {
    stopAutoPlay()
    startAutoPlay()
}

onMounted(() => {
    startAutoPlay()
})

onUnmounted(() => {
    stopAutoPlay()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
