<template>
    <section
        class="relative bg-gradient-to-r from-amber-50 to-orange-100 rounded-lg p-4 sm:p-6 md:p-8 lg:p-12 mb-6 md:mb-8 overflow-hidden"
    >
        <div class="max-w-full lg:max-w-2xl">
            <h1
                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight"
            >
                {{ title }}
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-gray-600 mb-4 md:mb-6">
                {{ subtitle }}
            </p>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-full sm:max-w-md">
                <input
                    v-model="email"
                    type="email"
                    :placeholder="placeholder"
                    class="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
                <button
                    @click="handleSubscribe"
                    :disabled="!isValidEmail"
                    class="px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                >
                    {{ buttonText }}
                </button>
            </div>
        </div>

        <!-- Hero Image - Hidden on mobile and small tablets -->
        <div
            class="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 hidden xl:block"
        >
            <img
                :src="heroImage"
                alt="Grocery items"
                class="w-64 h-48 lg:w-80 lg:h-60 xl:w-96 xl:h-72 object-cover rounded-lg opacity-90"
            />
        </div>

        <!-- Background decoration for mobile -->
        <div
            class="absolute -right-8 -top-8 w-32 h-32 bg-green-100 rounded-full opacity-30 xl:hidden"
        ></div>
        <div
            class="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-200 rounded-full opacity-40 xl:hidden"
        ></div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    title?: string
    subtitle?: string
    placeholder?: string
    buttonText?: string
    heroImage?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: "Don't miss amazing grocery deals",
    subtitle: 'Sign up for the daily newsletter',
    placeholder: 'Your email address',
    buttonText: 'Subscribe',
    heroImage: 'https://picsum.photos/400/300',
})

const emit = defineEmits<{
    subscribe: [email: string]
}>()

const email = ref('')

const isValidEmail = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value)
})

const handleSubscribe = () => {
    if (isValidEmail.value) {
        emit('subscribe', email.value)
        email.value = ''
    }
}
</script>
