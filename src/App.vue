<script setup lang="ts">
import { ref } from 'vue'
import BaseLayout from '@/components/layout/BaseLayout.vue'

const isLoading = ref(false)
</script>

<template>
    <BaseLayout :loading="isLoading">
        <RouterView />
    </BaseLayout>
</template>
