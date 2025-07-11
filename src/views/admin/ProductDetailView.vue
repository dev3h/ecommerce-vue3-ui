<template>
    <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
            <div class="text-center">
                <Loader2 class="h-8 w-8 animate-spin mx-auto mb-4" />
                <p class="text-gray-600 dark:text-gray-300">{{ t('common.loading') }}...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {{ t('admin.productsManagement.messages.loadError') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ error }}</p>
            <Button @click="loadProduct">
                <RefreshCw class="h-4 w-4 mr-2" />
                {{ t('common.retry') }}
            </Button>
        </div>

        <!-- Product Detail Content -->
        <div v-else-if="product" class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" @click="goBack">
                            <ArrowLeft class="h-4 w-4 mr-2" />
                            {{ t('common.back') }}
                        </Button>
                    </div>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-bold tracking-tight">{{ product.name }}</h1>
                        <Badge :variant="getStatusVariant(product.status)">
                            {{ t(`admin.productsManagement.status.${product.status}`) }}
                        </Badge>
                        <Badge v-if="product.featured" variant="secondary">
                            <Star class="h-3 w-3 mr-1" />
                            {{ t('admin.productsManagement.form.featured') }}
                        </Badge>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 mt-1">
                        {{ t('admin.productsManagement.detail.lastUpdated') }}:
                        {{ formatDate(product.updated_at) }}
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <Button variant="outline" @click="editProduct">
                        <Edit class="h-4 w-4 mr-2" />
                        {{ t('admin.productsManagement.actions.edit') }}
                    </Button>
                    <Button variant="destructive" @click="showDeleteDialog = true">
                        <Trash2 class="h-4 w-4 mr-2" />
                        {{ t('admin.productsManagement.actions.delete') }}
                    </Button>
                </div>
            </div>

            <!-- Product Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Basic Info Card -->
                <Card class="p-6">
                    <h3 class="text-lg font-semibold mb-4">
                        {{ t('admin.productsManagement.detail.basicInfo') }}
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.form.sku') }}
                            </span>
                            <p class="font-mono text-sm">{{ product.sku }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.form.category') }}
                            </span>
                            <p>{{ getCategoryName(product.category_id) }}</p>
                        </div>
                        <div v-if="product.brand_id">
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.form.brand') }}
                            </span>
                            <p>{{ getBrandName(product.brand_id) }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.detail.createdAt') }}
                            </span>
                            <p>{{ formatDate(product.created_at) }}</p>
                        </div>
                    </div>
                </Card>

                <!-- Pricing Card -->
                <Card class="p-6">
                    <h3 class="text-lg font-semibold mb-4">
                        {{ t('admin.productsManagement.form.pricingInventory') }}
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.form.price') }}
                            </span>
                            <p class="text-lg font-semibold">
                                {{ formatPrice(product.price, product.currency) }}
                            </p>
                        </div>
                        <div v-if="product.sale_price">
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.form.salePrice') }}
                            </span>
                            <p class="text-lg font-semibold text-green-600">
                                {{ formatPrice(product.sale_price, product.currency) }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.form.stockQuantity') }}
                            </span>
                            <div class="flex items-center gap-2">
                                <span class="font-semibold">{{ product.stock_quantity }}</span>
                                <Badge :variant="getStockVariant(product.stock_status)">
                                    {{
                                        t(
                                            `admin.productsManagement.stockStatus.${product.stock_status}`,
                                        )
                                    }}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Card>

                <!-- Statistics Card -->
                <Card class="p-6">
                    <h3 class="text-lg font-semibold mb-4">
                        {{ t('admin.productsManagement.detail.statistics') }}
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.detail.totalImages') }}
                            </span>
                            <p>{{ product.images.length }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.detail.totalVariants') }}
                            </span>
                            <p>{{ product.variants?.length || 0 }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.detail.totalTags') }}
                            </span>
                            <p>{{ product.tags.length }}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <!-- Detailed Information -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Product Images -->
                <Card class="p-6">
                    <h3 class="text-lg font-semibold mb-4">
                        {{ t('admin.productsManagement.form.images') }}
                    </h3>
                    <div
                        v-if="product.images.length === 0"
                        class="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                        <ImageIcon class="h-12 w-12 mx-auto mb-2" />
                        <p>{{ t('admin.productsManagement.detail.noImages') }}</p>
                    </div>
                    <div v-else class="grid grid-cols-3 md:grid-cols-4 gap-4">
                        <div
                            v-for="(image, index) in product.images"
                            :key="index"
                            class="relative group cursor-pointer"
                            @click="showImageModal(image, index)"
                        >
                            <div class="w-full h-24 bg-gray-100 rounded-lg border overflow-hidden">
                                <img
                                    :src="image"
                                    :alt="product.name"
                                    class="w-full h-full object-cover hover:shadow-md transition-shadow"
                                    @error="handleImageError($event, index)"
                                    loading="lazy"
                                    style="background-color: #f3f4f6; min-height: 96px"
                                />
                            </div>
                            <div
                                class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center"
                            >
                                <Eye
                                    class="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <!-- Product Description -->
                <Card class="p-6">
                    <h3 class="text-lg font-semibold mb-4">
                        {{ t('admin.productsManagement.form.description') }}
                    </h3>
                    <div class="space-y-4">
                        <div v-if="product.short_description">
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.form.shortDescription') }}
                            </span>
                            <p class="text-gray-800 dark:text-gray-200">{{ product.short_description }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {{ t('admin.productsManagement.form.description') }}
                            </span>
                            <div class="prose prose-sm max-w-none">
                                <p class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                    {{ product.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <!-- Tags -->
            <Card v-if="product.tags.length > 0" class="p-6">
                <h3 class="text-lg font-semibold mb-4">
                    {{ t('admin.productsManagement.form.tags') }}
                </h3>
                <div class="flex flex-wrap gap-2">
                    <Badge v-for="tag in product.tags" :key="tag" variant="outline">
                        {{ tag }}
                    </Badge>
                </div>
            </Card>

            <!-- Product Variants -->
            <Card v-if="product.variants && product.variants.length > 0" class="p-6">
                <h3 class="text-lg font-semibold mb-4">
                    {{ t('admin.productsManagement.form.variants') }}
                    <span class="text-sm font-normal text-gray-500">
                        ({{ product.variants.length }})
                    </span>
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b">
                                <th class="text-left py-2">
                                    {{ t('admin.productsManagement.form.variantName') }}
                                </th>
                                <th class="text-left py-2">
                                    {{ t('admin.productsManagement.form.variantSku') }}
                                </th>
                                <th class="text-left py-2">
                                    {{ t('admin.productsManagement.form.variantPrice') }}
                                </th>
                                <th class="text-left py-2">
                                    {{ t('admin.productsManagement.form.variantStock') }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="variant in product.variants"
                                :key="variant.id"
                                class="border-b"
                            >
                                <td class="py-2">{{ variant.name || '-' }}</td>
                                <td class="py-2">
                                    <code class="text-xs bg-gray-100 dark:text-black  px-1 rounded">{{
                                        variant.sku || '-'
                                    }}</code>
                                </td>
                                <td class="py-2">
                                    {{ formatPrice(variant.price, product.currency) }}
                                    <span v-if="variant.sale_price" class="text-green-600 ml-2">
                                        ({{ formatPrice(variant.sale_price, product.currency) }})
                                    </span>
                                </td>
                                <td class="py-2">{{ variant.stock_quantity }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            <!-- Attributes -->
            <Card v-if="Object.keys(product.attributes || {}).length > 0" class="p-6">
                <h3 class="text-lg font-semibold mb-4">
                    {{ t('admin.productsManagement.detail.attributes') }}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(value, key) in product.attributes" :key="key">
                        <span class="text-sm font-medium text-gray-500 capitalize">{{ key }}</span>
                        <p class="text-gray-800">{{ value }}</p>
                    </div>
                </div>
            </Card>
        </div>
    </div>

    <!-- Image Modal -->
    <Dialog v-model:open="imageModalOpen">
        <DialogContent class="max-w-4xl">
            <DialogHeader>
                <DialogTitle>
                    {{ t('admin.productsManagement.detail.imageGallery') }}
                    ({{ currentImageIndex + 1 }}/{{ product?.images.length }})
                </DialogTitle>
            </DialogHeader>
            <div class="relative">
                <img
                    v-if="currentImage"
                    :src="currentImage"
                    :alt="product?.name || 'Product'"
                    class="w-full h-auto max-h-[60vh] object-contain mx-auto"
                />
                <Button
                    v-if="(product?.images.length || 0) > 1"
                    variant="outline"
                    size="icon"
                    class="absolute left-2 top-1/2 transform -translate-y-1/2"
                    @click="previousImage"
                    :disabled="currentImageIndex === 0"
                >
                    <ChevronLeft class="h-4 w-4" />
                </Button>
                <Button
                    v-if="(product?.images.length || 0) > 1"
                    variant="outline"
                    size="icon"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2"
                    @click="nextImage"
                    :disabled="currentImageIndex === (product?.images.length || 0) - 1"
                >
                    <ChevronRight class="h-4 w-4" />
                </Button>
            </div>
            <div v-if="(product?.images.length || 0) > 1" class="flex justify-center mt-4">
                <div class="flex gap-2">
                    <button
                        v-for="(image, index) in product?.images"
                        :key="index"
                        @click="currentImageIndex = index"
                        class="w-12 h-12 border-2 rounded-lg overflow-hidden"
                        :class="currentImageIndex === index ? 'border-primary' : 'border-gray-300'"
                    >
                        <img
                            :src="image"
                            :alt="`Thumbnail ${index + 1}`"
                            class="w-full h-full object-cover"
                        />
                    </button>
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
        v-model:open="showDeleteDialog"
        :title="t('admin.productsManagement.messages.deleteConfirmTitle')"
        :message="t('admin.productsManagement.messages.deleteConfirmMessage')"
        :confirm-text="t('admin.productsManagement.messages.deleteConfirmYes')"
        :cancel-text="t('admin.productsManagement.messages.deleteConfirmNo')"
        @confirm="deleteProduct"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Badge from '@/components/ui/badge/Badge.vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import { productService, type Product } from '@/services/product.service'
import { useCategories } from '@/composables/useCategories'
import { useBrands } from '@/composables/useBrands'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'
import {
    ArrowLeft,
    Edit,
    Trash2,
    Star,
    Eye,
    ImageIcon,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    RefreshCw,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useAppI18n()

const productId = computed(() => route.params.id as string)
const product = ref<Product | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const showDeleteDialog = ref(false)

// Image modal
const imageModalOpen = ref(false)
const currentImageIndex = ref(0)
const currentImage = computed(() => product.value?.images[currentImageIndex.value] || '')

// Load categories and brands for display
const { categories, loadCategories } = useCategories()
const { brands, loadBrands } = useBrands()

// Navigation
const goBack = () => {
    router.push('/admin/products')
}

const editProduct = () => {
    router.push(`/admin/products/${productId.value}/edit`)
}

// Load product data
const loadProduct = async () => {
    if (!productId.value) return

    try {
        loading.value = true
        error.value = null
        const data = await productService.getProduct(productId.value)
        if (data) {
            product.value = data
        } else {
            error.value = t('admin.productsManagement.messages.productNotFound')
        }
    } catch (err) {
        console.error('Failed to load product:', err)
        error.value =
            err instanceof Error ? err.message : t('admin.productsManagement.messages.loadError')
    } finally {
        loading.value = false
    }
}

// Delete product
const deleteProduct = async () => {
    if (!productId.value) return

    try {
        await productService.deleteProduct(productId.value)
        toast.success(t('admin.productsManagement.messages.deleteSuccess'))
        goBack()
    } catch (err) {
        console.error('Failed to delete product:', err)
        toast.error(t('admin.productsManagement.messages.deleteError'))
    }
}

// Image modal controls
const showImageModal = (image: string, index: number) => {
    currentImageIndex.value = index
    imageModalOpen.value = true
}

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    }
}

const nextImage = () => {
    if (currentImageIndex.value < (product.value?.images.length || 0) - 1) {
        currentImageIndex.value++
    }
}

// Image error handling
const handleImageError = (event: Event, index: number) => {
    const img = event.target as HTMLImageElement
    console.error(`Failed to load image ${index + 1}:`, img.src.substring(0, 100))

    // Set a placeholder or fallback
    img.src =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA3MEgxNDBWMTMwSDYwVjcwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8Y2lyY2xlIGN4PSI4NSIgY3k9Ijg1IiByPSI1IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik02MCA5MEwxMDAgMTEwTDE0MCA3MEgxNDBWMTMwSDYwVjkwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K'
}

// Helper functions
const getCategoryName = (categoryId: string): string => {
    const category = categories.value.find((c) => c.id === categoryId)
    return category?.name || t('admin.productsManagement.detail.unknownCategory')
}

const getBrandName = (brandId: string): string => {
    const brand = brands.value.find((b) => b.id === brandId)
    return brand?.name || t('admin.productsManagement.detail.unknownBrand')
}

const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(price)
}

const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString))
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'published':
            return 'default'
        case 'draft':
            return 'secondary'
        case 'archived':
            return 'destructive'
        default:
            return 'outline'
    }
}

const getStockVariant = (stockStatus: string) => {
    switch (stockStatus) {
        case 'in_stock':
            return 'default'
        case 'low_stock':
            return 'secondary'
        case 'out_of_stock':
            return 'destructive'
        default:
            return 'outline'
    }
}

// Load data on component mount
onMounted(() => {
    loadCategories()
    loadBrands()
    loadProduct()
})
</script>
