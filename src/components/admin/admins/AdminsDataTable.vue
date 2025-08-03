<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">
                    {{ t('admin.adminsManagement.title') }}
                </h2>
                <p class="text-muted-foreground">{{ t('admin.adminsManagement.subtitle') }}</p>
            </div>
            <div class="flex items-center gap-2">
                <Button @click="navigateToCreateAdmin">
                    <Plus class="mr-2 h-4 w-4" />
                    {{ t('admin.adminsManagement.addAdmin') }}
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
                                    :placeholder="t('admin.adminsManagement.filters.allStatus')"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{{
                                    t('admin.adminsManagement.filters.allStatus')
                                }}</SelectItem>
                                <SelectItem value="active">{{
                                    t('admin.adminsManagement.status.active')
                                }}</SelectItem>
                                <SelectItem value="banned">{{
                                    t('admin.adminsManagement.status.banned')
                                }}</SelectItem>
                                <SelectItem value="temporarily_locked">{{
                                    t('admin.adminsManagement.status.temporarily_locked')
                                }}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select v-model="roleFilter" @update:model-value="applyFilters">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue
                                    :placeholder="loadingRoles ? t('common.loading') : t('admin.adminsManagement.filters.allRoles')"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{{
                                    t('admin.adminsManagement.filters.allRoles')
                                }}</SelectItem>
                                <SelectItem 
                                    v-for="role in roles" 
                                    :key="role.id" 
                                    :value="role.id"
                                >
                                    {{ t(`admin.adminsManagement.roles.${role.id}`) }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <!-- Bulk Actions -->
                <div v-if="selectedAdmins.length > 0" class="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <span class="text-sm text-muted-foreground">
                        {{ selectedAdmins.length }} {{ t('admin.adminsManagement.bulk.selected') }}
                    </span>
                    <div class="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            @click="handleBulkActivate"
                            :disabled="loading"
                        >
                            {{ t('admin.adminsManagement.bulk.activate') }}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            @click="handleBulkLock"
                            :disabled="loading"
                        >
                            {{ t('admin.adminsManagement.bulk.lock') }}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            @click="handleBulkBan"
                            :disabled="loading"
                        >
                            {{ t('admin.adminsManagement.bulk.ban') }}
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            @click="handleBulkDelete"
                            :disabled="loading"
                        >
                            {{ t('admin.adminsManagement.bulk.delete') }}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>

        <!-- Data Table -->
        <Card>
            <DataTable
                :columns="columns"
                :data="filteredAdmins"
                :loading="loading"
                :selection="selectedAdmins"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                :empty-state="{
                    title: t('admin.adminsManagement.noAdmins'),
                    description: t('admin.adminsManagement.noAdminsDescription'),
                    action: {
                        label: t('admin.adminsManagement.createFirstAdmin'),
                        onClick: navigateToCreateAdmin,
                    },
                }"
            />
        </Card>

        <!-- Delete Confirmation Dialog -->
        <ConfirmDialog
            :open="isDeleteDialogOpen"
            :title="t('admin.adminsManagement.messages.deleteConfirmTitle')"
            :description="deleteConfirmationText"
            :confirmText="t('admin.adminsManagement.messages.deleteConfirmYes')"
            :cancelText="t('admin.adminsManagement.messages.deleteConfirmNo')"
            :loading="isDeleting"
            @confirm="confirmDelete"
            @cancel="closeDeleteDialog"
        />

        <!-- Admin Form Dialog -->
        <AdminFormDialog
            :open="isFormDialogOpen"
            :admin="adminToEdit"
            @update:open="closeFormDialog"
            @saved="handleAdminSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { createColumnHelper } from '@tanstack/vue-table'
import type { Admin } from '@/types/admin'

// Composables
import { useAdmins, useRoles } from '@/composables/useAdmins'
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
import AdminFormDialog from './AdminFormDialog.vue'

