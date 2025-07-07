import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsService } from '@/services/products.service'
import { useAppI18n } from '@/composables/useI18n'
import type { ProductListItem, ProductFilters, CategoryData, SortOption } from '@/types/products'

export function useProducts() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useAppI18n()

    // State
    const products = ref<ProductListItem[]>([])
    const categories = ref<CategoryData>({ categories: [], brands: [] })
    const loading = ref({
        products: false,
        categories: false,
    })
    const error = ref<string | null>(null)

    // Pagination
    const currentPage = ref(1)
    const totalPages = ref(0)
    const totalProducts = ref(0)
    const productsPerPage = ref(12)

    // Filters
    const filters = ref<ProductFilters>({})
    const sortBy = ref('featured')
    const viewMode = ref<'grid' | 'list'>('grid')

    // Sort options - using i18n
    const sortOptions = computed<SortOption[]>(() => [
        { value: 'featured', label: t('products.featured') },
        { value: 'name_asc', label: t('products.nameAsc') },
        { value: 'name_desc', label: t('products.nameDesc') },
        { value: 'price_asc', label: t('products.priceAsc') },
        { value: 'price_desc', label: t('products.priceDesc') },
        { value: 'rating', label: t('products.customerRating') },
        { value: 'newest', label: t('products.newestFirst') },
    ])

    // Computed
    const hasProducts = computed(() => products.value.length > 0)
    const isFirstPage = computed(() => currentPage.value === 1)
    const isLastPage = computed(() => currentPage.value === totalPages.value)

    const activeFiltersCount = computed(() => {
        let count = 0
        if (filters.value.category) count++
        if (filters.value.brand && filters.value.brand.length > 0)
            count += filters.value.brand.length
        if (filters.value.priceMin !== undefined) count++
        if (filters.value.priceMax !== undefined) count++
        if (filters.value.rating !== undefined) count++
        if (filters.value.search) count++
        return count
    })

    // Methods
    const loadProducts = async (page = 1) => {
        loading.value.products = true
        error.value = null

        try {
            const response = await productsService.getProducts(
                page,
                productsPerPage.value,
                filters.value,
                sortBy.value,
            )

            products.value = response.products
            currentPage.value = response.page
            totalPages.value = response.totalPages
            totalProducts.value = response.total
        } catch (err) {
            error.value = t('products.errorLoadingProducts')
            console.error('Error loading products:', err)
        } finally {
            loading.value.products = false
        }
    }

    const loadCategories = async () => {
        loading.value.categories = true

        try {
            categories.value = await productsService.getCategories()
        } catch (err) {
            console.error('Error loading categories:', err)
            // Optionally show toast or handle error display
        } finally {
            loading.value.categories = false
        }
    }

    const applyFilters = (newFilters: Partial<ProductFilters>) => {
        filters.value = { ...filters.value, ...newFilters }
        currentPage.value = 1
        updateUrlParams()
        loadProducts(1)
    }

    const clearFilters = () => {
        filters.value = {}
        sortBy.value = 'featured'
        currentPage.value = 1
        updateUrlParams()
        loadProducts(1)
    }

    const clearCategoryFilter = () => {
        if (filters.value.category) {
            const newFilters = { ...filters.value }
            delete newFilters.category
            filters.value = newFilters
            currentPage.value = 1
            updateUrlParams()
            loadProducts(1)
        }
    }

    const setSortBy = (sort: string) => {
        sortBy.value = sort
        currentPage.value = 1
        updateUrlParams()
        loadProducts(1)
    }

    const setViewMode = (mode: 'grid' | 'list') => {
        viewMode.value = mode
        // Optionally save to localStorage
        localStorage.setItem('products_view_mode', mode)
    }

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
            updateUrlParams()
            loadProducts(page)
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const nextPage = () => {
        if (!isLastPage.value) {
            goToPage(currentPage.value + 1)
        }
    }

    const prevPage = () => {
        if (!isFirstPage.value) {
            goToPage(currentPage.value - 1)
        }
    }

    const updateUrlParams = () => {
        const query: Record<string, any> = {}

        if (currentPage.value > 1) {
            query.page = currentPage.value.toString()
        }

        if (filters.value.category) {
            query.category = filters.value.category
        }

        if (filters.value.brand && filters.value.brand.length > 0) {
            query.brand = filters.value.brand.join(',')
        }

        if (filters.value.priceMin !== undefined) {
            query.minPrice = filters.value.priceMin.toString()
        }

        if (filters.value.priceMax !== undefined) {
            query.maxPrice = filters.value.priceMax.toString()
        }

        if (filters.value.rating !== undefined) {
            query.rating = filters.value.rating.toString()
        }

        if (filters.value.search) {
            query.search = filters.value.search
        }

        if (sortBy.value !== 'featured') {
            query.sort = sortBy.value
        }

        router.push({ query })
    }

    const loadCategoryFromRoute = (params: any, query: any) => {
        // Clear category filter first
        filters.value.category = undefined

        // Load category from route params (for /categories/:slug routes)
        if (params.slug) {
            filters.value.category = params.slug as string
        }

        // Load filters from URL query (can override params.slug)
        if (query.category) {
            filters.value.category = query.category as string
        }
    }

    const loadFiltersFromQuery = (query: any) => {
        filters.value.brand = query.brand ? (query.brand as string).split(',') : undefined
        filters.value.priceMin = query.minPrice ? Number(query.minPrice) : undefined
        filters.value.priceMax = query.maxPrice ? Number(query.maxPrice) : undefined
        filters.value.rating = query.rating ? Number(query.rating) : undefined
        filters.value.search = query.search ? (query.search as string) : undefined
    }

    const loadSortAndPageFromQuery = (query: any) => {
        sortBy.value = query.sort ? (query.sort as string) : 'featured'
        currentPage.value = query.page ? Number(query.page) || 1 : 1
    }

    const loadFromUrlParams = () => {
        const query = route.query
        const params = route.params

        loadCategoryFromRoute(params, query)
        loadFiltersFromQuery(query)
        loadSortAndPageFromQuery(query)
    }

    const initializeViewMode = () => {
        const savedMode = localStorage.getItem('products_view_mode')
        if (savedMode === 'grid' || savedMode === 'list') {
            viewMode.value = savedMode
        }
    }

    // Initialize
    const initialize = async () => {
        initializeViewMode()
        loadFromUrlParams()
        await Promise.all([loadCategories(), loadProducts(currentPage.value)])
    }

    // Watch for route changes
    watch(
        () => [route.query, route.params],
        () => {
            loadFromUrlParams()
            loadProducts(currentPage.value)
        },
    )

    return {
        // State
        products,
        categories,
        loading,
        error,

        // Pagination
        currentPage,
        totalPages,
        totalProducts,
        productsPerPage,

        // Filters
        filters,
        sortBy,
        sortOptions,
        viewMode,

        // Computed
        hasProducts,
        isFirstPage,
        isLastPage,
        activeFiltersCount,

        // Methods
        loadProducts,
        loadCategories,
        applyFilters,
        clearFilters,
        clearCategoryFilter,
        setSortBy,
        setViewMode,
        goToPage,
        nextPage,
        prevPage,
        initialize,
    }
}
