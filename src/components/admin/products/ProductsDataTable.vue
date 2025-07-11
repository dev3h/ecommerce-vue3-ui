<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">
                    {{ t('admin.productsManagement.title') }}
                </h2>
                <p class="text-muted-foreground">{{ t('admin.productsManagement.subtitle') }}</p>
            </div>
            <div class="flex items-center gap-2">
                <Button @click="navigateToCreateProduct">
                    <Plus class="mr-2 h-4 w-4" />
                    {{ t('admin.productsManagement.addProduct') }}
                </Button>
            </div>
        </div>

        <!-- Filters -->
        <Card class="p-4">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex gap-2">
                        <Select v-model="statusFilter" @update:model-value="applyFilters">
                            <SelectTrigger class="w-[150px]">
                                <SelectValue
                                    :placeholder="t('admin.productsManagement.filters.allStatus')"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{{
                                    t('admin.productsManagement.filters.allStatus')
                                }}</SelectItem>
                                <SelectItem value="published">{{
                                    t('admin.productsManagement.status.published')
                                }}</SelectItem>
                                <SelectItem value="draft">{{
                                    t('admin.productsManagement.status.draft')
                                }}</SelectItem>
                                <SelectItem value="archived">{{
                                    t('admin.productsManagement.status.archived')
                                }}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select v-model="categoryFilter" @update:model-value="applyFilters">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue
                                    :placeholder="
                                        loadingCategories
                                            ? t('common.loading') + '...'
                                            : t('admin.productsManagement.filters.allCategories')
                                    "
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{{
                                    t('admin.productsManagement.filters.allCategories')
                                }}</SelectItem>
                                <SelectItem v-if="loadingCategories" value="loading" disabled>
                                    {{ t('common.loading') }}...
                                </SelectItem>
                                <SelectItem
                                    v-else-if="availableCategories.length === 0"
                                    value="empty"
                                    disabled
                                >
                                    {{ t('admin.productsManagement.form.noCategories') }}
                                </SelectItem>
                                <SelectItem
                                    v-else
                                    v-for="category in availableCategories"
                                    :key="category.id"
                                    :value="category.id"
                                >
                                    {{ category.name }}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select v-model="brandFilter" @update:model-value="applyFilters">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue
                                    :placeholder="
                                        loadingBrands
                                            ? t('common.loading') + '...'
                                            : t('admin.productsManagement.filters.allBrands')
                                    "
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{{
                                    t('admin.productsManagement.filters.allBrands')
                                }}</SelectItem>
                                <SelectItem v-if="loadingBrands" value="loading" disabled>
                                    {{ t('common.loading') }}...
                                </SelectItem>
                                <SelectItem
                                    v-else-if="availableBrands.length === 0"
                                    value="empty"
                                    disabled
                                >
                                    {{ t('admin.productsManagement.form.noBrands') }}
                                </SelectItem>
                                <SelectItem
                                    v-else
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

                <!-- Bulk actions -->
                <div v-if="selectedProducts.length > 0" class="flex items-center gap-2">
                    <span class="text-sm text-gray-600 dark:text-gray-300">
                        {{ selectedProducts.length }}
                        {{ t('admin.productsManagement.bulk.selected') }}
                    </span>
                    <Button variant="outline" size="sm" @click="handleBulkPublish">
                        {{ t('admin.productsManagement.bulk.publish') }}
                    </Button>
                    <Button variant="outline" size="sm" @click="handleBulkArchive">
                        {{ t('admin.productsManagement.bulk.archive') }}
                    </Button>
                    <Button variant="destructive" size="sm" @click="handleBulkDelete">
                        {{ t('admin.productsManagement.bulk.delete') }}
                    </Button>
                    <Button variant="ghost" size="sm" @click="clearSelection">
                        {{ t('common.clear') }}
                    </Button>
                </div>
            </div>
        </Card>

        <!-- Data Table -->
        <DataTable
            :columns="columns"
            :data="filteredProducts"
            :loading="loading"
            show-global-filter
            :filter-placeholder="t('admin.productsManagement.searchProducts')"
            :rows-per-page-text="t('admin.productsManagement.pagination.rowsPerPage')"
            :go-to-first-page-text="t('admin.productsManagement.pagination.first')"
            :go-to-previous-page-text="t('admin.productsManagement.pagination.previous')"
            :go-to-next-page-text="t('admin.productsManagement.pagination.next')"
            :go-to-last-page-text="t('admin.productsManagement.pagination.last')"
            :page-text="t('admin.productsManagement.pagination.page')"
            :of-text="t('admin.productsManagement.pagination.of')"
            :loading-text="t('common.loading')"
            :no-data-text="t('admin.productsManagement.noProducts')"
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange"
        >
            <template #pagination-left="{ selectedCount, totalCount }">
                <div class="flex-1 text-sm text-muted-foreground">
                    {{ selectedCount }} {{ t('admin.productsManagement.pagination.of') }}
                    {{ totalCount }} {{ t('admin.productsManagement.pagination.entries') }}
                    {{ t('common.selected') }}.
                </div>
            </template>
        </DataTable>

        <!-- Delete Dialog -->
        <ConfirmDialog
            :open="isDeleteDialogOpen"
            :title="t('admin.productsManagement.messages.deleteConfirmTitle')"
            :description="deleteConfirmationText"
            :confirm-text="t('admin.productsManagement.messages.deleteConfirmYes')"
            :cancel-text="t('admin.productsManagement.messages.deleteConfirmNo')"
            variant="destructive"
            :loading="isDeleting"
            @confirm="confirmDelete"
            @cancel="closeDeleteDialog"
            @close="closeDeleteDialog"
            @update:open="isDeleteDialogOpen = $event"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useProducts } from '@/composables/useProductsAdmin'
