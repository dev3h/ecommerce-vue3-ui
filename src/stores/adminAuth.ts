import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AdminUser {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
    role: 'admin'
    createdAt: string
    phone?: string
    dateOfBirth?: string
}

export interface AdminAuthState {
    user: AdminUser | null
    token: string | null
    refreshToken: string | null
    expiresAt: number | null
}

export const useAdminAuthStore = defineStore('adminAuth', () => {
    // State
    const user = ref<AdminUser | null>(null)
    const token = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const expiresAt = ref<number | null>(null)
    const isLoading = ref(false)

    // Getters
    const isAuthenticated = computed(() => {
        if (!token.value || !expiresAt.value) return false
        return Date.now() < expiresAt.value
    })

    const isAdmin = computed(() => {
        return user.value?.role === 'admin'
    })

    const timeUntilExpiry = computed(() => {
        if (!expiresAt.value) return 0
        return Math.max(0, expiresAt.value - Date.now())
    })

    // Storage key specific to admin
    const ADMIN_AUTH_KEY = 'adminAuth'

    // Helper functions
    const generateMockToken = () => {
        return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36))
    }

    const saveAuthToStorage = (authData: AdminAuthState) => {
        localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(authData))
    }

    const getStoredUsers = () => {
        try {
            const users = localStorage.getItem('users')
            return users ? JSON.parse(users) : []
        } catch {
            return []
        }
    }

    // Actions
    const login = async (email: string, password: string, rememberMe = false) => {
        isLoading.value = true
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Mock authentication - check against stored users (only admin users)
            const users = getStoredUsers()
            const foundUser = users.find(
                (u: any) => u.email === email && u.password === password && u.role === 'admin',
            )

            if (!foundUser) {
                throw new Error('Invalid admin credentials or insufficient permissions')
            }

            // Create auth data
            const authUser: AdminUser = {
                id: foundUser.id,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                avatar: foundUser.avatar,
                role: 'admin',
                createdAt: foundUser.createdAt,
            }

            const mockToken = generateMockToken()
            const mockRefreshToken = generateMockToken()
            const expiryDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 1 day
            const expiryTime = Date.now() + expiryDuration

            // Set state
            user.value = authUser
            token.value = mockToken
            refreshToken.value = mockRefreshToken
            expiresAt.value = expiryTime

            // Store in localStorage with admin-specific key
            saveAuthToStorage({
                user: authUser,
                token: mockToken,
                refreshToken: mockRefreshToken,
                expiresAt: expiryTime,
            })

            return authUser
        } catch (error) {
            console.error('Admin login failed:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        refreshToken.value = null
        expiresAt.value = null

        // Clear admin localStorage
        localStorage.removeItem(ADMIN_AUTH_KEY)
    }

    const refreshAuth = async () => {
        if (!refreshToken.value) {
            logout()
            return false
        }

        try {
            // Simulate refresh token API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const newToken = generateMockToken()
            const newExpiryTime = Date.now() + 24 * 60 * 60 * 1000 // 1 day

            token.value = newToken
            expiresAt.value = newExpiryTime

            // Update localStorage
            const currentAuth = JSON.parse(localStorage.getItem(ADMIN_AUTH_KEY) ?? '{}')
            saveAuthToStorage({
                ...currentAuth,
                token: newToken,
                expiresAt: newExpiryTime,
            })

            return true
        } catch (error) {
            console.error('Failed to refresh admin auth:', error)
            logout()
            return false
        }
    }

    const initializeAuth = () => {
        try {
            const storedAuth = localStorage.getItem(ADMIN_AUTH_KEY)
            if (storedAuth) {
                const authData = JSON.parse(storedAuth)

                // Check if token is still valid
                if (authData.expiresAt && Date.now() < authData.expiresAt) {
                    user.value = authData.user
                    token.value = authData.token
                    refreshToken.value = authData.refreshToken
                    expiresAt.value = authData.expiresAt
                } else {
                    // Token expired, try to refresh
                    refreshToken.value = authData.refreshToken
                    refreshAuth()
                }
            }
        } catch (error) {
            console.error('Failed to initialize admin auth:', error)
            logout()
        }
    }

    const updateProfile = async (updateData: Partial<AdminUser>) => {
        if (!user.value) throw new Error('Admin not authenticated')

        isLoading.value = true
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const updatedUser = { ...user.value, ...updateData }
            user.value = updatedUser

            // Update in storage
            const currentAuth = JSON.parse(localStorage.getItem(ADMIN_AUTH_KEY) ?? '{}')
            saveAuthToStorage({
                ...currentAuth,
                user: updatedUser,
            })

            // Update in users list
            const users = getStoredUsers()
            const userIndex = users.findIndex((u: any) => u.id === user.value?.id)
            if (userIndex >= 0) {
                users[userIndex] = { ...users[userIndex], ...updateData }
                localStorage.setItem('users', JSON.stringify(users))
            }

            return updatedUser
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        user,
        token,
        refreshToken,
        expiresAt,
        isLoading,

        // Getters
        isAuthenticated,
        isAdmin,
        timeUntilExpiry,

        // Actions
        login,
        logout,
        refreshAuth,
        initializeAuth,
        updateProfile,
    }
})
