import type {
    ProductListData,
    CategoryData,
    ProductListResponse,
    ProductFilters,
} from '@/types/products'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class ProductsService {
    private async loadProductsData(): Promise<ProductListData> {
        // Simulate network delay
        await delay(300)

        try {
            const response = await fetch('/src/data/products-list.json')
            if (!response.ok) {
                throw new Error('Failed to fetch products data')
            }
            return await response.json()
        } catch (error) {
            // Fallback for development
            console.warn('Failed to fetch products data, using fallback:', error)
            const { default: data } = await import('@/data/products-list.json')
            return data
        }
    }

    private async loadCategoriesData(): Promise<CategoryData> {
        // Simulate network delay
        await delay(200)

        try {
            const response = await fetch('/src/data/categories.json')
            if (!response.ok) {
                throw new Error('Failed to fetch categories data')
            }
            return await response.json()
        } catch (error) {
            // Fallback for development
            console.warn('Failed to fetch categories data, using fallback:', error)
            const { default: data } = await import('@/data/categories.json')
            return data
        }
    }

    async getProducts(
        page = 1,
        limit = 12,
        filters: ProductFilters = {},
        sortBy = 'featured',
    ): Promise<ProductListResponse> {
        const data = await this.loadProductsData()
        let filteredProducts = [...data.products]

        // Apply filters
        if (filters.category) {
            filteredProducts = filteredProducts.filter(
                (product) => product.category === filters.category,
            )
        }

        if (filters.brand && filters.brand.length > 0) {
            console.log('Filtering by brands:', filters.brand)
            const beforeFilter = filteredProducts.length
            filteredProducts = filteredProducts.filter((product) =>
                filters.brand!.includes(product.brand),
            )
            console.log(`Filtered from ${beforeFilter} to ${filteredProducts.length} products`)
        }

        if (filters.priceMin !== undefined) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price >= filters.priceMin!,
            )
        }

        if (filters.priceMax !== undefined) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price <= filters.priceMax!,
            )
        }

        if (filters.rating !== undefined) {
            filteredProducts = filteredProducts.filter(
                (product) => product.rating >= filters.rating!,
            )
        }

        if (filters.inStock) {
            filteredProducts = filteredProducts.filter((product) => product.inStock)
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            filteredProducts = filteredProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchLower) ||
                    product.description.toLowerCase().includes(searchLower) ||
                    product.brand.toLowerCase().includes(searchLower),
            )
        }

        // Apply sorting
        switch (sortBy) {
            case 'name_asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'name_desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
                break
            case 'price_asc':
                filteredProducts.sort((a, b) => a.price - b.price)
                break
            case 'price_desc':
                filteredProducts.sort((a, b) => b.price - a.price)
                break
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating)
                break
            case 'newest':
                // Simulate newest first by reversing array
                filteredProducts.reverse()
                break
            default:
                // Featured - keep original order
                break
        }

        // Apply pagination
        const total = filteredProducts.length
        const totalPages = Math.ceil(total / limit)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

        return {
            products: paginatedProducts,
            total,
            page,
            limit,
            totalPages,
            filters,
        }
    }

    async getCategories(): Promise<CategoryData> {
        return await this.loadCategoriesData()
    }

    async getProductById(id: string) {
        const data = await this.loadProductsData()
        return data.products.find((product) => product.id === id)
    }

    async getProductBySlug(slug: string) {
        const data = await this.loadProductsData()
        return data.products.find((product) => product.slug === slug)
    }

    async getFilterOptions() {
        const data = await this.loadProductsData()
        return data.filters
    }
    async getCategoriesWithProductCount() {
        const [categoriesData, productsData] = await Promise.all([
            this.loadCategoriesData(),
            this.loadProductsData(),
        ])

        // Count products for each category
        const categoryCounts = new Map<string, number>()

        productsData.products.forEach((product) => {
            const currentCount = categoryCounts.get(product.category) ?? 0
            categoryCounts.set(product.category, currentCount + 1)
        })

        // Count products for each brand
        const brandCounts = new Map<string, number>()

        productsData.products.forEach((product) => {
            const currentCount = brandCounts.get(product.brand) ?? 0
            brandCounts.set(product.brand, currentCount + 1)
        })

        // Create brands array from actual product data
        const brandsWithCount = Array.from(brandCounts.entries())
            .map(([brandName, count], index) => ({
                id: (index + 1).toString(),
                name: brandName,
                count: count,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically

        // Update categories with actual product counts
        const categoriesWithCount = categoriesData.categories.map((category) => ({
            ...category,
            count: categoryCounts.get(category.slug) ?? 0,
        }))

        return {
            categories: categoriesWithCount,
            brands: brandsWithCount,
        }
    }
}

export const productsService = new ProductsService()
