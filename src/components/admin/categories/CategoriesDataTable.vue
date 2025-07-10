<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">
                    {{ t('admin.categoriesManagement.title') }}
                </h2>
                <p class="text-muted-foreground">{{ t('admin.categoriesManagement.subtitle') }}</p>
            </div>
            <Button @click="openCreateDialog">
                <Plus class="mr-2 h-4 w-4" />
                {{ t('admin.categoriesManagement.addCategory') }}
            </Button>
        </div>

        <!-- Data Table -->
        <DataTable
            :columns="columns"
            :data="categories"
            :loading="loading"
            show-global-filter
            :filter-placeholder="t('admin.categoriesManagement.searchCategories')"
            :rows-per-page-text="t('admin.categoriesManagement.pagination.rowsPerPage')"
            :go-to-first-page-text="t('admin.categoriesManagement.pagination.first')"
            :go-to-previous-page-text="t('admin.categoriesManagement.pagination.previous')"
            :go-to-next-page-text="t('admin.categoriesManagement.pagination.next')"
            :go-to-last-page-text="t('admin.categoriesManagement.pagination.last')"
            :page-text="t('admin.categoriesManagement.pagination.page')"
            :of-text="t('admin.categoriesManagement.pagination.of')"
            :loading-text="t('common.loading')"
            :no-data-text="t('admin.categoriesManagement.noCategories')"
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange"
        >
            <template #pagination-left="{ selectedCount, totalCount }">
                <div class="flex-1 text-sm text-muted-foreground">
                    {{ selectedCount }} {{ t('admin.categoriesManagement.pagination.of') }}
                    {{ totalCount }} {{ t('admin.categoriesManagement.pagination.entries') }}
                    {{ t('common.selected') }}.
                </div>
            </template>
        </DataTable>

        <!-- Create/Edit Dialog -->
        <CategoryFormDialog
            :open="isDialogOpen"
            :category="selectedCategory"
            :parent-categories="parentCategories"
            :loading="isSubmitting"
            :success="isSuccess"
            @close="closeDialog"
            @save="handleSave"
            @update:open="isDialogOpen = $event"
        />

        <!-- Delete Dialog -->
        <ConfirmDialog
            :open="isDeleteDialogOpen"
            :title="t('admin.categoriesManagement.messages.deleteConfirmTitle')"
            :description="deleteConfirmationText"
            :confirm-text="t('admin.categoriesManagement.messages.deleteConfirmYes')"
            :cancel-text="t('admin.categoriesManagement.messages.deleteConfirmNo')"
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
import { useToast } from '@/composables/useToast'
import { useCategories } from '@/composables/useCategories'
import { useAppI18n } from '@/composables/useI18n'
import type { Category } from '@/services/category.service'
import { createColumnHelper } from '@tanstack/vue-table'

// UI Components
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import DataTable from '@/components/ui/DataTable.vue'

// Icons
import { Plus, Edit, Trash2 } from 'lucide-vue-next'

// Custom components
import CategoryFormDialog from './CategoryFormDialog.vue'
import IconRenderer from './IconRenderer.vue'

