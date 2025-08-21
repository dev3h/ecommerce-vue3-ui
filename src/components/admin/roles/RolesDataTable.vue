<template>
    <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">
                    {{ t('admin.rolesManagement.title') }}
                </h2>
                <p class="text-muted-foreground">{{ t('admin.rolesManagement.subtitle') }}</p>
            </div>
            <div class="flex items-center gap-2">
                <Button @click="navigateToCreateRole">
                    <Plus class="mr-2 h-4 w-4" />
                    {{ t('admin.rolesManagement.addRole') }}
                </Button>
            </div>
        </div>

        <!-- Filters and Stats -->
        <Card class="p-4">
            <div class="flex flex-col gap-4">
                <!-- Stats Row -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-3 bg-primary/5 rounded-lg">
                        <div class="text-2xl font-bold text-primary">{{ totalRoles }}</div>
                        <div class="text-sm text-muted-foreground">
                            {{ t('admin.rolesManagement.stats.total') }}
                        </div>
                    </div>
                    <div class="text-center p-3 bg-blue-50 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">{{ systemRoles.length }}</div>
                        <div class="text-sm text-muted-foreground">
                            {{ t('admin.rolesManagement.stats.system') }}
                        </div>
                    </div>
                    <div class="text-center p-3 bg-green-50 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">
                            {{ customRoles.length }}
                        </div>
                        <div class="text-sm text-muted-foreground">
                            {{ t('admin.rolesManagement.stats.custom') }}
                        </div>
                    </div>
                    <div class="text-center p-3 bg-orange-50 rounded-lg">
                        <div class="text-2xl font-bold text-orange-600">
                            {{ averagePermissions }}
                        </div>
                        <div class="text-sm text-muted-foreground">
                            {{ t('admin.rolesManagement.stats.avgPermissions') }}
                        </div>
                    </div>
                </div>

                <!-- Filters Row -->
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex gap-2">
                        <Select v-model="typeFilter" @update:model-value="applyFilters">
                            <SelectTrigger class="w-[150px]">
                                <SelectValue
                                    :placeholder="t('admin.rolesManagement.filters.allTypes')"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{{
                                    t('admin.rolesManagement.filters.allTypes')
                                }}</SelectItem>
                                <SelectItem value="system">{{
                                    t('admin.rolesManagement.filters.system')
                                }}</SelectItem>
                                <SelectItem value="custom">{{
                                    t('admin.rolesManagement.filters.custom')
                                }}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            v-model="searchQuery"
                            :placeholder="t('admin.rolesManagement.searchRoles')"
                            class="w-[250px]"
                            @input="applyFilters"
                        >
                            <template #prefix>
                                <Search class="h-4 w-4 text-muted-foreground" />
                            </template>
                        </Input>
                    </div>
                </div>

                <!-- Bulk Actions -->
                <div
                    v-if="selectedRoles.length > 0"
                    class="flex items-center gap-2 p-2 bg-muted rounded-md"
                >
                    <span class="text-sm text-muted-foreground">
                        {{ selectedRoles.length }} {{ t('admin.rolesManagement.bulk.selected') }}
                    </span>
                    <div class="flex gap-1">
                        <Button
                            variant="destructive"
                            size="sm"
                            @click="handleBulkDelete"
                            :disabled="loading || hasSystemRoleSelected"
                        >
                            {{ t('admin.rolesManagement.bulk.delete') }}
                        </Button>
                    </div>
                    <div v-if="hasSystemRoleSelected" class="flex items-center gap-2 ml-2">
                        <AlertTriangle class="h-4 w-4 text-amber-500" />
                        <span class="text-sm text-amber-600">
                            {{ t('admin.rolesManagement.bulk.systemRoleWarning') }}
                        </span>
                    </div>
                </div>
            </div>
        </Card>

        <!-- Data Table -->
        <Card>
            <DataTable
                :columns="columns"
                :data="filteredRoles"
                :loading="loading"
                :selection="selectedRoles"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                :empty-state="{
                    title: t('admin.rolesManagement.noRoles'),
                    description: t('admin.rolesManagement.noRolesDescription'),
                    action: {
                        label: t('admin.rolesManagement.createFirstRole'),
                        onClick: navigateToCreateRole,
                    },
                }"
            />
        </Card>

        <!-- Delete Confirmation Dialog -->
        <ConfirmDialog
            :open="isDeleteDialogOpen"
            :title="t('admin.rolesManagement.messages.deleteConfirmTitle')"
            :description="deleteConfirmationText"
            :confirmText="t('admin.rolesManagement.messages.deleteConfirmYes')"
            :cancelText="t('admin.rolesManagement.messages.deleteConfirmNo')"
            :loading="isDeleting"
            @confirm="confirmDelete"
            @cancel="closeDeleteDialog"
        />

        <!-- Role Form Dialog -->
        <RoleFormDialog
            :open="isFormDialogOpen"
            :role="roleToEdit"
            @update:open="closeFormDialog"
            @saved="handleRoleSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { createColumnHelper } from '@tanstack/vue-table'
