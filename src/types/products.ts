export interface ProductListItem {
    id: string
    name: string
    slug: string
    image: string
    price: number
    originalPrice?: number
    rating: number
    reviewCount: number
    badge?: string
    tag?: string
    discount?: number
    brand: string
    category: string
    description: string
    inStock: boolean
    quantity: number
    sku: string
}

export interface ProductCategory {
    id: string
    name: string
    slug: string
    icon: string
    color: string
    count: number
}

export interface ProductBrand {
    id: string
    name: string
    count: number
}

export interface PriceRange {
    min: number
    max: number | null
    label: string
}

export interface SortOption {
    value: string
    label: string
}

export interface ProductFilters {
    category?: string
    brand?: string[]
    priceMin?: number
    priceMax?: number
    rating?: number
    inStock?: boolean
    search?: string
}

export interface ProductListData {
    products: ProductListItem[]
    filters: {
        priceRanges: PriceRange[]
        sortOptions: SortOption[]
    }
}

export interface CategoryData {
    categories: ProductCategory[]
    brands: ProductBrand[]
}

export interface ProductListResponse {
    products: ProductListItem[]
    total: number
    page: number
    limit: number
    totalPages: number
    filters: ProductFilters
}
