<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/components/layout/BaseLayout.vue'
import AdminBaseLayout from '@/components/admin/AdminBaseLayout.vue'

const route = useRoute()
const isLoading = ref(false)

// Determine which layout to use based on route meta
const isAdminLayout = computed(() => {
    return route.meta?.layout === 'admin'
})
</script>

<template>
    <BaseLayout v-if="!isAdminLayout" :loading="isLoading">
        <RouterView />
    </BaseLayout>

    <AdminBaseLayout v-else>
        <RouterView />
    </AdminBaseLayout>
</template>
