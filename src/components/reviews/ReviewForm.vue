<template>
    <div class="bg-card rounded-lg border p-6 space-y-6">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
                {{ isEditing ? t('reviews.editReview') : t('reviews.writeReview') }}
            </h3>
            <Button
                v-if="isEditing && hasBeenEdited"
                variant="ghost"
                size="sm"
                class="text-muted-foreground"
                disabled
            >
                {{ t('reviews.hasBeenEdited') }}
            </Button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Rating -->
            <div class="space-y-2">
                <fieldset>
                    <legend class="text-sm font-medium">{{ t('reviews.rating') }} *</legend>
                    <div class="flex items-center gap-1">
                        <button
                            v-for="i in 5"
                            :key="i"
                            type="button"
                            @click="setRating(i)"
                            class="p-1 hover:scale-110 transition-transform"
                            :class="i <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
                            :aria-label="`${i} ${t('reviews.stars')}`"
                        >
                            <Star :class="i <= form.rating ? 'fill-current' : ''" class="w-6 h-6" />
                        </button>
                        <span class="ml-2 text-sm text-muted-foreground">
                            {{ form.rating }} {{ t('reviews.outOf5') }}
                        </span>
                    </div>
                </fieldset>
            </div>

            <!-- Title -->
            <div class="space-y-2">
                <label for="title" class="text-sm font-medium">
                    {{ t('reviews.reviewTitle') }} *
                </label>
                <Input
                    id="title"
                    v-model="form.title"
                    :placeholder="t('reviews.reviewTitle')"
                    required
                    maxlength="100"
                />
            </div>

            <!-- Comment -->
            <div class="space-y-2">
                <label for="comment" class="text-sm font-medium">
                    {{ t('reviews.reviewComment') }} *
                </label>
                <Textarea
                    id="comment"
                    v-model="form.comment"
                    :placeholder="t('reviews.reviewComment')"
                    rows="4"
                    required
                    maxlength="1000"
                />
                <div class="text-xs text-muted-foreground text-right">
                    {{ form.comment.length }}/1000
                </div>
            </div>

            <!-- Images (Optional) -->
            <div class="space-y-2">
                <label for="image-upload" class="text-sm font-medium">{{
                    t('reviews.addPhotos')
                }}</label>
                <div class="flex items-center gap-4">
                    <input
                        id="image-upload"
                        ref="fileInput"
                        type="file"
                        multiple
                        accept="image/*"
                        @change="handleFileUpload"
                        class="hidden"
                    />
                    <Button type="button" variant="outline" @click="fileInput?.click()">
                        <Camera class="w-4 h-4 mr-2" />
                        {{ t('reviews.addPhotos') }}
                    </Button>
                    <span class="text-xs text-muted-foreground">
                        ({{ t('common.optional') }})
                    </span>
                </div>

                <!-- Image Previews -->
                <div v-if="form.images.length > 0" class="flex gap-2 flex-wrap">
                    <div v-for="(image, index) in form.images" :key="index" class="relative group">
                        <img
                            :src="image"
                            :alt="`Preview ${index + 1}`"
                            class="w-20 h-20 object-cover rounded border"
                        />
                        <button
                            type="button"
                            @click="removeImage(index)"
                            class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X class="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 pt-4">
                <Button type="submit" :disabled="!isFormValid || loading" class="min-w-[120px]">
                    <span v-if="loading" class="flex items-center gap-2">
                        <div
                            class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                        ></div>
                        {{ t('common.loading') }}
                    </span>
                    <span v-else>
                        {{ isEditing ? t('reviews.updateReview') : t('reviews.submitReview') }}
                    </span>
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    @click="$emit('cancel')"
                    :disabled="loading"
                >
                    {{ t('reviews.cancelReview') }}
                </Button>

                <Button
                    v-if="isEditing && canDelete"
                    type="button"
                    variant="destructive"
                    @click="handleDelete"
                    :disabled="loading"
                    class="ml-auto"
                >
                    {{ t('reviews.deleteReview') }}
                </Button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Star, Camera, X } from 'lucide-vue-next'
import type { ProductReview, CreateReviewRequest, UpdateReviewRequest } from '@/types/reviews'

interface Props {
    loading?: boolean
    isEditing?: boolean
    existingReview?: ProductReview | null
    canDelete?: boolean
}

interface FormData {
    rating: number
    title: string
    comment: string
    images: string[]
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    isEditing: false,
    existingReview: null,
    canDelete: false,
})

const emit = defineEmits<{
    submit: [data: CreateReviewRequest | UpdateReviewRequest]
    cancel: []
    delete: []
}>()

const { t } = useAppI18n()

// Form state
const form = ref<FormData>({
    rating: 5,
    title: '',
    comment: '',
    images: [],
})

const fileInput = ref<HTMLInputElement>()

// Computed
const isFormValid = computed(
    () =>
        form.value.rating > 0 &&
        form.value.title.trim().length > 0 &&
        form.value.comment.trim().length > 0,
)

const hasBeenEdited = computed(() => props.existingReview?.hasBeenEdited ?? false)

// Methods
const setRating = (rating: number) => {
    form.value.rating = rating
}

const removeImage = (index: number) => {
    form.value.images.splice(index, 1)
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files

    if (!files) return

    // Convert files to URLs (in real app, upload to server)
    Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result && form.value.images.length < 5) {
                form.value.images.push(e.target.result as string)
            }
        }
        reader.readAsDataURL(file)
    })

    // Clear input
    target.value = ''
}

const handleSubmit = () => {
    if (!isFormValid.value) return

    const reviewData = {
        rating: form.value.rating,
        title: form.value.title.trim(),
        comment: form.value.comment.trim(),
        images: form.value.images,
    }

    emit('submit', reviewData)
}

const handleDelete = () => {
    if (confirm(t('reviews.confirmDelete'))) {
        emit('delete')
    }
}

// Initialize form with existing review data
watch(
    () => props.existingReview,
    (review) => {
        if (review) {
            form.value = {
                rating: review.rating,
                title: review.title,
                comment: review.comment,
                images: review.images ?? [],
            }
        }
    },
    { immediate: true },
)
</script>
