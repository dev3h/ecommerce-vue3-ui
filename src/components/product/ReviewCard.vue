<template>
    <div class="border border-border rounded-lg p-4 space-y-4">
        <!-- Reviewer Info -->
        <div class="flex items-start gap-3">
            <div
                class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"
            >
                <img
                    v-if="review.userAvatar"
                    :src="review.userAvatar"
                    :alt="review.userName"
                    class="w-full h-full rounded-full object-cover"
                />
                <User v-else class="w-5 h-5 text-primary" />
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-medium text-foreground">{{ review.userName }}</h4>
                    <span
                        v-if="review.verified"
                        class="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
                    >
                        <CheckCircle class="w-3 h-3" />
                        {{ t('productDetail.verifiedPurchase') }}
                    </span>
                </div>
                <div class="flex items-center gap-2 mb-2">
                    <div class="flex text-yellow-400">
                        <Star
                            v-for="i in 5"
                            :key="i"
                            :class="i <= review.rating ? 'fill-current' : ''"
                            class="w-4 h-4"
                        />
                    </div>
                    <span class="text-sm text-muted-foreground">{{
                        formatDate(review.createdAt)
                    }}</span>
                </div>
                <h5 v-if="review.title" class="font-medium text-foreground mb-2">
                    {{ review.title }}
                </h5>
                <p class="text-muted-foreground leading-relaxed">{{ review.comment }}</p>

                <!-- Review Images -->
                <div v-if="review.images?.length" class="flex gap-2 mt-3">
                    <img
                        v-for="(image, index) in review.images"
                        :key="index"
                        :src="image"
                        :alt="`Review ${index + 1}`"
                        class="w-16 h-16 rounded-lg object-cover border border-border"
                    />
                </div>

                <!-- Helpful Actions -->
                <div class="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                    <span class="text-sm text-muted-foreground">{{
                        t('productDetail.wasThisHelpful')
                    }}</span>
                    <div class="flex items-center gap-2">
                        <button
                            class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ThumbsUp class="w-4 h-4" />
                            {{ t('common.yes') }} ({{ review.helpful }})
                        </button>
                        <button
                            class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ThumbsDown class="w-4 h-4" />
                            {{ t('common.no') }} ({{ review.notHelpful }})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppI18n } from '@/composables/useI18n'
import type { ProductReview } from '@/types/product-detail'

// Icons
import { Star, User, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-vue-next'

interface Props {
    review: ProductReview
}

defineProps<Props>()

const { t } = useAppI18n()

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
        Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        'day',
    )
}
</script>
