<template>
    <section class="mb-8 sm:mb-12">
        <!-- Section Header -->
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6"
        >
            <div class="flex items-center gap-3">
                <h2 class="text-xl md:text-2xl font-bold text-foreground">
                    {{ t('home.reels.title') }}
                </h2>
                <div
                    class="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium"
                >
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                    </svg>
                    HOT
                </div>
            </div>
            <button
                @click="viewAllReels"
                class="text-primary hover:text-primary/80 font-medium text-sm sm:text-base transition-colors flex items-center gap-1"
            >
                {{ t('home.reels.viewAll') }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>

        <!-- Reels Grid -->
        <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else-if="reels.length === 0" class="text-center py-16">
            <svg
                class="w-16 h-16 mx-auto text-muted-foreground/50 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <p class="text-muted-foreground">{{ t('home.reels.noReels') }}</p>
        </div>

        <div
            v-else
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4"
        >
            <div
                v-for="reel in displayReels"
                :key="reel.id"
                @click="openReel(reel)"
                class="group relative aspect-[9/16] bg-black rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
                <!-- Thumbnail -->
                <img
                    :src="reel.thumbnail_url"
                    :alt="reel.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                />

                <!-- Gradient Overlay -->
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                />

                <!-- Play Icon -->
                <div
                    class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <div class="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    </div>
                </div>

                <!-- Creator Avatar -->
                <div class="absolute top-2 left-2">
                    <div class="relative">
                        <img
                            :src="reel.creator.avatar"
                            :alt="reel.creator.name"
                            class="w-8 h-8 rounded-full border-2 border-white/80"
                        />
                        <div
                            v-if="reel.creator.is_verified"
                            class="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5"
                        >
                            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="absolute top-2 right-2 flex flex-col items-end gap-1">
                    <div
                        class="flex items-center gap-1 text-white text-xs bg-black/50 rounded-full px-2 py-1"
                    >
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                                fill-rule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        {{ formatViews(reel.stats.views) }}
                    </div>
                    <div
                        class="flex items-center gap-1 text-white text-xs bg-black/50 rounded-full px-2 py-1"
                    >
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fill-rule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        {{ formatViews(reel.stats.likes) }}
                    </div>
                </div>

                <!-- Bottom Info -->
                <div class="absolute bottom-0 left-0 right-0 p-2">
                    <h3 class="text-white text-xs font-medium line-clamp-2 mb-1">
                        {{ reel.title }}
                    </h3>
                    <!-- Product Badge -->
                    <div
                        v-if="reel.product"
                        class="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 w-fit"
                    >
                        <img
                            :src="reel.product.image"
                            :alt="reel.product.name"
                            class="w-4 h-4 rounded-full object-cover"
                        />
                        <span class="text-black text-xs font-medium">{{
                            formatPrice(reel.product.price)
                        }}</span>
                    </div>
                </div>

                <!-- Duration -->
                <div
                    class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                >
                    {{ formatDuration(reel.duration) }}
                </div>
            </div>
        </div>

        <!-- View More Button (Mobile) -->
        <div v-if="reels.length > displayLimit" class="flex justify-center mt-4 sm:hidden">
            <button
                @click="showMore = !showMore"
                class="px-6 py-2 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors"
            >
                {{ showMore ? t('home.reels.showLess') : t('home.reels.showMore') }}
            </button>
        </div>
    </section>

    <!-- Reels Modal -->
    <Teleport to="body">
        <div v-if="selectedReel" class="fixed inset-0 z-50 bg-black" @click="closeReel">
            <div class="w-full h-full flex items-center justify-center">
                <div class="relative w-full max-w-md h-full">
                    <!-- Close Button -->
                    <button
                        @click="closeReel"
                        class="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <!-- Reel Player -->
                    <ReelPlayer
                        :reel="selectedReel"
                        :isActive="true"
                        :autoPlay="true"
                        @play="onPlay"
                        @pause="onPause"
                        @ended="onEnded"
                        @viewAdded="onViewAdded"
                    />

                    <!-- Side Actions -->
                    <div class="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
                        <button
                            @click.stop="toggleLike(selectedReel.id)"
                            class="bg-black/60 rounded-full p-3 text-white flex flex-col items-center hover:bg-black/80 transition-colors"
                        >
                            <svg
                                v-if="selectedReel.is_liked"
                                class="w-7 h-7 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                />
                            </svg>
                            <svg
                                v-else
                                class="w-7 h-7"
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
                            <span class="text-xs mt-1">{{ selectedReel.stats.likes }}</span>
                        </button>

                        <button
                            @click.stop="shareReel(selectedReel)"
                            class="bg-black/60 rounded-full p-3 text-white flex flex-col items-center hover:bg-black/80 transition-colors"
                        >
                            <svg
                                class="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                />
                            </svg>
                            <span class="text-xs mt-1">{{ selectedReel.stats.shares }}</span>
                        </button>

                        <button
                            v-if="selectedReel.product"
                            @click.stop="goToProduct(selectedReel.product.id)"
                            class="bg-white/90 rounded-full p-3 shadow-lg flex flex-col items-center hover:bg-white transition-colors"
                        >
                            <img
                                :src="selectedReel.product.image"
                                :alt="selectedReel.product.name"
                                class="w-10 h-10 rounded-full object-cover mb-1"
                            />
                            <span class="text-xs text-black font-semibold">Xem SP</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useReels } from '@/composables/useReels'
import ReelPlayer from '@/features/reels/ReelPlayer.vue'
import { formatNumber } from '@/lib/utils'
import type { Reel } from '@/types/reels'

const router = useRouter()
const { t } = useAppI18n()
const { reels, isLoading, loadReels, toggleLike, shareReel } = useReels()

// Local state
const selectedReel = ref<Reel | null>(null)
const showMore = ref(false)
const displayLimit = 6

// Computed
const displayReels = computed(() => {
    if (showMore.value || window.innerWidth >= 640) {
        return reels.value.slice(0, 12) // Show more on desktop
    }
    return reels.value.slice(0, displayLimit)
})

// Methods
const formatViews = formatNumber

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price)
}

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0
        ? `${mins}:${secs.toString().padStart(2, '0')}`
        : `0:${secs.toString().padStart(2, '0')}`
}

const openReel = (reel: Reel) => {
    selectedReel.value = reel
    document.body.style.overflow = 'hidden'
}

const closeReel = () => {
    selectedReel.value = null
    document.body.style.overflow = 'auto'
}

const viewAllReels = () => {
    router.push('/reels')
}

const goToProduct = (productId: string) => {
    router.push(`/product/${productId}`)
    closeReel()
}

const onPlay = () => {
    // Handle play event
}

const onPause = () => {
    // Handle pause event
}

const onEnded = () => {
    // Handle video end
}

const onViewAdded = () => {
    // Handle view added
}

// Lifecycle
onMounted(() => {
    loadReels(true)
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
