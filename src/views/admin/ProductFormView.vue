<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" @click="goBack">
                        <ArrowLeft class="h-4 w-4 mr-2" />
                        {{ t('common.back') }}
                    </Button>
                </div>
                <h1 class="text-2xl font-bold tracking-tight">
                    {{
                        productId
                            ? t('admin.productsManagement.form.editTitle')
                            : t('admin.productsManagement.form.addTitle')
                    }}
                </h1>
                <p class="text-gray-600 dark:text-gray-300">
                    {{
                        productId
                            ? t('admin.productsManagement.form.editDescription')
                            : t('admin.productsManagement.form.addDescription')
                    }}
                </p>
            </div>
        </div>

        <!-- Form -->
        <Card class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Basic Information -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold">
                            {{ t('admin.productsManagement.form.basicInfo') }}
                        </h3>

                        <!-- Product Name -->
                        <div class="space-y-2">
                            <Label for="product-name" class="flex items-center">
                                {{ t('admin.productsManagement.form.name') }}
                                <span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="product-name"
                                v-model="form.name"
                                :placeholder="t('admin.productsManagement.form.namePlaceholder')"
                                :class="validationErrors.name ? 'border-red-500' : ''"
                                required
                            />
                            <p v-if="validationErrors.name" class="text-sm text-red-500">
                                {{ validationErrors.name }}
                            </p>
                        </div>

                        <!-- SKU -->
                        <div class="space-y-2">
                            <Label for="product-sku" class="flex items-center">
                                {{ t('admin.productsManagement.form.sku') }}
                                <span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="product-sku"
                                v-model="form.sku"
                                :placeholder="t('admin.productsManagement.form.skuPlaceholder')"
                                :class="validationErrors.sku ? 'border-red-500' : ''"
                                required
                            />
                            <p v-if="validationErrors.sku" class="text-sm text-red-500">
                                {{ validationErrors.sku }}
                            </p>
                        </div>

                        <!-- Short Description -->
                        <div class="space-y-2">
                            <Label for="product-short-desc" class="flex items-center">
                                {{ t('admin.productsManagement.form.shortDescription') }}
                                <span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="product-short-desc"
                                v-model="form.short_description"
                                :placeholder="
                                    t('admin.productsManagement.form.shortDescriptionPlaceholder')
                                "
                                :class="validationErrors.short_description ? 'border-red-500' : ''"
                                required
                            />
                            <p
                                v-if="validationErrors.short_description"
                                class="text-sm text-red-500"
                            >
                                {{ validationErrors.short_description }}
                            </p>
                        </div>

                        <!-- Category & Brand -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <Label for="product-category" class="flex items-center">
                                    {{ t('admin.productsManagement.form.category') }}
                                    <span class="text-red-500 ml-1">*</span>
                                </Label>
                                <Select v-model="form.category_id">
                                    <SelectTrigger
                                        class="w-full"
                                        :class="
                                            validationErrors.category_id ? 'border-red-500' : ''
                                        "
                                    >
                                        <SelectValue
                                            :placeholder="
                                                loadingCategories
                                                    ? t('common.loading')
                                                    : t(
                                                          'admin.productsManagement.form.selectCategory',
                                                      )
                                            "
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            v-if="
                                                !loadingCategories &&
                                                availableCategories.length === 0
                                            "
                                            value="empty"
                                            disabled
                                        >
                                            {{ t('admin.productsManagement.form.noCategories') }}
                                        </SelectItem>
                                        <SelectItem
                                            v-for="category in availableCategories"
                                            :key="category.id"
                                            :value="category.id"
                                        >
                                            {{ category.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p v-if="validationErrors.category_id" class="text-sm text-red-500">
                                    {{ validationErrors.category_id }}
                                </p>
                            </div>

                            <div class="space-y-2">
                                <Label for="product-brand">{{
                                    t('admin.productsManagement.form.brand')
                                }}</Label>
                                <Select v-model="form.brand_id">
                                    <SelectTrigger class="w-full">
                                        <SelectValue
                                            :placeholder="
                                                loadingBrands
                                                    ? t('common.loading')
                                                    : t('admin.productsManagement.form.selectBrand')
                                            "
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            v-if="!loadingBrands && availableBrands.length === 0"
                                            value="empty"
                                            disabled
                                        >
                                            {{ t('admin.productsManagement.form.noBrands') }}
                                        </SelectItem>
                                        <SelectItem
                                            v-for="brand in availableBrands"
                                            :key="brand.id"
                                            :value="brand.id"
                                        >
                                            {{ brand.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <!-- Pricing & Inventory -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold">
                            {{ t('admin.productsManagement.form.pricingInventory') }}
                        </h3>

                        <!-- Price -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <Label for="product-price" class="flex items-center">
                                    {{ t('admin.productsManagement.form.price') }}
                                    <span class="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                    id="product-price"
                                    v-model.number="form.price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    :placeholder="
                                        t('admin.productsManagement.form.pricePlaceholder')
                                    "
                                    :class="validationErrors.price ? 'border-red-500' : ''"
                                    required
                                />
                                <p v-if="validationErrors.price" class="text-sm text-red-500">
                                    {{ validationErrors.price }}
                                </p>
                            </div>

                            <div class="space-y-2">
                                <Label for="product-sale-price">{{
                                    t('admin.productsManagement.form.salePrice')
                                }}</Label>
                                <Input
                                    id="product-sale-price"
                                    v-model.number="form.sale_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    :placeholder="
                                        t('admin.productsManagement.form.salePricePlaceholder')
                                    "
                                    :class="validationErrors.sale_price ? 'border-red-500' : ''"
                                />
                                <p v-if="validationErrors.sale_price" class="text-sm text-red-500">
                                    {{ validationErrors.sale_price }}
                                </p>
                            </div>
                        </div>

                        <!-- Stock -->
                        <div class="space-y-2">
                            <Label for="product-stock" class="flex items-center">
                                {{ t('admin.productsManagement.form.stockQuantity') }}
                                <span class="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                id="product-stock"
                                v-model.number="form.stock_quantity"
                                type="number"
                                min="0"
                                :placeholder="t('admin.productsManagement.form.stockPlaceholder')"
                                :class="validationErrors.stock_quantity ? 'border-red-500' : ''"
                                required
                            />
                            <p v-if="validationErrors.stock_quantity" class="text-sm text-red-500">
                                {{ validationErrors.stock_quantity }}
                            </p>
                        </div>

                        <!-- Status & Featured -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <Label for="product-status" class="flex items-center">
                                    {{ t('admin.productsManagement.form.status') }}
                                    <span class="text-red-500 ml-1">*</span>
                                </Label>
                                <Select v-model="form.status">
                                    <SelectTrigger
                                        class="w-full"
                                        :class="validationErrors.status ? 'border-red-500' : ''"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">{{
                                            t('admin.productsManagement.status.draft')
                                        }}</SelectItem>
                                        <SelectItem value="published">{{
                                            t('admin.productsManagement.status.published')
                                        }}</SelectItem>
                                        <SelectItem value="archived">{{
                                            t('admin.productsManagement.status.archived')
                                        }}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p v-if="validationErrors.status" class="text-sm text-red-500">
                                    {{ validationErrors.status }}
                                </p>
                            </div>

                            <div class="space-y-2">
                                <div class="flex items-center space-x-2 mt-6">
                                    <Checkbox
                                        id="product-featured"
                                        v-model:checked="form.featured"
                                    />
                                    <Label for="product-featured" class="cursor-pointer">{{
                                        t('admin.productsManagement.form.featured')
                                    }}</Label>
                                </div>
                            </div>
                        </div>

                        <!-- Tags -->
                        <div class="space-y-2">
                            <Label for="product-tags">{{
                                t('admin.productsManagement.form.tags')
                            }}</Label>
                            <Input
                                id="product-tags"
                                v-model="tagsInput"
                                :placeholder="t('admin.productsManagement.form.tagsPlaceholder')"
                                @keydown.enter.prevent="addTag"
                            />
                            <div v-if="form.tags.length" class="flex flex-wrap gap-1 mt-2">
                                <Badge
                                    v-for="(tag, index) in form.tags"
                                    :key="index"
                                    variant="secondary"
                                    class="cursor-pointer"
                                    @click="removeTag(index)"
                                >
                                    {{ tag }} ×
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div class="space-y-2">
                    <Label for="product-description" class="flex items-center">
                        {{ t('admin.productsManagement.form.description') }}
                        <span class="text-red-500 ml-1">*</span>
                    </Label>
                    <Textarea
                        id="product-description"
                        v-model="form.description"
                        :placeholder="t('admin.productsManagement.form.descriptionPlaceholder')"
                        :class="validationErrors.description ? 'border-red-500' : ''"
                        rows="4"
                        required
                    />
                    <p v-if="validationErrors.description" class="text-sm text-red-500">
                        {{ validationErrors.description }}
                    </p>
                </div>

                <!-- Product Variants -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">
                            {{ t('admin.productsManagement.form.variants') }}
                        </h3>
                        <Button type="button" variant="outline" size="sm" @click="addVariant">
                            <Plus class="h-4 w-4 mr-2" />
                            {{ t('admin.productsManagement.form.addVariant') }}
                        </Button>
                    </div>

                    <div
                        v-if="variants.length === 0"
                        class="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400"
                    >
                        <p>{{ t('admin.productsManagement.form.noVariants') }}</p>
                        <p class="text-sm mt-1">
                            {{ t('admin.productsManagement.form.noVariantsDescription') }}
                        </p>
                    </div>

                    <div v-else class="space-y-3">
                        <div
                            v-for="(variant, index) in variants"
                            :key="index"
                            class="border rounded-lg p-4 space-y-3"
                        >
                            <div class="flex items-center justify-between">
                                <h4 class="font-medium">
                                    {{ t('admin.productsManagement.form.variant') }} {{ index + 1 }}
                                </h4>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    @click="removeVariant(index)"
                                    class="text-red-500 hover:text-red-700"
                                >
                                    <X class="h-4 w-4" />
                                </Button>
                            </div>

                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div class="space-y-1">
                                    <Label :for="`variant-name-${index}`" class="text-xs">{{
                                        t('admin.productsManagement.form.variantName')
                                    }}</Label>
                                    <Input
                                        :id="`variant-name-${index}`"
                                        v-model="variant.name"
                                        :placeholder="
                                            t(
                                                'admin.productsManagement.form.variantNamePlaceholder',
                                            )
                                        "
                                        size="sm"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label :for="`variant-sku-${index}`" class="text-xs">{{
                                        t('admin.productsManagement.form.variantSku')
                                    }}</Label>
                                    <Input
                                        :id="`variant-sku-${index}`"
                                        v-model="variant.sku"
                                        :placeholder="
                                            t('admin.productsManagement.form.variantSkuPlaceholder')
                                        "
                                        size="sm"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label :for="`variant-price-${index}`" class="text-xs">{{
                                        t('admin.productsManagement.form.variantPrice')
                                    }}</Label>
                                    <Input
                                        :id="`variant-price-${index}`"
                                        v-model.number="variant.price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        :placeholder="
                                            t(
                                                'admin.productsManagement.form.variantPricePlaceholder',
                                            )
                                        "
                                        size="sm"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label :for="`variant-stock-${index}`" class="text-xs">{{
                                        t('admin.productsManagement.form.variantStock')
                                    }}</Label>
                                    <Input
                                        :id="`variant-stock-${index}`"
                                        v-model.number="variant.stock_quantity"
                                        type="number"
                                        min="0"
                                        :placeholder="
                                            t(
                                                'admin.productsManagement.form.variantStockPlaceholder',
                                            )
                                        "
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Images -->
                <div class="space-y-2">
                    <Label for="product-images" class="flex items-center">
                        {{ t('admin.productsManagement.form.images') }}
                        <span class="text-red-500 ml-1">*</span>
                    </Label>
                    <div
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors cursor-pointer"
                        :class="validationErrors.images ? 'border-red-500' : ''"
                        @click="triggerFileInput"
                        @dragover.prevent
                        @drop.prevent="onDrop"
                    >
                        <input
                            ref="fileInput"
                            id="product-images"
                            type="file"
                            @change="onFileChange"
                            accept="image/*"
                            multiple
                            class="hidden"
                        />

                        <div
                            v-if="form.images.length === 0"
                            class="text-center text-gray-500 dark:text-gray-400"
                        >
                            <ImagePlus class="h-12 w-12 mx-auto mb-2" />
                            <p>{{ t('admin.productsManagement.form.uploadImages') }}</p>
                            <p class="text-sm mt-1">
                                {{ t('admin.productsManagement.form.imagesDescription') }}
                            </p>
                        </div>

                        <div v-else class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            <div
                                v-for="(image, index) in form.images"
                                :key="index"
                                class="relative group"
                            >
                                <img
                                    :src="image"
                                    :alt="`Product ${index + 1}`"
                                    class="w-full h-24 object-cover rounded"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    class="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    @click.stop="removeImage(index)"
                                >
                                    <X class="h-3 w-3" />
                                </Button>
                            </div>
                            <div
                                class="border-2 border-dashed border-gray-300 rounded flex items-center justify-center h-24 cursor-pointer hover:border-gray-400"
                                @click.stop="triggerFileInput"
                            >
                                <Plus class="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <p v-if="validationErrors.images" class="text-sm text-red-500">
                        {{ validationErrors.images }}
                    </p>
                </div>

                <!-- Form Actions -->
                <div class="flex items-center justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="ghost" @click="goBack" :disabled="isSubmitting">
                        {{ t('common.cancel') }}
                    </Button>
                    <Button type="submit" :disabled="isSubmitting">
                        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
                        {{
                            productId
                                ? t('admin.productsManagement.form.update')
                                : t('admin.productsManagement.form.create')
                        }}
                    </Button>
                </div>
            </form>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import Badge from '@/components/ui/badge/Badge.vue'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { productService, type ProductFormData } from '@/services/product.service'
import { useCategories } from '@/composables/useCategories'
import { useBrands } from '@/composables/useBrands'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'
import { Loader2, ImagePlus, Plus, X, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { t } = useAppI18n()

const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement>()
const tagsInput = ref('')
const productId = computed(() => route.params.id as string | undefined)

// Load categories and brands
const { categories, loading: loadingCategories, loadCategories } = useCategories()
const { brands, loading: loadingBrands, loadBrands } = useBrands()

// Available options for selects
const availableCategories = computed(() => categories.value)
const availableBrands = computed(() => brands.value)

// Validation errors
const validationErrors = ref<Record<string, string>>({})

// Product variants
interface ProductVariantForm {
    name: string
    sku: string
    price: number
    sale_price?: number
    stock_quantity: number
    attributes: Record<string, string>
}

const variants = ref<ProductVariantForm[]>([])

const form = reactive<ProductFormData>({
    name: '',
    description: '',
    short_description: '',
    sku: '',
    price: 0,
    sale_price: undefined,
    currency: 'USD',
    status: 'draft',
    featured: false,
    stock_quantity: 0,
    manage_stock: true,
    category_id: '',
    brand_id: '',
    tags: [],
    images: [],
    attributes: {},
})

// Navigation
const goBack = () => {
    router.push('/admin/products')
}

// Load product data if editing
const loadProduct = async () => {
    if (!productId.value) return

    try {
        const product = await productService.getProduct(productId.value)
        if (product) {
            Object.assign(form, {
                name: product.name,
                description: product.description,
                short_description: product.short_description || '',
                sku: product.sku,
                price: product.price,
                sale_price: product.sale_price,
                currency: product.currency,
                status: product.status,
                featured: product.featured,
                stock_quantity: product.stock_quantity,
                manage_stock: product.manage_stock,
                category_id: product.category_id,
                brand_id: product.brand_id,
                tags: [...product.tags],
                images: [...product.images],
                attributes: { ...product.attributes },
            })

            // Load variants if they exist
            if (product.variants && Array.isArray(product.variants)) {
                variants.value = product.variants.map((v) => ({
                    name: v.name || '',
                    sku: v.sku || '',
                    price: v.price || form.price,
                    sale_price: v.sale_price,
                    stock_quantity: v.stock_quantity || 0,
                    attributes: { ...v.attributes },
                }))
            }
        }
    } catch (err) {
        console.error('Failed to load product:', err)
        toast.error(t('admin.productsManagement.messages.loadError'))
        goBack()
    }
}

// Load data on component mount
onMounted(() => {
    loadCategories()
    loadBrands()
    loadProduct()
})

// Variant management
const addVariant = () => {
    variants.value.push({
        name: '',
        sku: '',
        price: form.price,
        sale_price: form.sale_price,
        stock_quantity: 0,
        attributes: {},
    })
}

const removeVariant = (index: number) => {
    variants.value.splice(index, 1)
}

// File upload
const triggerFileInput = () => {
    fileInput.value?.click()
}

// File upload helpers
const handleUploadError = (err: unknown) => {
    console.error('Upload error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Upload failed'
    if (errorMessage.includes('Storage quota exceeded')) {
        toast.error(t('admin.productsManagement.messages.storageQuotaExceeded'))
    } else if (errorMessage.includes('too large')) {
        toast.error(t('admin.productsManagement.messages.uploadFileTooLarge'))
    } else if (errorMessage.includes('Failed to read file')) {
        toast.error(t('admin.productsManagement.messages.uploadFileReadError'))
    } else {
        toast.error(t('admin.productsManagement.messages.uploadError'))
    }
}

const onFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (files && files.length > 0) {
        try {
            const uploadedImages = await productService.uploadImages(Array.from(files))
            form.images.push(...uploadedImages)
        } catch (err) {
            handleUploadError(err)
        }
    }
}

const onDrop = async (event: DragEvent) => {
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
        const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))
        if (imageFiles.length > 0) {
            try {
                const uploadedImages = await productService.uploadImages(imageFiles)
                form.images.push(...uploadedImages)
            } catch (err) {
                handleUploadError(err)
            }
        }
    }
}

