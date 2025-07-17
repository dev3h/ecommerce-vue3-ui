import { createI18n } from 'vue-i18n'
import EN from './en.json'
import VI from './vi.json'
const en = {
    ...EN,
    admin: {
        ...EN.admin,
        coupons: await import('./en/admin/coupon.json').then(m => m.default),
    },
}
const vi = {
    ...VI,
    admin: {
        ...VI.admin,
        coupons: await import('./vi/admin/coupon.json').then(m => m.default),
    },
}
// Supported locales
export const SUPPORTED_LOCALES = ['en', 'vi'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

// Default locale
export const DEFAULT_LOCALE: SupportedLocale = 'en'

// Locale info for display
export const LOCALE_INFO = {
    en: {
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
    },
    vi: {
        name: 'Vietnamese',
        nativeName: 'Tiếng Việt',
        flag: '🇻🇳',
    },
} as const

// Get browser locale
function getBrowserLocale(): SupportedLocale {
    const browserLocale = navigator.language.split('-')[0]
    return SUPPORTED_LOCALES.includes(browserLocale as SupportedLocale)
        ? (browserLocale as SupportedLocale)
        : DEFAULT_LOCALE
}

// Get saved locale from localStorage
function getSavedLocale(): SupportedLocale | null {
    const saved = localStorage.getItem('locale')
    return saved && SUPPORTED_LOCALES.includes(saved as SupportedLocale)
        ? (saved as SupportedLocale)
        : null
}

// Save locale to localStorage
function saveLocale(locale: SupportedLocale): void {
    localStorage.setItem('locale', locale)
}

// Determine initial locale
function getInitialLocale(): SupportedLocale {
    return getSavedLocale() ?? getBrowserLocale()
}

// Create i18n instance
export const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: getInitialLocale(),
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
        en,
        vi,
    },
    globalInjection: true, // Enable global $t function
})

// Locale utilities
export const localeUtils = {
    /**
     * Change the current locale
     */
    setLocale(locale: SupportedLocale): void {
        if (!SUPPORTED_LOCALES.includes(locale)) {
            console.warn(`Unsupported locale: ${locale}`)
            return
        }

        i18n.global.locale.value = locale
        saveLocale(locale)
        document.documentElement.lang = locale

        // Update meta tags for SEO
        updateMetaTags(locale)
    },

    /**
     * Get current locale
     */
    getCurrentLocale(): SupportedLocale {
        return i18n.global.locale.value as SupportedLocale
    },

    /**
     * Check if locale is supported
     */
    isSupported(locale: string): locale is SupportedLocale {
        return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
    },

    /**
     * Get available locales with their info
     */
    getAvailableLocales() {
        return SUPPORTED_LOCALES.map((locale) => ({
            code: locale,
            ...LOCALE_INFO[locale],
        }))
    },

    /**
     * Format number according to current locale
     */
    formatNumber(number: number): string {
        const locale = this.getCurrentLocale()
        return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(number)
    },

    /**
     * Format currency according to current locale
     */
    formatCurrency(amount: number): string {
        const locale = this.getCurrentLocale()

        if (locale === 'vi') {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(amount)
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    },

    /**
     * Format date according to current locale
     */
    formatDate(date: Date): string {
        const locale = this.getCurrentLocale()
        return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(date)
    },

    /**
     * Format relative time according to current locale
     */
    formatRelativeTime(date: Date): string {
        const locale = this.getCurrentLocale()
        const rtf = new Intl.RelativeTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
            numeric: 'auto',
        })

        const diffInSeconds = Math.floor((date.getTime() - Date.now()) / 1000)
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        const diffInHours = Math.floor(diffInMinutes / 60)
        const diffInDays = Math.floor(diffInHours / 24)

        if (Math.abs(diffInDays) > 0) {
            return rtf.format(diffInDays, 'day')
        }
        if (Math.abs(diffInHours) > 0) {
            return rtf.format(diffInHours, 'hour')
        }
        if (Math.abs(diffInMinutes) > 0) {
            return rtf.format(diffInMinutes, 'minute')
        }
        return rtf.format(diffInSeconds, 'second')
    },
}

// Update meta tags for SEO
function updateMetaTags(locale: SupportedLocale): void {
    // Update lang attribute
    document.documentElement.lang = locale

    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
        const descriptions = {
            en: 'Modern e-commerce store built with Vue 3 and TypeScript',
            vi: 'Cửa hàng thương mại điện tử hiện đại được xây dựng với Vue 3 và TypeScript',
        }
        metaDescription.setAttribute('content', descriptions[locale])
    }
}

// Initialize meta tags
updateMetaTags(getInitialLocale())
