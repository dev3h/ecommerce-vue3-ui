import type { Role, RoleFormData, Permission } from '@/types/role'

// Import mock data
import rolesData from '@/data/roles.json'
import permissionsData from '@/data/permissions.json'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class RoleService {
    private roles: Role[] = [...rolesData]
    private permissions: Permission[] = [...permissionsData]

    // Get all roles
    async getRoles(): Promise<Role[]> {
        await delay(300)
        return [...this.roles]
    }

    // Get all permissions
    async getPermissions(): Promise<Permission[]> {
        await delay(200)
        return [...this.permissions]
    }

    // Get permissions grouped by module
    async getGroupedPermissions(): Promise<Record<string, Permission[]>> {
        await delay(200)
        const grouped: Record<string, Permission[]> = {}

        this.permissions.forEach((permission) => {
            if (!grouped[permission.module]) {
                grouped[permission.module] = []
            }
            grouped[permission.module].push(permission)
        })

        return grouped
    }

    // Get role by ID
    async getRole(id: string): Promise<Role> {
        await delay(200)
        const role = this.roles.find((r) => r.id === id)
        if (!role) {
            throw new Error(`Role with ID ${id} not found`)
        }
        return { ...role }
    }

    // Create new role
    async createRole(data: RoleFormData): Promise<Role> {
        await delay(500)

        // Validate required fields
        if (!data.name.trim()) {
            throw new Error('Role name is required')
        }

        if (!data.description.trim()) {
            throw new Error('Role description is required')
        }

        // Check if role name already exists
        const existingRole = this.roles.find(
            (r) => r.name.toLowerCase() === data.name.toLowerCase(),
        )
        if (existingRole) {
            throw new Error('Role name already exists')
        }

        // Validate permissions
        if (!data.permissions || data.permissions.length === 0) {
            throw new Error('At least one permission is required')
        }

        // Validate permission IDs exist
        const invalidPermissions = data.permissions.filter(
            (permId) => !this.permissions.find((p) => p.id === permId),
        )
        if (invalidPermissions.length > 0) {
            throw new Error(`Invalid permissions: ${invalidPermissions.join(', ')}`)
        }

        const newRole: Role = {
            id: `role-${Date.now()}`,
            name: data.name.trim(),
            description: data.description.trim(),
            permissions: [...data.permissions],
            is_system: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        this.roles.unshift(newRole)
        return { ...newRole }
    }

    // Update role
    async updateRole(id: string, data: Partial<RoleFormData>): Promise<Role> {
        await delay(500)

        const roleIndex = this.roles.findIndex((r) => r.id === id)
        if (roleIndex === -1) {
            throw new Error(`Role with ID ${id} not found`)
        }

        const existingRole = this.roles[roleIndex]

        // Prevent updating system roles' core properties
        if (existingRole.is_system && (data.name || data.permissions)) {
            throw new Error('Cannot modify system role name or permissions')
        }

        // Validate name uniqueness (if name is being updated)
        if (data.name && data.name !== existingRole.name) {
            const duplicateRole = this.roles.find(
                (r) => r.id !== id && r.name.toLowerCase() === data.name.toLowerCase(),
            )
            if (duplicateRole) {
                throw new Error('Role name already exists')
            }
        }

        // Validate permissions if provided
        if (data.permissions) {
            if (data.permissions.length === 0) {
                throw new Error('At least one permission is required')
            }

            const invalidPermissions = data.permissions.filter(
                (permId) => !this.permissions.find((p) => p.id === permId),
            )
            if (invalidPermissions.length > 0) {
                throw new Error(`Invalid permissions: ${invalidPermissions.join(', ')}`)
            }
        }

        const updatedRole: Role = {
            ...existingRole,
            ...(data.name && { name: data.name.trim() }),
            ...(data.description && { description: data.description.trim() }),
            ...(data.permissions && { permissions: [...data.permissions] }),
            updated_at: new Date().toISOString(),
        }

        this.roles[roleIndex] = updatedRole
        return { ...updatedRole }
    }

    // Delete role
    async deleteRole(id: string): Promise<void> {
        await delay(400)

        const roleIndex = this.roles.findIndex((r) => r.id === id)
        if (roleIndex === -1) {
            throw new Error(`Role with ID ${id} not found`)
        }

        const role = this.roles[roleIndex]

        // Prevent deleting system roles
        if (role.is_system) {
            throw new Error('Cannot delete system role')
        }

        // Check if role is being used (in real app, you'd check admin assignments)
        // For now, we'll allow deletion of non-system roles

        this.roles.splice(roleIndex, 1)
    }

    // Bulk delete roles
    async bulkDeleteRoles(ids: string[]): Promise<void> {
        await delay(600)

        const systemRoles = this.roles.filter((r) => ids.includes(r.id) && r.is_system)
        if (systemRoles.length > 0) {
            throw new Error('Cannot delete system roles')
        }

        this.roles = this.roles.filter((r) => !ids.includes(r.id))
    }

    // Validate role name uniqueness
    async validateRoleName(name: string, excludeId?: string): Promise<boolean> {
        await delay(200)

        const existingRole = this.roles.find(
            (r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== excludeId,
        )

        return !existingRole
    }

    // Get role statistics
    async getRoleStats(): Promise<{
        total: number
        system: number
        custom: number
        avgPermissions: number
    }> {
        await delay(300)

        const total = this.roles.length
        const system = this.roles.filter((r) => r.is_system).length
        const custom = total - system
        const avgPermissions =
            total > 0
                ? Math.round(this.roles.reduce((sum, r) => sum + r.permissions.length, 0) / total)
                : 0

        return { total, system, custom, avgPermissions }
    }
}

export const roleService = new RoleService()
export { type Role, type RoleFormData, type Permission }
