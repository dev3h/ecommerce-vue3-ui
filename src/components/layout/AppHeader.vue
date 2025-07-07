<template>
    <header
        class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
        <div class="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
            <!-- Logo -->
            <div class="mr-4 flex">
                <RouterLink to="/" class="mr-6 flex items-center space-x-2">
                    <svg
                        class="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                        <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                        <path d="M12 3v6" />
                    </svg>
                    <span class="hidden font-bold lg:inline-block">
                        {{ t('meta.defaultTitle') }}
                    </span>
                </RouterLink>
            </div>

            <!-- Desktop Navigation -->
            <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div class="w-full flex-1 md:w-auto md:flex-none">
                    <!-- Search Bar -->
                    <div class="relative hidden md:block">
                        <Search
                            class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70"
                        />
                        <Input
                            v-model="searchQuery"
                            type="search"
                            :placeholder="t('common.search')"
                            class="w-[300px] pl-8"
                            @keyup.enter="handleSearch"
                        />
                    </div>
                </div>

                <!-- Navigation Items -->
                <nav
                    class="hidden md:flex items-center space-x-6 text-sm font-medium"
                    aria-label="Main navigation"
                >
                    <RouterLink
                        to="/products"
                        class="transition-colors hover:text-foreground/80 text-foreground/60"
                        :class="{ 'text-foreground': isRouteActive('/products') }"
                    >
                        {{ t('navigation.products') }}
                    </RouterLink>
                    <RouterLink
                        to="/categories"
                        class="transition-colors hover:text-foreground/80 text-foreground/60"
                        :class="{ 'text-foreground': isRouteActive('/categories') }"
                    >
                        {{ t('navigation.categories') }}
                    </RouterLink>
                </nav>

                <!-- Right Side Actions -->
                <div class="flex items-center space-x-2">
                    <!-- Language Switcher -->
                    <LanguageSwitcher />

                    <!-- Theme Toggle -->
                    <Button @click="toggleTheme" variant="ghost" size="sm" class="h-9 w-9">
                        <Sun v-if="isDark" class="h-4 w-4" />
                        <Moon v-else class="h-4 w-4" />
                        <span class="sr-only">Toggle theme</span>
                    </Button>

                    <!-- Cart -->
                    <Button asChild variant="ghost" size="sm" class="h-9 w-9">
                        <RouterLink to="/cart">
                            <CartBadge :count="cartItemsCount">
                                <ShoppingCart class="h-4 w-4" />
                            </CartBadge>
                            <span class="sr-only">{{ t('navigation.cart') }}</span>
                        </RouterLink>
                    </Button>

                    <!-- User Menu -->
                    <div class="relative">
                        <Button @click="toggleUserMenu" variant="ghost" size="sm" class="h-9 w-9">
                            <User class="h-4 w-4" />
                            <span class="sr-only">User menu</span>
                        </Button>

                        <!-- User Dropdown -->
                        <Transition
                            enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95"
                        >
                            <div
                                v-show="showUserMenu"
                                class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-border focus:outline-none"
                            >
                                <div class="py-1">
                                    <template v-if="isAuthenticated">
                                        <button
                                            @click="goToAccount"
                                            class="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            {{ t('navigation.account') }}
                                        </button>
                                        <RouterLink
                                            to="/account/orders"
                                            class="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                                            @click="closeUserMenu"
                                        >
                                            {{ t('account.orders') }}
                                        </RouterLink>
                                        <RouterLink
                                            v-if="isAdmin"
                                            to="/admin"
                                            class="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground border-t border-border"
                                            @click="closeUserMenu"
                                        >
                                            {{ t('admin.title') }}
                                        </RouterLink>
                                        <Button
                                            @click="handleLogout"
                                            variant="ghost"
                                            size="sm"
                                            class="w-full justify-start"
                                        >
                                            {{ t('navigation.logout') }}
                                        </Button>
                                    </template>
                                    <template v-else>
                                        <RouterLink
                                            to="/login"
                                            class="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                                            @click="closeUserMenu"
                                        >
                                            {{ t('navigation.login') }}
                                        </RouterLink>
                                        <RouterLink
                                            to="/register"
                                            class="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                                            @click="closeUserMenu"
                                        >
                                            {{ t('navigation.register') }}
                                        </RouterLink>
                                    </template>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <!-- Mobile Menu Toggle -->
                    <Button
                        @click="toggleMobileMenu"
                        variant="ghost"
                        size="sm"
                        class="h-9 w-9 md:hidden"
                    >
                        <Menu v-if="!showMobileMenu" class="h-4 w-4" />
                        <X v-else class="h-4 w-4" />
                        <span class="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
        </div>

        <!-- Mobile Navigation -->
        <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 -translate-y-2"
            enter-to-class="transform opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 translate-y-0"
            leave-to-class="transform opacity-0 -translate-y-2"
        >
            <div v-show="showMobileMenu" class="md:hidden border-t border-border">
                <div class="container mx-auto py-4 space-y-4 px-4 sm:px-6 lg:px-8">
                    <!-- Mobile Search -->
                    <div class="relative">
                        <Search
                            class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70"
                        />
                        <Input
                            v-model="searchQuery"
                            type="search"
                            :placeholder="t('common.search')"
                            class="pl-8"
                            @keyup.enter="handleSearch"
                        />
                    </div>

                    <!-- Mobile Navigation Links -->
                    <nav class="space-y-2" aria-label="Mobile navigation">
                        <RouterLink
                            to="/products"
                            class="block py-2 text-sm font-medium transition-colors hover:text-primary"
                            @click="closeMobileMenu"
                        >
                            {{ t('navigation.products') }}
                        </RouterLink>
                        <RouterLink
                            to="/categories"
                            class="block py-2 text-sm font-medium transition-colors hover:text-primary"
                            @click="closeMobileMenu"
                        >
                            {{ t('navigation.categories') }}
                        </RouterLink>
                    </nav>
                </div>
            </div>
        </Transition>
    </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'
import { useCart } from '@/composables/useCart'
import { useToast } from '@/composables/useToast'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import CartBadge from '@/components/CartBadge.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ShoppingCart, User, Menu, X, Sun, Moon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { t } = useAppI18n()
const authStore = useAuthStore()
const { totalItems } = useCart()
const { success: showSuccess, error: showError } = useToast()

// State
const searchQuery = ref('')
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const isDark = ref(false)

// Computed
const cartItemsCount = computed(() => totalItems.value)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)

// Methods
const isRouteActive = (path: string) => {
    return route.path.startsWith(path)
}

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({
            name: 'products',
            query: { search: searchQuery.value },
        })
        closeMobileMenu()
    }
}

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
    showUserMenu.value = false
}

const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
    showMobileMenu.value = false
}

const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const handleLogout = async () => {
    try {
        authStore.logout()
        closeUserMenu()

        showSuccess(t('auth.signOut'), t('auth.logoutSuccess'))

        // Redirect to home page
        router.push('/')
    } catch (error: any) {
        showError(t('common.error'), error.message || t('auth.logoutError'))
    }
}

const goToAccount = () => {
    closeUserMenu()
    // Navigate to /account/profile directly to avoid redirect issues
    router.push('/account/profile')
}

const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
        showUserMenu.value = false
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