import type { Role } from '@/types/role'

// Composables
import { useRoles, usePermissions } from '@/composables/useRoles'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

// Components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import RoleFormDialog from './RoleFormDialog.vue'

// Icons
import { Plus, Edit, Trash2, Shield, Users, Search, AlertTriangle, Eye } from 'lucide-vue-next'

// Composables
const router = useRouter()
const { success, error: errorToast } = useToast()
const {
    roles,
    loading,
    loadRoles,
    deleteRole,
    bulkDeleteRoles,
    systemRoles,
    customRoles,
    totalRoles,
} = useRoles()
const { getPermissionName } = usePermissions()
const { t } = useAppI18n()

// Component state
const isDeleteDialogOpen = ref(false)
const roleToDelete = ref<Role | null>(null)
const isDeleting = ref(false)
const selectedRoles = ref<string[]>([])

// Form dialog state
const isFormDialogOpen = ref(false)
const roleToEdit = ref<Role | null>(null)

// Filters
const typeFilter = ref('all')
const searchQuery = ref('')

// Filtered roles
const filteredRoles = computed(() => {
    let filtered = roles.value

    // Filter by type
    if (typeFilter.value && typeFilter.value !== 'all') {
        if (typeFilter.value === 'system') {
            filtered = filtered.filter((role) => role.is_system)
        } else if (typeFilter.value === 'custom') {
            filtered = filtered.filter((role) => !role.is_system)
        }
    }

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
            (role) =>
                role.name.toLowerCase().includes(query) ||
                role.description.toLowerCase().includes(query),
        )
    }

    return filtered
})

// Computed properties
const deleteConfirmationText = computed(() => {
    return roleToDelete.value
        ? t('admin.rolesManagement.messages.deleteConfirmMessage', {
              name: roleToDelete.value.name,
          })
        : t('common.confirmMessage')
})

const hasSystemRoleSelected = computed(() => {
    return selectedRoles.value.some((id) => {
        const role = roles.value.find((r) => r.id === id)
        return role?.is_system
    })
})

const averagePermissions = computed(() => {
    if (roles.value.length === 0) return 0
    const total = roles.value.reduce((sum, role) => sum + role.permissions.length, 0)
    return Math.round(total / roles.value.length)
})

// Column helper
const columnHelper = createColumnHelper<Role>()

// Helper functions
const formatPermissions = (permissions: string[]) => {
    if (permissions.length === 0) return 'No permissions'
    if (permissions.length <= 3) {
        return permissions.map((p) => getPermissionName(p)).join(', ')
    }
    return `${permissions
        .slice(0, 2)
        .map((p) => getPermissionName(p))
        .join(', ')} +${permissions.length - 2} more`
}

const getRoleIcon = (role: Role) => {
    if (role.is_system) return Shield
    return Users
}

const getRoleBadgeVariant = (role: Role) => {
    return role.is_system ? 'default' : 'secondary'
}

