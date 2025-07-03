import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
    role: 'user' | 'admin'
    createdAt: string
    phone?: string
    dateOfBirth?: string
}

export interface AuthState {
    user: User | null
    token: string | null
    refreshToken: string | null
    expiresAt: number | null
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
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

    // Actions
    const login = async (email: string, password: string, rememberMe = false) => {
        isLoading.value = true
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Mock authentication - check against stored users
            const users = getStoredUsers()
            const foundUser = users.find((u: any) => u.email === email && u.password === password)

            if (!foundUser) {
                throw new Error('Invalid email or password')
            }

            // Create auth data
            const authUser: User = {
                id: foundUser.id,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                avatar: foundUser.avatar,
                role: foundUser.role ?? 'user',
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

            // Store in localStorage
            saveAuthToStorage({
                user: authUser,
                token: mockToken,
                refreshToken: mockRefreshToken,
                expiresAt: expiryTime,
            })

            return authUser
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const register = async (userData: {
        firstName: string
        lastName: string
        email: string
        password: string
    }) => {
        isLoading.value = true
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Check if user already exists
            const users = getStoredUsers()
            if (users.find((u: any) => u.email === userData.email)) {
                throw new Error('User with this email already exists')
            }

            // Create new user
            const newUser = {
                id: generateId(),
                email: userData.email,
                password: userData.password, // In real app, this would be hashed
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: 'user' as const,
                createdAt: new Date().toISOString(),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.firstName}`,
            }

            // Save to storage
            users.push(newUser)
            saveUsersToStorage(users)

            return {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                createdAt: newUser.createdAt,
                avatar: newUser.avatar,
            }
        } catch (error) {
            console.error('Registration failed:', error)
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

        // Clear localStorage
        localStorage.removeItem('auth')
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
            const currentAuth = JSON.parse(localStorage.getItem('auth') ?? '{}')
            saveAuthToStorage({
                ...currentAuth,
                token: newToken,
                expiresAt: newExpiryTime,
            })

            return true
        } catch (error) {
            console.error('Failed to refresh auth:', error)
            logout()
            return false
        }
    }

    const initializeAuth = () => {
        try {
            const storedAuth = localStorage.getItem('auth')
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
            console.error('Failed to initialize auth:', error)
            logout()
        }
    }

    const updateProfile = async (updateData: Partial<User>) => {
        if (!user.value) throw new Error('User not authenticated')

        isLoading.value = true
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const updatedUser = { ...user.value, ...updateData }
            user.value = updatedUser

            // Update in storage
            const currentAuth = JSON.parse(localStorage.getItem('auth') ?? '{}')
            saveAuthToStorage({
                ...currentAuth,
                user: updatedUser,
            })

            // Update in users list
            const users = getStoredUsers()
            const userIndex = users.findIndex((u: any) => u.id === user.value?.id)
            if (userIndex >= 0) {
                users[userIndex] = { ...users[userIndex], ...updateData }
                saveUsersToStorage(users)
            }

            return updatedUser
        } finally {
            isLoading.value = false
        }
    }

    const updateUserProfile = async (profileData: {
        firstName: string
        lastName: string
        email: string
        phone?: string
        dateOfBirth?: string
    }) => {
        if (!user.value) return

        // Update user object
        user.value = {
            ...user.value,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            phone: profileData.phone,
            dateOfBirth: profileData.dateOfBirth,
        }

        // Update in localStorage
        const currentAuth = JSON.parse(localStorage.getItem('auth') ?? '{}')
        if (currentAuth) {
            currentAuth.user = user.value
            localStorage.setItem('auth', JSON.stringify(currentAuth))
        }

        // Update in users storage
        const users = getStoredUsers()
        const userIndex = users.findIndex((u: any) => u.id === user.value?.id)
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                ...user.value,
            }
            saveUsersToStorage(users)
        }
    }

    return {
        // State
        user,
        token,
        isLoading,

        // Getters
        isAuthenticated,
        isAdmin,
        timeUntilExpiry,

        // Actions
        login,
        register,
        logout,
        refreshAuth,
        initializeAuth,
        updateProfile,
        updateUserProfile,
    }
})

// Helper functions
function generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now()
}

function generateId(): string {
    return 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now()
}

function saveAuthToStorage(authData: AuthState) {
    localStorage.setItem('auth', JSON.stringify(authData))
}

function getStoredUsers() {
    try {
        const stored = localStorage.getItem('users')
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

function saveUsersToStorage(users: any[]) {
    localStorage.setItem('users', JSON.stringify(users))
}

// Initialize with some mock users for testing
const initializeMockUsers = () => {
    const existingUsers = getStoredUsers()
    if (existingUsers.length === 0) {
        const mockUsers = [
            {
                id: 'admin_001',
                email: 'admin@nestgrocer.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                createdAt: new Date().toISOString(),
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            },
            {
                id: 'user_001',
                email: 'user@example.com',
                password: 'user123',
                firstName: 'John',
                lastName: 'Doe',
                role: 'user',
                createdAt: new Date().toISOString(),
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            },
        ]
        saveUsersToStorage(mockUsers)
    }
}

// Initialize mock users
initializeMockUsers()
