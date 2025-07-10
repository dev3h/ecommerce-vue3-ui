<template>
    <header
        class="sticky top-0 z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
        <div class="flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <!-- Sidebar Toggle -->
            <div class="flex items-center">
                <!-- Mobile & Desktop Sidebar Toggle - Always Visible -->
                <Button
                    variant="outline"
                    size="icon"
                    @click="handleToggleSidebar"
                    class="mr-3"
                    :title="t('common.menu')"
                >
                    <Menu class="h-5 w-5" />
                    <span class="sr-only">Toggle sidebar</span>
                </Button>
            </div>

            <!-- Admin Navigation & Actions -->
            <div class="flex flex-1 items-center justify-end space-x-4">
                <!-- Search -->
                <div class="relative hidden md:block">
                    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        v-model="searchQuery"
                        type="search"
                        :placeholder="t('admin.search')"
                        class="w-[300px] pl-8"
                        @keyup.enter="handleSearch"
                    />
                </div>

                <!-- Quick Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Notifications -->
                    <Button variant="ghost" size="icon" class="relative">
                        <Bell class="h-4 w-4" />
                        <span
                            v-if="notificationCount > 0"
                            class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center"
                        >
                            {{ notificationCount }}
                        </span>
                        <span class="sr-only">{{ t('admin.notifications') }}</span>
                    </Button>

                    <!-- Theme Toggle -->
                    <Button variant="ghost" size="icon" @click="toggleTheme">
                        <Sun v-if="isDark" class="h-4 w-4" />
                        <Moon v-else class="h-4 w-4" />
                        <span class="sr-only">Toggle theme</span>
                    </Button>

                    <!-- Language Switcher -->
                    <LanguageSwitcher />

                    <!-- Admin Profile Menu -->
                    <DropdownMenu>
                        <template #trigger>
                            <div class="flex items-center px-5 gap-5">
                                <Avatar class="w-7 h-7">
                                    <AvatarFallback class="bg-primary/10">
                                        <User class="w-4 h-4 text-primary" />
                                    </AvatarFallback>
                                </Avatar>
                                <div class="hidden sm:flex flex-col items-start">
                                    <span class="text-sm font-medium">{{ adminUser.name }}</span>
                                    <span class="text-xs text-muted-foreground">{{
                                        adminUser.role
                                    }}</span>
                                </div>
                                <ChevronDown class="w-4 h-4" />
                            </div>
                        </template>

                        <DropdownMenuLabel>
                            <div class="flex flex-col space-y-1">
                                <p class="text-sm font-medium leading-none">{{ adminUser.name }}</p>
                                <p class="text-xs leading-none text-muted-foreground">
                                    {{ adminUser.email }}
                                </p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem @click="navigateToProfile">
                            <Settings class="w-4 h-4 mr-2" />
                            {{ t('admin.profile') }}
                        </DropdownMenuItem>

                        <DropdownMenuItem @click="navigateToSettings">
                            <Cog class="w-4 h-4 mr-2" />
                            {{ t('admin.sidebar.settings') }}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem @click="handleLogout" class="text-destructive">
                            <LogOut class="w-4 h-4 mr-2" />
                            {{ t('navigation.logout') }}
                        </DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </div>
        </div>

        <!-- Mobile Search -->
        <div class="border-t border-border md:hidden">
            <div class="container mx-auto py-3 px-4">
                <div class="relative">
                    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        v-model="searchQuery"
                        type="search"
                        :placeholder="t('admin.search')"
                        class="pl-8"
                        @keyup.enter="handleSearch"
                    />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useAdminAuthStore } from '@/stores/adminAuth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
    Menu,
    Search,
    Bell,
    Sun,
    Moon,
    User,
    ChevronDown,
    Settings,
    Cog,
    LogOut,
} from 'lucide-vue-next'

const emit = defineEmits<{
    'toggle-sidebar': []
}>()

const router = useRouter()
const { t } = useAppI18n()
const authStore = useAdminAuthStore()

// State
const searchQuery = ref('')
const isDark = ref(false)

// Admin user data from auth store
const adminUser = computed(() => {
    const user = authStore.user
    if (!user) {
        return {
            name: 'Admin',
            email: 'admin@example.com',
            role: 'Admin',
        }
    }
    return {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role === 'admin' ? 'Admin' : 'User',
    }
})

// Computed
const notificationCount = computed(() => {
    // Get from notification store
    return 3
})

// Methods
const handleToggleSidebar = () => {
    console.log('Toggle sidebar clicked!') // Debug log
    emit('toggle-sidebar')
}

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({
            name: 'admin-search',
            query: { q: searchQuery.value },
        })
    }
}

const navigateToProfile = () => {
    router.push('/admin/profile')
}

const navigateToSettings = () => {
    router.push('/admin/settings')
}

const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const handleLogout = async () => {
    try {
        // Use auth store logout
        await authStore.logout()
        // Redirect to admin login
        router.push('/admin/login')
    } catch (error) {
        console.error('Logout failed:', error)
        // Force redirect even if logout fails
        router.push('/admin/login')
    }
}

// Lifecycle
onMounted(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
    document.documentElement.classList.toggle('dark', isDark.value)
})
</script>
