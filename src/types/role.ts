export interface Permission {
    id: string
    name: string
    description: string
    module: string
    action: string
}

export interface Role {
    id: string
    name: string
    description: string
    permissions: string[] // Array of permission IDs
    is_system: boolean
    created_at: string
    updated_at: string
}

export interface RoleFormData {
    name: string
    description: string
    permissions: string[]
}

export type RoleStatus = 'active' | 'inactive'
