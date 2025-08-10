<template>
  <ReelsLayout 
    :isFullscreen="isFullscreen" 
    :showHeader="false"
    @toggleFullscreen="toggleFullscreen"
    @touchstart="handleTouchStart" 
    @touchmove="handleTouchMove" 
    @touchend="handleTouchEnd"
    style="touch-action: pan-y;"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <div class="text-white text-center">
        <div class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>{{ t('common.loading') }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="reels.length === 0" class="flex justify-center items-center h-full text-white text-center">
      <div>
        <ComputerDesktopIcon class="w-16 h-16 mx-auto mb-4 text-white/50" />
        <p class="text-lg">{{ t('home.reels.noReels') }}</p>
      </div>
    </div>

    <!-- Reels List -->
    <div v-else class="reels-list relative h-full overflow-hidden">
      <div
        v-for="(reel, index) in reels"
        :key="reel.id"
        ref="reelElements"
        class="reel-item absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
        :class="{
          'translate-y-0 opacity-100 z-20': index === currentIndex,
          '-translate-y-full opacity-30 z-10': index === currentIndex - 1,
          'translate-y-full opacity-30 z-10': index === currentIndex + 1,
          'translate-y-full opacity-0 z-0': index > currentIndex + 1,
          '-translate-y-full opacity-0 z-0': index < currentIndex - 1
        }"
      >
        <ReelPlayer
          :reel="reel"
          :isActive="index === currentIndex"
          :autoPlay="index === currentIndex"
          @play="onPlay"
          @pause="onPause"
          @ended="onEnded"
          @viewAdded="addView(reel.id)"
        />

        <!-- Overlay Actions -->
        <div 
          class="absolute right-4 flex flex-col items-center gap-6 z-10"
          :class="{
            'bottom-36': isMobile,
            'bottom-8': !isMobile
          }"
        >
          <!-- Like Button -->
          <button
            @click="handleLike(reel)"
            class="bg-black/60 backdrop-blur-sm rounded-full p-3 text-white flex flex-col items-center hover:bg-black/80 transition-all active:scale-95 relative"
          >
            <HeartIconSolid
              v-if="reel.is_liked"
              class="w-7 h-7 text-red-500 animate-bounce"
            />
            <HeartIcon
              v-else
              class="w-7 h-7"
            />
            <span class="text-xs mt-1 font-medium">{{ formatCount(reel.stats.likes) }}</span>
            
            <!-- Like Animation Hearts -->
            <div 
              v-if="likeAnimations[reel.id]" 
              class="absolute inset-0 pointer-events-none"
            >
              <div 
                v-for="heart in likeAnimations[reel.id]" 
                :key="heart.id"
                class="absolute animate-ping"
                :style="{ 
                  left: heart.x + 'px', 
                  top: heart.y + 'px',
                  animation: `heartFloat 1s ease-out forwards`
                }"
              >
                ❤️
              </div>
            </div>
          </button>

          <!-- Comment Button -->
          <button
            @click="showComments(reel)"
            class="bg-black/60 backdrop-blur-sm rounded-full p-3 text-white flex flex-col items-center hover:bg-black/80 transition-all active:scale-95"
          >
            <ChatBubbleOvalLeftEllipsisIcon class="w-7 h-7" />
            <span class="text-xs mt-1 font-medium">{{ formatCount(reel.stats.comments) }}</span>
          </button>

          <!-- Share Button -->
          <button
            @click="shareReel(reel)"
            class="bg-black/60 backdrop-blur-sm rounded-full p-3 text-white flex flex-col items-center hover:bg-black/80 transition-all active:scale-95"
          >
            <ShareIcon class="w-7 h-7" />
            <span class="text-xs mt-1 font-medium">{{ formatCount(reel.stats.shares) }}</span>
          </button>

          <!-- Product Button -->
          <button
            v-if="reel.product"
            @click="goToProduct(reel.product.id)"
            class="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg flex flex-col items-center hover:bg-white transition-all active:scale-95"
          >
            <img
              :src="reel.product.image"
              :alt="reel.product.name"
              class="w-10 h-10 rounded-full object-cover mb-1"
            />
            <span class="text-xs text-black font-semibold">Xem SP</span>
          </button>
        </div>

        <!-- Navigation Dots (Desktop) -->
        <div v-if="!isMobile" class="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
          <div
            v-for="(_, idx) in reels.slice(Math.max(0, currentIndex - 2), currentIndex + 3)"
            :key="idx"
            class="w-1 h-8 rounded-full transition-all"
            :class="{
              'bg-white': Math.max(0, currentIndex - 2) + idx === currentIndex,
              'bg-white/30': Math.max(0, currentIndex - 2) + idx !== currentIndex
            }"
          />
        </div>
      </div>
    </div>

    <!-- Fullscreen Controls -->
    <div v-if="isFullscreen" class="absolute top-4 right-4 z-20">
      <button
        @click="toggleFullscreen"
        class="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Load More Trigger -->
    <div
      v-if="!isLoading && hasMore && currentIndex >= reels.length - 3"
      ref="loadMoreTrigger"
      class="absolute bottom-0 h-4 w-full"
    />

    <!-- Touch Handler với click navigation -->
    <div 
      class="absolute inset-0 z-10 pointer-events-auto"
      @touchstart="handleTouchStart" 
      @touchmove="handleTouchMove" 
      @touchend="handleTouchEnd"
      style="touch-action: pan-y;"
    >
      <!-- Click areas for navigation -->
      <div 
        class="absolute top-0 left-0 w-full h-1/3 cursor-pointer"
        @click="prevReel"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        title="Tap to go to previous video"
      />
      <div 
        class="absolute bottom-0 left-0 w-full h-1/3 cursor-pointer"
        @click="nextReel"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        title="Tap to go to next video"
      />
    </div>
    
    <!-- Swipe indicators -->
    <div v-if="isSwipeIndicatorVisible" class="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
      <div class="bg-black/50 text-white px-3 py-1 rounded-full text-sm animate-pulse">
        ↕ Vuốt để chuyển video ({{ currentIndex + 1 }}/{{ reels.length }})
      </div>
    </div>


  </ReelsLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
  XMarkIcon,
  ComputerDesktopIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import { useAppI18n } from '@/composables/useI18n'
