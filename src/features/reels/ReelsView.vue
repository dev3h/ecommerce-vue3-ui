<template>
  <div class="reels-view relative w-full h-screen bg-black">
    <div class="absolute inset-0 overflow-y-auto touch-pan-y">
      <div
        v-for="(reel, idx) in reels"
        :key="reel.id"
        class="reel-item w-full h-screen flex items-center justify-center"
        :style="{ position: idx === currentIndex ? 'relative' : 'absolute', top: 0, left: 0, zIndex: idx === currentIndex ? 2 : 1, opacity: idx === currentIndex ? 1 : 0 }"
      >
        <ReelPlayer
          :reel="reel"
          :isActive="idx === currentIndex"
          :autoPlay="idx === currentIndex"
          @play="onPlay(idx)"
          @pause="onPause(idx)"
          @ended="onEnded(idx)"
        />
        <!-- Overlay: Product, Like, Share -->
        <div class="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
          <button @click="toggleLike(reel)" class="bg-black/60 rounded-full p-3 text-white flex flex-col items-center">
            <svg v-if="reel.is_liked" class="w-7 h-7 text-red-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg v-else class="w-7 h-7" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span class="text-xs mt-1">{{ reel.stats.likes }}</span>
          </button>
          <button @click="shareReel(reel)" class="bg-black/60 rounded-full p-3 text-white flex flex-col items-center">
            <svg class="w-7 h-7" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span class="text-xs mt-1">{{ reel.stats.shares }}</span>
          </button>
          <button v-if="reel.product" @click="goToProduct(reel.product.id)" class="bg-white/90 rounded-full p-3 shadow-lg flex flex-col items-center">
            <img :src="reel.product.image" :alt="reel.product.name" class="w-10 h-10 rounded-full object-cover mb-1" />
            <span class="text-xs text-black font-semibold">Xem SP</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Swipe gesture area -->
    <div class="absolute inset-0 z-20" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReels } from '@/composables/useReels'
import ReelPlayer from './ReelPlayer.vue'

const router = useRouter()
const { reels, loadReels, toggleLike, shareReel } = useReels()
const currentIndex = ref(0)

onMounted(() => {
  loadReels(true)
})

const onPlay = (idx: number) => {}
const onPause = (idx: number) => {}
const onEnded = (idx: number) => {
  if (idx < reels.value.length - 1) {
    currentIndex.value = idx + 1
  }
}

const goToProduct = (productId: string) => {
  router.push(`/product/${productId}`)
}

// Swipe gesture logic
let startY = 0
let deltaY = 0
const onTouchStart = (e: TouchEvent) => {
  startY = e.touches[0].clientY
}
const onTouchMove = (e: TouchEvent) => {
  deltaY = e.touches[0].clientY - startY
}
const onTouchEnd = () => {
  if (deltaY < -50 && currentIndex.value < reels.value.length - 1) {
    currentIndex.value++
  } else if (deltaY > 50 && currentIndex.value > 0) {
    currentIndex.value--
  }
  deltaY = 0
}
</script>

<style scoped>
.reels-view {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}
.reel-item {
  width: 100vw;
  height: 100vh;
  transition: opacity 0.3s;
}
</style>
