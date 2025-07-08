<template>
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <!-- Logo & Header -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center gap-2 mb-6">
                    <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Shield class="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span class="text-xl font-bold text-foreground">{{
                        t('meta.defaultTitle')
                    }}</span>
                </div>
                <h1 class="text-3xl font-bold text-foreground mb-2">
                    {{ t('admin.login.title') }}
                </h1>
                <p class="text-muted-foreground">
                    {{ t('admin.login.subtitle') }}
                </p>
            </div>

            <!-- Login Form Card -->
            <Card class="p-6 shadow-lg">
                <form @submit.prevent="handleLogin" class="space-y-6">
                    <!-- Email Field -->
                    <div class="space-y-2">
                        <Label for="admin-email" class="text-sm font-medium">
                            {{ t('auth.email') }}
                        </Label>
                        <div class="relative">
                            <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="admin-email"
                                v-model="form.email"
                                type="email"
                                :placeholder="t('admin.login.emailPlaceholder')"
                                :disabled="isLoading"
                                required
                                class="pl-10"
                                :class="{ 'border-destructive': errors.email }"
                                autocomplete="username"
                            />
                        </div>
                        <div
                            v-if="errors.email"
                            class="text-sm text-destructive flex items-center gap-1"
                        >
                            <AlertCircle class="h-3 w-3" />
                            {{ errors.email }}
                        </div>
                    </div>

                    <!-- Password Field -->
                    <div class="space-y-2">
                        <Label for="admin-password" class="text-sm font-medium">
                            {{ t('auth.password') }}
                        </Label>
                        <div class="relative">
                            <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="admin-password"
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                :placeholder="t('admin.login.passwordPlaceholder')"
                                :disabled="isLoading"
                                required
                                class="pl-10 pr-10"
                                :class="{ 'border-destructive': errors.password }"
                                autocomplete="current-password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                class="absolute right-0 top-0 h-full px-3"
                                @click="togglePasswordVisibility"
                                :disabled="isLoading"
                            >
                                <Eye v-if="!showPassword" class="h-4 w-4" />
                                <EyeOff v-else class="h-4 w-4" />
                            </Button>
                        </div>
                        <div
                            v-if="errors.password"
                            class="text-sm text-destructive flex items-center gap-1"
                        >
                            <AlertCircle class="h-3 w-3" />
                            {{ errors.password }}
                        </div>
                    </div>

                    <!-- Remember Me -->
                    <div class="flex items-center space-x-2">
                        <Checkbox
                            id="remember-admin"
                            v-model:checked="form.rememberMe"
                            :disabled="isLoading"
                        />
                        <Label for="remember-admin" class="text-sm font-medium cursor-pointer">
                            {{ t('auth.rememberMe') }}
                        </Label>
                    </div>

                    <!-- Error Message -->
                    <div
                        v-if="errorMessage"
                        class="bg-destructive/10 border border-destructive/20 rounded-md p-3"
                    >
                        <div class="flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle class="h-4 w-4" />
                            {{ errorMessage }}
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <Button type="submit" class="w-full" :disabled="isLoading" size="lg">
                        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                        <LogIn v-else class="mr-2 h-4 w-4" />
                        {{ isLoading ? t('auth.signingIn') : t('admin.login.signIn') }}
                    </Button>

                    <!-- Forgot Password Link -->
                    <div class="text-center">
                        <RouterLink
                            to="/admin/forgot-password"
                            class="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            {{ t('admin.forgotPassword') }}
                        </RouterLink>
                    </div>

                    <!-- Back to Main Site -->
                    <div class="text-center pt-4">
                        <RouterLink
                            to="/"
                            class="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                        >
                            <ArrowLeft class="h-3 w-3" />
                            {{ t('admin.login.backToMainSite') }}
                        </RouterLink>
                    </div>
                </form>
            </Card>

            <!-- Demo Credentials -->
            <Card class="mt-6 p-4 bg-accent/50 border-border">
                <h3 class="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Shield class="h-4 w-4" />
                    {{ t('admin.login.demoCredentials') }}
                </h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between items-center">
                        <span class="text-muted-foreground"
                            >{{ t('admin.login.adminAccount') }}:</span
                        >
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            @click="fillCredentials('admin')"
                            class="text-primary hover:bg-primary/10 font-mono text-xs px-3 py-1 h-auto"
                            :disabled="isLoading"
                        >
                            admin@nestgrocer.com / admin123
                        </Button>
                    </div>
                    <p class="text-xs text-muted-foreground">
                        {{ t('admin.login.clickToFill') }}
                    </p>
                </div>
            </Card>

            <!-- Footer -->
            <div class="text-center mt-6 text-xs text-muted-foreground">
                {{ t('admin.login.secureLogin') }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'

// Components
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

// Icons
import {
    Shield,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    Loader2,
    LogIn,
    ArrowLeft,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useAppI18n()
const { success, error } = useToast()

// Form state
const form = reactive({
    email: '',
    password: '',
    rememberMe: false,
})

// UI state
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// Form validation errors
const errors = reactive({
    email: '',
    password: '',
})

// Computed
const isFormValid = computed(() => {
    return form.email && form.password && !errors.email && !errors.password
})

// Methods
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const validateForm = (): boolean => {
    // Reset errors
    errors.email = ''
    errors.password = ''

    let isValid = true

    // Email validation
    if (!form.email) {
        errors.email = t('validation.emailRequired')
        isValid = false
    } else if (!isValidEmail(form.email)) {
        errors.email = t('validation.emailInvalid')
        isValid = false
    }

    // Password validation
    if (!form.password) {
        errors.password = t('validation.passwordRequired')
        isValid = false
    } else if (form.password.length < 6) {
        errors.password = t('validation.passwordMinLength')
        isValid = false
    }

    return isValid
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const handleLogin = async () => {
    // Clear previous error
    errorMessage.value = ''

    // Validate form
    if (!validateForm()) {
        return
    }

    isLoading.value = true

    try {
        // Use auth store login - it will handle admin credential validation
        await authStore.login(form.email, form.password, form.rememberMe)

        // Check if user is admin
        if (!authStore.isAdmin) {
            throw new Error(t('admin.login.notAdminAccount'))
        }

        success(t('admin.login.successMessage'))

        // Redirect to admin dashboard
        router.push('/admin/dashboard')
    } catch (err: any) {
        console.error('Admin login error:', err)
        errorMessage.value = err.message || t('admin.login.errorMessage')
        error(t('admin.login.errorMessage'))
    } finally {
        isLoading.value = false
    }
}

const fillCredentials = (type: 'admin') => {
    form.email = 'admin@nestgrocer.com'
    form.password = 'admin123'
}
</script>
