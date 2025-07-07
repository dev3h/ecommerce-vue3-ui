import type { ProductDetail, ProductReview, RelatedProduct } from '@/types/product-detail'
import productsData from '@/data/products-list.json'

export interface ProductDetailResponse {
    product: ProductDetail
    reviews: ProductReview[]
    relatedProducts: RelatedProduct[]
}

class ProductDetailService {
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async getProductDetail(productId: string): Promise<ProductDetailResponse> {
        // Simulate API delay
        await this.delay(500)

        // Find the product by ID in the products list
        const product = productsData.products.find((p) => p.id === productId)

        if (!product) {
            throw new Error('Product not found')
        }

        // Convert the product to ProductDetail format
        const productDetail: ProductDetail = {
            id: product.id, // Use the original ID, not slug
            name: product.name,
            brand: product.brand,
            sku: product.sku,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount ?? 0,
            rating: product.rating,
            reviewCount: product.reviewCount,
            description: product.description,
            shortDescription: product.shortDescription ?? product.description,
            images: product.images ?? [product.image],
            inStock: product.inStock,
            quantity: product.quantity,
            weight: product.weight ?? '0g',
            dimensions: product.dimensions,
            ingredients: product.ingredients ?? [],
            nutritionFacts: product.nutritionFacts,
            specifications: product.specifications ?? [],
            tags: product.tags ?? [],
            badge: product.badge,
            tag: product.tag,
            createdAt: product.createdAt ?? new Date().toISOString(),
            updatedAt: product.updatedAt ?? new Date().toISOString(),
        }

        // Get related products (other products from the same category)
        const relatedProducts: RelatedProduct[] = productsData.products
            .filter((p) => p.id !== productId && p.category === product.category)
            .slice(0, 4)
            .map((p) => ({
                id: p.id, // Use original ID
                slug: p.slug ?? p.id,
                name: p.name,
                image: p.image,
                price: p.price,
                originalPrice: p.originalPrice ?? p.price,
                rating: p.rating,
                reviewCount: p.reviewCount,
                badge: p.badge ?? '',
                tag: p.tag ?? '',
                brand: p.brand,
                category: p.category,
                description: p.description,
                inStock: p.inStock,
                quantity: p.quantity,
                sku: p.sku,
            }))

        // Return empty reviews array (reviews will be handled by the review service)
        return {
            product: productDetail,
            reviews: [],
            relatedProducts,
        }
    }

    async getRelatedProducts(productId: string, limit: number = 4): Promise<RelatedProduct[]> {
        await this.delay(300)

        // Find the product to get its category
        const product = productsData.products.find((p) => p.id === productId)
        if (!product) {
            return []
        }

        // Get related products from the same category
        return productsData.products
            .filter((p) => p.id !== productId && p.category === product.category)
            .slice(0, limit)
            .map((p) => ({
                id: p.id, // Use original ID
                slug: p.slug ?? p.id,
                name: p.name,
                image: p.image,
                price: p.price,
                originalPrice: p.originalPrice ?? p.price,
                rating: p.rating,
                reviewCount: p.reviewCount,
                badge: p.badge ?? '',
                tag: p.tag ?? '',
                brand: p.brand,
                category: p.category,
                description: p.description,
                inStock: p.inStock,
                quantity: p.quantity,
                sku: p.sku,
            }))
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

        // This method is deprecated and should use the review service instead
        // Return empty reviews as the review service handles this now
        return {
            reviews: [],
            total: 0,
            hasMore: false,
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
