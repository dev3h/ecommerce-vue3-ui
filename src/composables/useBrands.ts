import { ref, computed } from 'vue'
import { brandService, type Brand, type BrandFormData } from '@/services/brand.service'

const brands = ref<Brand[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useBrands() {
    // Actions
    const loadBrands = async () => {
        try {
            loading.value = true
            error.value = null
            brands.value = await brandService.getBrands()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load brands'
        } finally {
            loading.value = false
        }
    }

    const createBrand = async (data: BrandFormData) => {
        try {
            loading.value = true
            error.value = null
            const newBrand = await brandService.createBrand(data)
            brands.value.push(newBrand)
            return newBrand
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create brand'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateBrand = async (id: string, data: Partial<BrandFormData>) => {
        try {
            loading.value = true
            error.value = null
            const updatedBrand = await brandService.updateBrand(id, data)
            const index = brands.value.findIndex((brand) => brand.id === id)
            if (index !== -1) {
                brands.value[index] = updatedBrand
            }
            return updatedBrand
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update brand'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteBrand = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            await brandService.deleteBrand(id)
            brands.value = brands.value.filter((brand) => brand.id !== id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete brand'
            throw err
        } finally {
            loading.value = false
        }
    }

    const getBrand = (id: string) => {
        return brands.value.find((brand) => brand.id === id) || null
    }

    const uploadLogo = async (file: File) => {
        try {
            loading.value = true
            error.value = null
            return await brandService.uploadLogo(file)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to upload logo'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        brands: computed(() => brands.value),
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        loadBrands,
        createBrand,
        updateBrand,
        deleteBrand,
        getBrand,
        uploadLogo,
    }
}
