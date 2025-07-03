<template>
    <Card>
        <CardHeader>
            <CardTitle>{{ t('account.personalInfo') }}</CardTitle>
            <CardDescription>
                {{ t('account.personalInfoDescription') }}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label for="firstName">{{ t('auth.firstName') }}</Label>
                        <Input
                            id="firstName"
                            v-model="form.firstName"
                            type="text"
                            :placeholder="t('auth.firstNamePlaceholder')"
                            required
                            :disabled="!isEditing"
                            :class="{ 'border-destructive': errors.firstName }"
                        />
                        <p v-if="errors.firstName" class="text-sm text-destructive">
                            {{ errors.firstName }}
                        </p>
                    </div>

                    <div class="space-y-2">
                        <Label for="lastName">{{ t('auth.lastName') }}</Label>
                        <Input
                            id="lastName"
                            v-model="form.lastName"
                            type="text"
                            :placeholder="t('auth.lastNamePlaceholder')"
                            required
                            :disabled="!isEditing"
                            :class="{ 'border-destructive': errors.lastName }"
                        />
                        <p v-if="errors.lastName" class="text-sm text-destructive">
                            {{ errors.lastName }}
                        </p>
                    </div>
                </div>

                <div class="space-y-2">
                    <Label for="email">{{ t('auth.email') }}</Label>
                    <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        :placeholder="t('auth.emailPlaceholder')"
                        required
                        :disabled="!isEditing"
                        :class="{ 'border-destructive': errors.email }"
                    />
                    <p v-if="errors.email" class="text-sm text-destructive">
                        {{ errors.email }}
                    </p>
                </div>

                <div class="space-y-2">
                    <Label for="phone">{{ t('account.phone') }}</Label>
                    <Input
                        id="phone"
                        v-model="form.phone"
                        type="tel"
                        :placeholder="t('account.phonePlaceholder')"
                        :disabled="!isEditing"
                        :class="{ 'border-destructive': errors.phone }"
                    />
                    <p v-if="errors.phone" class="text-sm text-destructive">
                        {{ errors.phone }}
                    </p>
                </div>

                <div class="space-y-2">
                    <Label for="dateOfBirth">{{ t('account.dateOfBirth') }}</Label>
                    <Input
                        id="dateOfBirth"
                        v-model="form.dateOfBirth"
                        type="date"
                        :disabled="!isEditing"
                        :class="{ 'border-destructive': errors.dateOfBirth }"
                    />
                    <p v-if="errors.dateOfBirth" class="text-sm text-destructive">
                        {{ errors.dateOfBirth }}
                    </p>
                </div>

                <div v-if="success" class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div class="flex">
                        <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800 dark:text-green-200">
                                {{ t('account.profileUpdated') }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="errors.submit" class="p-4 bg-destructive/10 rounded-lg">
                    <p class="text-sm text-destructive">{{ errors.submit }}</p>
                </div>

                <div class="flex justify-end space-x-4">
                    <Button v-if="isEditing" type="button" variant="outline" @click="cancelEdit">
                        {{ t('common.cancel') }}
                    </Button>
                    <Button v-if="!isEditing" type="button" @click="startEdit">
                        {{ t('common.edit') }}
                    </Button>
                    <Button
                        v-if="isEditing"
                        type="submit"
                        :disabled="isLoading"
                        :loading="isLoading"
                    >
                        {{ t('common.save') }}
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const { t } = useAppI18n()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

// Form state
const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
})

const isEditing = ref(false)
const isLoading = ref(false)
const success = ref(false)
const errors = ref<Record<string, string>>({})

// Methods
const loadUserData = () => {
    if (user.value) {
        form.firstName = user.value.firstName
        form.lastName = user.value.lastName
        form.email = user.value.email
        form.phone = user.value.phone || ''
        form.dateOfBirth = user.value.dateOfBirth || ''
    }
}

const startEdit = () => {
    isEditing.value = true
    success.value = false
    errors.value = {}
}

const cancelEdit = () => {
    isEditing.value = false
    errors.value = {}
    loadUserData() // Reset to original values
}

const validateForm = () => {
    errors.value = {}

    if (!form.firstName.trim()) {
        errors.value.firstName = t('validation.required')
        return false
    }

    if (!form.lastName.trim()) {
        errors.value.lastName = t('validation.required')
        return false
    }

    if (!form.email.trim()) {
        errors.value.email = t('validation.required')
        return false
    }

    if (!form.email.includes('@')) {
        errors.value.email = t('validation.invalidEmail')
        return false
    }

    if (form.phone && !/^\+?[\d\s-()]+$/.test(form.phone)) {
        errors.value.phone = t('validation.invalidPhone')
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
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Here you would call your API to update user profile
        console.log('Updating user profile:', form)

        // Update auth store (in real app, this would be done by the API response)
        if (user.value) {
            authStore.updateUserProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                dateOfBirth: form.dateOfBirth,
            })
        }

        success.value = true
        isEditing.value = false

        // Hide success message after 3 seconds
        setTimeout(() => {
            success.value = false
        }, 3000)
    } catch (error) {
        errors.value.submit = t('account.profileUpdateError')
        console.error('Profile update failed:', error)
    } finally {
        isLoading.value = false
    }
}

// Initialize
onMounted(() => {
    loadUserData()
})
</script>
