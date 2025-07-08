<template>
    <header
        class="sticky top-0 z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
        <div class="flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <!-- Sidebar Toggle -->
            <div class="flex items-center">
                <!-- Mobile & Desktop Sidebar Toggle - Always Visible -->
                <button
                    @click="handleToggleSidebar"
                    class="mr-3 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 border border-border"
                    :title="t('common.menu')"
                >
                    <Menu class="h-5 w-5" />
                    <span class="sr-only">Toggle sidebar</span>
                </button>
            </div>

            <!-- Admin Navigation & Actions -->
            <div class="flex flex-1 items-center justify-end space-x-4">
                <!-- Search -->
                <div class="relative hidden md:block">
                    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="search"
                        :placeholder="t('admin.search')"
                        class="h-9 w-[300px] rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        @keyup.enter="handleSearch"
                    />
                </div>

                <!-- Quick Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Notifications -->
                    <button
                        class="relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                    >
                        <Bell class="h-4 w-4" />
                        <span
                            v-if="notificationCount > 0"
                            class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center"
                        >
                            {{ notificationCount }}
                        </span>
                        <span class="sr-only">{{ t('admin.notifications') }}</span>
                    </button>

                    <!-- Theme Toggle -->
                    <button
                        @click="toggleTheme"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                    >
                        <Sun v-if="isDark" class="h-4 w-4" />
                        <Moon v-else class="h-4 w-4" />
                        <span class="sr-only">Toggle theme</span>
                    </button>

                    <!-- Language Switcher -->
                    <LanguageSwitcher />

                    <!-- Admin Profile Menu -->
                    <div class="relative">
                        <button
                            @click="toggleProfileMenu"
                            class="flex items-center space-x-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <div
                                class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"
                            >
                                <User class="w-4 h-4 text-primary" />
                            </div>
                            <div class="hidden sm:flex flex-col items-start">
                                <span class="text-sm font-medium">{{ adminUser.name }}</span>
                                <span class="text-xs text-muted-foreground">{{
                                    adminUser.role
                                }}</span>
                            </div>
                            <ChevronDown class="w-4 h-4" />
                        </button>

                        <!-- Profile Dropdown -->
                        <Transition
                            enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95"
                        >
                            <div
                                v-show="showProfileMenu"
                                class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-background border border-border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <div class="py-1">
                                    <div class="px-4 py-2 border-b border-border">
                                        <p class="text-sm font-medium">{{ adminUser.name }}</p>
                                        <p class="text-xs text-muted-foreground">
                                            {{ adminUser.email }}
                                        </p>
                                    </div>
                                    <RouterLink
                                        to="/admin/profile"
                                        class="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                        @click="closeProfileMenu"
                                    >
                                        <div class="flex items-center space-x-2">
                                            <Settings class="w-4 h-4" />
                                            <span>{{ t('admin.profile') }}</span>
                                        </div>
                                    </RouterLink>
                                    <RouterLink
                                        to="/admin/settings"
                                        class="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                        @click="closeProfileMenu"
                                    >
                                        <div class="flex items-center space-x-2">
                                            <Cog class="w-4 h-4" />
                                            <span>{{ t('admin.settings') }}</span>
                                        </div>
                                    </RouterLink>
                                    <div class="border-t border-border">
                                        <button
                                            @click="handleLogout"
                                            class="block w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <div class="flex items-center space-x-2">
                                                <LogOut class="w-4 h-4" />
                                                <span>{{ t('navigation.logout') }}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Search -->
        <div class="border-t border-border md:hidden">
            <div class="container mx-auto py-3 px-4">
                <div class="relative">
                    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        v-model="searchQuery"
                        type="search"
                        :placeholder="t('admin.search')"
                        class="h-9 w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        @keyup.enter="handleSearch"
                    />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
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
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const showProfileMenu = ref(false)
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

const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value
}

const closeProfileMenu = () => {
    showProfileMenu.value = false
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
        closeProfileMenu()
        // Redirect to admin login
        router.push('/admin/login')
    } catch (error) {
        console.error('Logout failed:', error)
        // Force redirect even if logout fails
        router.push('/admin/login')
    }
}

const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
        showProfileMenu.value = false
    }
}

// Lifecycle
onMounted(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
    document.documentElement.classList.toggle('dark', isDark.value)

    // Add click outside listener
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
