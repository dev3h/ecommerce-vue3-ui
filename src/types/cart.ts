export interface CartItem {
    id: number
    name: string
    price: number
    originalPrice?: number
    image: string
    quantity: number
    category?: string
    description?: string
}

export interface CartSummary {
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
}

export interface ShippingAddress {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface PaymentMethod {
    type: 'card' | 'paypal' | 'bank_transfer'
    cardNumber?: string
    cardExpiry?: string
    cardCvc?: string
    cardName?: string
}

export interface Order {
    id: string
    items: CartItem[]
    summary: CartSummary
    shippingAddress: ShippingAddress
    paymentMethod: PaymentMethod
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    createdAt: Date
    estimatedDelivery?: Date
}
