import { ref, computed } from 'vue'
import { reviewService } from '@/services/review.service'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'
import type {
    ProductReview,
    CreateReviewRequest,
    UpdateReviewRequest,
    OrderProductReviewPermissions,
} from '@/types/reviews'

export function useOrderProductReview(productId: string, orderId: string) {
    const authStore = useAuthStore()
    const { success, error } = useToast()
    const { t } = useAppI18n()

    // State
    const permissions = ref<OrderProductReviewPermissions | null>(null)
    const existingReview = ref<ProductReview | null>(null)

    const loading = ref({
        permissions: false,
        creating: false,
        updating: false,
    })

    const reviewError = ref<string | null>(null)

    // Computed
    const canUserReview = computed(() => permissions.value?.canReview && authStore.isAuthenticated)

    const hasUserReviewed = computed(() => permissions.value?.hasReviewed)

    const canEditReview = computed(() => permissions.value?.canEdit && existingReview.value)

    // Methods
    const loadPermissions = async () => {
        if (!authStore.user) return

        loading.value.permissions = true
        reviewError.value = null

        try {
            permissions.value = await reviewService.checkOrderProductReviewPermissions(
                productId,
                orderId,
                authStore.user.id,
            )

            // If user has reviewed, load the existing review
            if (permissions.value.hasReviewed && permissions.value.reviewId) {
                const productReviews = await reviewService.getProductReviews(productId, 1, 1000)
                existingReview.value =
                    productReviews.reviews.find(
                        (review) => review.id === permissions.value?.reviewId,
                    ) || null
            }
        } catch (err) {
            reviewError.value = t('reviews.error.loadPermissions')
            console.error('Failed to load review permissions:', err)
        } finally {
            loading.value.permissions = false
        }
    }

    const createReview = async (reviewData: Omit<CreateReviewRequest, 'productId' | 'orderId'>) => {
        if (!authStore.user || !canUserReview.value) {
            error(t('reviews.error.unauthorized'))
            return null
        }

        loading.value.creating = true
        reviewError.value = null

        try {
            const newReview = await reviewService.createReview({
                ...reviewData,
                productId,
                orderId,
            })

            existingReview.value = newReview
            permissions.value = {
                ...permissions.value!,
                canReview: false,
                hasReviewed: true,
                canEdit: true,
                reviewId: newReview.id,
            }

            success(t('reviews.success.created'))
            return newReview
        } catch (err) {
            reviewError.value = t('reviews.error.create')
            error(t('reviews.error.create'))
            console.error('Failed to create review:', err)
            return null
        } finally {
            loading.value.creating = false
        }
    }

    const updateReview = async (reviewData: UpdateReviewRequest) => {
        if (!existingReview.value || !canEditReview.value) {
            error(t('reviews.error.unauthorized'))
            return null
        }

        loading.value.updating = true
        reviewError.value = null

        try {
            const updatedReview = await reviewService.updateReview(
                existingReview.value.id,
                productId,
                reviewData,
            )

            existingReview.value = updatedReview
            permissions.value = {
                ...permissions.value!,
                canEdit: false, // Can't edit again after update
            }

            success(t('reviews.success.updated'))
            return updatedReview
        } catch (err) {
            reviewError.value = t('reviews.error.update')
            error(t('reviews.error.update'))
            console.error('Failed to update review:', err)
            return null
        } finally {
            loading.value.updating = false
        }
    }

    return {
        // State
        permissions,
        existingReview,
        loading,
        reviewError,

        // Computed
        canUserReview,
        hasUserReviewed,
        canEditReview,

        // Methods
        loadPermissions,
        createReview,
        updateReview,
    }
}
