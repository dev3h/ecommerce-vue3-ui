<template>
    <div class="reels-layout min-h-screen bg-black overflow-hidden lg:-ml-64">
        <!-- Mobile Status Bar Spacer -->
        <div v-if="isMobile" class="h-safe-top bg-black"></div>
        
        <!-- Desktop Header -->
        <div v-if="!isMobile && !isFullscreen" class="reels-header bg-background/95 backdrop-blur border-b border-border">
            <div class="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                <button
                    @click="goBack"
                    class="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <ChevronLeftIcon class="w-6 h-6" />
                </button>
                
                <h1 class="text-lg font-semibold">{{ t('home.reels.title') }}</h1>
                
                <button
                    @click="$emit('toggleFullscreen')"
                    class="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <ArrowsPointingOutIcon class="w-6 h-6" />
                </button>
            </div>
        </div>

        <!-- Reels Content -->
        <main 
            class="reels-main"
            :class="{
                'fixed inset-0 z-50': isFullscreen,
                'h-screen pb-8': !isMobile && !isFullscreen, // Desktop - full height with bottom padding
                'h-[calc(100vh-10rem)] pb-32': isMobile && !isFullscreen, // Mobile - account for bottom nav + extra padding
                'h-[calc(100vh-3.5rem-10rem)] pb-32': isMobile && !isFullscreen && showHeader, // Mobile with header
            }"
        >
            <slot />
        </main>

        <!-- Bottom Navigation for Mobile (only show when not fullscreen) -->
        <div v-if="isMobile && !isFullscreen" class="h-16 bg-background border-t border-border">
            <BottomNavigation />
        </div>

        <!-- Safe area bottom padding for iOS -->
        <div v-if="isMobile" class="h-safe-bottom bg-black"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon, ArrowsPointingOutIcon } from '@heroicons/vue/24/outline'
import { useAppI18n } from '@/composables/useI18n'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'

interface Props {
    isFullscreen?: boolean
    showHeader?: boolean
}

withDefaults(defineProps<Props>(), {
    isFullscreen: false,
    showHeader: false
})

defineEmits<{
    toggleFullscreen: []
}>()

const router = useRouter()
const { t } = useAppI18n()

// Reactive values
const isMobile = computed(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
})

// Methods
const goBack = () => {
    router.back()
}

// Prevent body scroll when reels is active
onMounted(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
})

onUnmounted(() => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.reels-layout {
    position: relative;
    height: 100vh;
    overflow: hidden;
}

.reels-main {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
}

/* Safe area support for iOS */
.h-safe-top {
    height: env(safe-area-inset-top);
}

.h-safe-bottom {
    height: env(safe-area-inset-bottom);
}

/* Desktop styles */
@media (min-width: 768px) {
    .reels-main {
        max-width: 400px;
    }
}

/* Hide scrollbar */
.reels-layout::-webkit-scrollbar {
    display: none;
}

.reels-layout {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