import { useReels } from '@/composables/useReels'
import ReelPlayer from '@/features/reels/ReelPlayer.vue'
import ReelsLayout from '@/components/layout/ReelsLayout.vue'
import type { Reel } from '@/types/reels'

const router = useRouter()
const { t } = useAppI18n()
const { reels, isLoading, hasMore, loadReels, loadMore, toggleLike, shareReel, addView } = useReels()

// State
const currentIndex = ref(0)
const isFullscreen = ref(false)
const isMobile = ref(false)
const reelElements = ref<HTMLDivElement[]>([])
const loadMoreTrigger = ref<HTMLDivElement>()
const isSwipeIndicatorVisible = ref(true)
const likeAnimations = ref<Record<string, Array<{ id: number, x: number, y: number }>>>({})

// Touch/Swipe handling
let startY = 0
let startTime = 0
let isSwipeInProgress = false

// Methods
const formatCount = (count: number) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const nextReel = async () => {
  console.log('Next reel called, current:', currentIndex.value, 'total:', reels.value.length)
  if (currentIndex.value < reels.value.length - 1) {
    currentIndex.value++
    console.log('Moving to index:', currentIndex.value)
  }
  
  if (currentIndex.value >= reels.value.length - 3 && hasMore.value && !isLoading.value) {
    await loadMore()
  }
}

const prevReel = () => {
  console.log('Prev reel called, current:', currentIndex.value)
  if (currentIndex.value > 0) {
    currentIndex.value--
    console.log('Moving to index:', currentIndex.value)
  }
}

const onPlay = () => {
  // Play handler
}

const onPause = () => {
  // Pause handler
}

const onEnded = () => {
  nextReel()
}

const showComments = (reel: Reel) => {
  console.log('Show comments for reel:', reel.id)
}

const goToProduct = (productId: string) => {
  router.push(`/products/${productId}`)
}

const handleLike = async (reel: Reel) => {
  // Toggle like state
  await toggleLike(reel.id)
  
  // Create like animation
  if (reel.is_liked) {
    createLikeAnimation(reel.id)
  }
}

