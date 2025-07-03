<template>
    <div class="min-h-screen bg-background pb-20 lg:pb-0 overflow-x-hidden">
        <!-- Mobile Header -->
        <div class="lg:hidden bg-card border-b border-border p-4 sticky top-0 z-10">
            <div class="flex items-center space-x-3 min-w-0">
                <div
                    class="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
                >
                    <span class="text-sm font-bold text-primary-foreground">
                        {{ userInitials }}
                    </span>
                </div>
                <div class="min-w-0 flex-1">
                    <h2 class="text-lg font-semibold text-foreground truncate">
                        {{ user?.firstName }} {{ user?.lastName }}
                    </h2>
                    <p class="text-sm text-muted-foreground truncate">{{ user?.email }}</p>
                </div>
            </div>
        </div>

        <div class="w-full max-w-full">
            <div class="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-full">
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
                    <!-- Desktop Sidebar -->
                    <div class="lg:col-span-1 hidden lg:block">
                        <Card class="sticky top-4">
                            <CardHeader class="pb-4">
                                <div class="flex items-center space-x-3 lg:space-x-4 min-w-0">
                                    <div
                                        class="w-12 h-12 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
                                >
                                    <span
                                        class="text-lg lg:text-2xl font-bold text-primary-foreground"
                                    >
                                        {{ userInitials }}
                                    </span>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h2
                                        class="text-lg lg:text-xl font-semibold text-foreground truncate"
                                    >
                                        {{ user?.firstName }} {{ user?.lastName }}
                                    </h2>
                                    <p class="text-sm text-muted-foreground truncate">
                                        {{ user?.email }}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent class="pt-0">
                            <nav class="space-y-1" aria-label="Account navigation">
                                <router-link
                                    v-for="item in navigationItems"
                                    :key="item.name"
                                    :to="item.to"
                                    class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full"
                                    :class="
                                        isActive(item.to)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    "
                                >
                                    <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
                                    <span class="truncate">{{ item.label }}</span>
                                </router-link>
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                <!-- Main Content -->
                <div class="lg:col-span-3 w-full min-w-0">
                    <div class="w-full max-w-full overflow-x-hidden">
                        <router-view />
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20">
            <nav class="flex" aria-label="Mobile account navigation">
                <router-link
                    v-for="item in navigationItems"
                    :key="item.name"
                    :to="item.to"
                    class="flex-1 flex flex-col items-center px-1 py-3 text-xs font-medium transition-colors min-w-0"
                    :class="
                        isActive(item.to)
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground'
                    "
                >
                    <component :is="item.icon" class="w-4 h-4 mb-1 flex-shrink-0" />
                    <span class="truncate w-full text-center text-[10px] leading-tight">{{ item.label }}</span>
                </router-link>
            </nav>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppI18n } from '@/composables/useI18n'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { User, ShoppingBag, Settings, Heart, MapPin, Shield } from 'lucide-vue-next'

const { t } = useAppI18n()
const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase()
})

const navigationItems = computed(() => [
    {
        name: 'profile',
        label: t('account.profile'),
        to: '/account/profile',
        icon: User,
    },
    {
        name: 'orders',
        label: t('account.orders'),
        to: '/account/orders',
        icon: ShoppingBag,
    },
    {
        name: 'wishlist',
        label: t('account.wishlist'),
        to: '/account/wishlist',
        icon: Heart,
    },
    {
        name: 'addresses',
        label: t('account.addresses'),
        to: '/account/addresses',
        icon: MapPin,
    },
    {
        name: 'security',
        label: t('account.security'),
        to: '/account/security',
        icon: Shield,
    },
    {
        name: 'settings',
        label: t('account.settings'),
        to: '/account/settings',
        icon: Settings,
    },
])

const isActive = (path: string) => {
    return route.path === path
}
</script>
