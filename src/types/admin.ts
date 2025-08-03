export interface Admin {
    id: string
    name: string
    email: string
    status: 'active' | 'banned' | 'temporarily_locked'
    role: string
    created_at: string
    updated_at: string
    last_login?: string
}

export interface AdminFormData {
    name: string
    email: string
    status: 'active' | 'banned' | 'temporarily_locked'
    role: string
}

export interface Role {
    id: string
    name: string
    display_name: string
    description: string
    permissions: string[]
}

export type AdminStatus = 'active' | 'banned' | 'temporarily_locked'
