import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface Address {
    id: string
    firstName: string
    lastName: string
    company?: string
    address: string
    apartment?: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
    isDefault: boolean
    createdAt: string
    updatedAt: string
}

export const useAddressStore = defineStore('addresses', () => {
    // State
    const addresses = ref<Address[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Get current user ID from auth store
    const getCurrentUserId = () => {
        const authStore = useAuthStore()
        return authStore.user?.id ?? 'guest'
    }

    // Helper functions for localStorage
    const getStorageKey = (userId: string) => `addresses_${userId}`

    const loadFromStorage = (userId: string): Address[] => {
        try {
            const stored = localStorage.getItem(getStorageKey(userId))
            return stored ? JSON.parse(stored) : []
        } catch (error) {
            console.error('Error loading addresses from localStorage:', error)
            return []
        }
    }

    const saveToStorage = (userId: string, data: Address[]) => {
        try {
            localStorage.setItem(getStorageKey(userId), JSON.stringify(data))
        } catch (error) {
            console.error('Error saving addresses to localStorage:', error)
        }
    }

    // Getters
    const defaultAddress = computed(() => addresses.value.find((addr) => addr.isDefault))
    const sortedAddresses = computed(() =>
        [...addresses.value].sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1
            if (!a.isDefault && b.isDefault) return 1
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        }),
    )

    // Actions
    const loadAddresses = async (userId?: string) => {
        const currentUserId = userId ?? getCurrentUserId()
        isLoading.value = true
        error.value = null

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))

            // Load from localStorage
            const storedAddresses = loadFromStorage(currentUserId)
            addresses.value = storedAddresses

            console.log(
                'Addresses loaded for user:',
                currentUserId,
                'count:',
                addresses.value.length,
            )
        } catch (err) {
            error.value = 'Failed to load addresses'
            console.error('Error loading addresses:', err)
        } finally {
            isLoading.value = false
        }
    }

    const createAddress = async (
        addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>,
        userId?: string,
    ) => {
        const currentUserId = userId ?? getCurrentUserId()
        isLoading.value = true
        error.value = null

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))

            const newAddress: Address = {
                ...addressData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            // If this is the first address or explicitly set as default, make it default
            const isFirstAddress = addresses.value.length === 0
            if (isFirstAddress || newAddress.isDefault) {
                // Remove default from all existing addresses
                addresses.value.forEach((addr) => {
                    addr.isDefault = false
                })
                newAddress.isDefault = true
            }

            addresses.value.push(newAddress)
            saveToStorage(currentUserId, addresses.value)

            console.log(
                'Address created for user:',
                currentUserId,
                'total addresses:',
                addresses.value.length,
            )
            return newAddress
        } catch (err) {
            error.value = 'Failed to create address'
            console.error('Error creating address:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateAddress = async (
        id: string,
        addressData: Partial<Omit<Address, 'id' | 'createdAt'>>,
        userId?: string,
    ) => {
        const currentUserId = userId ?? getCurrentUserId()
        isLoading.value = true
        error.value = null

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))

            const index = addresses.value.findIndex((addr) => addr.id === id)
            if (index === -1) {
                throw new Error('Address not found')
            }

            // If this is set as default, remove default from others
            if (addressData.isDefault) {
                addresses.value.forEach((addr) => {
                    addr.isDefault = false
                })
            }

            addresses.value[index] = {
                ...addresses.value[index],
                ...addressData,
                updatedAt: new Date().toISOString(),
            }

            saveToStorage(currentUserId, addresses.value)
            return addresses.value[index]
        } catch (err) {
            error.value = 'Failed to update address'
            console.error('Error updating address:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteAddress = async (id: string, userId?: string) => {
        const currentUserId = userId ?? getCurrentUserId()
        isLoading.value = true
        error.value = null

        try {
            const addressToDelete = addresses.value.find((addr) => addr.id === id)
            if (!addressToDelete) {
                throw new Error('Address not found')
            }

            // Prevent deleting the default address
            if (addressToDelete.isDefault) {
                throw new Error(
                    'Cannot delete the default address. Please set another address as default first.',
                )
            }

            // Prevent deleting if it's the only address
            if (addresses.value.length <= 1) {
                throw new Error('Cannot delete the last address')
            }

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500))

            const index = addresses.value.findIndex((addr) => addr.id === id)
            addresses.value.splice(index, 1)

            // If deleted address was default, set first remaining address as default
            if (addressToDelete.isDefault && addresses.value.length > 0) {
                addresses.value[0].isDefault = true
            }

            saveToStorage(currentUserId, addresses.value)
        } catch (err) {
            error.value = 'Failed to delete address'
            console.error('Error deleting address:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const setDefaultAddress = async (id: string, userId?: string) => {
        const currentUserId = userId ?? getCurrentUserId()
        isLoading.value = true
        error.value = null

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 300))

            // Remove default from all addresses
            addresses.value.forEach((addr) => {
                addr.isDefault = false
            })

            // Set new default
            const address = addresses.value.find((addr) => addr.id === id)
            if (address) {
                address.isDefault = true
                address.updatedAt = new Date().toISOString()
            }

            saveToStorage(currentUserId, addresses.value)
        } catch (err) {
            error.value = 'Failed to set default address'
            console.error('Error setting default address:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const getAddressById = (id: string) => {
        return addresses.value.find((addr) => addr.id === id)
    }

    return {
        // State
        addresses: sortedAddresses,
        isLoading,
        error,

        // Getters
        defaultAddress,

        // Actions
        loadAddresses,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getAddressById,
    }
})