// Icons
import { Plus, Edit, Trash2, User, Shield, Clock, Eye } from 'lucide-vue-next'

// Composables
const router = useRouter()
const { success, error: errorToast } = useToast()
const { admins, loading, loadAdmins, deleteAdmin, bulkUpdateStatus } = useAdmins()
const { roles, loading: loadingRoles, loadRoles } = useRoles()
const { t } = useAppI18n()

// Component state
const isDeleteDialogOpen = ref(false)
const adminToDelete = ref<Admin | null>(null)
const isDeleting = ref(false)
const selectedAdmins = ref<string[]>([])

// Form dialog state
const isFormDialogOpen = ref(false)
const adminToEdit = ref<Admin | null>(null)

// Filters
const statusFilter = ref('all')
const roleFilter = ref('all')

// Filtered admins
const filteredAdmins = computed(() => {
    let filtered = admins.value

    // Filter by status
    if (statusFilter.value && statusFilter.value !== 'all') {
        filtered = filtered.filter((admin) => admin.status === statusFilter.value)
    }

    // Filter by role
    if (roleFilter.value && roleFilter.value !== 'all') {
        filtered = filtered.filter((admin) => admin.role === roleFilter.value)
    }

    return filtered
})

// Computed properties
const deleteConfirmationText = computed(() => {
    return adminToDelete.value
        ? t('admin.adminsManagement.messages.deleteConfirmMessage')
        : t('common.confirmMessage')
})

// Column helper
const columnHelper = createColumnHelper<Admin>()

// Helper functions
const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) {
        return t('admin.adminsManagement.detail.neverLoggedIn')
    }
    return new Date(lastLogin).toLocaleString('vi-VN')
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'active':
            return 'default'
        case 'banned':
            return 'destructive'
        case 'temporarily_locked':
            return 'secondary'
        default:
            return 'outline'
    }
}

const getRoleIcon = (role: string) => {
    switch (role) {
        case 'super_admin':
            return Shield
        case 'manager':
            return User
        case 'staff':
            return Clock
        default:
            return User
    }
}

const getRoleName = (roleId: string) => {
    return t(`admin.adminsManagement.roles.${roleId}`)
}

