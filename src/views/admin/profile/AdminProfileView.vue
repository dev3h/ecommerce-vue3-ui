<template>
    <form @submit.prevent="onSubmit" class="space-y-6" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label
                        for="firstName"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {{ t('admin.profilePage.firstName') }}<span class="text-red-500">*</span>
                    </Label>
                    <Input
                        id="firstName"
                        v-model="form.firstName"
                        type="text"
                        required
                        :placeholder="t('admin.profilePage.firstNamePlaceholder')"
                        :aria-invalid="!!errors.firstName"
                        :class="errors.firstName ? 'border-red-500 focus:border-red-500' : ''"
                    />
                    <p v-if="errors.firstName" class="text-xs text-red-500 mt-1">
                        {{ errors.firstName }}
                    </p>
                </div>
                <div>
                    <Label
                        for="lastName"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {{ t('admin.profilePage.lastName') }}<span class="text-red-500">*</span>
                    </Label>
                    <Input
                        id="lastName"
                        v-model="form.lastName"
                        type="text"
                        required
                        :placeholder="t('admin.profilePage.lastNamePlaceholder')"
                        :aria-invalid="!!errors.lastName"
                        :class="errors.lastName ? 'border-red-500 focus:border-red-500' : ''"
                    />
                    <p v-if="errors.lastName" class="text-xs text-red-500 mt-1">
                        {{ errors.lastName }}
                    </p>
                </div>
            </div>
            <div>
                <Label
                    for="email"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {{ t('admin.profilePage.email') }}<span class="text-red-500">*</span>
                </Label>
                <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    :placeholder="t('admin.profilePage.emailPlaceholder')"
                    :aria-invalid="!!errors.email"
                    :class="errors.email ? 'border-red-500 focus:border-red-500' : ''"
                />
                <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
            </div>
            <div>
                <Label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {{ t('admin.profilePage.phone') }}
                </Label>
                <Input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    :placeholder="t('admin.profilePage.phonePlaceholder')"
                    :aria-invalid="!!errors.phone"
                    :class="errors.phone ? 'border-red-500 focus:border-red-500' : ''"
                />
                <p v-if="errors.phone" class="text-xs text-red-500 mt-1">{{ errors.phone }}</p>
            </div>
            <div class="flex justify-end">
                <Button
                    type="submit"
                    :disabled="loading"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                >
                    <span v-if="loading">{{ t('admin.profilePage.saving') }}</span>
                    <span v-else>{{ t('admin.profilePage.save') }}</span>
                </Button>
            </div>
        </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAdminAuthStore } from '@/stores/adminAuth'

const { t } = useAppI18n()
const { success, error } = useToast()
const { user, updateProfile } = useAdminAuthStore()
const route = useRoute()
const form = ref({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: user?.phone,
})
const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
})
const loading = ref(false)

function validate() {
    let valid = true
    errors.firstName = ''
    errors.lastName = ''
    errors.email = ''
    errors.phone = ''
    if (!form.value.firstName) {
        errors.firstName = t('admin.profilePage.firstNameRequired')
        valid = false
    }
    if (!form.value.lastName) {
        errors.lastName = t('admin.profilePage.lastNameRequired')
        valid = false
    }
    if (!form.value.email) {
        errors.email = t('admin.profilePage.emailRequired')
        valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        errors.email = t('admin.profilePage.emailInvalid')
        valid = false
    }
    // Optional: validate phone if needed
    return valid
}

const onSubmit = async () => {
    if (!validate()) {
        error(t('admin.profilePage.formInvalid'))
        return
    }
    loading.value = true
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const data = {
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            email: form.value.email,
            phone: form.value.phone,
        }
        await updateProfile(data)

        success(t('admin.profilePage.updateSuccess'))
    } catch (e) {
        error(t('admin.profilePage.updateError'))
    } finally {
        loading.value = false
    }
}
</script>
