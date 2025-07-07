import { ref, onMounted } from 'vue'
import { HomeService } from '@/services/home.service'
import { useAppI18n } from '@/composables/useI18n'
import type { Product, Deal, Category, PromoSection } from '@/types/home'

export function useHomeData() {
    const { t } = useAppI18n()

    // State
    const popularProducts = ref<Product[]>([])
    const newProducts = ref<Product[]>([])
    const dealsOfDay = ref<Deal[]>([])
    const categories = ref<Category[]>([])
    const promoSections = ref<PromoSection[]>([])

    // Loading states
    const loading = ref({
        products: false,
        deals: false,
        home: false,
    })

    // Error states
    const errors = ref({
        products: null as string | null,
        deals: null as string | null,
        home: null as string | null,
    })

    // Methods
    const loadProducts = async () => {
        loading.value.products = true
        errors.value.products = null

        try {
            const data = await HomeService.getProducts()
            popularProducts.value = data.popularProducts
            newProducts.value = data.newProducts
        } catch (error) {
            errors.value.products = t('errors.loadingProducts')
            console.error('Error loading products:', error)
        } finally {
            loading.value.products = false
        }
    }

    const loadDeals = async () => {
        loading.value.deals = true
        errors.value.deals = null

        try {
            const data = await HomeService.getDeals()
            dealsOfDay.value = data.dealsOfDay
        } catch (error) {
            errors.value.deals = t('errors.loadingDeals')
            console.error('Error loading deals:', error)
        } finally {
            loading.value.deals = false
        }
    }

    const loadHomeData = async () => {
        loading.value.home = true
        errors.value.home = null

        try {
            const data = await HomeService.getHomeData()
            categories.value = data.categories
            promoSections.value = data.promoSections
        } catch (error) {
            errors.value.home = t('errors.loadingHomeData')
            console.error('Error loading home data:', error)
        } finally {
            loading.value.home = false
        }
    }

    const loadAllData = async () => {
        await Promise.all([loadProducts(), loadDeals(), loadHomeData()])
    }

    // Auto-load on mount
    onMounted(() => {
        loadAllData()
    })

    return {
        // Data
        popularProducts,
        newProducts,
        dealsOfDay,
        categories,
        promoSections,

        // States
        loading,
        errors,

        // Methods
        loadProducts,
        loadDeals,
        loadHomeData,
        loadAllData,
    }
}
