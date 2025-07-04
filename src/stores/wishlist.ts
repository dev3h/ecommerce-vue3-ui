import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface WishlistItem {
    id: string
    productId: string
    name: string
    price: number
    originalPrice?: number
    image: string
    category?: string
    description?: string
    rating?: number
    reviewCount?: number
    inStock?: boolean
    addedAt: string
}

export const useWishlistStore = defineStore('wishlist', () => {
    // State
    const wishlistItems = ref<WishlistItem[]>([])
    const isLoading = ref(false)

    // Getters
    const userWishlist = computed(() => {
        const authStore = useAuthStore()
        if (!authStore.user?.id) return []
        return wishlistItems.value
    })

    const wishlistCount = computed(() => wishlistItems.value.length)

    const isEmpty = computed(() => wishlistItems.value.length === 0)

    const isInWishlist = computed(() => {
        return (productId: string) => {
            return wishlistItems.value.some((item) => item.productId === productId)
        }
    })

    // Actions
    const addToWishlist = (product: Omit<WishlistItem, 'id' | 'addedAt'>) => {
        const authStore = useAuthStore()
        if (!authStore.user?.id) {
            throw new Error('User must be authenticated to add items to wishlist')
        }

        // Check if item already exists
        const existingItem = wishlistItems.value.find(
            (item) => item.productId === product.productId,
        )
        if (existingItem) {
            return // Item already in wishlist
        }

        const wishlistItem: WishlistItem = {
            id: 'wishlist_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now(),
            ...product,
            addedAt: new Date().toISOString(),
        }

        wishlistItems.value.unshift(wishlistItem)
        saveWishlistToStorage()
    }

    const removeFromWishlist = (productId: string) => {
        const index = wishlistItems.value.findIndex((item) => item.productId === productId)
        if (index > -1) {
            wishlistItems.value.splice(index, 1)
            saveWishlistToStorage()
        }
    }

    const toggleWishlist = (product: Omit<WishlistItem, 'id' | 'addedAt'>) => {
        if (isInWishlist.value(product.productId)) {
            removeFromWishlist(product.productId)
            return false // Removed
        } else {
            addToWishlist(product)
            return true // Added
        }
    }

    const clearWishlist = () => {
        wishlistItems.value = []
        saveWishlistToStorage()
    }

    // Persistence
    const saveWishlistToStorage = () => {
        const authStore = useAuthStore()
        if (authStore.user?.id) {
            const key = `wishlist_${authStore.user.id}`
            localStorage.setItem(key, JSON.stringify(wishlistItems.value))
        }
    }

    const loadWishlistFromStorage = () => {
        const authStore = useAuthStore()
        if (!authStore.user?.id) return

        const key = `wishlist_${authStore.user.id}`
        const saved = localStorage.getItem(key)

        if (saved) {
            try {
                wishlistItems.value = JSON.parse(saved)
            } catch (error) {
                console.error('Error parsing wishlist from localStorage:', error)
                wishlistItems.value = []
            }
        }
    }

    const clearUserWishlist = () => {
        const authStore = useAuthStore()
        if (authStore.user?.id) {
            const key = `wishlist_${authStore.user.id}`
            localStorage.removeItem(key)
            wishlistItems.value = []
        }
    }

    // Initialize wishlist from storage
    const initializeWishlist = () => {
        loadWishlistFromStorage()

        // Add sample items if no wishlist exists (for demo)
        // if (wishlistItems.value.length === 0) {
        //     createSampleWishlist()
        // }
    }

    // Create sample wishlist for testing
    const createSampleWishlist = () => {
        const sampleItems: WishlistItem[] = [
            {
                id: 'wishlist_sample_001',
                productId: 'prod_001',
                name: 'Wireless Bluetooth Headphones',
                price: 79.99,
                originalPrice: 99.99,
                image: 'https://picsum.photos/300/300?random=1',
                category: 'Electronics',
                description: 'High-quality wireless headphones with noise cancellation',
                rating: 4.5,
                reviewCount: 128,
                inStock: true,
                addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            },
            {
                id: 'wishlist_sample_002',
                productId: 'prod_002',
                name: 'Smart Fitness Watch',
                price: 199.99,
                originalPrice: 249.99,
                image: 'https://picsum.photos/300/300?random=2',
                category: 'Wearables',
                description: 'Advanced fitness tracking with heart rate monitor',
                rating: 4.3,
                reviewCount: 89,
                inStock: true,
                addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            },
            {
                id: 'wishlist_sample_003',
                productId: 'prod_003',
                name: 'Portable Laptop Stand',
                price: 45.99,
                image: 'https://picsum.photos/300/300?random=3',
                category: 'Office',
                description: 'Adjustable and portable laptop stand for better ergonomics',
                rating: 4.7,
                reviewCount: 234,
                inStock: false,
                addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            },
        ]

        wishlistItems.value = sampleItems
        saveWishlistToStorage()
    }

    return {
        // State
        wishlistItems: computed(() => wishlistItems.value),
        isLoading,

        // Getters
        userWishlist,
        wishlistCount,
        isEmpty,
        isInWishlist,

        // Actions
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        loadWishlistFromStorage,
        clearUserWishlist,
        initializeWishlist,
        createSampleWishlist,
    }
})
