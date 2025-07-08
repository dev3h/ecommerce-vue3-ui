<template>
    <div
        class="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
    >
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                    {{ t('admin.forgotPassword') }}
                </h2>
                <p class="mt-2 text-center text-sm text-muted-foreground">
                    {{ t('admin.forgotPasswordDescription') }}
                </p>
            </div>

            <Card class="mt-8">
                <CardHeader>
                    <CardTitle class="text-2xl font-bold">{{ t('admin.resetPassword') }}</CardTitle>
                    <CardDescription>
                        {{ t('admin.resetPasswordDescription') }}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <div class="space-y-2">
                            <Label for="email">{{ t('admin.email') }}</Label>
                            <Input
                                id="email"
                                v-model="form.email"
                                type="email"
                                :placeholder="t('admin.emailPlaceholder')"
                                required
                                :class="{ 'border-destructive': errors.email }"
                            />
                            <p v-if="errors.email" class="text-sm text-destructive">
                                {{ errors.email }}
                            </p>
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
                                        {{ t('admin.resetEmailSent') }}
                                    </h3>
                                    <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                                        {{ t('admin.resetEmailSentDescription') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div v-if="errors.submit" class="p-4 bg-destructive/10 rounded-lg">
                            <p class="text-sm text-destructive">{{ errors.submit }}</p>
                        </div>

                        <Button
                            type="submit"
                            class="w-full"
                            :disabled="isLoading"
                            :loading="isLoading"
                        >
                            {{ t('admin.sendResetLink') }}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <div class="text-center text-sm text-muted-foreground space-y-2">
                        <p>
                            {{ t('admin.rememberPassword') }}
                            <router-link
                                to="/admin/login"
                                class="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {{ t('admin.backToLogin') }}
                            </router-link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
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

// Form state
const form = reactive({
    email: '',
})

const isLoading = ref(false)
const success = ref(false)
const errors = ref<Record<string, string>>({})

// Methods
const validateForm = () => {
    errors.value = {}

    if (!form.email) {
        errors.value.email = t('validation.required')
        return false
    }

    if (!form.email.includes('@')) {
        errors.value.email = t('validation.invalidEmail')
        return false
    }

    return true
}

const handleSubmit = async () => {
    if (!validateForm()) return

    isLoading.value = true
    errors.value = {}

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Here you would call your admin API to send reset email
        console.log('Admin password reset requested for:', form.email)

        success.value = true

        // Reset form
        form.email = ''

        // Redirect to admin login after 3 seconds
        setTimeout(() => {
            router.push('/admin/login')
        }, 3000)
    } catch (error) {
        errors.value.submit = t('admin.resetPasswordError')
        console.error('Admin password reset failed:', error)
    } finally {
        isLoading.value = false
    }
}
</script>
