<template>
    <div class="container mx-auto px-4 py-6">
        <!-- Breadcrumb -->
        <div class="mb-6">
            <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                <button @click="goBack" class="hover:text-foreground">
                    {{ t('admin.rolesManagement.title') }}
                </button>
                <span>/</span>
                <span class="text-foreground">{{ role?.name || 'Loading...' }}</span>
            </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="text-center space-y-2">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p class="text-muted-foreground">{{ t('common.loading') }}</p>
            </div>
        </div>

        <div v-else-if="error" class="flex items-center justify-center py-12">
            <div class="text-center space-y-4">
                <div class="text-destructive">
                    <AlertCircle class="h-12 w-12 mx-auto mb-2" />
                    <h3 class="text-lg font-semibold">{{ t('common.error') }}</h3>
                    <p class="text-muted-foreground">{{ error }}</p>
                </div>
                <Button @click="loadRole" variant="outline">
                    {{ t('common.retry') }}
                </Button>
            </div>
        </div>

        <div v-else-if="role" class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <component :is="getRoleIcon(role)" class="h-8 w-8 text-muted-foreground" />
                        <div>
                            <h1 class="text-3xl font-bold">{{ role.name }}</h1>
                            <p class="text-muted-foreground">{{ role.description }}</p>
                        </div>
                    </div>
                    <Badge :variant="getRoleBadgeVariant(role)">
                        {{ role.is_system ? t('admin.rolesManagement.types.system') : t('admin.rolesManagement.types.custom') }}
                    </Badge>
                </div>

                <div class="flex items-center space-x-2">
                    <Button @click="handleEdit" variant="outline">
                        <Edit class="mr-2 h-4 w-4" />
                        {{ t('admin.rolesManagement.actions.edit') }}
                    </Button>
                    
                    <Button 
                        @click="handleDelete" 
                        variant="destructive"
                        :disabled="role.is_system"
                        v-if="!role.is_system"
                    >
                        <Trash2 class="mr-2 h-4 w-4" />
                        {{ t('admin.rolesManagement.actions.delete') }}
                    </Button>
                </div>
            </div>

            <!-- Basic Info -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center">
                        <Info class="mr-2 h-5 w-5" />
                        {{ t('admin.rolesManagement.detail.basicInfo') }}
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label class="text-sm font-medium text-muted-foreground">
                                {{ t('admin.rolesManagement.form.name') }}
                            </Label>
                            <p class="font-medium">{{ role.name }}</p>
                        </div>

                        <div>
                            <Label class="text-sm font-medium text-muted-foreground">
                                {{ t('admin.rolesManagement.table.type') }}
                            </Label>
                            <div class="flex items-center space-x-2">
                                <Badge :variant="getRoleBadgeVariant(role)">
                                    {{ role.is_system ? t('admin.rolesManagement.types.system') : t('admin.rolesManagement.types.custom') }}
                                </Badge>
                            </div>
                        </div>

                        <div class="md:col-span-2">
                            <Label class="text-sm font-medium text-muted-foreground">
                                {{ t('admin.rolesManagement.form.description') }}
                            </Label>
                            <p>{{ role.description }}</p>
                        </div>

                        <div>
                            <Label class="text-sm font-medium text-muted-foreground">
                                {{ t('admin.rolesManagement.table.createdAt') }}
                            </Label>
                            <p>{{ formatDate(role.created_at) }}</p>
                        </div>

                        <div>
                            <Label class="text-sm font-medium text-muted-foreground">
                                {{ t('admin.rolesManagement.table.updatedAt') }}
                            </Label>
                            <p>{{ formatDate(role.updated_at) }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Permissions -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center justify-between">
                        <div class="flex items-center">
                            <Shield class="mr-2 h-5 w-5" />
                            {{ t('admin.rolesManagement.detail.permissions') }}
                        </div>
                        <Badge variant="outline">
                            {{ role.permissions.length }} {{ t('admin.rolesManagement.table.permissionsCount') }}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div v-if="role.permissions.length === 0" class="text-center py-8 text-muted-foreground">
                        <Shield class="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>{{ t('admin.rolesManagement.detail.noPermissions') }}</p>
                    </div>

                    <div v-else class="space-y-6">
                        <!-- Permissions by Module -->
                        <div 
                            v-for="[module, modulePermissions] in groupedPermissions" 
                            :key="module"
                            class="space-y-3"
                        >
                            <div class="flex items-center space-x-2 pb-2 border-b">
                                <h4 class="font-semibold text-base">
                                    {{ t(`admin.permissions.modules.${module}`) }}
                                </h4>
                                <Badge variant="secondary" class="text-xs">
                                    {{ modulePermissions.length }}
                                </Badge>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div 
                                    v-for="permission in modulePermissions" 
                                    :key="permission.id"
                                    class="flex items-center space-x-3 p-3 rounded-lg border bg-card"
                                >
                                    <div class="flex-shrink-0">
                                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-medium text-sm">{{ permission.name }}</p>
                                        <p class="text-xs text-muted-foreground truncate">
                                            {{ permission.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- System Role Warning -->
            <Card v-if="role.is_system" class="border-amber-200 bg-amber-50">
                <CardContent class="pt-6">
                    <div class="flex items-start space-x-3">
                        <AlertTriangle class="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 class="font-semibold text-amber-800">
                                {{ t('admin.rolesManagement.detail.systemRoleWarning') }}
                            </h4>
                            <p class="text-sm text-amber-700 mt-1">
                                {{ t('admin.rolesManagement.detail.systemRoleDescription') }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

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
            :role="role"
            @update:open="closeFormDialog"
            @saved="handleRoleSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Role, Permission } from '@/types/role'

// Composables
import { useRoles, usePermissions } from '@/composables/useRoles'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

// Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Badge from '@/components/ui/badge/Badge.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import RoleFormDialog from '@/components/admin/roles/RoleFormDialog.vue'

// Icons
import { 
    Edit, 
    Trash2, 
    Shield, 
    Users, 
    Info, 
    AlertCircle, 
    AlertTriangle
} from 'lucide-vue-next'

// Composables
const route = useRoute()
const router = useRouter()
const { success, error: errorToast } = useToast()
const { t } = useAppI18n()
const { 
    roles,
    loading, 
    error,
    deleteRole, 
    loadRoles 
} = useRoles()
const { permissions } = usePermissions()

// Component state
const role = ref<Role | null>(null)
const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)
const isFormDialogOpen = ref(false)

// Computed properties
const deleteConfirmationText = computed(() => {
    return role.value
        ? t('admin.rolesManagement.messages.deleteConfirmMessage', { name: role.value.name })
        : t('common.confirmMessage')
})

const groupedPermissions = computed(() => {
    if (!role.value || !permissions.value) return new Map()
    
    const rolePermissions = permissions.value.filter(p => 
        role.value!.permissions.includes(p.id)
    )
    
    const grouped = new Map<string, Permission[]>()
    
    for (const permission of rolePermissions) {
        if (!grouped.has(permission.module)) {
            grouped.set(permission.module, [])
        }
        grouped.get(permission.module)!.push(permission)
    }
    
    return grouped
})

// Helper functions
const getRoleIcon = (role: Role) => {
    return role.is_system ? Shield : Users
}

const getRoleBadgeVariant = (role: Role) => {
    return role.is_system ? 'default' : 'secondary'
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Load role data
const loadRole = async () => {
    const roleId = route.params.id as string
    
    if (!roleId) {
        router.push('/admin/roles')
        return
    }

    try {
        await loadRoles()
        const foundRole = roles.value.find(r => r.id === roleId)
        
        if (!foundRole) {
            errorToast(t('common.error'), t('admin.rolesManagement.messages.roleNotFound'))
            router.push('/admin/roles')
            return
        }
        
        role.value = foundRole
    } catch (err) {
        console.error('Error loading role:', err)
        errorToast(t('common.error'), t('admin.rolesManagement.messages.loadError'))
    }
}

// Event handlers
const goBack = () => {
    router.push('/admin/roles')
}

const handleEdit = () => {
    isFormDialogOpen.value = true
}

const handleDelete = () => {
    isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
    isDeleteDialogOpen.value = false
}

const closeFormDialog = () => {
    isFormDialogOpen.value = false
}

const handleRoleSaved = async () => {
    await loadRole()
}

const confirmDelete = async () => {
    if (!role.value) return

    isDeleting.value = true
    try {
        await deleteRole(role.value.id)
        success(t('admin.rolesManagement.messages.deleteSuccess'), '')
        router.push('/admin/roles')
    } catch (err) {
        errorToast(
            t('common.error'),
            err instanceof Error ? err.message : t('admin.rolesManagement.messages.deleteError'),
        )
    } finally {
        isDeleting.value = false
        closeDeleteDialog()
    }
}

// Load data on mount
onMounted(async () => {
    await loadRole()
})
</script>
