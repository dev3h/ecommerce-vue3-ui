<template>
    <footer class="border-t border-border bg-background">
        <div class="container mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
            <!-- Main Footer Content -->
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                <!-- Company Info -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
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
                        <span class="font-bold text-lg">{{ t('meta.defaultTitle') }}</span>
                    </div>
                    <p class="text-sm text-muted-foreground">
                        {{ t('footer.description') }}
                    </p>
                    <div class="flex space-x-4">
                        <a
                            href="#"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook class="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter class="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram class="h-5 w-5" />
                        </a>
                        <a
                            href="#"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin class="h-5 w-5" />
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="space-y-4">
                    <h3 class="text-sm font-semibold">{{ t('footer.quickLinks') }}</h3>
                    <ul class="space-y-2 text-sm">
                        <li>
                            <RouterLink
                                to="/products"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('navigation.products') }}
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink
                                to="/categories"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('navigation.categories') }}
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink
                                to="/cart"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('navigation.cart') }}
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink
                                to="/account"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('navigation.account') }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <!-- Customer Service -->
                <div class="space-y-4">
                    <h3 class="text-sm font-semibold">{{ t('footer.customerService') }}</h3>
                    <ul class="space-y-2 text-sm">
                        <li>
                            <RouterLink
                                to="/help"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('footer.help') }}
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink
                                to="/shipping"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('footer.shipping') }}
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink
                                to="/returns"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('footer.returns') }}
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink
                                to="/contact"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('common.contact') }}
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink
                                to="/faq"
                                class="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {{ t('footer.faq') }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="space-y-4">
                    <h3 class="text-sm font-semibold">{{ t('footer.newsletter') }}</h3>
                    <p class="text-sm text-muted-foreground">
                        {{ t('footer.newsletterDescription') }}
                    </p>
                    <form @submit.prevent="handleSubscribe" class="space-y-2">
                        <Input
                            v-model="email"
                            type="email"
                            :placeholder="t('auth.email')"
                            required
                        />
                        <Button type="submit" :disabled="isSubscribing" class="w-full">
                            <span v-if="!isSubscribing">{{ t('footer.subscribe') }}</span>
                            <span v-else class="flex items-center justify-center">
                                <Loader2 class="h-4 w-4 animate-spin mr-2" />
                                {{ t('common.loading') }}
                            </span>
                        </Button>
                    </form>
                </div>
            </div>

            <!-- Newsletter Success Message -->
            <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 translate-y-2"
                enter-to-class="transform opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 translate-y-0"
                leave-to-class="transform opacity-0 translate-y-2"
            >
                <div
                    v-if="showSuccessMessage"
                    class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
                >
                    <p class="text-sm text-green-800 dark:text-green-200">
                        {{ t('footer.subscriptionSuccess') }}
                    </p>
                </div>
            </Transition>

            <!-- Divider -->
            <div class="mt-12 border-t border-border pt-8">
                <div
                    class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                >
                    <!-- Copyright -->
                    <p class="text-sm text-muted-foreground">
                        © {{ currentYear }} {{ t('meta.defaultTitle') }}.
                        {{ t('footer.allRightsReserved') }}
                    </p>

                    <!-- Legal Links -->
                    <div class="flex space-x-4 text-sm">
                        <RouterLink
                            to="/privacy"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {{ t('footer.privacy') }}
                        </RouterLink>
                        <RouterLink
                            to="/terms"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {{ t('footer.terms') }}
                        </RouterLink>
                        <RouterLink
                            to="/cookies"
                            class="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {{ t('footer.cookies') }}
                        </RouterLink>
                    </div>
                </div>

                <!-- Payment Methods -->
                <div
                    class="mt-8 flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0"
                >
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-muted-foreground"
                            >{{ t('footer.paymentMethods') }}:</span
                        >
                        <div class="flex space-x-2">
                            <div
                                class="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
                            >
                                <CreditCard class="h-3 w-3" />
                            </div>
                            <div
                                class="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold"
                            >
                                V
                            </div>
                            <div
                                class="w-8 h-5 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold"
                            >
                                M
                            </div>
                            <div
                                class="w-8 h-5 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold"
                            >
                                P
                            </div>
                        </div>
                    </div>

                    <!-- Security Badge -->
                    <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Shield class="h-4 w-4" />
                        <span>{{ t('footer.secureCheckout') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Loader2,
    CreditCard,
    Shield,
} from 'lucide-vue-next'

const { t } = useAppI18n()

// State
const email = ref('')
const isSubscribing = ref(false)
const showSuccessMessage = ref(false)

// Computed
const currentYear = computed(() => new Date().getFullYear())

// Methods
const handleSubscribe = async () => {
    if (!email.value) return

    isSubscribing.value = true

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Show success message
        showSuccessMessage.value = true
        email.value = ''

        // Hide success message after 5 seconds
        setTimeout(() => {
            showSuccessMessage.value = false
        }, 5000)
    } catch (error) {
        console.error('Newsletter subscription failed:', error)
    } finally {
        isSubscribing.value = false
    }
}
</script>
