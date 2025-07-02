import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'
import type { CartItem, CartSummary } from '@/types/cart'

// Global cart state
const cartItems = ref<CartItem[]>([])

// Interface for adding items to cart
interface AddToCartItem {
    id: string | number
    name: string
    price: number
    originalPrice?: number
    image: string
    category?: string
    description?: string
}

export function useCart() {
    // Composables must be called at top level
    const { success } = useToast()
    const { t } = useAppI18n()

    // Computed properties
    const totalItems = computed(() => cartItems.value.length) // Số loại sản phẩm khác nhau

    const totalQuantity = computed(() =>
        cartItems.value.reduce((total, item) => total + item.quantity, 0),
    ) // Tổng số lượng tất cả sản phẩm

    const isEmpty = computed(() => cartItems.value.length === 0)

    const cartSummary = computed((): CartSummary => {
        const subtotal = cartItems.value.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        )
        const shipping = subtotal > 50 ? 0 : 10 // Free shipping over $50
        const tax = subtotal * 0.08 // 8% tax
        const discount = 0 // Can be implemented later
        const total = subtotal + shipping + tax - discount

        return {
            subtotal: Number(subtotal.toFixed(2)),
            shipping: Number(shipping.toFixed(2)),
            tax: Number(tax.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            total: Number(total.toFixed(2)),
        }
    })

    // Methods
    const addToCart = (product: AddToCartItem, quantity: number = 1) => {
        const productId = product.id.toString() // Convert to string for consistency
        const existingItem = cartItems.value.find((item) => item.id === productId)

        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            const cartItem: CartItem = {
                id: productId,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                quantity,
                category: product.category,
                description: product.description,
            }
            cartItems.value.push(cartItem)
        }

        // Save to localStorage
        saveCartToStorage()

        // Show success notification
        success(t('cart.addedToCartSuccess'))
    }

    const removeFromCart = (productId: string) => {
        const index = cartItems.value.findIndex((item) => item.id === productId)
        if (index > -1) {
            cartItems.value.splice(index, 1)
            saveCartToStorage()
        }
    }

    const updateQuantity = (productId: string, quantity: number) => {
        const item = cartItems.value.find((item) => item.id === productId)
        if (item) {
            if (quantity <= 0) {
                removeFromCart(productId)
            } else {
                item.quantity = quantity
                saveCartToStorage()
            }
        }
    }

    const clearCart = () => {
        cartItems.value = []
        saveCartToStorage()
    }

    // Persistence
    const saveCartToStorage = () => {
        localStorage.setItem('cart', JSON.stringify(cartItems.value))
    }

    const loadCartFromStorage = () => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            cartItems.value = JSON.parse(savedCart)
        }
    }

    // Initialize cart from storage
    if (typeof window !== 'undefined') {
        loadCartFromStorage()
    }

    return {
        // State
        cartItems: computed(() => cartItems.value),

        // Computed
        totalItems,
        totalQuantity,
        isEmpty,
        cartSummary,

        // Methods
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCartFromStorage,
    }
}
