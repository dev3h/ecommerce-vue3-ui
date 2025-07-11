<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold">{{ t('admin.brandsManagement.title') }}</h1>
                <p class="text-gray-500">{{ t('admin.brandsManagement.subtitle') }}</p>
            </div>
            <Button @click="showAddDialog = true">
                <Plus class="w-4 h-4 mr-2" />
                {{ t('admin.brandsManagement.addBrand') }}
            </Button>
        </div>

        <div class="mb-6">
            <Card>
                <CardContent class="p-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            v-model="searchQuery"
                            :placeholder="t('admin.brandsManagement.searchBrands')"
                            @input="resetPagination"
                        />
                        <!-- Placeholder for date filter -->
                        <div></div>
                        <!-- Placeholder for date filter -->
                        <div></div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div v-if="loading" class="text-center">{{ t('common.loading') }}</div>
        <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
        <div v-else>
            <!-- Showing results info -->
            <div class="mb-4 text-sm text-gray-600">
                {{ t('admin.brandsManagement.pagination.showing') }} {{ startItem }}
                {{ t('admin.brandsManagement.pagination.to') }} {{ endItem }}
                {{ t('admin.brandsManagement.pagination.of') }} {{ totalItems }}
                {{ t('admin.brandsManagement.pagination.entries') }}
            </div>

            <!-- Brands grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-6">
                <BrandCard
                    v-for="brand in paginatedBrands"
                    :key="brand.id"
                    :brand="brand"
                    @edit="handleEdit"
                    @delete="handleDelete"
                />
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        @click="prevPage"
                        :disabled="currentPage === 1"
                    >
                        <ChevronLeft class="h-4 w-4" />
                        {{ t('admin.brandsManagement.pagination.previous') }}
                    </Button>

                    <div class="flex items-center space-x-1">
                        <Button
                            v-for="page in Math.min(totalPages, 5)"
                            :key="page"
                            :variant="page === currentPage ? 'default' : 'outline'"
                            size="sm"
                            @click="goToPage(page)"
                        >
                            {{ page }}
                        </Button>
                        <span v-if="totalPages > 5" class="px-2">...</span>
                        <Button
                            v-if="totalPages > 5 && currentPage < totalPages - 2"
                            variant="outline"
                            size="sm"
                            @click="goToPage(totalPages)"
                        >
                            {{ totalPages }}
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                    >
                        {{ t('admin.brandsManagement.pagination.next') }}
                        <ChevronRight class="h-4 w-4" />
                    </Button>
                </div>

                <div class="text-sm text-gray-600">
                    {{ t('admin.brandsManagement.pagination.page') }} {{ currentPage }}
                    {{ t('admin.brandsManagement.pagination.of') }} {{ totalPages }}
                </div>
            </div>
        </div>

        <!-- Form dialog for both add and edit operations -->
        <BrandFormDialog
            v-if="showAddDialog || editingBrand"
            :open="showAddDialog || !!editingBrand"
            :brand="editingBrand"
            @update:open="handleDialogClose"
            @saved="handleSave"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBrands } from '@/composables/useBrands'
import BrandCard from '@/components/admin/brands/BrandCard.vue'
import type { Brand } from '@/services/brand.service'
import BrandFormDialog from '@/components/admin/brands/BrandFormDialog.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

const { brands, loading, error, loadBrands, deleteBrand } = useBrands()
const toast = useToast()
const { t } = useAppI18n()

const searchQuery = ref('')
const showAddDialog = ref(false) // Initialize as false to keep dialog hidden initially
const editingBrand = ref<Brand | null>(null) // Store the brand being edited

// Pagination states
const currentPage = ref(1)
const perPage = ref(12)

const filteredBrands = computed(() => {
    if (!searchQuery.value) {
        return brands.value
    }
    return brands.value.filter((brand) =>
        brand.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredBrands.value.length / perPage.value))
const paginatedBrands = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return filteredBrands.value.slice(start, end)
})

const totalItems = computed(() => filteredBrands.value.length)
const startItem = computed(() => (currentPage.value - 1) * perPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * perPage.value, totalItems.value))

// Pagination methods
const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

// Reset pagination when search changes
const resetPagination = () => {
    currentPage.value = 1
}

const handleEdit = (brand: Brand) => {
    editingBrand.value = brand
}

const handleDelete = async (brandId: string) => {
    try {
        await deleteBrand(brandId)
        toast.success(t('admin.brandsManagement.messages.deleteSuccess'))
        // No need to explicitly call loadBrands() since the state is already updated by deleteBrand
        return true // Indicate success
    } catch (err) {
        toast.error(
            t('admin.brandsManagement.messages.deleteError'),
            err instanceof Error ? err.message : '',
        )
        return false // Indicate failure
    }
}

const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
        showAddDialog.value = false
        editingBrand.value = null
    }
}

const handleSave = () => {
    loadBrands() // Refresh the list after saving
    editingBrand.value = null

    // Reset to page 1 to show the newly created brand
    // (brands are typically sorted by creation date, so new ones appear first)
    currentPage.value = 1
}

onMounted(() => {
    loadBrands()
})
</script>
