import type { ProductDetail, ProductReview, RelatedProduct } from '@/types/product-detail'
import productDetailData from '@/data/product-detail.json'

export interface ProductDetailResponse {
    product: ProductDetail
    reviews: ProductReview[]
    relatedProducts: RelatedProduct[]
}

class ProductDetailService {
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async getProductDetail(slug: string): Promise<ProductDetailResponse> {
        // Simulate API delay
        await this.delay(500)

        // In a real app, this would be an API call
        // For now, return the fake data regardless of slug
        const data = productDetailData as ProductDetailResponse

        if (!data.product) {
            throw new Error('Product not found')
        }

        return data
    }

    async getRelatedProducts(productId: string, limit: number = 4): Promise<RelatedProduct[]> {
        await this.delay(300)

        const data = productDetailData as ProductDetailResponse
        return data.relatedProducts.slice(0, limit)
    }

    async getProductReviews(
        productId: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<{
        reviews: ProductReview[]
        total: number
        hasMore: boolean
    }> {
        await this.delay(400)

        const data = productDetailData as ProductDetailResponse
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        const reviews = data.reviews.slice(startIndex, endIndex)
        const total = data.reviews.length
        const hasMore = endIndex < total

        return {
            reviews,
            total,
            hasMore,
        }
    }

    async addProductReview(
        productId: string,
        review: Omit<ProductReview, 'id' | 'createdAt'>,
    ): Promise<ProductReview> {
        await this.delay(600)

        // Simulate creating a new review
        const newReview: ProductReview = {
            ...review,
            id: `review-${Date.now()}`,
            createdAt: new Date().toISOString(),
        }

        return newReview
    }

    async updateProductStock(productId: string, quantity: number): Promise<void> {
        await this.delay(200)

        // Simulate stock update
        console.log(`Updated stock for product ${productId}: ${quantity}`)
    }
}

export const productDetailService = new ProductDetailService()
