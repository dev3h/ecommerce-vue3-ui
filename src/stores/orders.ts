import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface OrderItem {
    id: string
    productId: string
    name: string
    price: number
    quantity: number
    image?: string
}

export interface ShippingAddress {
    firstName: string
    lastName: string
    email: string
    phone?: string
    address: string
    city: string
    state?: string
    zipCode: string
    country: string
}

export interface Order {
    id: string
    userId: string
    number: string
    date: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    items: OrderItem[]
    itemCount: number
    subtotal: number
    shipping: number
    tax: number
    total: number
    currency: string
    shippingAddress: ShippingAddress
    paymentMethod: {
        type: string
        last4?: string
    }
    tracking?: string
    estimatedDelivery?: string
}

export const useOrderStore = defineStore('orders', () => {
    // State
    const orders = ref<Order[]>([])
    const isLoading = ref(false)

    // Getters
    const userOrders = computed(() => {
        const authStore = useAuthStore()
        if (!authStore.user?.id) return []
        return orders.value.filter((order) => order.userId === authStore.user?.id)
    })

    const getOrderById = computed(() => {
        return (id: string) => orders.value.find((order) => order.id === id)
    })

    // Actions
    const createOrder = async (orderData: {
        items: OrderItem[]
        shippingAddress: ShippingAddress
        paymentMethod: any
        subtotal: number
        shipping: number
        tax: number
        total: number
    }) => {
        const authStore = useAuthStore()
        if (!authStore.user?.id) {
            throw new Error('User must be authenticated to create order')
        }

        isLoading.value = true
        try {
            // Generate order number and ID
            const orderNumber = generateOrderNumber()
            const orderId = generateOrderId()

            const newOrder: Order = {
                id: orderId,
                userId: authStore.user.id,
                number: orderNumber,
                date: new Date().toISOString(),
                status: 'pending',
                items: orderData.items,
                itemCount: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                tax: orderData.tax,
                total: orderData.total,
                currency: 'USD',
                shippingAddress: orderData.shippingAddress,
                paymentMethod: {
                    type: orderData.paymentMethod.type,
                    last4: orderData.paymentMethod.cardNumber?.slice(-4),
                },
                estimatedDelivery: getEstimatedDelivery(),
            }

            // Add to orders array
            orders.value.unshift(newOrder)

            // Save to localStorage
            saveOrdersToStorage()

            // Simulate order processing
            setTimeout(() => {
                updateOrderStatus(orderId, 'processing')
            }, 5000)

            return newOrder
        } finally {
            isLoading.value = false
        }
    }

    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        const orderIndex = orders.value.findIndex((order) => order.id === orderId)
        if (orderIndex !== -1) {
            orders.value[orderIndex].status = status

            // Add tracking number when shipped
            if (status === 'shipped' && !orders.value[orderIndex].tracking) {
                orders.value[orderIndex].tracking = generateTrackingNumber()
            }

            saveOrdersToStorage()
        }
    }

    const loadUserOrders = () => {
        const authStore = useAuthStore()
        if (!authStore.user?.id) return

        try {
            const stored = localStorage.getItem('orders')
            if (stored) {
                const allOrders = JSON.parse(stored)
                orders.value = allOrders.filter(
                    (order: Order) => order.userId === authStore.user?.id,
                )
            }
        } catch (error) {
            console.error('Failed to load orders:', error)
        }
    }

    const loadAllOrders = () => {
        try {
            const stored = localStorage.getItem('orders')
            if (stored) {
                orders.value = JSON.parse(stored)
            }
        } catch (error) {
            console.error('Failed to load orders:', error)
        }
    }

    const saveOrdersToStorage = () => {
        try {
            // Get all orders from storage first
            const stored = localStorage.getItem('orders')
            let allOrders: Order[] = stored ? JSON.parse(stored) : []

            // Update or add current user's orders
            const authStore = useAuthStore()
            if (authStore.user?.id) {
                // Remove old orders for this user
                allOrders = allOrders.filter((order) => order.userId !== authStore.user?.id)
                // Add current orders
                allOrders.push(
                    ...orders.value.filter((order) => order.userId === authStore.user?.id),
                )
            }

            localStorage.setItem('orders', JSON.stringify(allOrders))
        } catch (error) {
            console.error('Failed to save orders:', error)
        }
    }

    const clearUserOrders = () => {
        const authStore = useAuthStore()
        if (authStore.user?.id) {
            orders.value = orders.value.filter((order) => order.userId !== authStore.user?.id)
            saveOrdersToStorage()
        }
    }

    // Initialize orders when store is created
    const initializeOrders = () => {
        loadAllOrders()
    }

    return {
        // State
        orders,
        isLoading,

        // Getters
        userOrders,
        getOrderById,

        // Actions
        createOrder,
        updateOrderStatus,
        loadUserOrders,
        loadAllOrders,
        clearUserOrders,
        initializeOrders,
    }
})

// Helper functions
function generateOrderNumber(): string {
    return (
        'ORD-' +
        Date.now().toString().slice(-8) +
        '-' +
        Math.random().toString(36).substring(2, 6).toUpperCase()
    )
}

function generateOrderId(): string {
    return 'order_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now()
}

function generateTrackingNumber(): string {
    return (
        'TRK' +
        Math.random().toString(36).substring(2, 11).toUpperCase() +
        Date.now().toString().slice(-6)
    )
}

function getEstimatedDelivery(): string {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 3) // 3-7 days
    return deliveryDate.toISOString()
}
