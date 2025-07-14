import type { Order } from '@/stores/orders'

// Extended Order interface for admin view
export interface AdminOrder extends Order {
    customerName: string
    customerEmail: string
}

export interface OrderFilters {
    status?: string
    dateRange?: {
        start: string
        end: string
    }
    search?: string
    page?: number
    limit?: number
}

export interface OrderStats {
    totalOrders: number
    pendingOrders: number
    processingOrders: number
    shippedOrders: number
    deliveredOrders: number
    cancelledOrders: number
    totalRevenue: number
    averageOrderValue: number
}

export const orderService = {
    /**
     * Get all orders (for admin)
     */
    async getAllOrders(filters?: OrderFilters): Promise<AdminOrder[]> {
        try {
            const stored = localStorage.getItem('orders')
            let orders: Order[] = stored ? JSON.parse(stored) : []

            // Apply filters
            if (filters?.status && filters.status !== 'all') {
                orders = orders.filter((order) => order.status === filters.status)
            }

            if (filters?.search) {
                const search = filters.search.toLowerCase()
                orders = orders.filter(
                    (order) =>
                        order.number.toLowerCase().includes(search) ||
                        order.shippingAddress.firstName.toLowerCase().includes(search) ||
                        order.shippingAddress.lastName.toLowerCase().includes(search) ||
                        order.shippingAddress.email.toLowerCase().includes(search),
                )
            }

            if (filters?.dateRange) {
                const startDate = new Date(filters.dateRange.start)
                const endDate = new Date(filters.dateRange.end)
                orders = orders.filter((order) => {
                    const orderDate = new Date(order.date)
                    return orderDate >= startDate && orderDate <= endDate
                })
            }

            // Convert to AdminOrder format
            const adminOrders: AdminOrder[] = orders.map((order) => ({
                ...order,
                customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
                customerEmail: order.shippingAddress.email,
            }))

            // Sort by date (newest first)
            adminOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

            // Apply pagination
            if (filters?.page && filters?.limit) {
                const start = (filters.page - 1) * filters.limit
                const end = start + filters.limit
                return adminOrders.slice(start, end)
            }

            return adminOrders
        } catch (error) {
            console.error('Error loading orders:', error)
            throw new Error('Failed to load orders')
        }
    },

    /**
     * Get single order by ID
     */
    async getOrder(orderId: string): Promise<AdminOrder | null> {
        try {
            const stored = localStorage.getItem('orders')
            const orders: Order[] = stored ? JSON.parse(stored) : []
            const order = orders.find((o) => o.id === orderId)

            if (!order) {
                return null
            }

            return {
                ...order,
                customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
                customerEmail: order.shippingAddress.email,
            }
        } catch (error) {
            console.error('Error loading order:', error)
            throw new Error('Failed to load order')
        }
    },

    /**
     * Get available status transitions for an order
     */
    getAvailableStatusTransitions(currentStatus: Order['status']): Order['status'][] {
        switch (currentStatus) {
            case 'pending':
                return ['pending', 'processing', 'cancelled']
            case 'processing':
                return ['processing', 'shipped', 'cancelled']
            case 'shipped':
                return ['shipped', 'delivered', 'cancelled']
            case 'delivered':
                return ['delivered'] // Không thể thay đổi từ delivered
            case 'cancelled':
                return ['cancelled'] // Không thể thay đổi từ cancelled
            default:
                return ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        }
    },

    /**
     * Validate if status transition is allowed
     */
    isStatusTransitionValid(currentStatus: Order['status'], newStatus: Order['status']): boolean {
        const allowedTransitions = this.getAvailableStatusTransitions(currentStatus)
        return allowedTransitions.includes(newStatus)
    },

    /**
     * Update order status with validation
     */
    async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
        try {
            const stored = localStorage.getItem('orders')
            let orders: Order[] = stored ? JSON.parse(stored) : []

            const orderIndex = orders.findIndex((order) => order.id === orderId)
            if (orderIndex === -1) {
                throw new Error('Order not found')
            }

            const currentOrder = orders[orderIndex]

            // Validate status transition
            if (!this.isStatusTransitionValid(currentOrder.status, status)) {
                throw new Error(
                    `Invalid status transition from ${currentOrder.status} to ${status}`,
                )
            }

            orders[orderIndex].status = status

            // Add tracking number when shipped
            if (status === 'shipped' && !orders[orderIndex].tracking) {
                orders[orderIndex].tracking = this.generateTrackingNumber()
            }

            localStorage.setItem('orders', JSON.stringify(orders))
        } catch (error) {
            console.error('Error updating order status:', error)
            throw new Error('Failed to update order status')
        }
    },

    /**
     * Get order statistics
     */
    async getOrderStats(): Promise<OrderStats> {
        try {
            const stored = localStorage.getItem('orders')
            const orders: Order[] = stored ? JSON.parse(stored) : []

            const stats: OrderStats = {
                totalOrders: orders.length,
                pendingOrders: orders.filter((o) => o.status === 'pending').length,
                processingOrders: orders.filter((o) => o.status === 'processing').length,
                shippedOrders: orders.filter((o) => o.status === 'shipped').length,
                deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
                cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
                totalRevenue: orders
                    .filter((o) => o.status !== 'cancelled')
                    .reduce((sum, order) => sum + order.total, 0),
                averageOrderValue: 0,
            }

            const completedOrders = orders.filter((o) => o.status !== 'cancelled')
            if (completedOrders.length > 0) {
                stats.averageOrderValue = stats.totalRevenue / completedOrders.length
            }

            return stats
        } catch (error) {
            console.error('Error loading order stats:', error)
            throw new Error('Failed to load order statistics')
        }
    },

    /**
     * Generate tracking number
     */
    generateTrackingNumber(): string {
        return (
            'TRK' +
            Math.random().toString(36).substring(2, 11).toUpperCase() +
            Date.now().toString().slice(-6)
        )
    },

    /**
     * Get order status badge variant
     */
    getStatusVariant(status: Order['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
        switch (status) {
            case 'delivered':
                return 'default'
            case 'shipped':
                return 'secondary'
            case 'processing':
                return 'outline'
            case 'cancelled':
                return 'destructive'
            default:
                return 'secondary'
        }
    },

    /**
     * Format currency
     */
    formatCurrency(amount: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount)
    },

    /**
     * Format date
     */
    formatDate(dateString: string, locale: string = 'en-US'): string {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString))
    },

    /**
     * Format payment method for display
     */
    formatPaymentMethod(paymentMethod: { type: string; last4?: string } | null): string {
        if (!paymentMethod) {
            return 'Credit Card'
        }

        if (typeof paymentMethod === 'string') {
            return paymentMethod
        }

        if (paymentMethod.type && paymentMethod.last4) {
            return `${paymentMethod.type} ending in ${paymentMethod.last4}`
        }

        return paymentMethod.type || 'Credit Card'
    },
}