const createLikeAnimation = (reelId: string) => {
  if (!likeAnimations.value[reelId]) {
    likeAnimations.value[reelId] = []
  }
  
  // Create multiple hearts
  for (let i = 0; i < 3; i++) {
    const heart = {
      id: Date.now() + i,
      x: Math.random() * 20 - 10, // Random x offset
      y: Math.random() * 20 - 10  // Random y offset
    }
    
    likeAnimations.value[reelId].push(heart)
    
    // Remove heart after animation
    setTimeout(() => {
      if (likeAnimations.value[reelId]) {
        const index = likeAnimations.value[reelId].findIndex(h => h.id === heart.id)
        if (index > -1) {
          likeAnimations.value[reelId].splice(index, 1)
        }
      }
    }, 1000)
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// Touch/Swipe handlers
const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    startY = e.touches[0].clientY
    startTime = Date.now()
    isSwipeInProgress = true
    console.log('Touch start:', startY)
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isSwipeInProgress || e.touches.length !== 1) return
  
  // Don't prevent default to allow normal scrolling behavior
  const currentY = e.touches[0].clientY
  const deltaY = startY - currentY
  
  // Only prevent default if this is a vertical swipe
  if (Math.abs(deltaY) > 10) {
    e.preventDefault()
  }
  
  console.log('Touch move delta:', deltaY)
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isSwipeInProgress) return
  
  const endY = e.changedTouches[0].clientY
  const deltaY = startY - endY
  const deltaTime = Date.now() - startTime
  
  console.log('Touch end - deltaY:', deltaY, 'deltaTime:', deltaTime)
  
  isSwipeInProgress = false
  
  // Reduced threshold and increased time window for easier swiping
  if (Math.abs(deltaY) > 30 && deltaTime < 500) {
    if (deltaY > 0) {
      console.log('Swipe up - next reel')
      nextReel()
    } else {
      console.log('Swipe down - prev reel')
      prevReel()
    }
  }
}

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      prevReel()
      break
    case 'ArrowDown':
    case ' ':
      e.preventDefault()
      nextReel()
      break
    case 'Escape':
      if (isFullscreen.value) {
        toggleFullscreen()
      }
      break
  }
}

// Mouse wheel for desktop
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (e.deltaY > 0) {
    nextReel()
  } else if (e.deltaY < 0) {
    prevReel()
  }
}

// Mouse events for desktop
const handleMouseDown = () => {
  console.log('Mouse down - navigation area clicked')
}

const handleMouseUp = () => {
  console.log('Mouse up')
}

// Intersection Observer for load more
const setupIntersectionObserver = () => {
  if (!loadMoreTrigger.value) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
        loadMore()
      }
    },
    { threshold: 0.1 }
  )
  
  observer.observe(loadMoreTrigger.value)
  
  return observer
}

// Lifecycle
onMounted(async () => {
  await loadReels()
  checkIfMobile()
  
  // Hide swipe indicator after 3 seconds
  setTimeout(() => {
    isSwipeIndicatorVisible.value = false
  }, 3000)
  
  window.addEventListener('resize', checkIfMobile)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('wheel', handleWheel, { passive: false })
  
  await nextTick()
  const observer = setupIntersectionObserver()
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkIfMobile)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('wheel', handleWheel)
    if (observer) {
      observer.disconnect()
    }
  })
})

// Watch for load more trigger changes
watch(loadMoreTrigger, () => {
  setupIntersectionObserver()
})
</script>

<style scoped>
.reels-list {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  touch-action: pan-y;
}

.reel-item {
  will-change: transform, opacity;
  touch-action: pan-y;
}

.touch-none {
  touch-action: pan-y !important;
  pointer-events: auto;
}

/* Ensure touch events work properly */
* {
  touch-action: pan-y;
}

/* Allow touch on buttons */
button {
  touch-action: manipulation;
  pointer-events: auto;
}

/* Like animation */
@keyframes heartFloat {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-20px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
  }
}

.heart-animation {
  animation: heartFloat 1s ease-out forwards;
}

/* Volume slider styles */
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>