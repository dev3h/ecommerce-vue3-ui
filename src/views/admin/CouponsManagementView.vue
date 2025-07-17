<template>
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {{ t('admin.coupons.title') }}
        </h1>
        <Button class="mb-4" @click="openCreateModal">
            {{ t('admin.coupons.addCoupon') }}
        </Button>
        <DataTable
            :columns="columns"
            :data="coupons"
            :loading="loading"
            show-global-filter
            :filter-placeholder="t('admin.coupons.searchCoupons')"
            :rows-per-page-text="t('pagination.rowsPerPage')"
            :go-to-first-page-text="t('pagination.first')"
            :go-to-previous-page-text="t('pagination.previous')"
            :go-to-next-page-text="t('pagination.next')"
            :go-to-last-page-text="t('pagination.last')"
            :page-text="t('pagination.page')"
            :of-text="t('pagination.of')"
            :loading-text="t('common.loading')"
            :no-data-text="t('admin.coupons.noCoupons')"
        >
            <template #pagination-left="{ selectedCount, totalCount }">
                <div class="flex-1 text-sm text-muted-foreground">
                    {{ selectedCount }} {{ t('pagination.of') }} {{ totalCount }}
                    {{ t('pagination.entries') }} {{ t('common.selected') }}.
                </div>
            </template>
        </DataTable>
        <CouponFormModal
            v-model:open="showFormModal"
            :edit-coupon="editCoupon"
            @success="onFormSuccess"
        />
        <ConfirmDialog
            v-model:open="showDeleteDialog"
            :title="t('admin.coupons.deleteTitle')"
            :description="t('admin.coupons.deleteConfirm')"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { useCoupons } from '@/composables/useCoupons'
import DataTable from '@/components/ui/DataTable.vue'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import CouponFormModal from './CouponFormModal.vue'

const { t } = useAppI18n()
const toast = useToast()
const { coupons, loading, loadCoupons, deleteCoupon } = useCoupons()

const showFormModal = ref(false)
const editCoupon = ref(null)
const showDeleteDialog = ref(false)
const deleteId = ref<number | null>(null)

const columns = [
    {
        accessorKey: 'code',
        header: () => t('admin.coupons.code'),
        cell: ({ row }: any) => row.original.code,
    },
    {
        accessorKey: 'description',
        header: () => t('admin.coupons.description'),
        cell: ({ row }: any) => row.original.description,
    },
    {
        accessorKey: 'discount',
        header: () => t('admin.coupons.discount'),
        cell: ({ row }: any) =>
            row.original.type === 'percent'
                ? row.original.discount + '%'
                : row.original.type === 'amount'
                  ? '$' + row.original.discount
                  : t('admin.coupons.freeship'),
    },
    {
        accessorKey: 'active',
        header: () => t('admin.coupons.active'),
        cell: ({ row }: any) =>
            row.original.active ? t('admin.coupons.active') : t('admin.coupons.inactive'),
    },
    {
        accessorKey: 'actions',
        header: () => t('admin.coupons.actions'),
        cell: ({ row }: any) => [
            h(
                Button,
                {
                    size: 'sm',
                    class: 'mr-2',
                    onClick: () => openEditModal(row.original),
                },
                () => t('admin.coupons.edit'),
            ),
            h(
                Button,
                {
                    size: 'sm',
                    variant: 'destructive',
                    onClick: () => openDeleteDialog(row.original.id),
                },
                () => t('admin.coupons.delete'),
            ),
        ],
    },
]

function openCreateModal() {
    editCoupon.value = null
    showFormModal.value = true
}
function openEditModal(coupon: any) {
    editCoupon.value = coupon
    showFormModal.value = true
}
function onFormSuccess(msg: string) {
    showFormModal.value = false
    loadCoupons()
    toast.success(msg)
}
function openDeleteDialog(id: number) {
    deleteId.value = id
    showDeleteDialog.value = true
}
async function confirmDelete() {
    if (deleteId.value != null) {
        const ok = await deleteCoupon(deleteId.value)
        if (ok) {
            toast.success(t('admin.coupons.deleteSuccess'))
            loadCoupons()
        } else {
            toast.error(t('admin.coupons.deleteError'))
        }
    }
    showDeleteDialog.value = false
    deleteId.value = null
}
loadCoupons()
</script>
