<script setup lang="ts">
import { useAppI18n } from '@/composables/useI18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t, formatCurrency, currentLocale } = useAppI18n()
</script>

<template>
    <main class="container mx-auto px-4 py-8">
        <!-- Header with language switcher -->
        <header class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ t('common.welcome') }}
            </h1>
            <LanguageSwitcher />
        </header>

        <!-- Demo content -->
        <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {{ t('navigation.home') }}
                </h2>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {{ t('common.welcome') }} to our e-commerce store!
                </p>

                <!-- Demo features -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div class="text-center p-4 border rounded-lg">
                        <h3 class="font-semibold">{{ t('navigation.products') }}</h3>
                        <p class="text-sm text-gray-500 mt-2">{{ t('products.allProducts') }}</p>
                    </div>
                    <div class="text-center p-4 border rounded-lg">
                        <h3 class="font-semibold">{{ t('navigation.cart') }}</h3>
                        <p class="text-sm text-gray-500 mt-2">{{ t('cart.title') }}</p>
                    </div>
                    <div class="text-center p-4 border rounded-lg">
                        <h3 class="font-semibold">{{ t('navigation.account') }}</h3>
                        <p class="text-sm text-gray-500 mt-2">{{ t('account.title') }}</p>
                    </div>
                </div>

                <!-- Currency formatting demo -->
                <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 class="font-semibold mb-2">{{ t('products.price') }} Demo:</h3>
                    <p class="text-lg">{{ formatCurrency(299.99) }}</p>
                    <p class="text-sm text-gray-500">Current locale: {{ currentLocale }}</p>
                </div>
            </div>
        </div>
    </main>
</template>
