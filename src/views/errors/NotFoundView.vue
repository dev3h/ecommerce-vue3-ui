<template>
    <div class="min-h-screen bg-background flex items-center justify-center px-4">
        <div class="max-w-2xl mx-auto text-center">
            <!-- 404 Illustration -->
            <div class="mb-8">
                <div class="relative">
                    <!-- Large 404 Text -->
                    <h1 class="text-9xl md:text-[12rem] font-bold text-primary/20 select-none">
                        404
                    </h1>

                    <!-- Floating Elements -->
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="relative">
                            <!-- Search Icon -->
                            <div
                                class="w-32 h-32 md:w-40 md:h-40 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto animate-bounce"
                            >
                                <SearchIcon class="w-16 h-16 md:w-20 md:h-20 text-primary" />
                            </div>

                            <!-- Floating dots -->
                            <div
                                class="absolute -top-4 -right-4 w-3 h-3 bg-primary rounded-full animate-pulse"
                            ></div>
                            <div
                                class="absolute -bottom-4 -left-4 w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300"
                            ></div>
                            <div
                                class="absolute top-8 -left-8 w-1 h-1 bg-primary rounded-full animate-pulse delay-700"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="space-y-6">
                <div>
                    <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {{ t('errors.pageNotFound') }}
                    </h2>
                    <p class="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                        {{ t('errors.pageNotFoundDescription') }}
                    </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button @click="goHome" size="lg" class="min-w-[140px]">
                        <HomeIcon class="w-4 h-4 mr-2" />
                        {{ t('errors.goHome') }}
                    </Button>

                    <Button @click="goBack" variant="outline" size="lg" class="min-w-[140px]">
                        <ArrowLeftIcon class="w-4 h-4 mr-2" />
                        {{ t('errors.goBack') }}
                    </Button>
                </div>

                <!-- Search Suggestions -->
                <div class="pt-8 border-t border-border mt-12">
                    <h3 class="text-lg font-semibold text-foreground mb-4">
                        {{ t('errors.searchSuggestions') }}
                    </h3>
                    <div class="flex flex-wrap gap-2 justify-center">
                        <Button
                            v-for="suggestion in searchSuggestions"
                            :key="suggestion.path"
                            variant="ghost"
                            size="sm"
                            @click="navigateTo(suggestion.path)"
                            class="text-sm"
                        >
                            {{ suggestion.label }}
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Background decoration -->
            <div class="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    class="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl"
                ></div>
                <div
                    class="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-xl"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { SearchIcon, HomeIcon, ArrowLeftIcon } from 'lucide-vue-next'

const { t } = useAppI18n()
const router = useRouter()

// Search suggestions for common pages
const searchSuggestions = computed(() => [
    { label: t('navigation.home'), path: '/' },
    { label: t('navigation.products'), path: '/products' },
    { label: t('navigation.account'), path: '/account' },
    { label: t('navigation.cart'), path: '/cart' },
])

const goHome = () => {
    router.push('/')
}

const goBack = () => {
    if (window.history.length > 1) {
        router.go(-1)
    } else {
        router.push('/')
    }
}

const navigateTo = (path: string) => {
    router.push(path)
}
</script>

<style scoped>
/* Custom animations */
@keyframes float {
    0%,
    100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}
</style>
