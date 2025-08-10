<template>
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
        <div class="flex items-center justify-around h-16 px-4">
            <!-- Home -->
            <RouterLink
                to="/"
                class="flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 group"
                :class="{ 'text-primary': isActiveRoute('/') }"
            >
                <div class="relative">
                    <svg class="w-5 h-5 transition-colors" :class="isActiveRoute('/') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <div v-if="isActiveRoute('/')" class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span class="text-xs font-medium truncate" :class="isActiveRoute('/') ? 'text-primary' : 'text-muted-foreground'">
                    {{ t('navigation.home') }}
                </span>
            </RouterLink>

            <!-- Products -->
            <RouterLink
                to="/products"
                class="flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 group"
                :class="{ 'text-primary': isActiveRoute('/products') }"
            >
                <div class="relative">
                    <svg class="w-5 h-5 transition-colors" :class="isActiveRoute('/products') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    <div v-if="isActiveRoute('/products')" class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span class="text-xs font-medium truncate" :class="isActiveRoute('/products') ? 'text-primary' : 'text-muted-foreground'">
                    {{ t('navigation.products') }}
                </span>
            </RouterLink>

            <!-- Reels -->
            <RouterLink
                to="/reels"
                class="flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 group relative"
                :class="{ 'text-primary': isActiveRoute('/reels') }"
            >
                <div class="relative">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="isActiveRoute('/reels') ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-muted-foreground/10 group-hover:bg-muted-foreground/20'">
                        <svg class="w-4 h-4 transition-colors" :class="isActiveRoute('/reels') ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <!-- Hot Badge -->
                    <div v-if="!isActiveRoute('/reels')" class="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        HOT
                    </div>
                </div>
                <span class="text-xs font-medium truncate" :class="isActiveRoute('/reels') ? 'text-primary' : 'text-muted-foreground'">
                    Reels
                </span>
            </RouterLink>

            <!-- Categories -->
            <RouterLink
                to="/categories"
                class="flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 group"
                :class="{ 'text-primary': isActiveRoute('/categories') }"
            >
                <div class="relative">
                    <svg class="w-5 h-5 transition-colors" :class="isActiveRoute('/categories') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    <div v-if="isActiveRoute('/categories')" class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span class="text-xs font-medium truncate" :class="isActiveRoute('/categories') ? 'text-primary' : 'text-muted-foreground'">
                    {{ t('navigation.categories') }}
                </span>
            </RouterLink>

            <!-- Account -->
            <RouterLink
                to="/account"
                class="flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 group"
                :class="{ 'text-primary': isActiveRoute('/account') }"
            >
                <div class="relative">
                    <svg class="w-5 h-5 transition-colors" :class="isActiveRoute('/account') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <div v-if="isActiveRoute('/account')" class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span class="text-xs font-medium truncate" :class="isActiveRoute('/account') ? 'text-primary' : 'text-muted-foreground'">
                    {{ t('navigation.account') }}
                </span>
            </RouterLink>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'

const route = useRoute()
const { t } = useAppI18n()

const currentPath = computed(() => route.path)

const isActiveRoute = (path: string) => {
    if (path === '/') {
        return currentPath.value === '/'
    }
    return currentPath.value.startsWith(path)
}
</script>

<style scoped>
/* Smooth transitions */
.router-link-active {
    transition: all 0.2s ease-in-out;
}

/* Prevent text selection on navigation items */
nav a {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
}

/* Active state animations */
.router-link-active .w-2.h-2 {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

/* Gradient animation for Reels button */
.bg-gradient-to-r.from-pink-500.to-purple-600 {
    background: linear-gradient(45deg, #ec4899, #8b5cf6);
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
