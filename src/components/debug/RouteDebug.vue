<template>
    <div class="p-4 bg-red-100 border border-red-400 text-red-700">
        <h2>Route Debug Info</h2>
        <p><strong>Path:</strong> {{ route.path }}</p>
        <p><strong>Name:</strong> {{ route.name }}</p>
        <p><strong>Meta:</strong> {{ JSON.stringify(route.meta, null, 2) }}</p>
        <p><strong>Layout:</strong> {{ route.meta?.layout }}</p>
        <p><strong>Is Admin Layout:</strong> {{ isAdminLayout }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isAdminLayout = computed(() => {
    return route.meta?.layout === 'admin' || route.path.startsWith('/admin')
})
</script>