import { useCategories } from '@/composables/useCategories'
import { useBrands } from '@/composables/useBrands'
import { useAppI18n } from '@/composables/useI18n'
import type { Product } from '@/services/product.service'
import { productService } from '@/services/product.service'
import { createColumnHelper } from '@tanstack/vue-table'

// UI Components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Badge from '@/components/ui/badge/Badge.vue'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DataTable from '@/components/ui/DataTable.vue'

// Icons
import { Plus, Edit, Trash2, Star, Package, Eye } from 'lucide-vue-next'

// Composables
const router = useRouter()
const { success, error: errorToast } = useToast()
const { products, loading, loadProducts, deleteProduct, updateProduct } = useProducts()
const { categories, loading: loadingCategories, loadCategories } = useCategories()
const { brands, loading: loadingBrands, loadBrands } = useBrands()
const { t } = useAppI18n()

// Component state
const isDeleteDialogOpen = ref(false)
const productToDelete = ref<Product | null>(null)
const isDeleting = ref(false)
const selectedProducts = ref<string[]>([])

// Filters
const statusFilter = ref('all')
const categoryFilter = ref('all')
const brandFilter = ref('all')

// Available filter options
const availableCategories = computed(() => categories.value)
const availableBrands = computed(() => brands.value)

// Filtered products
const filteredProducts = computed(() => {
    let filtered = products.value

    // Filter by status
    if (statusFilter.value && statusFilter.value !== 'all') {
        filtered = filtered.filter((product) => product.status === statusFilter.value)
    }

    // Filter by category
    if (categoryFilter.value && categoryFilter.value !== 'all') {
        filtered = filtered.filter((product) => product.category_id === categoryFilter.value)
    }

    // Filter by brand
    if (brandFilter.value && brandFilter.value !== 'all') {
        filtered = filtered.filter((product) => product.brand_id === brandFilter.value)
    }

    return filtered
})

// Computed properties
const deleteConfirmationText = computed(() => {
    return productToDelete.value
        ? t('admin.productsManagement.messages.deleteConfirmMessage')
        : t('common.confirmMessage')
})

// Column helper
const columnHelper = createColumnHelper<Product>()

// Helper functions
const getCategoryName = (categoryId: string) => {
    const category = categories.value.find((c) => c.id === categoryId)
    return category?.name || '-'
}

const getBrandName = (brandId: string) => {
    const brand = brands.value.find((b) => b.id === brandId)
    return brand?.name || '-'
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price)
}

