import { ref, computed } from 'vue'
import { categoryService, type Category, type CategoryFormData } from '@/services/category.service'

const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useCategories() {
    // Computed
    const parentCategories = computed(() => categories.value.filter((cat) => !cat.parent_id))

    const categoriesTree = computed(() => {
        const parents = categories.value.filter((cat) => !cat.parent_id)
        return parents.map((parent) => ({
            ...parent,
            children: categories.value.filter((cat) => cat.parent_id === parent.id),
        }))
    })

    // Actions
    const loadCategories = async () => {
        try {
            loading.value = true
            error.value = null
            categories.value = await categoryService.getCategories()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load categories'
        } finally {
            loading.value = false
        }
    }

    const createCategory = async (data: CategoryFormData) => {
        try {
            loading.value = true
            error.value = null
            const newCategory = await categoryService.createCategory(data)
            categories.value.push(newCategory)
            return newCategory
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create category'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateCategory = async (id: string, data: Partial<CategoryFormData>) => {
        try {
            loading.value = true
            error.value = null
            const updatedCategory = await categoryService.updateCategory(id, data)
            const index = categories.value.findIndex((cat) => cat.id === id)
            if (index !== -1) {
                categories.value[index] = updatedCategory
            }
            return updatedCategory
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update category'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteCategory = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            await categoryService.deleteCategory(id)
            categories.value = categories.value.filter((cat) => cat.id !== id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete category'
            throw err
        } finally {
            loading.value = false
        }
    }

    const getCategory = (id: string) => {
        return categories.value.find((cat) => cat.id === id) || null
    }

    const reorderCategories = async (categoryIds: string[]) => {
        try {
            loading.value = true
            error.value = null
            await categoryService.reorderCategories(categoryIds)
            await loadCategories() // Reload to get updated order
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to reorder categories'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        categories: computed(() => categories.value),
        parentCategories,
        categoriesTree,
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategory,
        reorderCategories,
    }
}