const removeImage = (index: number) => {
    form.images.splice(index, 1)
}

// Tags management
const addTag = () => {
    if (tagsInput.value.trim() && !form.tags.includes(tagsInput.value.trim())) {
        form.tags.push(tagsInput.value.trim())
        tagsInput.value = ''
    }
}

const removeTag = (index: number) => {
    form.tags.splice(index, 1)
}

// Validation
const validateForm = (): boolean => {
    validationErrors.value = {}

    // Required field validation
    if (!form.name.trim()) {
        validationErrors.value.name = t('admin.productsManagement.validation.nameRequired')
    }

    if (!form.sku.trim()) {
        validationErrors.value.sku = t('admin.productsManagement.validation.skuRequired')
    }

    if (!form.short_description?.trim()) {
        validationErrors.value.short_description = t(
            'admin.productsManagement.validation.shortDescriptionRequired',
        )
    }

    if (!form.description.trim()) {
        validationErrors.value.description = t(
            'admin.productsManagement.validation.descriptionRequired',
        )
    }

    if (!form.category_id) {
        validationErrors.value.category_id = t(
            'admin.productsManagement.validation.categoryRequired',
        )
    }

    if (!form.status) {
        validationErrors.value.status = t('admin.productsManagement.validation.statusRequired')
    }

    if (form.images.length === 0) {
        validationErrors.value.images = t('admin.productsManagement.validation.imagesRequired')
    }

    if (form.price <= 0) {
        validationErrors.value.price = t('admin.productsManagement.validation.priceRequired')
    }

    if (form.sale_price !== undefined && form.sale_price >= form.price) {
        validationErrors.value.sale_price = t(
            'admin.productsManagement.validation.salePriceInvalid',
        )
    }

    if (form.stock_quantity < 0) {
        validationErrors.value.stock_quantity = t(
            'admin.productsManagement.validation.stockInvalid',
        )
    }

    // Check if there are any validation errors
    return Object.keys(validationErrors.value).length === 0
}

