<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">
                    {{ t('admin.couponsManagement.title') }}
                </h2>
                <p class="text-muted-foreground">{{ t('admin.couponsManagement.subtitle') }}</p>
            </div>
            <div class="flex items-center gap-2">
                <Button @click="navigateToCreateCoupon">
                    <Plus class="mr-2 h-4 w-4" />
                    {{ t('admin.couponsManagement.addCoupon') }}
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
                                    :placeholder="t('admin.couponsManagement.filters.allStatus')"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{{
                                    t('admin.couponsManagement.filters.allStatus')
                                }}</SelectItem>
                                <SelectItem value="active">{{
                                    t('admin.couponsManagement.status.active')
                                }}</SelectItem>
                                <SelectItem value="inactive">{{
                                    t('admin.couponsManagement.status.inactive')
                                }}</SelectItem>
                                <SelectItem value="expired">{{
                                    t('admin.couponsManagement.status.expired')
                                }}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select v-model="typeFilter" @update:model-value="applyFilters">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue
                                    :placeholder="t('admin.couponsManagement.filters.allTypes')"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{{
                                    t('admin.couponsManagement.filters.allTypes')
                                }}</SelectItem>
                                <SelectItem value="fixed">{{
                                    t('admin.couponsManagement.discountType.fixed')
                                }}</SelectItem>
                                <SelectItem value="percentage">{{
                                    t('admin.couponsManagement.discountType.percentage')
                                }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <!-- Bulk Actions -->
                <div
                    v-if="selectedCoupons.length > 0"
                    class="flex items-center gap-2 p-2 bg-muted rounded-md"
                >
                    <span class="text-sm text-muted-foreground">
                        {{ selectedCoupons.length }}
                        {{ t('admin.couponsManagement.bulk.selected') }}
                    </span>
                    <div class="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            @click="handleBulkActivate"
                            :disabled="loading"
                        >
                            {{ t('admin.couponsManagement.bulk.activate') }}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            @click="handleBulkDeactivate"
                            :disabled="loading"
                        >
                            {{ t('admin.couponsManagement.bulk.deactivate') }}
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            @click="handleBulkDelete"
                            :disabled="loading"
                        >
                            {{ t('admin.couponsManagement.bulk.delete') }}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>

        <!-- Data Table -->
        <Card>
            <DataTable
                :columns="columns"
                :data="filteredCoupons"
                :loading="loading"
                :selection="selectedCoupons"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                :empty-state="{
                    title: t('admin.couponsManagement.noCoupons'),
                    description: t('admin.couponsManagement.noCouponsDescription'),
                    action: {
                        label: t('admin.couponsManagement.createFirstCoupon'),
                        onClick: navigateToCreateCoupon,
                    },
                }"
            />
        </Card>

        <!-- Delete Confirmation Dialog -->
        <ConfirmDialog
            :open="isDeleteDialogOpen"
            :title="t('admin.couponsManagement.messages.deleteConfirmTitle')"
            :description="deleteConfirmationText"
            :confirmText="t('admin.couponsManagement.messages.deleteConfirmYes')"
            :cancelText="t('admin.couponsManagement.messages.deleteConfirmNo')"
            :loading="isDeleting"
            @confirm="confirmDelete"
            @cancel="closeDeleteDialog"
        />

        <!-- Coupon Form Dialog -->
        <CouponFormDialog
            :open="isFormDialogOpen"
            :coupon="couponToEdit"
            @update:open="closeFormDialog"
            @saved="handleCouponSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { createColumnHelper } from '@tanstack/vue-table'
import type { Coupon } from '@/types/coupon'

// Composables
import { useCoupons } from '@/composables/useCoupons'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

// Components
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
import CouponFormDialog from './CouponFormDialog.vue'

// Icons
import { Plus, Edit, Trash2, Calendar, Users, Percent, DollarSign, Eye } from 'lucide-vue-next'

// Composables
const router = useRouter()
const { success, error: errorToast } = useToast()
const { coupons, loading, loadCoupons, deleteCoupon, bulkUpdateStatus } = useCoupons()
const { t } = useAppI18n()

