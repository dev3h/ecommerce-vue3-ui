import { ref } from 'vue'
import { adminService, type Admin, type AdminFormData, type Role } from '@/services/admin.service'

export function useAdmins() {
    const admins = ref<Admin[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const loadAdmins = async () => {
        try {
            loading.value = true
            error.value = null
            admins.value = await adminService.getAdmins()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load admins'
        } finally {
            loading.value = false
        }
    }

    const createAdmin = async (data: AdminFormData) => {
        try {
            loading.value = true
            error.value = null
            const newAdmin = await adminService.createAdmin(data)
            admins.value.unshift(newAdmin) // Add to beginning
            return newAdmin
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create admin'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateAdmin = async (id: string, data: Partial<AdminFormData>) => {
        try {
            loading.value = true
            error.value = null
            const updatedAdmin = await adminService.updateAdmin(id, data)
            const index = admins.value.findIndex((a) => a.id === id)
            if (index !== -1) {
                admins.value[index] = updatedAdmin
            }
            return updatedAdmin
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update admin'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteAdmin = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            await adminService.deleteAdmin(id)
            admins.value = admins.value.filter((a) => a.id !== id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete admin'
            throw err
        } finally {
            loading.value = false
        }
    }

    const getAdmin = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            return await adminService.getAdmin(id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to get admin'
            throw err
        } finally {
            loading.value = false
        }
    }

    const bulkUpdateStatus = async (ids: string[], status: 'active' | 'banned' | 'temporarily_locked') => {
        try {
            loading.value = true
            error.value = null
            await adminService.bulkUpdateStatus(ids, status)
            // Update local state
            for (const id of ids) {
                const index = admins.value.findIndex((a) => a.id === id)
                if (index !== -1) {
                    admins.value[index] = {
                        ...admins.value[index],
                        status,
                        updated_at: new Date().toISOString()
                    }
                }
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update admin status'
            throw err
        } finally {
            loading.value = false
        }
    }

    const validateEmail = async (email: string, excludeId?: string) => {
        try {
            return await adminService.validateEmail(email, excludeId)
        } catch (err) {
            console.error('Failed to validate email:', err)
            return false
        }
    }

    const getAdminById = (id: string): Admin | null => {
        return admins.value.find(admin => admin.id === id) || null
    }

    return {
        admins,
        loading,
        error,
        loadAdmins,
        createAdmin,
        updateAdmin,
        deleteAdmin,
        getAdmin,
        getAdminById,
        bulkUpdateStatus,
        validateEmail,
    }
}

export function useRoles() {
    const roles = ref<Role[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const loadRoles = async () => {
        try {
            loading.value = true
            error.value = null
            roles.value = await adminService.getRoles()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load roles'
        } finally {
            loading.value = false
        }
    }

    return {
        roles,
        loading,
        error,
        loadRoles,
    }
}
