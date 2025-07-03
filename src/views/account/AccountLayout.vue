<template>
    <div class="min-h-screen bg-background">
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Sidebar -->
                <div class="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <div class="flex items-center space-x-4">
                                <div
                                    class="w-16 h-16 bg-primary rounded-full flex items-center justify-center"
                                >
                                    <span class="text-2xl font-bold text-primary-foreground">
                                        {{ userInitials }}
                                    </span>
                                </div>
                                <div>
                                    <h2 class="text-xl font-semibold text-foreground">
                                        {{ user?.firstName }} {{ user?.lastName }}
                                    </h2>
                                    <p class="text-muted-foreground">{{ user?.email }}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <nav class="space-y-2">
                                <router-link
                                    v-for="item in navigationItems"
                                    :key="item.name"
                                    :to="item.to"
                                    class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                    :class="
                                        isActive(item.to)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    "
                                >
                                    <component :is="item.icon" class="w-4 h-4" />
                                    <span>{{ item.label }}</span>
                                </router-link>
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                <!-- Main Content -->
                <div class="md:col-span-3">
                    <router-view />
                </div>
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
