export interface Product {
    id: number
    name: string
    price: number
    originalPrice?: number
    badge?: string
    image: string
    rating: number
    tag?: 'pink' | 'blue' | 'green' | 'orange'
}

export interface Deal {
    id: number
    name: string
    price: number
    originalPrice: number
    discount: number
    image: string
}

export interface Category {
    name: string
    icon: string
    color: string
}

export interface PromoSection {
    title: string
    image: string
    buttonText: string
    bgColor: string
}

export interface ProductsResponse {
    popularProducts: Product[]
    newProducts: Product[]
}

export interface DealsResponse {
    dealsOfDay: Deal[]
}

export interface HomeResponse {
    categories: Category[]
    promoSections: PromoSection[]
}
