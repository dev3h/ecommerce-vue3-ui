import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './locales'
import { useWishlistStore } from './stores/wishlist'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize stores after app is set up
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()

// Initialize wishlist when auth state changes
router.afterEach(() => {
    if (authStore.user?.id) {
        wishlistStore.initializeWishlist()
    }
})

// Initialize wishlist on app load if user is already authenticated
if (authStore.user?.id) {
    wishlistStore.initializeWishlist()
}

app.mount('#app')
