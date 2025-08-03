import { ref } from 'vue'
import type { Admin, AdminFormData, Role } from '@/types/admin'
import adminsData from '@/data/admins.json'
import rolesData from '@/data/roles.json'

class AdminService {
    private admins = ref<Admin[]>(adminsData as Admin[])
    private roles = ref<Role[]>(rolesData as Role[])

    async getAdmins(): Promise<Admin[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))
        return [...this.admins.value]
    }

    async getAdmin(id: string): Promise<Admin> {
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const admin = this.admins.value.find(a => a.id === id)
        if (!admin) {
            throw new Error('Admin not found')
        }
        return { ...admin }
    }

    async createAdmin(data: AdminFormData): Promise<Admin> {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check if email already exists
        const existingAdmin = this.admins.value.find(a => 
            a.email.toLowerCase() === data.email.toLowerCase()
        )
        if (existingAdmin) {
            throw new Error('Email already exists')
        }

        const newAdmin: Admin = {
            id: (Math.max(...this.admins.value.map(a => parseInt(a.id))) + 1).toString(),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: undefined
        }

        this.admins.value.unshift(newAdmin)
        return { ...newAdmin }
    }

    async updateAdmin(id: string, data: Partial<AdminFormData>): Promise<Admin> {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const index = this.admins.value.findIndex(a => a.id === id)
        if (index === -1) {
            throw new Error('Admin not found')
        }

        // Check if email is being changed and if it conflicts with existing
        if (data.email) {
            const existingAdmin = this.admins.value.find(a => 
                a.id !== id && a.email.toLowerCase() === data.email!.toLowerCase()
            )
            if (existingAdmin) {
                throw new Error('Email already exists')
            }
        }

        const updatedAdmin: Admin = {
            ...this.admins.value[index],
            ...data,
            updated_at: new Date().toISOString()
        }

        this.admins.value[index] = updatedAdmin
        return { ...updatedAdmin }
    }

    async deleteAdmin(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const index = this.admins.value.findIndex(a => a.id === id)
        if (index === -1) {
            throw new Error('Admin not found')
        }

        // Prevent deleting the last super admin
        const admin = this.admins.value[index]
        if (admin.role === 'super_admin') {
            const superAdminCount = this.admins.value.filter(a => a.role === 'super_admin').length
            if (superAdminCount <= 1) {
                throw new Error('Cannot delete the last super administrator')
            }
        }

        this.admins.value.splice(index, 1)
    }

    async bulkUpdateStatus(ids: string[], status: 'active' | 'banned' | 'temporarily_locked'): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        for (const id of ids) {
            const index = this.admins.value.findIndex(a => a.id === id)
            if (index !== -1) {
                // Prevent banning/locking all super admins
                const admin = this.admins.value[index]
                if (admin.role === 'super_admin' && status !== 'active') {
                    const activeSuperAdminCount = this.admins.value.filter(a => 
                        a.role === 'super_admin' && a.status === 'active' && a.id !== id
                    ).length
                    if (activeSuperAdminCount === 0) {
                        continue // Skip this admin to prevent locking all super admins
                    }
                }

                this.admins.value[index] = {
                    ...this.admins.value[index],
                    status,
                    updated_at: new Date().toISOString()
                }
            }
        }
    }

    async validateEmail(email: string, excludeId?: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const existingAdmin = this.admins.value.find(a => 
            a.id !== excludeId && a.email.toLowerCase() === email.toLowerCase()
        )
        return !existingAdmin
    }

    async getRoles(): Promise<Role[]> {
        await new Promise(resolve => setTimeout(resolve, 200))
        return [...this.roles.value]
    }
}

export const adminService = new AdminService()
export * from '@/types/admin'
