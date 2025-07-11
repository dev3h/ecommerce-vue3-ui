<template>
    <div class="flex items-center justify-center">
        <img
            v-if="isValidURL(logoUrl)"
            :src="logoUrl"
            :alt="alt"
            :style="{ width: sizeClass, height: sizeClass }"
            class="object-contain"
        />
        <div
            v-else
            class="bg-muted flex items-center justify-center rounded-md"
            :style="{ width: sizeClass, height: sizeClass }"
        >
            <ImageIcon class="text-muted-foreground" :class="iconSizeClass" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ImageIcon } from 'lucide-vue-next'

interface Props {
    logoUrl: string
    size?: 'sm' | 'md' | 'lg'
    alt?: string
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    alt: 'Brand logo',
})

const sizeClass = computed(() => {
    const sizes = {
        sm: '32px',
        md: '48px',
        lg: '64px',
    }
    return sizes[props.size]
})

const iconSizeClass = computed(() => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    }
    return sizes[props.size]
})

// Function to check if the provided URL is valid
const isValidURL = (url: string) => {
    if (!url) return false
    return url.startsWith('http') || url.startsWith('data:image')
}
</script>
