import { ref, computed } from 'vue'
import { reviewService } from '@/services/review.service'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'
import type {
    ProductReview,
    ReviewStats,
    CreateReviewRequest,
    UpdateReviewRequest,
    ReviewPermissions,
    OrderProductReviewPermissions,
} from '@/types/reviews'

export function useReviews(productId: string) {
    const authStore = useAuthStore()
    const { success, error } = useToast()
    const { t } = useAppI18n()

    // State
    const reviews = ref<ProductReview[]>([])
    const reviewStats = ref<ReviewStats | null>(null)
    const userPermissions = ref<ReviewPermissions | null>(null)
    const userReview = ref<ProductReview | null>(null)

    const loading = ref({
        reviews: false,
        permissions: false,
        creating: false,
        updating: false,
        deleting: false,
    })

    const reviewError = ref<string | null>(null)

    // Computed
    const canUserReview = computed(
        () => userPermissions.value?.canReview && authStore.isAuthenticated,
    )

    const hasUserReviewed = computed(() => userPermissions.value?.hasReviewed)

    const canEditReview = computed(() => userPermissions.value?.canEdit && userReview.value)

    const totalReviews = computed(() => reviewStats.value?.totalReviews ?? 0)
    const averageRating = computed(() => reviewStats.value?.averageRating ?? 0)

    // Methods
    const loadReviews = async (page = 1) => {
        loading.value.reviews = true
        reviewError.value = null

        try {
            const response = await reviewService.getProductReviews(productId, page)
            reviews.value = response.reviews
            reviewStats.value = response.stats

            // Find current user's review if exists
            if (authStore.user?.id) {
                userReview.value =
                    reviews.value.find((review) => review.userId === authStore.user?.id) || null
            }
        } catch (err) {
            reviewError.value = t('errors.loadingReviews')
            console.error('Error loading reviews:', err)
        } finally {
            loading.value.reviews = false
        }
    }

    const loadUserPermissions = async () => {
        console.log('🔍 Loading user permissions for productId:', productId)
        console.log('🔍 Auth store state:', {
            isAuthenticated: authStore.isAuthenticated,
            userId: authStore.user?.id,
        })

        if (!authStore.isAuthenticated || !authStore.user?.id) {
            console.log('❌ User not authenticated, setting default permissions')
            userPermissions.value = {
                canReview: false,
                hasReviewed: false,
                canEdit: false,
            }
            return
        }

        loading.value.permissions = true

        try {
            userPermissions.value = await reviewService.checkReviewPermissions(
                productId,
                authStore.user.id,
            )
            console.log('✅ User permissions loaded:', userPermissions.value)
        } catch (err) {
            console.error('Error loading review permissions:', err)
            userPermissions.value = {
                canReview: false,
                hasReviewed: false,
                canEdit: false,
            }
        } finally {
            loading.value.permissions = false
        }
    }

    const createReview = async (reviewData: Omit<CreateReviewRequest, 'productId'>) => {
        if (!canUserReview.value || !userPermissions.value?.orderId) {
            error(t('reviews.cannotReview'))
            return false
        }

        loading.value.creating = true

        try {
            const newReview = await reviewService.createReview({
                ...reviewData,
                productId,
                orderId: userPermissions.value.orderId,
            })

            // Add to reviews list
            reviews.value.unshift(newReview)
            userReview.value = newReview

            // Update permissions
            userPermissions.value.canReview = false
            userPermissions.value.hasReviewed = true
            userPermissions.value.canEdit = true
            userPermissions.value.reviewId = newReview.id

            // Update stats
            if (reviewStats.value) {
                reviewStats.value.totalReviews += 1
                // Recalculate average (simplified)
                const total = reviewStats.value.totalReviews
                const currentTotal =
                    reviewStats.value.averageRating * (total - 1) + reviewData.rating
                reviewStats.value.averageRating = currentTotal / total
            }

            success(t('reviews.reviewCreated'))
            return true
        } catch (err) {
            error(t('reviews.createError'))
            console.error('Error creating review:', err)
            return false
        } finally {
            loading.value.creating = false
        }
    }

    const updateReview = async (reviewData: UpdateReviewRequest) => {
        if (!canEditReview.value || !userReview.value) {
            error(t('reviews.cannotEdit'))
            return false
        }

        loading.value.updating = true

        try {
            const updatedReview = await reviewService.updateReview(
                userReview.value.id,
                productId,
                reviewData,
            )

            // Update in reviews list
            const index = reviews.value.findIndex((r) => r.id === updatedReview.id)
            if (index !== -1) {
                reviews.value[index] = updatedReview
            }
            userReview.value = updatedReview

            // Update permissions - can't edit again
            if (userPermissions.value) {
                userPermissions.value.canEdit = false
            }

            success(t('reviews.reviewUpdated'))
            return true
        } catch (err) {
            error(t('reviews.updateError'))
            console.error('Error updating review:', err)
            return false
        } finally {
            loading.value.updating = false
        }
    }

    const deleteReview = async () => {
        if (!userReview.value) return false

        loading.value.deleting = true

        try {
            await reviewService.deleteReview(userReview.value.id)

            // Remove from reviews list
            reviews.value = reviews.value.filter((r) => r.id !== userReview.value?.id)
            userReview.value = null

            // Update permissions
            if (userPermissions.value) {
                userPermissions.value.hasReviewed = false
                userPermissions.value.canReview = true
                userPermissions.value.canEdit = false
                userPermissions.value.reviewId = undefined
            }

            // Update stats
            if (reviewStats.value) {
                reviewStats.value.totalReviews = Math.max(0, reviewStats.value.totalReviews - 1)
            }

            success(t('reviews.reviewDeleted'))
            return true
        } catch (err) {
            error(t('reviews.deleteError'))
            console.error('Error deleting review:', err)
            return false
        } finally {
            loading.value.deleting = false
        }
    }

    const markHelpful = async (reviewId: string) => {
        try {
            await reviewService.markReviewHelpful(reviewId)

            // Update helpful count in UI
            const review = reviews.value.find((r) => r.id === reviewId)
            if (review) {
                review.helpfulCount += 1
            }

            success(t('reviews.markedHelpful'))
        } catch (err) {
            error(t('reviews.helpfulError'))
            console.error('Error marking review as helpful:', err)
        }
    }

    // Initialize
    const initialize = async () => {
        await Promise.all([loadReviews(), loadUserPermissions()])
    }

    // Refresh data (useful when reviews are added from outside)
    const refresh = async () => {
        await initialize()
    }

    return {
        // State
        reviews,
        reviewStats,
        userPermissions,
        userReview,
        loading,
        reviewError,

        // Computed
        canUserReview,
        hasUserReviewed,
        canEditReview,
        totalReviews,
        averageRating,

        // Methods
        loadReviews,
        loadUserPermissions,
        createReview,
        updateReview,
        deleteReview,
        markHelpful,
        initialize,
        refresh,
    }
}
