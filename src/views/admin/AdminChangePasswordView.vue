<template>
    <div
        class="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
    >
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                    {{ t('admin.changePassword') }}
                </h2>
                <p class="mt-2 text-center text-sm text-muted-foreground">
                    {{ t('admin.changePasswordDescription') }}
                </p>
            </div>

            <Card class="mt-8">
                <CardHeader>
                    <CardTitle class="text-2xl font-bold">{{
                        t('admin.updatePassword')
                    }}</CardTitle>
                    <CardDescription>
                        {{ t('admin.updatePasswordDescription') }}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <div class="space-y-2">
                            <Label for="currentPassword">{{ t('admin.currentPassword') }}</Label>
                            <Input
                                id="currentPassword"
                                v-model="form.currentPassword"
                                type="password"
                                :placeholder="t('admin.currentPasswordPlaceholder')"
                                required
                                :class="{ 'border-destructive': errors.currentPassword }"
                            />
                            <p v-if="errors.currentPassword" class="text-sm text-destructive">
                                {{ errors.currentPassword }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <Label for="newPassword">{{ t('admin.newPassword') }}</Label>
                            <Input
                                id="newPassword"
                                v-model="form.newPassword"
                                type="password"
                                :placeholder="t('admin.newPasswordPlaceholder')"
                                required
                                :class="{ 'border-destructive': errors.newPassword }"
                            />
                            <p v-if="errors.newPassword" class="text-sm text-destructive">
                                {{ errors.newPassword }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <Label for="confirmPassword">{{ t('admin.confirmPassword') }}</Label>
                            <Input
                                id="confirmPassword"
                                v-model="form.confirmPassword"
                                type="password"
                                :placeholder="t('admin.confirmPasswordPlaceholder')"
                                required
                                :class="{ 'border-destructive': errors.confirmPassword }"
                            />
                            <p v-if="errors.confirmPassword" class="text-sm text-destructive">
                                {{ errors.confirmPassword }}
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
                                        {{ t('admin.passwordChanged') }}
                                    </h3>
                                    <p class="mt-1 text-sm text-green-700 dark:text-green-300">
                                        {{ t('admin.passwordChangedDescription') }}
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
                            {{ t('admin.updatePassword') }}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <div class="text-center text-sm text-muted-foreground space-y-2">
                        <p>
                            <router-link
                                to="/admin/dashboard"
                                class="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {{ t('admin.backToDashboard') }}
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
import { useAdminAuthStore } from '@/stores/adminAuth'
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
const authStore = useAdminAuthStore()

// Form state
const form = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
})

const isLoading = ref(false)
const success = ref(false)
const errors = ref<Record<string, string>>({})

// Methods
const validateForm = () => {
    errors.value = {}

    if (!form.currentPassword) {
        errors.value.currentPassword = t('validation.required')
        return false
    }

    if (!form.newPassword) {
        errors.value.newPassword = t('validation.required')
        return false
    }

    if (form.newPassword.length < 6) {
        errors.value.newPassword = t('validation.passwordMinLength')
        return false
    }

    if (!form.confirmPassword) {
        errors.value.confirmPassword = t('validation.required')
        return false
    }

    if (form.newPassword !== form.confirmPassword) {
        errors.value.confirmPassword = t('validation.passwordMismatch')
        return false
    }

    if (form.currentPassword === form.newPassword) {
        errors.value.newPassword = t('admin.newPasswordSameAsCurrent')
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

        // Here you would call your admin API to change password
        console.log('Admin password change requested for user:', authStore.user?.email)

        success.value = true

        // Reset form
        form.currentPassword = ''
        form.newPassword = ''
        form.confirmPassword = ''

        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
            router.push('/admin/dashboard')
        }, 2000)
    } catch (error) {
        errors.value.submit = t('admin.changePasswordError')
        console.error('Admin password change failed:', error)
    } finally {
        isLoading.value = false
    }
}
</script>
