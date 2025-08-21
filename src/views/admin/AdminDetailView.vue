<template>
    <div class="container mx-auto p-6 space-y-6">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <router-link to="/admin/admins" class="hover:text-foreground">
                {{ t('admin.adminsManagement.title') }}
            </router-link>
            <ChevronRight class="h-4 w-4" />
            <span class="text-foreground">{{ admin?.name || adminId }}</span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p class="mt-2 text-muted-foreground">{{ t('common.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
            <AlertCircle class="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 class="text-2xl font-bold text-destructive mb-2">
                {{ t('admin.adminsManagement.detail.notFound') }}
            </h2>
            <p class="text-muted-foreground mb-4">{{ error }}</p>
            <Button @click="router.push('/admin/admins')">
                {{ t('admin.adminsManagement.detail.backToList') }}
            </Button>
        </div>

        <!-- Content -->
        <div v-else-if="admin" class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col lg:flex-row gap-4 justify-between">
                <div class="flex items-center gap-4">
                    <div
                        class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
                    >
                        <component :is="getRoleIcon(admin.role)" class="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 class="text-3xl font-bold">{{ admin.name }}</h1>
                        <p class="text-muted-foreground">{{ admin.email }}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <Badge :variant="getStatusBadgeVariant(admin.status)">
                                {{ t(`admin.adminsManagement.status.${admin.status}`) }}
                            </Badge>
                            <Badge variant="outline">
                                {{ t(`admin.adminsManagement.roles.${admin.role}`) }}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button @click="openEditDialog" :disabled="loading">
                        <Edit class="mr-2 h-4 w-4" />
                        {{ t('admin.adminsManagement.actions.edit') }}
                    </Button>
                    <Button variant="outline" @click="router.push('/admin/admins')">
                        {{ t('admin.adminsManagement.detail.backToList') }}
                    </Button>
                </div>
            </div>

            <!-- Admin Details -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Basic Information -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <User class="h-5 w-5" />
                            {{ t('admin.adminsManagement.detail.basicInfo') }}
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <Label class="text-sm font-medium text-muted-foreground">
                                    {{ t('admin.adminsManagement.form.name') }}
                                </Label>
                                <p class="mt-1">{{ admin.name }}</p>
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-muted-foreground">
                                    {{ t('admin.adminsManagement.form.email') }}
                                </Label>
                                <p class="mt-1">{{ admin.email }}</p>
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-muted-foreground">
                                    {{ t('admin.adminsManagement.form.role') }}
                                </Label>
                                <div class="mt-1 flex items-center gap-2">
                                    <component :is="getRoleIcon(admin.role)" class="h-4 w-4" />
                                    {{ t(`admin.adminsManagement.roles.${admin.role}`) }}
                                </div>
                            </div>
                            <div>
                                <Label class="text-sm font-medium text-muted-foreground">
                                    {{ t('admin.adminsManagement.form.status') }}
                                </Label>
                                <div class="mt-1">
                                    <Badge :variant="getStatusBadgeVariant(admin.status)">
                                        {{ t(`admin.adminsManagement.status.${admin.status}`) }}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Activity Information -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Clock class="h-5 w-5" />
                            {{ t('admin.adminsManagement.detail.activityInfo') }}
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div>
                            <Label class="text-sm font-medium text-muted-foreground">
                                {{ t('admin.adminsManagement.detail.lastLogin') }}
                            </Label>
                            <p class="mt-1">
                                {{
                                    admin.last_login
                                        ? formatDate(admin.last_login)
                                        : t('admin.adminsManagement.detail.neverLoggedIn')
                                }}
                            </p>
                        </div>
                        <div>
                            <Label class="text-sm font-medium text-muted-foreground">
                                {{ t('admin.adminsManagement.detail.createdAt') }}
                            </Label>
                            <p class="mt-1">{{ formatDate(admin.created_at) }}</p>
                        </div>
                        <div>
                            <Label class="text-sm font-medium text-muted-foreground">
                                {{ t('admin.adminsManagement.detail.updatedAt') }}
                            </Label>
                            <p class="mt-1">{{ formatDate(admin.updated_at) }}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Role Permissions (if available) -->
            <Card v-if="rolePermissions">
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Shield class="h-5 w-5" />
                        {{ t('admin.adminsManagement.detail.permissions') }}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                            v-for="permission in rolePermissions"
                            :key="permission"
                            class="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                        >
                            <Check class="h-4 w-4 text-green-600" />
                            <span class="text-sm">{{ permission }}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Admin Form Dialog -->
        <AdminFormDialog
            :open="isFormDialogOpen"
            :admin="admin"
            @update:open="closeFormDialog"
            @saved="handleAdminSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Admin } from '@/types/admin'

// Composables
import { useAdmins } from '@/composables/useAdmins'
import { useAppI18n } from '@/composables/useI18n'

// Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Badge from '@/components/ui/badge/Badge.vue'
import AdminFormDialog from '@/components/admin/admins/AdminFormDialog.vue'

// Icons
import { User, Edit, Clock, Shield, ChevronRight, AlertCircle, Check } from 'lucide-vue-next'

// Router
const route = useRoute()
const router = useRouter()

// Composables
const { admins, loading, loadAdmins, getAdminById } = useAdmins()
const { t } = useAppI18n()

// Component state
const admin = ref<Admin | null>(null)
const error = ref<string | null>(null)
const isFormDialogOpen = ref(false)

// Get admin ID from route
const adminId = computed(() => route.params.id as string)

// Role permissions mapping (could be moved to a service)
const rolePermissionsMap = {
    super_admin: [
        'Manage all admins',
        'Manage all products',
        'Manage all categories',
        'Manage all orders',
        'Manage all customers',
        'View all reports',
        'System configuration',
    ],
    manager: [
        'Manage products',
        'Manage categories',
        'Manage orders',
        'View customers',
        'View reports',
    ],
    staff: ['View products', 'Process orders', 'View customers'],
}

const rolePermissions = computed(() => {
    if (!admin.value) return null
    return rolePermissionsMap[admin.value.role as keyof typeof rolePermissionsMap] || []
})

// Helper functions
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
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

// Load admin data
const loadAdminData = async () => {
    if (!adminId.value) {
        error.value = t('admin.adminsManagement.detail.invalidId')
        return
    }

    try {
        error.value = null

        // If admins are not loaded yet, load them first
        if (admins.value.length === 0) {
            await loadAdmins()
        }

        // Find the admin
        const foundAdmin = getAdminById(adminId.value)
        if (foundAdmin) {
            admin.value = foundAdmin
        } else {
            error.value = t('admin.adminsManagement.detail.notFound')
        }
    } catch (err) {
        console.error('Load admin error:', err)
        error.value = err instanceof Error ? err.message : t('common.error')
    }
}

// Event handlers
const openEditDialog = () => {
    isFormDialogOpen.value = true
}

const closeFormDialog = () => {
    isFormDialogOpen.value = false
}

const handleAdminSaved = async () => {
    await loadAdminData() // Reload admin data to reflect changes
}

// Watch for route changes
watch(() => adminId.value, loadAdminData, { immediate: true })

// Load data on mount
onMounted(loadAdminData)
</script>
