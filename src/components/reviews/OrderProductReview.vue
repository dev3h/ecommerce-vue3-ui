<template>
    <Collapsible v-slot="{ open }" class="border-t pt-4 mt-4">
        <CollapsibleTrigger
            class="flex items-center justify-between w-full py-2 text-left hover:bg-accent/50 rounded px-2 transition-colors"
        >
            <div class="flex items-center gap-3">
                <h4 class="font-medium text-sm">{{ t('reviews.yourReview') }}</h4>
                <div
                    v-if="permissions?.hasReviewed"
                    class="text-xs text-muted-foreground bg-accent px-2 py-1 rounded"
                >
                    {{ t('reviews.reviewed') }}
                </div>
                <div
                    v-else-if="permissions?.canReview"
                    class="text-xs text-primary bg-primary/10 px-2 py-1 rounded"
                >
                    {{ t('reviews.canReview') }}
                </div>
            </div>
            <ChevronDown
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': open }"
            />
        </CollapsibleTrigger>

        <CollapsibleContent>
            <div class="px-2 pb-2">
                <!-- Loading State -->
                <div v-if="loading.permissions" class="flex justify-center py-4">
                    <div
                        class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
                    ></div>
                </div>

                <!-- Permission Check -->
                <div
                    v-else-if="!permissions?.canReview && !permissions?.hasReviewed"
                    class="text-center py-4"
                >
                    <p class="text-sm text-muted-foreground">
                        {{ t('reviews.cannotReview') }}
                    </p>
                </div>

                <!-- Existing Review Display -->
                <div
                    v-else-if="permissions?.hasReviewed && existingReview && !isEditing"
                    class="space-y-3"
                >
                    <div class="p-3 bg-accent/50 rounded-lg">
                        <!-- Rating -->
                        <div class="flex items-center gap-2 mb-2">
                            <div class="flex">
                                <Star
                                    v-for="i in 5"
                                    :key="i"
                                    class="w-4 h-4"
                                    :class="
                                        i <= existingReview.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                    "
                                />
                            </div>
                            <span class="text-sm font-medium">{{ existingReview.rating }}/5</span>
                        </div>

                        <!-- Title -->
                        <h5 class="font-medium text-sm mb-1">{{ existingReview.title }}</h5>

                        <!-- Comment -->
                        <p class="text-sm text-muted-foreground mb-2">
                            {{ existingReview.comment }}
                        </p>

                        <!-- Review Meta -->
                        <div
                            class="flex items-center justify-between text-xs text-muted-foreground"
                        >
                            <span>{{ formatDate(existingReview.createdAt) }}</span>
                            <span v-if="existingReview.hasBeenEdited" class="text-blue-600">
                                {{ t('reviews.edited') }}
                            </span>
                        </div>
                    </div>

                    <!-- Edit Button -->
                    <Button
                        v-if="permissions?.canEdit"
                        variant="outline"
                        size="sm"
                        @click="startEditing"
                        class="w-full"
                    >
                        <Edit class="w-4 h-4 mr-2" />
                        {{ t('reviews.editReview') }}
                    </Button>
                </div>

                <!-- Review Form -->
                <div v-else-if="permissions?.canReview || isEditing" class="space-y-4">
                    <ReviewForm
                        :product-id="productId"
                        :order-id="orderId"
                        :existing-review="isEditing ? existingReview : undefined"
                        @submit="handleReviewSubmitted"
                        @cancel="handleCancel"
                        class="border rounded-lg p-4"
                    />
                </div>
            </div>
        </CollapsibleContent>
    </Collapsible>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Star, Edit, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import ReviewForm from './ReviewForm.vue'
import { useOrderProductReview } from '@/composables/useOrderProductReview'
import { useAppI18n } from '@/composables/useI18n'

interface Props {
    productId: string
    orderId: string
    userId: string
}

const props = defineProps<Props>()
const { t } = useAppI18n()

const { permissions, existingReview, loading, loadPermissions, createReview, updateReview } =
    useOrderProductReview(props.productId, props.orderId)

const isEditing = ref(false)

const emit = defineEmits<{
    reviewUpdated: []
}>()

// Load review permissions and existing review
const loadReviewData = async () => {
    await loadPermissions()
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
}

const startEditing = () => {
    isEditing.value = true
}

const handleReviewSubmitted = async (reviewData: any) => {
    if (isEditing.value && existingReview.value) {
        // Update existing review
        const updatedReview = await updateReview(reviewData)
        if (updatedReview) {
            isEditing.value = false
            emit('reviewUpdated')
        }
    } else {
        // Create new review
        const newReview = await createReview(reviewData)
        if (newReview) {
            emit('reviewUpdated')
        }
    }
}

const handleCancel = () => {
    isEditing.value = false
}

onMounted(() => {
    loadReviewData()
})
</script>
