<template>
    <div
        ref="playerContainer"
        class="relative w-full h-full bg-black overflow-hidden"
        @click="togglePlay"
    >
        <!-- Video Element -->
        <video
            ref="videoElement"
            :src="currentVideoUrl"
            :poster="reel.thumbnail_url"
            class="w-full h-full object-cover"
            :muted="isMuted"
            :volume="1"
            :loop="true"
            preload="metadata"
            playsinline
            @loadedmetadata="onVideoLoaded"
            @loadstart="onLoadStart"
            @canplay="onCanPlay"
            @timeupdate="onTimeUpdate"
            @ended="onVideoEnded"
            @play="onPlay"
            @pause="onPause"
            @error="onVideoError"
            @click="togglePlay"
        />

        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/50">
            <div
                class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"
            />
        </div>

        <!-- Error Overlay -->
        <div v-if="hasError" class="absolute inset-0 flex items-center justify-center bg-black/50">
            <div class="text-white text-center">
                <ExclamationCircleIcon class="w-16 h-16 mx-auto mb-4 text-white/50" />
                <p class="text-lg">Video không thể phát</p>
                <button
                    @click="retryVideo"
                    class="mt-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                    Thử lại
                </button>
            </div>
        </div>

        <!-- Play/Pause Overlay -->
        <div
            v-if="showPlayButton || !isPlaying"
            class="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
            :class="{ 'opacity-0': isPlaying && !showPlayButton }"
        >
            <div class="bg-black/60 rounded-full p-6 backdrop-blur-sm">
                <PlayIcon v-if="!isPlaying" class="w-16 h-16 text-white fill-white" />
                <PauseIcon v-else class="w-16 h-16 text-white fill-white" />
            </div>
        </div>

        <!-- Timeline Progress Bar (YouTube style) -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div
                class="h-full bg-red-500 transition-all duration-100 ease-linear relative"
                :style="{ width: `${progress}%` }"
            >
                <!-- Progress dot -->
                <div
                    class="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg"
                ></div>
            </div>
        </div>

        <!-- Time Display và Mute Button -->
        <div class="absolute bottom-16 left-4 flex items-center space-x-3 z-20">
            <!-- Time Display -->
            <div
                class="text-white text-sm font-medium bg-black/70 px-2 py-1 rounded-lg backdrop-blur-sm"
            >
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>

            <!-- Mute/Unmute Button -->
            <!-- Mute/Unmute Button -->
            <button
                @click.stop="toggleMute"
                class="p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-all backdrop-blur-sm"
                :class="{ 'bg-red-500/70 hover:bg-red-500/90': isMuted }"
                :title="isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'"
            >
                <!-- Muted Icon (với dấu gạch chéo) -->
                <SpeakerXMarkIcon v-if="isMuted" class="w-5 h-5" />
                <!-- Unmuted Icon -->
                <SpeakerWaveIcon v-else class="w-5 h-5" />
            </button>
        </div>

        <!-- Controls Overlay -->
        <div class="absolute top-4 right-4 flex flex-col space-y-2">
            <!-- Shopping Cart (nếu có sản phẩm) -->
            <button
                v-if="reel.product"
                @click.stop="showProductPopup = true"
                class="p-3 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-all backdrop-blur-sm relative"
                title="Xem sản phẩm"
            >
                <ShoppingCartIcon class="w-5 h-5" />
                <!-- Badge số lượng -->
                <div
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                    {{ reel.product.sold_count > 999 ? '999+' : reel.product.sold_count }}
                </div>
            </button>
        </div>

        <!-- Creator Info Overlay -->
        <div class="absolute bottom-20 left-4 right-20">
            <div class="flex items-center space-x-3 mb-2">
                <img
                    :src="reel.creator.avatar"
                    :alt="reel.creator.name"
                    class="w-10 h-10 rounded-full border-2 border-white"
                />
                <div>
                    <div class="flex items-center space-x-1">
                        <span class="text-white font-semibold text-sm">
                            {{ reel.creator.name }}
                        </span>
                        <CheckBadgeIcon
                            v-if="reel.creator.is_verified"
                            class="w-4 h-4 text-blue-500"
                        />
                    </div>
                    <div class="text-white/80 text-xs">
                        {{ formatNumber(reel.stats.views) }} lượt xem
                    </div>
                </div>
            </div>

            <!-- Title and Description -->
            <div class="text-white mb-2">
                <h3 class="font-semibold text-sm mb-1 line-clamp-2">
                    {{ reel.title }}
                </h3>
                <p
                    class="text-sm text-white/90 leading-tight"
                    :class="{
                        'line-clamp-2': !showFullDescription,
                        'max-h-32 overflow-y-auto': showFullDescription,
                    }"
                >
                    {{ reel.description }}
                </p>
                <button
                    v-if="reel.description.length > 100"
                    @click.stop="showFullDescription = !showFullDescription"
                    class="text-white/80 text-sm mt-1 underline"
                >
                    {{ showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
                </button>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1 mb-3">
                <span
                    v-for="tag in reel.tags.slice(0, 3)"
                    :key="tag"
                    class="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
                >
                    #{{ tag }}
                </span>
            </div>
        </div>

        <!-- Product Popup Modal -->
        <div
            v-if="showProductPopup && reel.product"
            class="absolute inset-0 bg-black/50 flex items-end justify-center z-50 backdrop-blur-sm"
            @click="showProductPopup = false"
        >
            <div
                class="bg-white rounded-t-2xl p-6 w-full max-w-md mx-4 mb-0 transform transition-all duration-300"
                @click.stop
            >
                <!-- Product Info -->
                <div class="flex items-start space-x-4">
                    <img
                        :src="reel.product.image"
                        :alt="reel.product.name"
                        class="w-20 h-20 rounded-lg object-cover"
                    />
                    <div class="flex-1">
                        <h3 class="font-semibold text-lg text-gray-900 mb-2">
                            {{ reel.product.name }}
                        </h3>
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-red-500 font-bold text-xl">
                                {{ formatPrice(reel.product.price) }}₫
                            </span>
                            <span
                                v-if="
                                    reel.product.original_price &&
                                    reel.product.original_price > reel.product.price
                                "
                                class="text-gray-400 line-through text-sm"
                            >
                                {{ formatPrice(reel.product.original_price) }}₫
                            </span>
                        </div>
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                            <div class="flex items-center">
                                <StarIcon class="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                                {{ reel.product.rating }}
                            </div>
                            <span>•</span>
                            <span>Đã bán {{ formatNumber(reel.product.sold_count) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex space-x-3 mt-6">
                    <button
                        @click="addToCart"
                        class="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                    >
                        <ShoppingCartIcon class="w-5 h-5" />
                        <span>Thêm vào giỏ hàng</span>
                    </button>
                    <button
                        @click="buyNow"
                        class="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                        Mua ngay
                    </button>
                </div>

                <!-- Close Button -->
                <button
                    @click="showProductPopup = false"
                    class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <XMarkIcon class="w-5 h-5 text-gray-400" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ShoppingCartIcon,
    ExclamationCircleIcon,
    XMarkIcon,
    CheckBadgeIcon,
    StarIcon,
} from '@heroicons/vue/24/outline'
import type { Reel } from '@/types/reels'
import { getRandomFallbackVideo } from '@/utils/videoUtils'

interface Props {
    reel: Reel
    isActive: boolean
    autoPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    autoPlay: false,
})

const emit = defineEmits<{
    play: []
    pause: []
    ended: []
    viewAdded: []
}>()

const playerContainer = ref<HTMLDivElement>()
const videoElement = ref<HTMLVideoElement>()
const isLoading = ref(true)
const isPlaying = ref(false)
const isMuted = ref(false) // Bật âm thanh từ đầu
const showPlayButton = ref(false)
const showFullDescription = ref(false)
const progress = ref(0)
const currentVideoUrl = ref(props.reel.video_url)
const hasError = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const showProductPopup = ref(false)

// Utility functions
const formatNumber = (n: number) => n.toLocaleString('vi-VN')

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
    if (!videoElement.value) return
    if (isPlaying.value) {
        videoElement.value.pause()
    } else {
        videoElement.value.play()
    }
}

const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (videoElement.value) {
        videoElement.value.muted = isMuted.value
    }
}

