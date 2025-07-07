export interface ProductReview {
    id: string
    productId: string
    userId: string
    orderId: string
    userName: string
    userAvatar?: string
    rating: number // 1-5 stars
    title: string
    comment: string
    images?: string[] // Optional review images
    isVerifiedPurchase: boolean
    helpfulCount: number
    createdAt: string
    updatedAt: string
    canEdit: boolean // User can only edit their own review and only once
    hasBeenEdited: boolean
}

export interface ReviewStats {
    totalReviews: number
    averageRating: number
    ratingDistribution: {
        1: number
        2: number
        3: number
        4: number
        5: number
    }
}

export interface CreateReviewRequest {
    productId: string
    orderId: string
    rating: number
    title: string
    comment: string
    images?: string[]
}

export interface UpdateReviewRequest {
    rating: number
    title: string
    comment: string
    images?: string[]
}

export interface ReviewPermissions {
    canReview: boolean // User has purchased and received the product
    hasReviewed: boolean // User already reviewed this product for this order
    canEdit: boolean // User can edit their existing review (only once)
    reviewId?: string // ID of existing review if any
    orderId?: string // Order ID that allows reviewing
}

// New interface for order-product review permissions
export interface OrderProductReviewPermissions {
    canReview: boolean // User can review this product from this order
    hasReviewed: boolean // User already reviewed this product for this specific order
    canEdit: boolean // User can edit their existing review (only once)
    reviewId?: string // ID of existing review if any
    productId: string // Product ID
    orderId: string // Order ID
}
