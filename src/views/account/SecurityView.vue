<template>
    <div class="security-view">
        <div class="space-y-6">
            <!-- Header -->
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ $t('security.title') }}
                </h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('security.description') }}
                </p>
            </div>

            <!-- Password Section -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <LockIcon class="w-5 h-5" />
                        {{ $t('security.password.title') }}
                    </CardTitle>
                    <CardDescription>
                        {{ $t('security.password.description') }}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="changePassword" class="space-y-4">
                        <div>
                            <Label for="currentPassword" class="mb-2 block">{{
                                $t('security.password.currentPassword')
                            }}</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                v-model="passwordForm.currentPassword"
                                :placeholder="$t('security.password.currentPasswordPlaceholder')"
                                :class="{ 'border-red-500': passwordErrors.currentPassword }"
                                @input="passwordErrors.currentPassword = ''"
                                required
                            />
                            <p
                                v-if="passwordErrors.currentPassword"
                                class="text-sm text-red-500 mt-1"
                            >
                                {{ passwordErrors.currentPassword }}
                            </p>
                        </div>
                        <div>
                            <Label for="newPassword" class="mb-2 block">{{
                                $t('security.password.newPassword')
                            }}</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                v-model="passwordForm.newPassword"
                                :placeholder="$t('security.password.newPasswordPlaceholder')"
                                :class="{ 'border-red-500': passwordErrors.newPassword }"
                                @input="passwordErrors.newPassword = ''"
                                required
                            />
                            <p v-if="passwordErrors.newPassword" class="text-sm text-red-500 mt-1">
                                {{ passwordErrors.newPassword }}
                            </p>
                        </div>
                        <div>
                            <Label for="confirmPassword" class="mb-2 block">{{
                                $t('security.password.confirmPassword')
                            }}</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                v-model="passwordForm.confirmPassword"
                                :placeholder="$t('security.password.confirmPasswordPlaceholder')"
                                :class="{ 'border-red-500': passwordErrors.confirmPassword }"
                                @input="passwordErrors.confirmPassword = ''"
                                required
                            />
                            <p
                                v-if="passwordErrors.confirmPassword"
                                class="text-sm text-red-500 mt-1"
                            >
                                {{ passwordErrors.confirmPassword }}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <Button type="submit" :disabled="isChangingPassword" class="flex-1">
                                <Loader2Icon
                                    v-if="isChangingPassword"
                                    class="w-4 h-4 mr-2 animate-spin"
                                />
                                {{ $t('security.password.updatePassword') }}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                @click="resetPasswordForm"
                                class="flex-1"
                            >
                                {{ $t('common.cancel') }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <!-- Two-Factor Authentication Section -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <ShieldCheckIcon class="w-5 h-5" />
                        {{ $t('security.twoFactor.title') }}
                    </CardTitle>
                    <CardDescription>
                        {{ $t('security.twoFactor.description') }}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium">
                                {{ $t('security.twoFactor.status') }}
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{
                                    isTwoFactorEnabled
                                        ? $t('security.twoFactor.enabled')
                                        : $t('security.twoFactor.disabled')
                                }}
                            </p>
                        </div>
                        <Button
                            :variant="isTwoFactorEnabled ? 'destructive' : 'default'"
                            @click="toggleTwoFactor"
                            :disabled="isTogglingTwoFactor"
                        >
                            <Loader2Icon
                                v-if="isTogglingTwoFactor"
                                class="w-4 h-4 mr-2 animate-spin"
                            />
                            {{
                                isTwoFactorEnabled
                                    ? $t('security.twoFactor.disable')
                                    : $t('security.twoFactor.enable')
                            }}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <!-- Login Activity Section -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <ActivityIcon class="w-5 h-5" />
                        {{ $t('security.loginActivity.title') }}
                    </CardTitle>
                    <CardDescription>
                        {{ $t('security.loginActivity.description') }}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Collapsible v-model:open="isActivityOpen">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" class="w-full justify-between">
                                {{ $t('security.loginActivity.viewActivity') }}
                                <ChevronDownIcon
                                    class="w-4 h-4 transition-transform duration-200"
                                    :class="{ 'rotate-180': isActivityOpen }"
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent class="pt-4">
                            <div class="space-y-3">
                                <div
                                    v-for="activity in loginActivities"
                                    :key="activity.id"
                                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-2 h-2 bg-green-500 rounded-full"
                                            v-if="activity.current"
                                        ></div>
                                        <div class="w-2 h-2 bg-gray-400 rounded-full" v-else></div>
                                        <div>
                                            <p class="font-medium">{{ activity.device }}</p>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                                {{ activity.location }} •
                                                {{ formatDate(activity.timestamp) }}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        v-if="!activity.current"
                                        variant="ghost"
                                        size="sm"
                                        @click="revokeSession(activity.id)"
                                    >
                                        {{ $t('security.loginActivity.revoke') }}
                                    </Button>
                                    <span
                                        v-else
                                        class="text-sm text-green-600 dark:text-green-400 font-medium"
                                    >
                                        {{ $t('security.loginActivity.current') }}
                                    </span>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </CardContent>
            </Card>

            <!-- Account Deletion Section -->
            <Card class="border-red-200 dark:border-red-800">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangleIcon class="w-5 h-5" />
                        {{ $t('security.deleteAccount.title') }}
                    </CardTitle>
                    <CardDescription>
                        {{ $t('security.deleteAccount.description') }}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" @click="showDeleteConfirmation = true">
                        {{ $t('security.deleteAccount.delete') }}
                    </Button>
                </CardContent>
            </Card>
        </div>

        <!-- Delete Account Confirmation Dialog -->
        <Dialog v-model:open="showDeleteConfirmation">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{{ $t('security.deleteAccount.confirmTitle') }}</DialogTitle>
                    <DialogDescription>
                        {{ $t('security.deleteAccount.confirmDescription') }}
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-4">
                    <div>
                        <Label for="deleteConfirmation" class="mb-2 block">{{
                            $t('security.deleteAccount.typeConfirm')
                        }}</Label>
                        <Input
                            id="deleteConfirmation"
                            v-model="deleteConfirmationText"
                            :placeholder="$t('security.deleteAccount.confirmPlaceholder')"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showDeleteConfirmation = false">
                        {{ $t('common.cancel') }}
                    </Button>
                    <Button
                        variant="destructive"
                        :disabled="deleteConfirmationText !== 'DELETE' || isDeletingAccount"
                        @click="deleteAccount"
                    >
                        <Loader2Icon v-if="isDeletingAccount" class="w-4 h-4 mr-2 animate-spin" />
                        {{ $t('security.deleteAccount.confirmDelete') }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

// Icons
import {
    LockIcon,
    ShieldCheckIcon,
    ActivityIcon,
    AlertTriangleIcon,
    ChevronDownIcon,
    Loader2Icon,
} from 'lucide-vue-next'

const { t } = useAppI18n()
const { success: showSuccessToast, error: showErrorToast } = useToast()
const router = useRouter()

// Reactive states
const isActivityOpen = ref(false)
const isChangingPassword = ref(false)
const isTogglingTwoFactor = ref(false)
const isDeletingAccount = ref(false)
const showDeleteConfirmation = ref(false)
const deleteConfirmationText = ref('')

// Two-factor authentication state
const isTwoFactorEnabled = ref(false)

// Password form
const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
})