// Composables
const { success, error: errorToast } = useToast()
const {
    categories,
    parentCategories,
    loading,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = useCategories()
const { t } = useAppI18n()

// Component state
const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const selectedCategory = ref<Category | null>(null)
const categoryToDelete = ref<Category | null>(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const isSuccess = ref(false) // Add success state

// Computed properties
const deleteConfirmationText = computed(() => {
    return categoryToDelete.value
        ? t('admin.categoriesManagement.messages.deleteConfirmMessage')
        : t('common.confirmMessage')
})

// Column helper
const columnHelper = createColumnHelper<Category>()

// Table columns
const columns = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.getValue('id')),
        size: 80,
    }),
    columnHelper.accessor('name', {
        header: () => t('admin.categoriesManagement.table.name'),
        cell: ({ row }) => {
            const category = row.original
            const depth = category.parent_id ? 1 : 0
            return h(
                'div',
                {
                    class: `flex items-center gap-2`,
                    style: { paddingLeft: `${depth * 20}px` },
                },
                [
                    depth > 0 ? h('div', { class: 'w-4 h-px bg-border' }) : null,
                    h('span', { class: 'font-medium' }, category.name),
                ],
            )
        },
    }),
    columnHelper.accessor('icon', {
        header: () => t('admin.categoriesManagement.table.icon'),
        cell: ({ row }) => {
            const iconName = row.getValue('icon') as string
            return h('div', { class: 'flex items-center justify-center w-8 h-8' }, [
                h(IconRenderer, { iconName, size: 'sm' }),
            ])
        },
        size: 120,
    }),
    columnHelper.accessor('description', {
        header: () => t('admin.categoriesManagement.table.description'),
        cell: ({ row }) =>
            h(
                'div',
                {
                    class: 'max-w-[300px] truncate text-sm text-muted-foreground',
                },
                row.getValue('description'),
            ),
    }),
    columnHelper.accessor('slug', {
        header: () => t('admin.categoriesManagement.table.slug'),
        cell: ({ row }) =>
            h(
                'code',
                {
                    class: 'rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
                },
                row.getValue('slug'),
            ),
    }),
    columnHelper.accessor('order', {
        header: () => t('admin.categoriesManagement.table.order'),
        cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('order')),
        size: 80,
    }),
    columnHelper.display({
        id: 'actions',
        header: () => t('admin.categoriesManagement.table.actions'),
        cell: ({ row }) => {
            const category = row.original
            return h('div', { class: 'flex items-center gap-2' }, [
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': t('admin.categoriesManagement.actions.edit'),
                        onClick: () => openEditDialog(category),
                    },
                    {
                        default: () => [h(Edit, { class: 'h-4 w-4 mr-2' })],
                    },
                ),
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': t('admin.categoriesManagement.actions.delete'),
                        onClick: () => openDeleteDialog(category),
                        class: 'text-destructive hover:text-destructive',
                    },
                    {
                        default: () => [h(Trash2, { class: 'h-4 w-4 mr-2' })],
                    },
                ),
            ])
        },
        size: 120,
    }),
]

// Event handlers
const handleRowClick = (row: Category) => {
    // Optional: Handle row click (e.g., for row selection)
    console.log('Row clicked:', row)
}

const handleSelectionChange = (selection: any) => {
    // Optional: Handle selection changes
    console.log('Selection changed:', selection)
}

// Dialog methods
const openCreateDialog = () => {
    selectedCategory.value = null
    isDialogOpen.value = true
}

const openEditDialog = (category: Category) => {
    selectedCategory.value = category
    isDialogOpen.value = true
}

const closeDialog = () => {
    isDialogOpen.value = false
    selectedCategory.value = null
    isSubmitting.value = false // Reset loading state
    isSuccess.value = false // Reset success state
}

const openDeleteDialog = (category: Category) => {
    categoryToDelete.value = category
    isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
    isDeleteDialogOpen.value = false
    categoryToDelete.value = null
}

// CRUD operations
const handleSave = async (formData: any) => {
    isSubmitting.value = true
    isSuccess.value = false
    try {
        if (selectedCategory.value) {
            await updateCategory(selectedCategory.value.id, formData)
            await loadCategories()
        } else {
            await createCategory(formData)
            // Reload categories to ensure table is updated
            await loadCategories()
        }

        // Stop loading and show success state briefly
        isSubmitting.value = false
        isSuccess.value = true

        // Then show success toast
        if (selectedCategory.value) {
            success(
                t('admin.categoriesManagement.messages.updateSuccess'),
                t('admin.categoriesManagement.messages.updateSuccess'),
            )
        } else {
            success(
                t('admin.categoriesManagement.messages.createSuccess'),
                t('admin.categoriesManagement.messages.createSuccess'),
            )
        }

        // Delay closing dialog to let user see the toast and success state
        setTimeout(() => {
            closeDialog()
        }, 1500)
    } catch (err) {
        const errorMessage = selectedCategory.value
            ? t('admin.categoriesManagement.messages.updateError')
            : t('admin.categoriesManagement.messages.createError')
        errorToast(t('common.error'), err instanceof Error ? err.message : errorMessage)
        isSubmitting.value = false
        isSuccess.value = false
    }
}

const confirmDelete = async () => {
    if (!categoryToDelete.value) return

    isDeleting.value = true
    try {
        await deleteCategory(categoryToDelete.value.id)
        success(
            t('admin.categoriesManagement.messages.deleteSuccess'),
            t('admin.categoriesManagement.messages.deleteSuccess'),
        )
        closeDeleteDialog()
    } catch (err) {
        errorToast(
            t('common.error'),
            err instanceof Error
                ? err.message
                : t('admin.categoriesManagement.messages.deleteError'),
        )
    } finally {
        isDeleting.value = false
    }
}

// Load data on mount
onMounted(() => {
    loadCategories()
})
</script>
