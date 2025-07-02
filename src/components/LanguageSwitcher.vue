<template>
    <Select :model-value="selectedLocale" @update:model-value="changeLocale">
        <SelectTrigger class="w-[120px] h-9">
            <SelectValue>
                <div class="flex items-center gap-2">
                    <span class="text-base">{{ currentLocaleInfo.flag }}</span>
                    <span class="text-sm">{{ currentLocaleInfo.nativeName }}</span>
                </div>
            </SelectValue>
        </SelectTrigger>
        <SelectContent>
            <SelectItem v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
                <div class="flex items-center gap-2">
                    <span class="text-base">{{ locale.flag }}</span>
                    <span>{{ locale.nativeName }}</span>
                </div>
            </SelectItem>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localeUtils, LOCALE_INFO, type SupportedLocale } from '@/locales'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const { locale } = useI18n()
const selectedLocale = ref<string>(locale.value)
const currentLocaleInfo = computed(() => LOCALE_INFO[selectedLocale.value as SupportedLocale])
const availableLocales = computed(() => localeUtils.getAvailableLocales())

const changeLocale = (newLocale: any) => {
    console.log('LanguageSwitcher: Attempting to change locale to:', newLocale)

    if (!newLocale || typeof newLocale !== 'string') {
        console.error('LanguageSwitcher: Invalid locale value:', newLocale)
        return
    }

    if (!localeUtils.isSupported(newLocale)) {
        console.error('LanguageSwitcher: Unsupported locale:', newLocale)
        return
    }

    try {
        // Update local state
        selectedLocale.value = newLocale

        // Update i18n locale
        locale.value = newLocale as SupportedLocale

        // Update locale utils (for localStorage and meta tags)
        localeUtils.setLocale(newLocale as SupportedLocale)

        console.log('LanguageSwitcher: Successfully changed locale to:', newLocale)
        console.log('LanguageSwitcher: Current i18n locale:', locale.value)
    } catch (error) {
        console.error('LanguageSwitcher: Error changing locale:', error)
    }
}
</script>
