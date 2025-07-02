<template>
    <span :class="['relative inline-flex items-center justify-center', shakeClass]">
        <slot />
        <span
            v-if="count > 0"
            :class="[
                'absolute -top-1 -right-1 min-w-[1rem] h-4 bg-red-500 text-white font-medium rounded-full flex items-center justify-center px-1 border border-background',
                badgeShakeClass,
            ]"
            style="font-size: 10px; line-height: 1"
        >
            {{ count > 99 ? '99+' : count }}
        </span>
    </span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
    count: number
}

const props = defineProps<Props>()

const shakeClass = ref('')
const badgeShakeClass = ref('')

const triggerShake = () => {
    shakeClass.value = 'animate-shake'
    badgeShakeClass.value = 'animate-bounce-scale'

    setTimeout(() => {
        shakeClass.value = ''
        badgeShakeClass.value = ''
    }, 1000)
}

watch(
    () => props.count,
    (newCount, oldCount) => {
        if (newCount > oldCount) {
            triggerShake()
        }
    },
)
</script>

<style scoped>
@keyframes shake {
    0%,
    100% {
        transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-2px);
    }
    20%,
    40%,
    60%,
    80% {
        transform: translateX(2px);
    }
}

@keyframes bounce-scale {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.animate-shake {
    animation: shake 0.6s ease-in-out;
}

.animate-bounce-scale {
    animation: bounce-scale 0.4s ease-in-out;
}
</style>