// Table columns
const columns = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.getValue('id')),
        size: 80,
    }),
    columnHelper.accessor('name', {
        header: () => t('admin.adminsManagement.table.name'),
        cell: ({ row }) => {
            const admin = row.original
            const RoleIcon = getRoleIcon(admin.role)
            return h('div', { class: 'flex items-center gap-2' }, [
                h(RoleIcon, { class: 'h-4 w-4 text-muted-foreground' }),
                h('div', { class: 'flex flex-col' }, [
                    h('span', { class: 'font-medium' }, admin.name),
                    h('span', { class: 'text-sm text-muted-foreground' }, admin.email),
                ])
            ])
        },
    }),
    columnHelper.accessor('role', {
        header: () => t('admin.adminsManagement.table.role'),
        cell: ({ row }) => {
            const role = row.getValue('role') as string
            return h('span', { class: 'text-sm' }, getRoleName(role))
        },
        size: 120,
    }),
    columnHelper.accessor('status', {
        header: () => t('admin.adminsManagement.table.status'),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const variant = getStatusBadgeVariant(status)
            return h(Badge, { variant }, () => t(`admin.adminsManagement.status.${status}`))
        },
        size: 120,
    }),
    columnHelper.display({
        id: 'lastLogin',
        header: () => t('admin.adminsManagement.table.lastLogin'),
        cell: ({ row }) => {
            const admin = row.original
            return h('span', { class: 'text-sm' }, formatLastLogin(admin.last_login))
        },
        size: 180,
    }),
    columnHelper.display({
        id: 'actions',
        header: () => t('admin.adminsManagement.table.actions'),
        cell: ({ row }) => {
            const admin = row.original
            return h('div', { class: 'flex items-center gap-2' }, [
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': t('admin.adminsManagement.actions.view'),
                        onClick: () => navigateToViewAdmin(admin),
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
                        'aria-label': t('admin.adminsManagement.actions.edit'),
                        onClick: () => navigateToEditAdmin(admin),
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
                        'aria-label': t('admin.adminsManagement.actions.delete'),
                        onClick: () => openDeleteDialog(admin),
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
const handleRowClick = (row: Admin) => {
    console.log('Row clicked:', row)
}

const handleSelectionChange = (selection: string[]) => {
    selectedAdmins.value = selection
}

// Filter methods
const applyFilters = () => {
    // Filters are applied automatically via computed property
}

const clearSelection = () => {
    selectedAdmins.value = []
}

// Bulk operations
const handleBulkActivate = async () => {
    try {
        await bulkUpdateStatus(selectedAdmins.value, 'active')
        success(t('admin.adminsManagement.bulk.activateSuccess'), '')
        clearSelection()
        await loadAdmins()
    } catch (err) {
        console.error('Bulk activate error:', err)
        errorToast(t('admin.adminsManagement.bulk.activateError'), '')
    }
}

const handleBulkBan = async () => {
    try {
        await bulkUpdateStatus(selectedAdmins.value, 'banned')
        success(t('admin.adminsManagement.bulk.banSuccess'), '')
        clearSelection()
        await loadAdmins()
    } catch (err) {
        console.error('Bulk ban error:', err)
        errorToast(t('admin.adminsManagement.bulk.banError'), '')
    }
}

const handleBulkLock = async () => {
    try {
        await bulkUpdateStatus(selectedAdmins.value, 'temporarily_locked')
        success(t('admin.adminsManagement.bulk.lockSuccess'), '')
        clearSelection()
        await loadAdmins()
    } catch (err) {
        console.error('Bulk lock error:', err)
        errorToast(t('admin.adminsManagement.bulk.lockError'), '')
    }
}

const handleBulkDelete = async () => {
    if (!confirm(t('admin.adminsManagement.bulk.deleteConfirm'))) {
        return
    }

    try {
        for (const adminId of selectedAdmins.value) {
            await deleteAdmin(adminId)
        }
        success(t('admin.adminsManagement.bulk.deleteSuccess'), '')
        clearSelection()
        await loadAdmins()
    } catch (err) {
        console.error('Bulk delete error:', err)
        errorToast(t('admin.adminsManagement.bulk.deleteError'), '')
    }
}

// Navigation methods
const navigateToCreateAdmin = () => {
    adminToEdit.value = null
    isFormDialogOpen.value = true
}

const navigateToEditAdmin = (admin: Admin) => {
    adminToEdit.value = admin
    isFormDialogOpen.value = true
}

const navigateToViewAdmin = (admin: Admin) => {
    router.push(`/admin/admins/${admin.id}`)
}

const closeFormDialog = () => {
    isFormDialogOpen.value = false
    adminToEdit.value = null
}

const handleAdminSaved = async () => {
    await loadAdmins()
}

const openDeleteDialog = (admin: Admin) => {
    adminToDelete.value = admin
    isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
    isDeleteDialogOpen.value = false
    adminToDelete.value = null
}

// CRUD operations
const confirmDelete = async () => {
    if (!adminToDelete.value) return

    isDeleting.value = true
    try {
        await deleteAdmin(adminToDelete.value.id)
        success(t('admin.adminsManagement.messages.deleteSuccess'), '')
        await loadAdmins()
        closeDeleteDialog()
    } catch (err) {
        errorToast(
            t('common.error'),
            err instanceof Error ? err.message : t('admin.adminsManagement.messages.deleteError'),
        )
    } finally {
        isDeleting.value = false
    }
}

// Load data on mount
onMounted(async () => {
    await Promise.all([
        loadAdmins(),
        loadRoles()
    ])
})
</script>
