# Internationalization (i18n) Setup

This project supports multi-language functionality with English and Vietnamese languages using Vue I18n.

## 📁 Structure

```
src/locales/
├── index.ts          # Main i18n configuration and utilities
├── types.ts          # TypeScript interfaces for translations
├── en.json           # English translations
└── vi.json           # Vietnamese translations

src/composables/
└── useI18n.ts        # Enhanced i18n composable

src/components/
├── LanguageSwitcher.vue  # Language switcher component
└── PriceDisplay.vue      # Locale-aware price formatting
```

## 🚀 Features

### ✅ **Supported Languages**

- **English** (en) - Default language
- **Vietnamese** (vi) - Vietnamese language

### ✅ **Automatic Detection**

- Browser language detection
- LocalStorage persistence
- Fallback to default language

### ✅ **Formatting Utilities**

- Currency formatting (USD for English, VND for Vietnamese)
- Number formatting
- Date formatting
- Relative time formatting

### ✅ **Components**

- **LanguageSwitcher**: Dropdown component for language selection
- **PriceDisplay**: Locale-aware price display with discount support

## 🔧 Usage

### Basic Translation

```vue
<template>
  <div>
    <h1>{{ $t('common.welcome') }}</h1>
    <p>{{ $t('navigation.home') }}</p>
  </div>
</template>
```

### Using the Enhanced Composable

```vue
<script setup>
import { useAppI18n } from '@/composables/useI18n'

const { t, formatCurrency, formatDate, currentLocale, setLocale } = useAppI18n()
</script>

<template>
  <div>
    <h1>{{ t('common.welcome') }}</h1>
    <p>{{ t('products.price') }}: {{ formatCurrency(299.99) }}</p>
    <p>Current: {{ currentLocale }}</p>
    <button @click="setLocale('vi')">Switch to Vietnamese</button>
  </div>
</template>
```

### Language Switcher

```vue
<template>
  <div>
    <LanguageSwitcher />
  </div>
</template>

<script setup>
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>
```

### Price Display Component

```vue
<template>
  <div>
    <!-- Basic price -->
    <PriceDisplay :price="299.99" />

    <!-- With discount -->
    <PriceDisplay :price="199.99" :originalPrice="299.99" size="lg" />
  </div>
</template>

<script setup>
import PriceDisplay from '@/components/PriceDisplay.vue'
</script>
```

## 📝 Translation Keys Structure

```json
{
  "common": {
    /* Common UI elements */
  },
  "navigation": {
    /* Navigation menu items */
  },
  "auth": {
    /* Authentication forms */
  },
  "products": {
    /* Product-related content */
  },
  "cart": {
    /* Shopping cart */
  },
  "account": {
    /* User account */
  },
  "errors": {
    /* Error messages */
  },
  "meta": {
    /* Page titles and meta */
  }
}
```

## 🎯 Adding New Languages

1. **Create language file**:

   ```json
   // src/locales/fr.json
   {
     "common": {
       "welcome": "Bienvenue"
     }
     // ... other translations
   }
   ```

2. **Update locales configuration**:

   ```typescript
   // src/locales/index.ts
   export const SUPPORTED_LOCALES = ['en', 'vi', 'fr'] as const

   export const LOCALE_INFO = {
     // ... existing locales
     fr: {
       name: 'French',
       nativeName: 'Français',
       flag: '🇫🇷',
     },
   }
   ```

3. **Import in i18n config**:

   ```typescript
   import fr from './fr.json'

   export const i18n = createI18n({
     messages: {
       en,
       vi,
       fr,
     },
   })
   ```

## 💡 Best Practices

### ✅ **Do's**

- Use nested translation keys for organization
- Provide fallback text for missing translations
- Use the composable for complex formatting
- Test with both languages
- Use semantic key names

### ❌ **Don'ts**

- Don't hardcode text in components
- Don't forget to add new keys to both language files
- Don't use translation keys as display text
- Don't mix languages in the same namespace

## 🔄 Dynamic Route Titles

Routes automatically use translated titles:

```typescript
// In route definition
{
  path: '/products',
  meta: {
    title: 'meta.productsTitle', // Translation key
  }
}
```

## 📱 Currency and Number Formatting

The system automatically formats currencies and numbers according to the selected locale:

- **English**: $299.99 (USD format)
- **Vietnamese**: 299.990 ₫ (VND format)

## 🛠 Development Tools

### Adding New Translation Keys

1. Add to both `en.json` and `vi.json`
2. Update `types.ts` interface if needed
3. Use in components with `t('your.new.key')`

### Testing Different Locales

```javascript
// In browser console
localStorage.setItem('locale', 'vi')
location.reload()
```

## 🚀 Production Considerations

- All translations are bundled (no lazy loading)
- LocalStorage persists user language preference
- SEO-friendly with proper lang attributes
- Automatic browser language detection

## 📊 Performance

- Small bundle size (JSON files are efficiently compressed)
- No runtime translation compilation
- Cached in localStorage for quick switching
- Efficient Vue reactivity for language changes
