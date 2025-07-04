import { computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

interface AddToWishlistItem {
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
}

export function useWishlist() {
    const wishlistStore = useWishlistStore()
    const { success, error } = useToast()
    const { t } = useAppI18n()

    // Computed properties
    const wishlistItems = computed(() => wishlistStore.userWishlist)
    const wishlistCount = computed(() => wishlistStore.wishlistCount)
    const isEmpty = computed(() => wishlistStore.isEmpty)
    const isInWishlist = computed(() => wishlistStore.isInWishlist)

    // Methods
    const addToWishlist = (product: AddToWishlistItem) => {
        try {
            wishlistStore.addToWishlist(product)
            success(t('wishlist.addedToWishlist'))
            return true
        } catch (err: any) {
            error(err.message ?? t('wishlist.addError'))
            return false
        }
    }

    const removeFromWishlist = (productId: string) => {
        try {
            wishlistStore.removeFromWishlist(productId)
            success(t('wishlist.removedFromWishlist'))
            return true
        } catch (err: any) {
            error(err.message ?? t('wishlist.removeError'))
            return false
        }
    }

    const toggleWishlist = (product: AddToWishlistItem) => {
        try {
            const isAdded = wishlistStore.toggleWishlist(product)
            if (isAdded) {
                success(t('wishlist.addedToWishlist'))
            } else {
                success(t('wishlist.removedFromWishlist'))
            }
            return isAdded
        } catch (err: any) {
            error(err.message ?? t('wishlist.toggleError'))
            return false
        }
    }

    const clearWishlist = () => {
        try {
            wishlistStore.clearWishlist()
            success(t('wishlist.clearedWishlist'))
            return true
        } catch (err: any) {
            error(err.message ?? t('wishlist.clearError'))
            return false
        }
    }

    const loadWishlist = () => {
        wishlistStore.loadWishlistFromStorage()
    }

    const initializeWishlist = () => {
        wishlistStore.initializeWishlist()
    }

    return {
        // State
        wishlistItems,
        wishlistCount,
        isEmpty,
        isInWishlist,

        // Methods
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        loadWishlist,
        initializeWishlist,
    }
}
