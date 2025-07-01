import type { ProductsResponse, DealsResponse, HomeResponse } from '@/types/home'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class HomeService {
    static async getProducts(): Promise<ProductsResponse> {
        await delay(100) // Simulate network delay
        const response = await import('@/data/products.json')
        return response.default as ProductsResponse
    }

    static async getDeals(): Promise<DealsResponse> {
        await delay(100)
        const response = await import('@/data/deals.json')
        return response.default as DealsResponse
    }

    static async getHomeData(): Promise<HomeResponse> {
        await delay(100)
        const response = await import('@/data/home.json')
        return response.default as HomeResponse
    }

    // Alternative method using fetch if you prefer
    static async getProductsViaFetch(): Promise<ProductsResponse> {
        const response = await fetch('/src/data/products.json')
        return response.json()
    }
}
