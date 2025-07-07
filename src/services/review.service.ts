import type {
    ProductReview,
    ReviewStats,
    CreateReviewRequest,
    UpdateReviewRequest,
    ReviewPermissions,
    OrderProductReviewPermissions,
} from '@/types/reviews'
import { useOrderStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { reviewEventBus, REVIEW_EVENTS } from '@/lib/reviewEventBus'

class ReviewService {
    private readonly STORAGE_KEY = 'product_reviews'

    private async delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    // Helper to get reviews from localStorage
    private getStoredReviews(): Record<string, ProductReview[]> {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY)
            return stored ? JSON.parse(stored) : {}
        } catch {
            return {}
        }
    }

    // Helper to save reviews to localStorage
    private saveReviews(reviews: Record<string, ProductReview[]>) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews))
        } catch (error) {
            console.error('Failed to save reviews to localStorage:', error)
        }
    }

    // Get reviews for a product
    async getProductReviews(
        productId: string,
        page = 1,
        limit = 10,
    ): Promise<{
        reviews: ProductReview[]
        stats: ReviewStats
        totalPages: number
        currentPage: number
    }> {
        await this.delay(500)

        // Get stored reviews for this product
        const allReviews = this.getStoredReviews()
        const storedReviews = allReviews[productId] ?? []

        // Add some mock reviews for demonstration (only if no stored reviews exist)
        const mockReviews: ProductReview[] =
            storedReviews.length === 0
                ? [
                      {
                          id: 'review_001',
                          productId,
                          userId: 'user_002',
                          orderId: 'order_001',
                          userName: 'Jane Smith',
                          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
                          rating: 5,
                          title: 'Excellent product!',
                          comment:
                              'Really satisfied with this purchase. Great quality and fast delivery.',
                          images: ['https://picsum.photos/200/200?random=10'],
                          isVerifiedPurchase: true,
                          helpfulCount: 12,
                          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                          canEdit: false,
                          hasBeenEdited: false,
                      },
                      {
                          id: 'review_002',
                          productId,
                          userId: 'user_003',
                          orderId: 'order_002',
                          userName: 'Mike Johnson',
                          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
                          rating: 4,
                          title: 'Good value for money',
                          comment:
                              'Product works as expected. Delivery was a bit slow but overall satisfied.',
                          isVerifiedPurchase: true,
                          helpfulCount: 8,
                          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                          canEdit: false,
                          hasBeenEdited: false,
                      },
                  ]
                : []

        // Combine stored and mock reviews
        const allProductReviews = [...storedReviews, ...mockReviews]

        // Sort by creation date (newest first)
        allProductReviews.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

        // Calculate stats
        const totalReviews = allProductReviews.length
        const averageRating =
            totalReviews > 0
                ? allProductReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
                : 0

        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        allProductReviews.forEach((review) => {
            ratingDistribution[review.rating as keyof typeof ratingDistribution]++
        })

        const stats: ReviewStats = {
            totalReviews,
            averageRating,
            ratingDistribution,
        }

        // Pagination
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedReviews = allProductReviews.slice(startIndex, endIndex)
        const totalPages = Math.ceil(totalReviews / limit)

        return {
            reviews: paginatedReviews,
            stats,
            totalPages,
            currentPage: page,
        }
    }

    // Check if user can review a specific product from a specific order
    async checkOrderProductReviewPermissions(
        productId: string,
        orderId: string,
        userId: string,
    ): Promise<OrderProductReviewPermissions> {
        await this.delay(300)

        const orderStore = useOrderStore()
        const authStore = useAuthStore()

        console.log('🔍 Checking order-product review permissions:', { productId, orderId, userId })

        // Check if user is authenticated
        if (!authStore.isAuthenticated || !authStore.user) {
            console.log('❌ User not authenticated')
            return {
                canReview: false,
                hasReviewed: false,
                canEdit: false,
                reviewId: undefined,
                productId,
                orderId,
            }
        }

        // Find the specific order
        const order = orderStore.orders.find(
            (o) => o.id === orderId && o.userId === userId && o.status === 'delivered',
        )

        if (!order) {
            console.log('❌ Order not found or not delivered')
            return {
                canReview: false,
                hasReviewed: false,
                canEdit: false,
                reviewId: undefined,
                productId,
                orderId,
            }
        }

        // Check if the order contains this product
        const orderItem = order.items.find((item) => item.productId === productId)
        if (!orderItem) {
            console.log('❌ Product not found in this order')
            return {
                canReview: false,
                hasReviewed: false,
                canEdit: false,
                reviewId: undefined,
                productId,
                orderId,
            }
        }

        // Check if user already has a review for this product-order combination
        const existingReviews = await this.getProductReviews(productId, 1, 1000)
        const userReview = existingReviews.reviews.find(
            (review) => review.userId === userId && review.orderId === orderId,
        )

        console.log('🔍 Existing user review for this order-product:', userReview)

        if (userReview) {
            console.log(
                '✅ User has existing review for this order-product, can edit:',
                !userReview.hasBeenEdited,
            )
            return {
                canReview: false,
                hasReviewed: true,
                canEdit: !userReview.hasBeenEdited,
                reviewId: userReview.id,
                productId,
                orderId,
            }
        }

        // User can review this product from this order
        console.log(
            '✅ User can review - has delivered order and no existing review for this order-product',
        )
        return {
            canReview: true,
            hasReviewed: false,
            canEdit: false,
            reviewId: undefined,
            productId,
            orderId,
        }
    }

    // Check if user can review a product (legacy method - now checks first delivered order)
    async checkReviewPermissions(productId: string, userId: string): Promise<ReviewPermissions> {
        await this.delay(300)

        // Get the current user's orders and existing reviews
        const orderStore = useOrderStore()
        const authStore = useAuthStore()

        console.log('🔍 Checking review permissions:', { productId, userId })
        console.log('🔍 Auth state:', {
            isAuthenticated: authStore.isAuthenticated,
            user: authStore.user,
        })
        console.log('🔍 Orders:', orderStore.orders)

        // Check if user is authenticated
        if (!authStore.isAuthenticated || !authStore.user) {
            console.log('❌ User not authenticated')
            return {
                canReview: false,
                hasReviewed: false,
                canEdit: false,
                reviewId: undefined,
                orderId: undefined,
            }
        }

        // Find if user has any delivered orders containing this product
        const deliveredOrders = orderStore.orders.filter(
            (order) =>
                order.userId === userId &&
                order.status === 'delivered' &&
                order.items.some((item) => item.productId === productId),
        )

        console.log('🔍 Delivered orders for user:', deliveredOrders)
        console.log('🔍 Looking for productId:', productId)

        // If no delivered orders with this product, user cannot review
        if (deliveredOrders.length === 0) {
            console.log('❌ No delivered orders found for this product')
            return {
                canReview: false,
                hasReviewed: false,
                canEdit: false,
                reviewId: undefined,
                orderId: undefined,
            }
        }

        // Check if user already has a review for this product
        // In a real app, this would be fetched from API
        // For now, we'll check against the mock reviews stored in this service
        const existingReviews = await this.getProductReviews(productId, 1, 1000)
        const userReview = existingReviews.reviews.find((review) => review.userId === userId)

        console.log('🔍 Existing user review:', userReview)

        // Get the first eligible order for reviewing
        const eligibleOrder = deliveredOrders[0]

        if (userReview) {
            console.log('✅ User has existing review, can edit:', !userReview.hasBeenEdited)
            return {
                canReview: false,
                hasReviewed: true,
                canEdit: !userReview.hasBeenEdited,
                reviewId: userReview.id,
                orderId: eligibleOrder.id,
            }
        }

        // User can review if they have delivered order and haven't reviewed yet
        console.log('✅ User can review - has delivered order and no existing review')
        return {
            canReview: true,
            hasReviewed: false,
            canEdit: false,
            reviewId: undefined,
            orderId: eligibleOrder.id,
        }
    }

    // Create a new review
    async createReview(reviewData: CreateReviewRequest): Promise<ProductReview> {
        await this.delay(800)

        const authStore = useAuthStore()
        if (!authStore.user) {
            throw new Error('User not authenticated')
        }

        const newReview: ProductReview = {
            id: 'review_' + Math.random().toString(36).substring(2, 11),
            productId: reviewData.productId,
            userId: authStore.user.id,
            orderId: reviewData.orderId,
            userName: `${authStore.user.firstName} ${authStore.user.lastName}`,
            userAvatar:
                authStore.user.avatar ??
                'https://api.dicebear.com/7.x/avataaars/svg?seed=' + authStore.user.firstName,
            rating: reviewData.rating,
            title: reviewData.title,
            comment: reviewData.comment,
            images: reviewData.images || [],
            isVerifiedPurchase: true,
            helpfulCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            canEdit: true,
            hasBeenEdited: false,
        }

        // Save to localStorage
        const allReviews = this.getStoredReviews()
        if (!allReviews[reviewData.productId]) {
            allReviews[reviewData.productId] = []
        }
        allReviews[reviewData.productId].push(newReview)
        this.saveReviews(allReviews)

        // Emit event for other components to listen
        reviewEventBus.emit(REVIEW_EVENTS.REVIEW_CREATED, {
            productId: reviewData.productId,
            review: newReview,
        })

        return newReview
    }

    // Update an existing review (only allowed once)
    async updateReview(
        reviewId: string,
        productId: string,
        reviewData: UpdateReviewRequest,
    ): Promise<ProductReview> {
        await this.delay(800)

        const authStore = useAuthStore()
        if (!authStore.user) {
            throw new Error('User not authenticated')
        }

        // Get stored reviews
        const allReviews = this.getStoredReviews()
        const productReviews = allReviews[productId] || []

        // Find and update the review
        const reviewIndex = productReviews.findIndex((review) => review.id === reviewId)
        if (reviewIndex === -1) {
            throw new Error('Review not found')
        }

        const existingReview = productReviews[reviewIndex]
        if (existingReview.userId !== authStore.user.id) {
            throw new Error('Unauthorized to update this review')
        }

        if (existingReview.hasBeenEdited) {
            throw new Error('Review can only be edited once')
        }

        // Update the review
        const updatedReview: ProductReview = {
            ...existingReview,
            rating: reviewData.rating,
            title: reviewData.title,
            comment: reviewData.comment,
            images: reviewData.images || [],
            updatedAt: new Date().toISOString(),
            canEdit: false, // Can't edit again after first edit
            hasBeenEdited: true,
        }

        // Update in storage
        productReviews[reviewIndex] = updatedReview
        allReviews[productId] = productReviews
        this.saveReviews(allReviews)

        console.log('Updating review:', updatedReview)

        return updatedReview
    }

    // Delete a review (optional feature)
    async deleteReview(reviewId: string): Promise<void> {
        await this.delay(500)
        console.log('Deleting review:', reviewId)
    }

    // Mark review as helpful
    async markReviewHelpful(reviewId: string): Promise<void> {
        await this.delay(300)
        console.log('Marking review as helpful:', reviewId)
    }
}

export const reviewService = new ReviewService()
