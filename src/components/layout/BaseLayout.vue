<template>
    <div class="min-h-screen bg-background font-sans antialiased flex flex-col">
        <!-- Header -->
        <AppHeader />

        <!-- Main Content Area (Flex Body) -->
        <div class="flex-1 relative">
            <div class="container mx-auto max-w-screen-2xl px-0">
                <div class="flex relative" style="min-height: calc(100vh - 3.5rem - 200px)">
                    <!-- Sidebar -->
                    <AppSidebar
                        :is-open="sidebarOpen"
                        :max-height="sidebarMaxHeight"
                        @close="closeSidebar"
                    />

                    <!-- Main Content -->
                    <main
                        class="flex-1 transition-all duration-300 ease-in-out flex flex-col w-full min-w-0"
                        :class="{
                            'lg:ml-64': sidebarOpen,
                            'ml-0': !sidebarOpen,
                        }"
                    >
                        <!-- Content Container -->
                        <div class="px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
                            <!-- Breadcrumbs -->
                            <nav v-if="breadcrumbs.length > 1" class="mb-6" aria-label="Breadcrumb">
                                <ol
                                    class="flex items-center space-x-2 text-sm text-muted-foreground"
                                >
                                    <li
                                        v-for="(crumb, index) in breadcrumbs"
                                        :key="crumb.name"
                                        class="flex items-center"
                                    >
                                        <RouterLink
                                            v-if="index < breadcrumbs.length - 1"
                                            :to="crumb.to"
                                            class="hover:text-foreground transition-colors"
                                        >
                                            {{ crumb.name }}
                                        </RouterLink>
                                        <span v-else class="text-foreground font-medium">
                                            {{ crumb.name }}
                                        </span>
                                        <ChevronRight
                                            v-if="index < breadcrumbs.length - 1"
                                            class="h-4 w-4 mx-2"
                                        />
                                    </li>
                                </ol>
                            </nav>

                            <!-- Page Content -->
                            <slot />
                        </div>
                    </main>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter ref="footerRef" />

        <!-- Sidebar Toggle Button (Mobile) -->
        <button
            @click="toggleSidebar"
            class="fixed bottom-4 left-4 z-50 lg:hidden inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg h-12 w-12 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            :class="{
                'translate-x-64': sidebarOpen,
            }"
        >
            <Filter class="h-5 w-5" />
            <span class="sr-only">Toggle filters</span>
        </button>

        <!-- Back to Top Button -->
        <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <button
                v-show="showBackToTop"
                @click="scrollToTop"
                class="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg h-12 w-12 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
                <ArrowUp class="h-5 w-5" />
                <span class="sr-only">Back to top</span>
            </button>
        </Transition>

        <!-- Loading Overlay -->
        <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isLoading"
                class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
                <div class="flex flex-col items-center space-y-4">
                    <Loader2 class="h-8 w-8 animate-spin text-primary" />
                    <p class="text-sm text-muted-foreground">{{ t('common.loading') }}</p>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { generateBreadcrumbs } from '@/router/utils'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppFooter from './AppFooter.vue'
import { ChevronRight, Filter, ArrowUp, Loader2 } from 'lucide-vue-next'

interface Props {
    loading?: boolean
    showSidebar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    showSidebar: true,
})

const { t } = useAppI18n()
const route = useRoute()

// State
const sidebarOpen = ref(false)
const showBackToTop = ref(false)
const footerHeight = ref(0)
const footerRef = ref<HTMLElement | null>(null)

// Computed
const isLoading = computed(() => props.loading)
const breadcrumbs = computed(() => generateBreadcrumbs(route))
const sidebarMaxHeight = computed(() => {
    // For desktop, use the available space in the flex container
    // For mobile, use viewport height minus header
    return 'calc(100vh - 3.5rem)'
})

// Methods
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
    sidebarOpen.value = false
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

const handleScroll = () => {
    showBackToTop.value = window.scrollY > 300
}

const updateFooterHeight = () => {
    if (footerRef.value) {
        footerHeight.value = footerRef.value.offsetHeight
    }
}

// Watchers
watch(
    () => route.path,
    () => {
        // Close sidebar on route change (mobile)
        if (window.innerWidth < 1024) {
            closeSidebar()
        }
    },
)

// Lifecycle
onMounted(() => {
    // Initialize sidebar state based on screen size and props
    const isLargeScreen = window.innerWidth >= 1024
    sidebarOpen.value = isLargeScreen && props.showSidebar

    // Add scroll listener
    window.addEventListener('scroll', handleScroll)

    // Add resize listener
    const handleResize = () => {
        const isLarge = window.innerWidth >= 1024
        if (!isLarge) {
            sidebarOpen.value = false
        } else if (props.showSidebar) {
            sidebarOpen.value = true
        }
        // Update footer height on resize
        nextTick(updateFooterHeight)
    }

    window.addEventListener('resize', handleResize)

    // Set up ResizeObserver for footer
    const resizeObserver = new ResizeObserver(() => {
        updateFooterHeight()
    })

    // Observe footer changes
    nextTick(() => {
        if (footerRef.value) {
            resizeObserver.observe(footerRef.value)
            updateFooterHeight()
        }
    })

    // Cleanup function will be called in onUnmounted
    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
        resizeObserver.disconnect()
    })
})
</script>
