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
        console.log('useCart: Showing success toast for:', product.name)
        success(t('cart.addedToCartSuccess'))
        console.log('useCart: Toast should be visible now')
    }

    const removeFromCart = (productId: string) => {
        const index = cartItems.value.findIndex((item) => item.id === productId)
        if (index > -1) {
            cartItems.value.splice(index, 1)
            saveCartToStorage()
        }
    }

    const updateQuantity = (productId: string, quantity: number) => {
        console.log('useCart: Updating quantity for product', productId, 'to', quantity)
        const item = cartItems.value.find((item) => item.id === productId)
        console.log('useCart: Found item:', item)
        if (item) {
            if (quantity <= 0) {
                console.log('useCart: Quantity <= 0, removing from cart')
                removeFromCart(productId)
            } else {
                console.log('useCart: Setting quantity from', item.quantity, 'to', quantity)
                item.quantity = quantity
                saveCartToStorage()
                console.log('useCart: Cart items after update:', cartItems.value)
            }
        } else {
            console.log('useCart: Item not found in cart')
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
        console.log('useCart: Loading cart from storage:', savedCart)
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                console.log('useCart: Parsed cart data:', parsedCart)
                cartItems.value = parsedCart
                console.log('useCart: Cart items after loading:', cartItems.value)
            } catch (error) {
                console.error('useCart: Error parsing cart from localStorage:', error)
                cartItems.value = []
            }
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
