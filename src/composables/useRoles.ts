import { ref, computed } from 'vue'
import { roleService, type Role, type RoleFormData, type Permission } from '@/services/role.service'

export function useRoles() {
    const roles = ref<Role[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const loadRoles = async () => {
        try {
            loading.value = true
            error.value = null
            roles.value = await roleService.getRoles()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load roles'
        } finally {
            loading.value = false
        }
    }

    const createRole = async (data: RoleFormData) => {
        try {
            loading.value = true
            error.value = null
            const newRole = await roleService.createRole(data)
            roles.value.unshift(newRole)
            return newRole
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create role'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateRole = async (id: string, data: Partial<RoleFormData>) => {
        try {
            loading.value = true
            error.value = null
            const updatedRole = await roleService.updateRole(id, data)
            const index = roles.value.findIndex((r) => r.id === id)
            if (index !== -1) {
                roles.value[index] = updatedRole
            }
            return updatedRole
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update role'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteRole = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            await roleService.deleteRole(id)
            roles.value = roles.value.filter((r) => r.id !== id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete role'
            throw err
        } finally {
            loading.value = false
        }
    }

    const getRole = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            return await roleService.getRole(id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to get role'
            throw err
        } finally {
            loading.value = false
        }
    }

    const getRoleById = (id: string): Role | null => {
        return roles.value.find((role) => role.id === id) || null
    }

    const bulkDeleteRoles = async (ids: string[]) => {
        try {
            loading.value = true
            error.value = null
            await roleService.bulkDeleteRoles(ids)
            roles.value = roles.value.filter((r) => !ids.includes(r.id))
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete roles'
            throw err
        } finally {
            loading.value = false
        }
    }

    const validateRoleName = async (name: string, excludeId?: string) => {
        try {
            return await roleService.validateRoleName(name, excludeId)
        } catch (err) {
            console.error('Failed to validate role name:', err)
            return false
        }
    }

    // Computed properties
    const systemRoles = computed(() => roles.value.filter((r) => r.is_system))
    const customRoles = computed(() => roles.value.filter((r) => !r.is_system))
    const totalRoles = computed(() => roles.value.length)

    return {
        roles,
        loading,
        error,
        loadRoles,
        createRole,
        updateRole,
        deleteRole,
        getRole,
        getRoleById,
        bulkDeleteRoles,
        validateRoleName,
        systemRoles,
        customRoles,
        totalRoles,
    }
}

export function usePermissions() {
    const permissions = ref<Permission[]>([])
    const groupedPermissions = ref<Record<string, Permission[]>>({})
    const loading = ref(false)
    const error = ref<string | null>(null)

    const loadPermissions = async () => {
        try {
            loading.value = true
            error.value = null
            permissions.value = await roleService.getPermissions()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load permissions'
        } finally {
            loading.value = false
        }
    }

    const loadGroupedPermissions = async () => {
        try {
            loading.value = true
            error.value = null
            groupedPermissions.value = await roleService.getGroupedPermissions()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load grouped permissions'
        } finally {
            loading.value = false
        }
    }

    // Get permission name by ID
    const getPermissionName = (id: string): string => {
        const permission = permissions.value.find((p) => p.id === id)
        return permission?.name || id
    }

    // Get permissions by module
    const getPermissionsByModule = (module: string): Permission[] => {
        return permissions.value.filter((p) => p.module === module)
    }

    // Computed properties
    const permissionModules = computed(() => {
        const modules = new Set(permissions.value.map((p) => p.module))
        return Array.from(modules).sort()
    })

    const totalPermissions = computed(() => permissions.value.length)

    return {
        permissions,
        groupedPermissions,
        loading,
        error,
        loadPermissions,
        loadGroupedPermissions,
        getPermissionName,
        getPermissionsByModule,
        permissionModules,
        totalPermissions,
    }
}

export function useRoleStats() {
    const stats = ref<{
        total: number
        system: number
        custom: number
        avgPermissions: number
    }>({
        total: 0,
        system: 0,
        custom: 0,
        avgPermissions: 0,
    })
    const loading = ref(false)
    const error = ref<string | null>(null)

    const loadStats = async () => {
        try {
            loading.value = true
            error.value = null
            stats.value = await roleService.getRoleStats()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load role stats'
        } finally {
            loading.value = false
        }
    }

    return {
        stats,
        loading,
        error,
        loadStats,
    }
}
