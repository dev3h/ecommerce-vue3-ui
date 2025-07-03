<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'
import BaseLayout from '@/components/layout/BaseLayout.vue'
import AdminBaseLayout from '@/components/admin/AdminBaseLayout.vue'
import Toast from '@/components/Toast.vue'

const route = useRoute()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const isLoading = ref(false)

// Determine which layout to use based on route meta
const isAdminLayout = computed(() => {
    return route.meta?.layout === 'admin'
})

// Initialize auth store on app mount
onMounted(() => {
    authStore.initializeAuth()
    orderStore.initializeOrders()
})
</script>

<template>
    <BaseLayout v-if="!isAdminLayout" :loading="isLoading">
        <RouterView />
    </BaseLayout>

    <AdminBaseLayout v-else>
        <RouterView />
    </AdminBaseLayout>

    <!-- Global Toast Notifications -->
    <Toast />
</template>