// Component state
const isDeleteDialogOpen = ref(false)
const couponToDelete = ref<Coupon | null>(null)
const isDeleting = ref(false)
const selectedCoupons = ref<string[]>([])

// Form dialog state
const isFormDialogOpen = ref(false)
const couponToEdit = ref<Coupon | null>(null)

// Filters
const statusFilter = ref('all')
const typeFilter = ref('all')

// Filtered coupons
const filteredCoupons = computed(() => {
    let filtered = coupons.value

    // Filter by status
    if (statusFilter.value && statusFilter.value !== 'all') {
        filtered = filtered.filter((coupon) => coupon.status === statusFilter.value)
    }

    // Filter by type
    if (typeFilter.value && typeFilter.value !== 'all') {
        filtered = filtered.filter((coupon) => coupon.discount_type === typeFilter.value)
    }

    return filtered
})

// Computed properties
const deleteConfirmationText = computed(() => {
    return couponToDelete.value
        ? t('admin.couponsManagement.messages.deleteConfirmMessage')
        : t('common.confirmMessage')
})

// Column helper
const columnHelper = createColumnHelper<Coupon>()

// Helper functions
const formatDiscountValue = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
        return `${coupon.discount_value}%`
    } else {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(coupon.discount_value)
    }
}

const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('vi-VN')
    const end = new Date(endDate).toLocaleDateString('vi-VN')
    return `${start} - ${end}`
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'active':
            return 'default'
        case 'inactive':
            return 'secondary'
        case 'expired':
            return 'destructive'
        default:
            return 'outline'
    }
}

const formatUsage = (coupon: Coupon) => {
    if (coupon.has_limit && coupon.usage_limit) {
        return `${coupon.usage_count}/${coupon.usage_limit}`
    }
    return coupon.usage_count.toString()
}

