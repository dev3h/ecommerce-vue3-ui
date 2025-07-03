<template>
    <div
        class="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
    >
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                    {{ t('auth.resetPassword') }}
                </h2>
                <p class="mt-2 text-center text-sm text-muted-foreground">
                    {{ t('auth.enterNewPassword') }}
                </p>
            </div>

            <Card class="mt-8">
                <CardHeader>
                    <CardTitle class="text-2xl font-bold">{{ t('auth.setNewPassword') }}</CardTitle>
                    <CardDescription>
                        {{ t('auth.setNewPasswordDescription') }}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <div class="space-y-2">
                            <Label for="password">{{ t('auth.password') }}</Label>
                            <Input
                                id="password"
                                v-model="form.password"
                                type="password"
                                :placeholder="t('auth.passwordPlaceholder')"
                                required
                                :class="{ 'border-destructive': errors.password }"
                            />
                            <p v-if="errors.password" class="text-sm text-destructive">
                                {{ errors.password }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <Label for="confirmPassword">{{ t('auth.confirmPassword') }}</Label>
                            <Input
                                id="confirmPassword"
                                v-model="form.confirmPassword"
                                type="password"
                                :placeholder="t('auth.confirmPasswordPlaceholder')"
                                required
                                :class="{ 'border-destructive': errors.confirmPassword }"
                            />
                            <p v-if="errors.confirmPassword" class="text-sm text-destructive">
                                {{ errors.confirmPassword }}
                            </p>
                        </div>

                        <!-- Password Strength Indicator -->
                        <div v-if="form.password" class="space-y-2">
                            <div class="flex items-center gap-2">
                                <div class="flex-1 bg-secondary rounded-full h-2">
                                    <div
                                        class="h-2 rounded-full transition-all duration-300"
                                        :class="passwordStrengthColor"
                                        :style="{ width: `${passwordStrengthPercentage}%` }"
                                    ></div>
                                </div>
                                <span class="text-sm font-medium" :class="passwordStrengthColor">
                                    {{ passwordStrengthLabel }}
                                </span>
                            </div>
                        </div>

                        <div v-if="success" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div class="flex">
                                <svg
                                    class="w-5 h-5 text-green-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <div class="ml-3">
                                    <h3
                                        class="text-sm font-medium text-green-800 dark:text-green-200"
                                    >
                                        {{ t('auth.passwordResetSuccess') }}
                                    </h3>
                                    <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                                        {{ t('auth.passwordResetSuccessDescription') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div v-if="errors.submit" class="p-4 bg-destructive/10 rounded-lg">
                            <p class="text-sm text-destructive">{{ errors.submit }}</p>
                        </div>

                        <div v-if="errors.token" class="p-4 bg-destructive/10 rounded-lg">
                            <p class="text-sm text-destructive">{{ errors.token }}</p>
                        </div>

                        <Button
                            type="submit"
                            class="w-full"
                            :disabled="isLoading || !isValidToken"
                            :loading="isLoading"
                        >
                            {{ t('auth.updatePassword') }}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <div class="text-center text-sm text-muted-foreground">
                        <router-link
                            to="/login"
                            class="font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            {{ t('auth.backToLogin') }}
                        </router-link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

const { t } = useAppI18n()
const router = useRouter()
const route = useRoute()

// Form state
const form = reactive({
    password: '',
    confirmPassword: '',
})

const isLoading = ref(false)
const success = ref(false)
const isValidToken = ref(false)
const errors = ref<Record<string, string>>({})

// Password strength calculation
const passwordStrength = computed(() => {
    const password = form.password
    if (!password) return 0

    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25

    return Math.min(strength, 100)
})

const passwordStrengthPercentage = computed(() => passwordStrength.value)

const passwordStrengthLabel = computed(() => {
    const strength = passwordStrength.value
    if (strength < 25) return t('auth.passwordWeak')
    if (strength < 50) return t('auth.passwordFair')
    if (strength < 75) return t('auth.passwordGood')
    return t('auth.passwordStrong')
})

const passwordStrengthColor = computed(() => {
    const strength = passwordStrength.value
    if (strength < 25) return 'bg-red-500 text-red-600'
    if (strength < 50) return 'bg-orange-500 text-orange-600'
    if (strength < 75) return 'bg-yellow-500 text-yellow-600'
    return 'bg-green-500 text-green-600'
})

// Methods
const validateToken = async () => {
    const token = route.query.token as string
    if (!token) {
        errors.value.token = t('auth.invalidResetToken')
        return false
    }

    try {
        // Simulate API call to validate token
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Here you would validate the token with your API
        console.log('Validating reset token:', token)

        isValidToken.value = true
        return true
    } catch (error) {
        console.error('Token validation failed:', error)
        errors.value.token = t('auth.expiredResetToken')
        return false
    }
}

const validateForm = () => {
    errors.value = {}

    if (!form.password) {
        errors.value.password = t('validation.required')
        return false
    }

    if (form.password.length < 8) {
        errors.value.password = t('auth.passwordMinLength8')
        return false
    }

    if (!form.confirmPassword) {
        errors.value.confirmPassword = t('validation.required')
        return false
    }

    if (form.password !== form.confirmPassword) {
        errors.value.confirmPassword = t('auth.passwordsDoNotMatch')
        return false
    }

    return true
}

const handleSubmit = async () => {
    if (!validateForm()) return

    isLoading.value = true
    errors.value = {}

    try {
        const token = route.query.token as string

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Here you would call your API to reset password
        console.log('Password reset for token:', token)
        console.log('New password:', form.password)

        success.value = true

        // Reset form
        form.password = ''
        form.confirmPassword = ''

        // Redirect to login after 3 seconds
        setTimeout(() => {
            router.push('/login')
        }, 3000)
    } catch (error) {
        errors.value.submit = t('auth.passwordResetError')
        console.error('Password reset failed:', error)
    } finally {
        isLoading.value = false
    }
}

// Initialize
onMounted(() => {
    validateToken()
})
</script>
