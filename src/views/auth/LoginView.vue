<template>
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <!-- Logo -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center gap-2 mb-6">
                    <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm">🛒</span>
                    </div>
                    <span class="text-xl font-bold text-foreground">Nest Grocer</span>
                </div>
                <h1 class="text-2xl font-bold text-foreground mb-2">
                    {{ t('auth.signIn') }}
                </h1>
                <p class="text-muted-foreground">
                    {{ t('auth.signInSubtitle') }}
                </p>
            </div>

            <!-- Login Form Card -->
            <Card class="p-6">
                <form @submit.prevent="handleLogin" class="space-y-4">
                    <!-- Email Field -->
                    <div class="space-y-2">
                        <Label for="email">
                            {{ t('auth.email') }}
                        </Label>
                        <Input
                            id="email"
                            v-model="form.email"
                            type="email"
                            :placeholder="t('auth.emailPlaceholder')"
                            :disabled="isLoading"
                            required
                            class="w-full"
                            :class="{ 'border-destructive': errors.email }"
                        />
                        <div v-if="errors.email" class="text-sm text-destructive">
                            {{ errors.email }}
                        </div>
                    </div>

                    <!-- Password Field -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <Label for="password">
                                {{ t('auth.password') }}
                            </Label>
                            <router-link
                                to="/forgot-password"
                                class="text-sm text-primary hover:underline"
                            >
                                {{ t('auth.forgotPassword') }}
                            </router-link>
                        </div>
                        <div class="relative">
                            <Input
                                id="password"
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                :placeholder="t('auth.passwordPlaceholder')"
                                :disabled="isLoading"
                                required
                                class="w-full pr-10"
                                :class="{ 'border-destructive': errors.password }"
                            />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                :disabled="isLoading"
                            >
                                <Eye v-if="!showPassword" class="w-4 h-4" />
                                <EyeOff v-else class="w-4 h-4" />
                            </button>
                        </div>
                        <div v-if="errors.password" class="text-sm text-destructive">
                            {{ errors.password }}
                        </div>
                    </div>

                    <!-- Remember Me -->
                    <div class="flex items-center space-x-2">
                        <Checkbox id="remember" v-model="form.rememberMe" />
                        <Label
                            for="remember"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {{ t('auth.rememberMe') }}
                        </Label>
                    </div>

                    <!-- Error Message -->
                    <div v-if="errors.general" class="text-sm text-destructive text-center">
                        {{ errors.general }}
                    </div>

                    <!-- Login Button -->
                    <Button
                        type="submit"
                        class="w-full"
                        :disabled="isLoading || !isFormValid"
                        size="lg"
                    >
                        <div v-if="isLoading" class="flex items-center gap-2">
                            <div
                                class="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"
                            ></div>
                            {{ t('auth.signingIn') }}
                        </div>
                        <span v-else>{{ t('auth.signIn') }}</span>
                    </Button>
                </form>

                <!-- Divider -->
                <div class="relative my-6">
                    <div class="absolute inset-0 flex items-center">
                        <span class="w-full border-t border-border" />
                    </div>
                    <div class="relative flex justify-center text-xs uppercase">
                        <span class="bg-background px-2 text-muted-foreground">
                            {{ t('auth.orSignInWith') }}
                        </span>
                    </div>
                </div>

                <!-- Social Login -->
                <div class="space-y-3">
                    <Button
                        type="button"
                        variant="outline"
                        class="w-full"
                        @click="handleSocialLogin('google')"
                        :disabled="isLoading"
                    >
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            {{ t('auth.signInWithGoogle') }}
                        </div>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        class="w-full"
                        @click="handleSocialLogin('facebook')"
                        :disabled="isLoading"
                    >
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                />
                            </svg>
                            {{ t('auth.signInWithFacebook') }}
                        </div>
                    </Button>
                </div>
            </Card>

            <!-- Sign Up Link -->
            <div class="text-center mt-6">
                <p class="text-muted-foreground">
                    {{ t('auth.dontHaveAccount') }}
                    <router-link to="/register" class="text-primary font-medium hover:underline">
                        {{ t('auth.signUp') }}
                    </router-link>
                </p>
            </div>

            <!-- Demo Credentials -->
            <Card class="mt-6 p-4 bg-accent/50">
                <h3 class="font-medium text-foreground mb-3">{{ t('auth.demoCredentials') }}</h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between items-center">
                        <span class="text-muted-foreground">{{ t('auth.demoAccount') }}:</span>
                        <button
                            @click="fillCredentials('user')"
                            class="text-primary hover:underline font-mono bg-primary/10 px-2 py-1 rounded transition-colors"
                        >
                            user@example.com / user123
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

// Components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

// Icons
import { Eye, EyeOff } from 'lucide-vue-next'

const { t } = useAppI18n()
const router = useRouter()
const authStore = useAuthStore()
const { success: showSuccess, error: showError, info: showInfo } = useToast()

// Form state
const form = ref({
    email: '',
    password: '',
    rememberMe: false,
})

const showPassword = ref(false)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

// Computed
const isFormValid = computed(() => {
    return form.value.email && form.value.password && !isLoading.value
})

// Methods
const validateForm = () => {
    errors.value = {}

    if (!form.value.email) {
        errors.value.email = t('auth.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
        errors.value.email = t('auth.emailInvalid')
    }

    if (!form.value.password) {
        errors.value.password = t('auth.passwordRequired')
    } else if (form.value.password.length < 6) {
        errors.value.password = t('auth.passwordMinLength')
    }

    return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
    if (!validateForm()) return

    isLoading.value = true
    errors.value = {}

    try {
        await authStore.login(form.value.email, form.value.password, form.value.rememberMe)

        showSuccess(t('auth.loginSuccess'), t('auth.welcomeBack'))

        // Redirect to intended page or home
        const redirect = router.currentRoute.value.query.redirect as string
        router.push(redirect || '/')
    } catch (error: any) {
        errors.value.general = error.message || t('auth.loginError')
        showError(t('auth.loginFailed'), error.message || t('auth.loginError'))
    } finally {
        isLoading.value = false
    }
}

const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    showInfo(t('auth.comingSoon'), t('auth.socialLoginNotImplemented'))
}

const fillCredentials = (type: 'user') => {
    form.value.email = 'user@example.com'
    form.value.password = 'user123'
}
</script>