const addToCart = () => {
    // Emit event để parent component xử lý
    console.log('Add to cart:', props.reel.product)
    showProductPopup.value = false
    // TODO: Implement add to cart logic
}

const buyNow = () => {
    // Emit event để parent component xử lý
    console.log('Buy now:', props.reel.product)
    showProductPopup.value = false
    // TODO: Implement buy now logic
}

const onVideoLoaded = () => {
    isLoading.value = false
    if (videoElement.value) {
        duration.value = videoElement.value.duration
    }
    console.log('Video loaded:', currentVideoUrl.value)
}

const onLoadStart = () => {
    isLoading.value = true
    console.log('Video loading started:', currentVideoUrl.value)
}

const onCanPlay = () => {
    isLoading.value = false
    console.log('Video can play:', currentVideoUrl.value)
}

const onVideoError = (e: Event) => {
    isLoading.value = false
    hasError.value = true
    console.error('Video error:', e, currentVideoUrl.value)

    // Try fallback video
    if (!hasError.value || currentVideoUrl.value === props.reel.video_url) {
        console.log('Trying fallback video...')
        currentVideoUrl.value = getRandomFallbackVideo()
        hasError.value = false
        isLoading.value = true
    }
}

const retryVideo = () => {
    hasError.value = false
    isLoading.value = true
    currentVideoUrl.value = getRandomFallbackVideo()
}

const onTimeUpdate = () => {
    if (!videoElement.value) return
    currentTime.value = videoElement.value.currentTime
    progress.value = (videoElement.value.currentTime / videoElement.value.duration) * 100
}

const onVideoEnded = () => {
    emit('ended')
    showPlayButton.value = true
}

const onPlay = () => {
    isPlaying.value = true
    showPlayButton.value = false
    emit('play')
}

const onPause = () => {
    isPlaying.value = false
    showPlayButton.value = true
    emit('pause')
}

watch(
    () => props.isActive,
    (active) => {
        if (active && videoElement.value) {
            videoElement.value.play()
        } else if (!active && videoElement.value) {
            videoElement.value.pause()
        }
    },
)

onMounted(() => {
    if (videoElement.value) {
        videoElement.value.muted = isMuted.value
        videoElement.value.volume = 1 // Bật âm thanh full
        if (props.autoPlay) {
            videoElement.value.play()
        }
    }
})

onUnmounted(() => {
    if (videoElement.value) {
        videoElement.value.pause()
    }
})
</script>

<style scoped>
/* Volume slider styles */
.slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slider {
    background: rgba(255, 255, 255, 0.3);
    outline: none;
}

/* Video container */
.video-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/* Progress bar animation */
.progress-bar {
    transition: width 0.1s linear;
}
</style>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
