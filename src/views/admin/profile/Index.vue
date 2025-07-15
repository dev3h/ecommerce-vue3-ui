<template>
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {{ t('admin.profilePage.title') }}
        </h1>
        <!-- Tabs for Profile & Security -->
        <div class="flex gap-4 mb-8">
            <RouterLink
                :to="{ name: 'AdminProfile' }"
                class="px-4 py-2 rounded-t-md border-b-2"
                :class="
                    route.name === 'AdminProfile'
                        ? 'border-emerald-600 text-emerald-700 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-emerald-600'
                "
            >
                {{ t('admin.profilePage.title') }}
            </RouterLink>
            <RouterLink
                :to="{ name: 'AdminSecurity' }"
                class="px-4 py-2 rounded-t-md border-b-2"
                :class="
                    route.name === 'AdminSecurity'
                        ? 'border-emerald-600 text-emerald-700 font-semibold'
                        : 'border-transparent text-gray-500 hover:text-emerald-600'
                "
            >
                {{ t('admin.profilePage.security') }}
            </RouterLink>
        </div>
        <AdminProfileView v-if="route.name === 'AdminProfile'" />
        <AdminSecurityView v-else />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { useAdminAuthStore } from '@/stores/adminAuth'
import AdminProfileView from './AdminProfileView.vue'
import AdminSecurityView from './AdminSecurityView.vue'

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
