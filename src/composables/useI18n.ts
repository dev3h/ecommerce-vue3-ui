import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localeUtils, type SupportedLocale } from '@/locales'

/**
 * Enhanced i18n composable with additional utilities
 */
export function useAppI18n() {
    const { t, locale, availableLocales, messages } = useI18n()

    // Current locale info
    const currentLocale = computed(() => localeUtils.getCurrentLocale())
    const isVietnamese = computed(() => currentLocale.value === 'vi')
    const isEnglish = computed(() => currentLocale.value === 'en')

    // Formatting utilities
    const formatNumber = (number: number) => localeUtils.formatNumber(number)
    const formatCurrency = (amount: number) => localeUtils.formatCurrency(amount)
    const formatDate = (date: Date) => localeUtils.formatDate(date)
    const formatRelativeTime = (date: Date) => localeUtils.formatRelativeTime(date)

    // Locale switching
    const setLocale = (newLocale: SupportedLocale) => localeUtils.setLocale(newLocale)
    const getAvailableLocales = () => localeUtils.getAvailableLocales()

    // Translation with fallback
    const translate = (key: string, fallback?: string) => {
        try {
            const translation = t(key)
            return translation !== key ? translation : (fallback ?? key)
        } catch {
            return fallback ?? key
        }
    }

    // Pluralization helper
    const translatePlural = (key: string, count: number, fallback?: string) => {
        try {
            return t(key, count)
        } catch {
            return fallback ?? key
        }
    }

    // Get nested translation
    const getNestedTranslation = (keyPath: string) => {
        const keys = keyPath.split('.')
        let current: any = messages.value[currentLocale.value]

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key]
            } else {
                return keyPath // Return key if not found
            }
        }

        return typeof current === 'string' ? current : keyPath
    }

    // Check if translation exists
    const hasTranslation = (key: string): boolean => {
        try {
            const translation = t(key)
            return translation !== key
        } catch {
            return false
        }
    }

    // Get all translations for a namespace
    const getNamespaceTranslations = (namespace: string) => {
        const namespaceMessages = messages.value[currentLocale.value]?.[namespace]
        return namespaceMessages ?? {}
    }

    // Direction helper for RTL/LTR languages
    const direction = computed(() => {
        // Add RTL languages here if needed in the future
        return 'ltr'
    })

    return {
        // Core i18n
        t: translate,
        locale,
        availableLocales,
        messages,

        // Enhanced functions
        translate,
        translatePlural,
        getNestedTranslation,
        hasTranslation,
        getNamespaceTranslations,

        // Locale info
        currentLocale,
        isVietnamese,
        isEnglish,
        direction,

        // Formatting
        formatNumber,
        formatCurrency,
        formatDate,
        formatRelativeTime,

        // Locale switching
        setLocale,
        getAvailableLocales,
    }
}