// Password form errors
const passwordErrors = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
})

// Mock login activities
const loginActivities = ref([
    {
        id: '1',
        device: 'Chrome on Windows',
        location: 'Ho Chi Minh City, Vietnam',
        timestamp: new Date(),
        current: true,
    },
    {
        id: '2',
        device: 'Safari on iPhone',
        location: 'Hanoi, Vietnam',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        current: false,
    },
    {
        id: '3',
        device: 'Firefox on Linux',
        location: 'Da Nang, Vietnam',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        current: false,
    },
])

// Methods
const clearPasswordErrors = () => {
    passwordErrors.currentPassword = ''
    passwordErrors.newPassword = ''
    passwordErrors.confirmPassword = ''
}

const validatePasswordForm = () => {
    clearPasswordErrors()
    let isValid = true

    // Validate current password
    if (!passwordForm.currentPassword.trim()) {
        passwordErrors.currentPassword = t('security.password.currentPasswordRequired')
        isValid = false
    }

    // Validate new password
    if (!passwordForm.newPassword.trim()) {
        passwordErrors.newPassword = t('security.password.newPasswordRequired')
        isValid = false
    } else if (passwordForm.newPassword.length < 8) {
        passwordErrors.newPassword = t('security.password.passwordTooShort')
        isValid = false
    }

    // Validate confirm password
    if (!passwordForm.confirmPassword.trim()) {
        passwordErrors.confirmPassword = t('security.password.confirmPasswordRequired')
        isValid = false
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        passwordErrors.confirmPassword = t('security.password.passwordMismatch')
        isValid = false
    }

    return isValid
}

const changePassword = async () => {
    if (!validatePasswordForm()) {
        return
    }

    isChangingPassword.value = true

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        showSuccessToast(t('security.password.passwordChanged'))
        resetPasswordForm()
    } catch (error) {
        console.error('Password change error:', error)
        showErrorToast(t('security.password.passwordChangeError'))
    } finally {
        isChangingPassword.value = false
    }
}

const resetPasswordForm = () => {
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    clearPasswordErrors()
}

const toggleTwoFactor = async () => {
    isTogglingTwoFactor.value = true

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        isTwoFactorEnabled.value = !isTwoFactorEnabled.value
        showSuccessToast(
            isTwoFactorEnabled.value
                ? t('security.twoFactor.enabledSuccess')
                : t('security.twoFactor.disabledSuccess'),
        )
    } catch (error) {
        console.error('Two-factor toggle error:', error)
        showErrorToast(t('security.twoFactor.toggleError'))
    } finally {
        isTogglingTwoFactor.value = false
    }
}

const revokeSession = async (sessionId: string) => {
    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        loginActivities.value = loginActivities.value.filter(
            (activity) => activity.id !== sessionId,
        )
        showSuccessToast(t('security.loginActivity.sessionRevoked'))
    } catch (error) {
        console.error('Session revoke error:', error)
        showErrorToast(t('security.loginActivity.revokeError'))
    }
}

const deleteAccount = async () => {
    isDeletingAccount.value = true

    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        showSuccessToast(t('security.deleteAccount.accountDeleted'))

        // Redirect to home or login page
        setTimeout(() => {
            router.push('/')
        }, 1000)
    } catch (error) {
        console.error('Account deletion error:', error)
        showErrorToast(t('security.deleteAccount.deleteError'))
    } finally {
        isDeletingAccount.value = false
        showDeleteConfirmation.value = false
    }
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}
</script>

<style scoped>
.security-view {
    max-width: 1024px;
    margin: 0 auto;
    padding: 1.5rem;
}
</style>