// Table columns
const columns = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.getValue('id')),
        size: 80,
    }),
    columnHelper.accessor('name', {
        header: () => t('admin.couponsManagement.table.name'),
        cell: ({ row }) => {
            const coupon = row.original
            const discountIcon = coupon.discount_type === 'percentage' ? Percent : DollarSign
            return h('div', { class: 'flex items-center gap-2' }, [
                h(discountIcon, { class: 'h-4 w-4 text-muted-foreground' }),
                h('div', { class: 'flex flex-col' }, [
                    h('span', { class: 'font-medium' }, coupon.name),
                    h(
                        'span',
                        { class: 'text-sm text-muted-foreground truncate max-w-[200px]' },
                        coupon.description,
                    ),
                ]),
            ])
        },
    }),
    columnHelper.accessor('discount_type', {
        header: () => t('admin.couponsManagement.table.type'),
        cell: ({ row }) => {
            const type = row.getValue('discount_type') as string
            return h(
                'span',
                { class: 'text-sm' },
                t(`admin.couponsManagement.discountType.${type}`),
            )
        },
        size: 120,
    }),
    columnHelper.display({
        id: 'value',
        header: () => t('admin.couponsManagement.table.value'),
        cell: ({ row }) => {
            const coupon = row.original
            return h('span', { class: 'font-medium' }, formatDiscountValue(coupon))
        },
        size: 120,
    }),
    columnHelper.display({
        id: 'usage',
        header: () => t('admin.couponsManagement.table.usage'),
        cell: ({ row }) => {
            const coupon = row.original
            const isLimitReached =
                coupon.has_limit && coupon.usage_limit && coupon.usage_count >= coupon.usage_limit
            return h('div', { class: 'flex items-center gap-2' }, [
                h(
                    'span',
                    {
                        class: isLimitReached
                            ? 'text-red-600 font-medium'
                            : 'text-green-600 font-medium',
                    },
                    formatUsage(coupon),
                ),
                h(Users, { class: 'h-4 w-4 text-muted-foreground' }),
            ])
        },
        size: 120,
    }),
    columnHelper.display({
        id: 'validity',
        header: () => t('admin.couponsManagement.table.validity'),
        cell: ({ row }) => {
            const coupon = row.original
            return h('div', { class: 'flex items-center gap-2' }, [
                h(Calendar, { class: 'h-4 w-4 text-muted-foreground' }),
                h(
                    'span',
                    { class: 'text-sm' },
                    formatDateRange(coupon.start_date, coupon.end_date),
                ),
            ])
        },
        size: 180,
    }),
    columnHelper.accessor('status', {
        header: () => t('admin.couponsManagement.table.status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const variant = getStatusBadgeVariant(status)
            return h(Badge, { variant }, () => t(`admin.couponsManagement.status.${status}`))
        },
        size: 120,
    }),
    columnHelper.display({
        id: 'actions',
        header: () => t('admin.couponsManagement.table.actions'),
        cell: ({ row }) => {
            const coupon = row.original
            return h('div', { class: 'flex items-center gap-2' }, [
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': t('admin.couponsManagement.actions.view'),
                        onClick: () => navigateToViewCoupon(coupon),
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
                        'aria-label': t('admin.couponsManagement.actions.edit'),
                        onClick: () => navigateToEditCoupon(coupon),
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
                        'aria-label': t('admin.couponsManagement.actions.delete'),
                        onClick: () => openDeleteDialog(coupon),
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
const handleRowClick = (row: Coupon) => {
    console.log('Row clicked:', row)
}

const handleSelectionChange = (selection: string[]) => {
    selectedCoupons.value = selection
}

// Filter methods
const applyFilters = () => {
    // Filters are applied automatically via computed property
}

const clearSelection = () => {
    selectedCoupons.value = []
}

// Bulk operations
const handleBulkActivate = async () => {
    try {
        await bulkUpdateStatus(selectedCoupons.value, 'active')
        success(t('admin.couponsManagement.bulk.activateSuccess'), '')
        clearSelection()
        await loadCoupons()
    } catch (err) {
        console.error('Bulk activate error:', err)
        errorToast(t('admin.couponsManagement.bulk.activateError'), '')
    }
}

const handleBulkDeactivate = async () => {
    try {
        await bulkUpdateStatus(selectedCoupons.value, 'inactive')
        success(t('admin.couponsManagement.bulk.deactivateSuccess'), '')
        clearSelection()
        await loadCoupons()
    } catch (err) {
        console.error('Bulk deactivate error:', err)
        errorToast(t('admin.couponsManagement.bulk.deactivateError'), '')
    }
}

const handleBulkDelete = async () => {
    if (!confirm(t('admin.couponsManagement.bulk.deleteConfirm'))) {
        return
    }

    try {
        for (const couponId of selectedCoupons.value) {
            await deleteCoupon(couponId)
        }
        success(t('admin.couponsManagement.bulk.deleteSuccess'), '')
        clearSelection()
        await loadCoupons()
    } catch (err) {
        console.error('Bulk delete error:', err)
        errorToast(t('admin.couponsManagement.bulk.deleteError'), '')
    }
}

// Navigation methods
const navigateToCreateCoupon = () => {
    couponToEdit.value = null
    isFormDialogOpen.value = true
}

const navigateToEditCoupon = (coupon: Coupon) => {
    couponToEdit.value = coupon
    isFormDialogOpen.value = true
}

const navigateToViewCoupon = (coupon: Coupon) => {
    router.push(`/admin/coupons/${coupon.id}`)
}

const closeFormDialog = () => {
    isFormDialogOpen.value = false
    couponToEdit.value = null
}

const handleCouponSaved = async () => {
    await loadCoupons()
}

const openDeleteDialog = (coupon: Coupon) => {
    couponToDelete.value = coupon
    isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
    isDeleteDialogOpen.value = false
    couponToDelete.value = null
}

// CRUD operations
const confirmDelete = async () => {
    if (!couponToDelete.value) return

    isDeleting.value = true
    try {
        await deleteCoupon(couponToDelete.value.id)
        success(t('admin.couponsManagement.messages.deleteSuccess'), '')
        await loadCoupons()
        closeDeleteDialog()
    } catch (err) {
        errorToast(
            t('common.error'),
            err instanceof Error ? err.message : t('admin.couponsManagement.messages.deleteError'),
        )
    } finally {
        isDeleting.value = false
    }
}

// Load data on mount
onMounted(async () => {
    await loadCoupons()
})
</script>
