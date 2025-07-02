import { ref, computed } from 'vue'
import type { CartItem, CartSummary } from '@/types/cart'
import type { Product } from '@/types/products'

// Global cart state
const cartItems = ref<CartItem[]>([])

export function useCart() {
    // Computed properties
    const totalItems = computed(() =>
        cartItems.value.reduce((total, item) => total + item.quantity, 0),
    )

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
    const addToCart = (product: Product, quantity: number = 1) => {
        const existingItem = cartItems.value.find((item) => item.id === product.id)

        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            const cartItem: CartItem = {
                id: product.id,
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
    }

    const removeFromCart = (productId: number) => {
        const index = cartItems.value.findIndex((item) => item.id === productId)
        if (index > -1) {
            cartItems.value.splice(index, 1)
            saveCartToStorage()
        }
    }

    const updateQuantity = (productId: number, quantity: number) => {
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
