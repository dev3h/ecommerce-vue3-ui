<template>
    <section
        class="relative bg-gradient-to-r from-amber-50 via-orange-50 to-orange-100 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-orange-950/30 rounded-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-6 md:mb-8 overflow-hidden border border-border shadow-sm dark:shadow-none backdrop-blur-sm"
    >
        <div class="max-w-full lg:max-w-2xl relative z-10">
            <h1
                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4 leading-tight drop-shadow-sm"
            >
                {{ title }}
            </h1>
            <p
                class="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 md:mb-6 font-medium"
            >
                {{ subtitle }}
            </p>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-full sm:max-w-md">
                <Input
                    v-model="email"
                    type="email"
                    :placeholder="placeholder"
                    class="flex-1 bg-background/50 dark:bg-background/80 backdrop-blur-sm"
                />
                <Button
                    @click="handleSubscribe"
                    :disabled="!isValidEmail"
                    class="px-4 sm:px-6 whitespace-nowrap bg-primary hover:bg-primary/90 shadow-md"
                    size="default"
                >
                    {{ buttonText }}
                </Button>
            </div>
        </div>

        <!-- Hero Image - Hidden on mobile and small tablets -->
        <div
            class="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 hidden xl:block z-0"
        >
            <div class="relative">
                <img
                    :src="heroImage"
                    :alt="altText"
                    class="w-64 h-48 lg:w-80 lg:h-60 xl:w-96 xl:h-72 object-cover rounded-xl opacity-90 border border-border shadow-lg dark:shadow-2xl"
                />
                <!-- Image overlay for better contrast in dark mode -->
                <div
                    class="absolute inset-0 bg-gradient-to-l from-background/20 to-transparent rounded-xl"
                ></div>
            </div>
        </div>

        <!-- Background decoration for mobile -->
        <div
            class="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 dark:bg-primary/5 rounded-full opacity-30 xl:hidden blur-sm"
        ></div>
        <div
            class="absolute -right-4 -bottom-4 w-20 h-20 bg-secondary/20 dark:bg-secondary/10 rounded-full opacity-40 xl:hidden blur-sm"
        ></div>
        <div
            class="absolute -left-12 top-1/2 w-24 h-24 bg-accent/15 dark:bg-accent/8 rounded-full opacity-50 xl:hidden blur-sm"
        ></div>

        <!-- Additional background pattern -->
        <div class="absolute inset-0 opacity-5 dark:opacity-10">
            <div class="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full"></div>
            <div class="absolute top-20 left-32 w-1 h-1 bg-secondary rounded-full"></div>
            <div class="absolute bottom-20 left-20 w-1.5 h-1.5 bg-accent rounded-full"></div>
            <div class="absolute top-32 right-32 w-1 h-1 bg-primary rounded-full xl:hidden"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
    title?: string
    subtitle?: string
    placeholder?: string
    buttonText?: string
    heroImage?: string
    altText?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: "Don't miss amazing grocery deals",
    subtitle: 'Sign up for the daily newsletter',
    placeholder: 'Your email address',
    buttonText: 'Subscribe',
    heroImage: 'https://picsum.photos/400/300',
    altText: 'Grocery items',
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
