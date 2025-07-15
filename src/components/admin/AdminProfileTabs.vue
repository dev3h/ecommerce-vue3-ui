<template>
    <div class="flex gap-4 mb-8">
        <RouterLink
            :to="{ name: 'AdminProfile' }"
            class="px-4 py-2 rounded-t-md border-b-2"
            :class="
                $route.name === 'AdminProfile'
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
                $route.name === 'AdminSecurity'
                    ? 'border-emerald-600 text-emerald-700 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-emerald-600'
            "
        >
            {{ t('admin.sidebar.security') }}
        </RouterLink>
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
const $route = useRoute()
const { t } = useAppI18n()
</script>