const getStatusBadgeVariant = (status: string) => {
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

// Table columns
const columns = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.getValue('id')),
        size: 80,
    }),
    columnHelper.display({
        id: 'image',
        header: () => t('admin.productsManagement.table.image'),
        cell: ({ row }) => {
            const product = row.original
            const imageUrl = product.images?.[0] || '/placeholder-product.png'
            return h('div', { class: 'flex items-center justify-center w-12 h-12' }, [
                h('img', {
                    src: imageUrl,
                    alt: product.name,
                    class: 'w-10 h-10 object-cover rounded border',
                }),
            ])
        },
        size: 80,
    }),
    columnHelper.accessor('name', {
        header: () => t('admin.productsManagement.table.name'),
        cell: ({ row }) => {
            const product = row.original
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'font-medium' }, product.name),
                h('span', { class: 'text-sm text-muted-foreground' }, product.sku),
            ])
        },
    }),
    columnHelper.accessor('category_id', {
        header: () => t('admin.productsManagement.table.category'),
        cell: ({ row }) => {
            const categoryId = row.getValue('category_id') as string
            return h('span', { class: 'text-sm' }, getCategoryName(categoryId))
        },
        size: 120,
    }),
    columnHelper.accessor('brand_id', {
        header: () => t('admin.productsManagement.table.brand'),
        cell: ({ row }) => {
            const brandId = row.getValue('brand_id') as string
            return h('span', { class: 'text-sm' }, getBrandName(brandId))
        },
        size: 120,
    }),
    columnHelper.accessor('price', {
        header: () => t('admin.productsManagement.table.price'),
        cell: ({ row }) => {
            const price = row.getValue('price') as number
            return h('span', { class: 'font-medium' }, formatPrice(price))
        },
        size: 120,
    }),
    columnHelper.accessor('stock_quantity', {
        header: () => t('admin.productsManagement.table.stock'),
        cell: ({ row }) => {
            const stock = row.getValue('stock_quantity') as number
            const isLowStock = stock < 10
            return h('div', { class: 'flex items-center gap-2' }, [
                h(
                    'span',
                    {
                        class: isLowStock
                            ? 'text-red-600 font-medium'
                            : 'text-green-600 font-medium',
                    },
                    stock,
                ),
                isLowStock ? h(Package, { class: 'h-4 w-4 text-red-500' }) : null,
            ])
        },
        size: 100,
    }),
    columnHelper.accessor('status', {
        header: () => t('admin.productsManagement.table.status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const variant = getStatusBadgeVariant(status)
            return h(Badge, { variant }, () => t(`admin.productsManagement.status.${status}`))
        },
        size: 120,
    }),
    columnHelper.accessor('featured', {
        header: () => t('admin.productsManagement.table.featured'),
        cell: ({ row }) => {
            const featured = row.getValue('featured') as boolean
            return featured ? h(Star, { class: 'h-4 w-4 text-yellow-500 fill-current' }) : null
        },
        size: 80,
    }),
    columnHelper.display({
        id: 'actions',
        header: () => t('admin.productsManagement.table.actions'),
        cell: ({ row }) => {
            const product = row.original
            return h('div', { class: 'flex items-center gap-2' }, [
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': t('admin.productsManagement.actions.view'),
                        onClick: () => navigateToViewProduct(product),
                    },
                    {
                        default: () => [h(Eye, { class: 'h-4 w-4' })],
                    },
                ),
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': t('admin.productsManagement.actions.edit'),
                        onClick: () => navigateToEditProduct(product),
                    },
                    {
                        default: () => [h(Edit, { class: 'h-4 w-4' })],
                    },
                ),
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': t('admin.productsManagement.actions.delete'),
                        onClick: () => openDeleteDialog(product),
                        class: 'text-destructive hover:text-destructive',
                    },
                    {
                        default: () => [h(Trash2, { class: 'h-4 w-4' })],
                    },
                ),
            ])
        },
        size: 120,
    }),
]

// Event handlers
const handleRowClick = (row: Product) => {
    console.log('Row clicked:', row)
}

const handleSelectionChange = (selection: any) => {
    selectedProducts.value = selection
}

// Filter methods
const applyFilters = () => {
    // Filters are applied automatically via computed property
}

const clearSelection = () => {
    selectedProducts.value = []
}

// Bulk operations
const handleBulkPublish = async () => {
    try {
        for (const productId of selectedProducts.value) {
            await updateProduct(productId, { status: 'published' })
        }
        success(t('admin.productsManagement.bulk.publishSuccess'), '')
        clearSelection()
        await loadProducts()
    } catch (err) {
        console.error('Bulk publish error:', err)
        errorToast(t('admin.productsManagement.bulk.publishError'), '')
    }
}

const handleBulkArchive = async () => {
    try {
        for (const productId of selectedProducts.value) {
            await updateProduct(productId, { status: 'archived' })
        }
        success(t('admin.productsManagement.bulk.archiveSuccess'), '')
        clearSelection()
        await loadProducts()
    } catch (err) {
        console.error('Bulk archive error:', err)
        errorToast(t('admin.productsManagement.bulk.archiveError'), '')
    }
}

const handleBulkDelete = async () => {
    if (!confirm(t('admin.productsManagement.bulk.deleteConfirm'))) {
        return
    }

    try {
        for (const productId of selectedProducts.value) {
            await deleteProduct(productId)
        }
        success(t('admin.productsManagement.bulk.deleteSuccess'), '')
        clearSelection()
        await loadProducts()
    } catch (err) {
        console.error('Bulk delete error:', err)
        errorToast(t('admin.productsManagement.bulk.deleteError'), '')
    }
}

// Navigation methods
const navigateToCreateProduct = () => {
    router.push('/admin/products/new')
}

const navigateToEditProduct = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`)
}

const navigateToViewProduct = (product: Product) => {
    router.push(`/admin/products/${product.id}`)
}

const openDeleteDialog = (product: Product) => {
    productToDelete.value = product
    isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
    isDeleteDialogOpen.value = false
    productToDelete.value = null
}

// CRUD operations
const confirmDelete = async () => {
    if (!productToDelete.value) return

    isDeleting.value = true
    try {
        await deleteProduct(productToDelete.value.id)
        success(t('admin.productsManagement.messages.deleteSuccess'), '')
        await loadProducts()
        closeDeleteDialog()
    } catch (err) {
        errorToast(
            t('common.error'),
            err instanceof Error ? err.message : t('admin.productsManagement.messages.deleteError'),
        )
    } finally {
        isDeleting.value = false
    }
}

// Load data on mount
onMounted(async () => {
    await loadProducts()
    await loadCategories()
    await loadBrands()
})
</script>
