<template>
    <div class="space-y-6">
        <!-- Reviews Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold">
                    {{ t('reviews.basedOnReviews').replace('{count}', totalReviews.toString()) }}
                </h2>
                <div v-if="averageRating > 0" class="flex items-center gap-2 mt-2">
                    <div class="flex text-yellow-400">
                        <Star
                            v-for="i in 5"
                            :key="i"
                            :class="i <= Math.floor(averageRating) ? 'fill-current' : ''"
                            class="w-5 h-5"
                        />
                    </div>
                    <span class="font-medium">{{ averageRating.toFixed(1) }}</span>
                    <span class="text-muted-foreground">{{ t('reviews.outOf5') }}</span>
                </div>
            </div>
        </div>

        <!-- User Review Status -->
        <div v-if="!canUserReview && authStore.isAuthenticated && userReview" class="p-4 bg-muted rounded-lg">
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <CheckCircle class="w-5 h-5 text-green-500" />
                    <span class="font-medium">{{ t('reviews.yourReview') }}</span>
                </div>
                <ReviewCard :review="userReview" :can-edit="false" :can-mark-helpful="false" />
            </div>
        </div>

        <!-- Reviews List -->
        <div class="space-y-6">
            <div v-if="loading.reviews" class="flex justify-center py-8">
                <div
                    class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
                ></div>
            </div>

            <div v-else-if="reviews.length === 0" class="text-center py-12">
                <MessageSquare class="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 class="text-lg font-medium text-muted-foreground">
                    {{ t('reviews.noReviews') }}
                </h3>
                <p class="text-muted-foreground mt-1">{{ t('reviews.beFirstToReview') }}</p>
            </div>

            <div v-else class="space-y-4">
                <ReviewCard
                    v-for="review in reviews"
                    :key="review.id"
                    :review="review"
                    :can-mark-helpful="authStore.isAuthenticated"
                    :show-actions="false"
                    @mark-helpful="handleMarkHelpful"
                />
            </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreReviews" class="text-center">
            <Button variant="outline" @click="loadMoreReviews" :disabled="loading.reviews">
                {{ t('common.loadMore') }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReviews } from '@/composables/useReviews'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import ReviewCard from './ReviewCard.vue'
import { Star, CheckCircle, MessageSquare } from 'lucide-vue-next'
import { reviewEventBus, REVIEW_EVENTS } from '@/lib/reviewEventBus'

interface Props {
    productId: string
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const { t } = useAppI18n()

const {
    reviews,
    userReview,
    loading,
    canUserReview,
    hasUserReviewed,
    canEditReview,
    totalReviews,
    averageRating,
    markHelpful,
    initialize,
    refresh,
} = useReviews(props.productId)

// Local state
const hasMoreReviews = ref(false) // Would be from API pagination

// Expose refresh method for parent components
defineExpose({
    refresh,
})

// Methods
const handleMarkHelpful = async (reviewId: string) => {
    await markHelpful(reviewId)
}

const loadMoreReviews = async () => {
    // Implement pagination if needed
    console.log('Load more reviews')
}

// Initialize
onMounted(() => {
    initialize()

    // Listen for review events to refresh when reviews are added from order page
    const handleReviewEvent = (data: { productId: string; review: any }) => {
        if (data.productId === props.productId) {
            refresh()
        }
    }

    reviewEventBus.on(REVIEW_EVENTS.REVIEW_CREATED, handleReviewEvent)
    reviewEventBus.on(REVIEW_EVENTS.REVIEW_UPDATED, handleReviewEvent)
})

onUnmounted(() => {
    // Clean up event listeners
    reviewEventBus.off(REVIEW_EVENTS.REVIEW_CREATED, () => {})
    reviewEventBus.off(REVIEW_EVENTS.REVIEW_UPDATED, () => {})
})
</script>
