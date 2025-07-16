import { ref, watch } from 'vue'
import { fetchCustomersService } from '@/services/customer.service'
import type { Customer } from '@/services/customer.service'

export function useCustomers() {
    const customers = ref<Customer[]>([])
    const loading = ref(false)
    const search = ref('')

    async function fetchCustomers() {
        loading.value = true
        customers.value = await fetchCustomersService(search.value)
        loading.value = false
    }

    // Fetch on mount
    fetchCustomers()

    // Refetch when search changes
    watch(search, () => {
        fetchCustomers()
    })

    return {
        customers,
        loading,
        search,
        fetchCustomers,
    }
}
