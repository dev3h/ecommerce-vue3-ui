<template>
    <div class="bg-card rounded-lg border p-6 space-y-4">
        <!-- Header -->
        <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
                <img
                    :src="review.userAvatar || '/default-avatar.png'"
                    :alt="review.userName"
                    class="w-10 h-10 rounded-full"
                />
                <div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-medium">{{ review.userName }}</h4>
                        <span
                            v-if="review.isVerifiedPurchase"
                            class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full"
                        >
                            {{ t('reviews.verifiedPurchase') }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <div class="flex text-yellow-400">
                            <Star
                                v-for="i in 5"
                                :key="i"
                                :class="i <= review.rating ? 'fill-current' : ''"
                                class="w-4 h-4"
                            />
                        </div>
                        <span class="text-sm text-muted-foreground">
                            {{ formatDate(review.createdAt) }}
                        </span>
                        <span v-if="review.hasBeenEdited" class="text-xs text-muted-foreground">
                            ({{ t('reviews.hasBeenEdited') }})
                        </span>
                    </div>
                </div>
            </div>

            <!-- Actions for current user's review -->
            <div v-if="isCurrentUserReview && showActions" class="flex items-center gap-2">
                <Button v-if="canEdit" variant="ghost" size="sm" @click="$emit('edit', review)">
                    <Edit2 class="w-4 h-4 mr-2" />
                    {{ t('reviews.editReview') }}
                </Button>
            </div>
        </div>

        <!-- Review Content -->
        <div class="space-y-3">
            <h5 class="font-medium text-lg">{{ review.title }}</h5>
            <p class="text-muted-foreground leading-relaxed">{{ review.comment }}</p>

            <!-- Review Images -->
            <div v-if="review.images?.length" class="flex gap-2 flex-wrap">
                <img
                    v-for="(image, index) in review.images"
                    :key="index"
                    :src="image"
                    :alt="`Review ${index + 1}`"
                    class="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    @click="openImageModal(image)"
                />
            </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-4 border-t">
            <div class="flex items-center gap-4">
                <span class="text-sm text-muted-foreground">
                    {{ t('reviews.wasHelpful') }}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    @click="$emit('mark-helpful', review.id)"
                    :disabled="!canMarkHelpful"
                    class="gap-2"
                >
                    <ThumbsUp class="w-4 h-4" />
                    {{ t('reviews.helpful') }} ({{ review.helpfulCount }})
                </Button>
            </div>
        </div>
    </div>

    <!-- Image Modal -->
    <Teleport to="body">
        <div
            v-if="selectedImage"
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            @click="closeImageModal"
        >
            <div class="relative max-w-4xl max-h-4xl">
                <img
                    :src="selectedImage"
                    alt="Review"
                    class="max-w-full max-h-full object-contain"
                />
                <button
                    @click="closeImageModal"
                    class="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                    <X class="w-4 h-4" />
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { Star, Edit2, ThumbsUp, X } from 'lucide-vue-next'
import type { ProductReview } from '@/types/reviews'

interface Props {
    review: ProductReview
    showActions?: boolean
    canEdit?: boolean
    canMarkHelpful?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    showActions: true,
    canEdit: false,
    canMarkHelpful: true,
})

const emit = defineEmits<{
    edit: [review: ProductReview]
    'mark-helpful': [reviewId: string]
}>()

const authStore = useAuthStore()
const { t } = useAppI18n()

const selectedImage = ref<string | null>(null)

// Computed
const isCurrentUserReview = computed(() => authStore.user?.id === props.review.userId)

// Methods
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
        return t('common.today')
    } else if (diffInDays === 1) {
        return t('common.yesterday')
    } else if (diffInDays < 30) {
        return `${diffInDays} ${t('common.daysAgo')}`
    } else {
        return date.toLocaleDateString()
    }
}

const openImageModal = (image: string) => {
    selectedImage.value = image
}

const closeImageModal = () => {
    selectedImage.value = null
}
</script>