// Table columns
const columns = [
    columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => h('div', { class: 'font-mono text-sm' }, row.getValue('id')),
        size: 120,
    }),
    columnHelper.accessor('name', {
        header: () => t('admin.rolesManagement.table.name'),
        cell: ({ row }) => {
            const role = row.original
            const RoleIcon = getRoleIcon(role)
            return h('div', { class: 'flex items-center gap-2' }, [
                h(RoleIcon, { class: 'h-4 w-4 text-muted-foreground' }),
                h('div', { class: 'flex flex-col' }, [
                    h('span', { class: 'font-medium' }, role.name),
                    h(
                        'span',
                        { class: 'text-sm text-muted-foreground truncate max-w-[200px]' },
                        role.description,
                    ),
                ]),
            ])
        },
        size: 250,
    }),
    columnHelper.display({
        id: 'permissions',
        header: () => t('admin.rolesManagement.table.permissions'),
        cell: ({ row }) => {
            const role = row.original
            return h('div', { class: 'space-y-1' }, [
                h('div', { class: 'flex items-center gap-2' }, [
                    h(
                        Badge,
                        { variant: 'outline' },
                        () =>
                            `${role.permissions.length} ${t('admin.rolesManagement.table.permissionsCount')}`,
                    ),
                ]),
                h(
                    'div',
                    { class: 'text-xs text-muted-foreground truncate max-w-[200px]' },
                    formatPermissions(role.permissions),
                ),
            ])
        },
        size: 250,
    }),
    columnHelper.display({
        id: 'type',
        header: () => t('admin.rolesManagement.table.type'),
        cell: ({ row }) => {
            const role = row.original
            const variant = getRoleBadgeVariant(role)
            const label = role.is_system
                ? t('admin.rolesManagement.types.system')
                : t('admin.rolesManagement.types.custom')
            return h(Badge, { variant }, () => label)
        },
        size: 100,
    }),
    columnHelper.display({
        id: 'createdAt',
        header: () => t('admin.rolesManagement.table.createdAt'),
        cell: ({ row }) => {
            const role = row.original
            return h(
                'span',
                { class: 'text-sm' },
                new Date(role.created_at).toLocaleDateString('vi-VN'),
            )
        },
        size: 120,
    }),
    columnHelper.display({
        id: 'actions',
        header: () => t('admin.rolesManagement.table.actions'),
        cell: ({ row }) => {
            const role = row.original
            return h('div', { class: 'flex items-center gap-2' }, [
                h(
                    Button,
                    {
                        variant: 'ghost',
                        size: 'sm',
                        'aria-label': t('admin.rolesManagement.actions.view'),
                        onClick: () => navigateToViewRole(role),
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
                        'aria-label': t('admin.rolesManagement.actions.edit'),
                        onClick: () => navigateToEditRole(role),
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
                        'aria-label': t('admin.rolesManagement.actions.delete'),
                        onClick: () => openDeleteDialog(role),
                        disabled: role.is_system,
                        class: role.is_system
                            ? 'opacity-50 cursor-not-allowed'
                            : 'text-destructive hover:text-destructive',
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
const handleRowClick = (row: Role) => {
    console.log('Row clicked:', row)
}

const handleSelectionChange = (selection: string[]) => {
    selectedRoles.value = selection
}

// Filter methods
const applyFilters = () => {
    // Filters are applied automatically via computed property
}

const clearSelection = () => {
    selectedRoles.value = []
}

// Bulk operations
const handleBulkDelete = async () => {
    if (!confirm(t('admin.rolesManagement.bulk.deleteConfirm'))) {
        return
    }

    try {
        await bulkDeleteRoles(selectedRoles.value)
        success(t('admin.rolesManagement.bulk.deleteSuccess'), '')
        clearSelection()
        await loadRoles()
    } catch (err) {
        console.error('Bulk delete error:', err)
        errorToast(t('admin.rolesManagement.bulk.deleteError'), '')
    }
}

// Navigation methods
const navigateToCreateRole = () => {
    roleToEdit.value = null
    isFormDialogOpen.value = true
}

const navigateToEditRole = (role: Role) => {
    roleToEdit.value = role
    isFormDialogOpen.value = true
}

const navigateToViewRole = (role: Role) => {
    router.push(`/admin/roles/${role.id}`)
}

const closeFormDialog = () => {
    isFormDialogOpen.value = false
    roleToEdit.value = null
}

const handleRoleSaved = async () => {
    await loadRoles()
}

const openDeleteDialog = (role: Role) => {
    roleToDelete.value = role
    isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
    isDeleteDialogOpen.value = false
    roleToDelete.value = null
}

// CRUD operations
const confirmDelete = async () => {
    if (!roleToDelete.value) return

    isDeleting.value = true
    try {
        await deleteRole(roleToDelete.value.id)
        success(t('admin.rolesManagement.messages.deleteSuccess'), '')
        await loadRoles()
        closeDeleteDialog()
    } catch (err) {
        errorToast(
            t('common.error'),
            err instanceof Error ? err.message : t('admin.rolesManagement.messages.deleteError'),
        )
    } finally {
        isDeleting.value = false
    }
}

// Load data on mount
onMounted(async () => {
    await loadRoles()
})
</script>
