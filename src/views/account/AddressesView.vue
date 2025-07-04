<template>
    <div class="w-full max-w-full overflow-x-hidden">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h1 class="text-2xl font-semibold text-foreground">
                    {{ t('address.myAddresses') }}
                </h1>
                <p class="text-muted-foreground mt-1">{{ t('address.addressSubtitle') }}</p>
            </div>
            <Button @click="openAddForm" class="w-full sm:w-auto">
                <Plus class="w-4 h-4 mr-2" />
                {{ t('address.addNewAddress') }}
            </Button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && !addressStore.addresses.length" class="flex justify-center py-12">
            <div
                class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
            ></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!addressStore.addresses.length" class="text-center py-12">
            <MapPin class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 class="text-xl font-semibold text-foreground mb-2">
                {{ t('address.noAddresses') }}
            </h2>
            <p class="text-muted-foreground mb-6">
                {{ t('address.noAddressesDescription') }}
            </p>
            <Button @click="openAddForm">
                <Plus class="w-4 h-4 mr-2" />
                {{ t('address.addFirstAddress') }}
            </Button>
        </div>

        <!-- Addresses Grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <AddressCard
                v-for="address in addressStore.addresses"
                :key="address.id"
                :address="address"
                :can-delete="canDeleteAddress(address)"
                @edit="openEditForm(address)"
                @deleted="handleAddressDeleted"
            />
        </div>

        <!-- Error Message -->
        <div
            v-if="error"
            class="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
            <div class="flex items-center gap-2 text-destructive">
                <AlertCircle class="w-5 h-5" />
                <span class="font-medium">{{ t('common.error') }}</span>
            </div>
            <p class="text-destructive/80 mt-1">{{ error }}</p>
        </div>

        <!-- Address Form Modal -->
        <AddressForm
            v-if="showForm"
            :address="editingAddress"
            :is-open="showForm"
            @close="closeForm"
            @success="handleFormSuccess"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppI18n } from '@/composables/useI18n'
import { useAddressStore, type Address } from '@/stores/addresses'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, AlertCircle } from 'lucide-vue-next'
import AddressCard from '@/components/address/AddressCard.vue'
import AddressForm from '@/components/address/AddressForm.vue'

const { t } = useAppI18n()
const addressStore = useAddressStore()

// Form state
const showForm = ref(false)
const editingAddress = ref<Address | null>(null)

// Reactive computed properties from store
const { addresses, isLoading, error } = storeToRefs(addressStore)

// Methods
const openAddForm = () => {
    editingAddress.value = null
    showForm.value = true
}

const openEditForm = (address: Address) => {
    editingAddress.value = address
    showForm.value = true
}

const closeForm = () => {
    showForm.value = false
    editingAddress.value = null
}

const handleFormSuccess = async () => {
    // Reload addresses after successful creation/update
    await addressStore.loadAddresses()
    console.log('Address saved successfully')
}

const handleAddressDeleted = async () => {
    // Reload addresses after successful deletion
    await addressStore.loadAddresses()
    console.log('Address deleted successfully')
}

const canDeleteAddress = (address: Address) => {
    // Cannot delete if it's the only address
    if (addressStore.addresses.length <= 1) return false
    // Cannot delete if it's the default address
    if (address.isDefault) return false
    return true
}

// Load addresses on mount
onMounted(async () => {
    console.log('AddressesView mounted, loading addresses...')
    await addressStore.loadAddresses()
    console.log('Addresses loaded:', addressStore.addresses.length)
})

// Debug watcher for addresses changes
watch(
    () => addressStore.addresses,
    (newAddresses) => {
        console.log('Addresses changed:', newAddresses.length, newAddresses)
    },
    { immediate: true, deep: true },
)
</script>
