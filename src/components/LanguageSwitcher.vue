<template>
    <div class="language-switcher">
        <!-- Dropdown button -->
        <button
            @click="toggleDropdown"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md transition-colors"
            :aria-expanded="isOpen"
            aria-haspopup="true"
        >
            <span class="text-base">{{ currentLocaleInfo.flag }}</span>
            <span>{{ currentLocaleInfo.nativeName }}</span>
            <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': isOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </button>

        <!-- Dropdown menu -->
        <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div
                v-show="isOpen"
                class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
            >
                <div class="py-1">
                    <button
                        v-for="locale in availableLocales"
                        :key="locale.code"
                        @click="changeLocale(locale.code)"
                        class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        :class="{
                            'bg-gray-100 dark:bg-gray-700': locale.code === currentLocale,
                            'font-medium': locale.code === currentLocale,
                        }"
                        role="menuitem"
                    >
                        <span class="text-base">{{ locale.flag }}</span>
                        <span>{{ locale.nativeName }}</span>
                        <svg
                            v-if="locale.code === currentLocale"
                            class="w-4 h-4 ml-auto text-primary"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { localeUtils, LOCALE_INFO, type SupportedLocale } from '@/locales'

const isOpen = ref(false)

const currentLocale = computed(() => localeUtils.getCurrentLocale())
const currentLocaleInfo = computed(() => LOCALE_INFO[currentLocale.value])
const availableLocales = computed(() => localeUtils.getAvailableLocales())

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const changeLocale = (locale: SupportedLocale) => {
    localeUtils.setLocale(locale)
    isOpen.value = false
}

const closeDropdown = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.language-switcher')) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.language-switcher {
    position: relative;
    display: inline-block;
    text-align: left;
}
</style>