// Storage management helpers
const checkAndOptimizeStorage = async () => {
    const storageHealth = productService.checkStorageHealth()
    if (storageHealth.needsCleanup) {
        console.warn('Storage cleanup needed:', storageHealth)
        toast.warning(t('admin.productsManagement.messages.storageWarning'))

        // Automatically optimize storage if it's getting full
        if (storageHealth.percentage > 90) {
            await productService.optimizeStorage()
            toast.info(t('admin.productsManagement.messages.storageOptimized'))
        }
    }
}

const handleStorageError = async (errorMessage: string) => {
    toast.error(t('admin.productsManagement.messages.storageQuotaExceeded'))

    // Suggest storage optimization
    try {
        await productService.optimizeStorage()
        toast.info(t('admin.productsManagement.messages.storageOptimizedRetry'))
    } catch (optimizeError) {
        console.error('Failed to optimize storage:', optimizeError)
        toast.error(t('admin.productsManagement.messages.storageOptimizationFailed'))
    }
}

// Form submission
const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
        toast.error(t('admin.productsManagement.messages.validationError'))
        return
    }

    try {
        isSubmitting.value = true

        // Check storage health before saving
        await checkAndOptimizeStorage()

        // Prepare form data with variants
        const formDataWithVariants = {
            ...form,
            variants: variants.value.length > 0 ? variants.value : undefined,
        }

        if (!productId.value) {
            await productService.createProduct(formDataWithVariants)
            toast.success(t('admin.productsManagement.messages.createSuccess'))
        } else {
            await productService.updateProduct(productId.value, formDataWithVariants)
            toast.success(t('admin.productsManagement.messages.updateSuccess'))
        }

        goBack()
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'

        // Special handling for storage quota errors
        if (errorMessage.includes('quota') || errorMessage.includes('storage')) {
            await handleStorageError(errorMessage)
        } else {
            const errorKey = productId.value
                ? 'admin.productsManagement.messages.updateError'
                : 'admin.productsManagement.messages.createError'
            toast.error(t(errorKey), errorMessage)
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>
