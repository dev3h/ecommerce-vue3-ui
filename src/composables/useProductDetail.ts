import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useWishlist } from '@/composables/useWishlist'
import { productDetailService } from '@/services/product-detail.service'
import type { ProductDetail, ProductReview, RelatedProduct } from '@/types/product-detail'

export function useProductDetail() {
    const route = useRoute()
    const { addToCart: cartAddToCart } = useCart()
    const { toggleWishlist } = useWishlist()

    // State
    const product = ref<ProductDetail | null>(null)
    const reviews = ref<ProductReview[]>([])
    const relatedProducts = ref<RelatedProduct[]>([])

    const loading = ref({
        product: false,
        reviews: false,
        relatedProducts: false,
    })

    const error = ref<string | null>(null)

    // Product state
    const selectedImageIndex = ref(0)
    const quantity = ref(1)
    const activeTab = ref('description')

    // Reviews state
    const reviewsPage = ref(1)
    const reviewsTotal = ref(0)
    const hasMoreReviews = ref(false)

    // Computed
    const selectedImage = computed(() => {
        if (!product.value?.images?.length) return ''
        return product.value.images[selectedImageIndex.value] || product.value.images[0]
    })

    const discountAmount = computed(() => {
        if (!product.value?.originalPrice) return 0
        return product.value.originalPrice - product.value.price
    })

    const discountPercentage = computed(() => {
        if (!product.value?.originalPrice) return 0
        return Math.round(
            ((product.value.originalPrice - product.value.price) / product.value.originalPrice) *
                100,
        )
    })

    const averageRating = computed(() => {
        if (!reviews.value.length) return product.value?.rating ?? 0
        const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
        return sum / reviews.value.length
    })

    const ratingDistribution = computed(() => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        reviews.value.forEach((review) => {
            distribution[review.rating as keyof typeof distribution]++
        })
        return distribution
    })

    const isInStock = computed(() => product.value?.inStock && (product.value?.quantity ?? 0) > 0)

    const canAddToCart = computed(
        () =>
            isInStock.value &&
            quantity.value > 0 &&
            quantity.value <= (product.value?.quantity ?? 0),
    )

    // Methods
    const loadProductDetail = async (id?: string) => {
        try {
            loading.value.product = true
            error.value = null

            const productId = id ?? (route.params.id as string)
            if (!productId) {
                throw new Error('Product ID is required')
            }

            const data = await productDetailService.getProductDetail(productId)
            product.value = data.product
            reviews.value = data.reviews
            reviewsTotal.value = data.reviews.length
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load product'
            console.error('Error loading product detail:', err)
        } finally {
            loading.value.product = false
        }
    }

    const loadRelatedProducts = async () => {
        if (!product.value) return

        try {
            loading.value.relatedProducts = true
            const products = await productDetailService.getRelatedProducts(product.value.id)
            relatedProducts.value = products
        } catch (err) {
            console.error('Error loading related products:', err)
        } finally {
            loading.value.relatedProducts = false
        }
    }

    const loadMoreReviews = async () => {
        if (!product.value || loading.value.reviews) return

        try {
            loading.value.reviews = true
            const nextPage = reviewsPage.value + 1
            const data = await productDetailService.getProductReviews(product.value.id, nextPage)

            reviews.value.push(...data.reviews)
            reviewsPage.value = nextPage
            hasMoreReviews.value = data.hasMore
            reviewsTotal.value = data.total
        } catch (err) {
            console.error('Error loading more reviews:', err)
        } finally {
            loading.value.reviews = false
        }
    }

    const selectImage = (index: number) => {
        if (product.value?.images && index >= 0 && index < product.value.images.length) {
            selectedImageIndex.value = index
        }
    }

    const updateQuantity = (newQuantity: number) => {
        const maxQuantity = product.value?.quantity ?? 0
        quantity.value = Math.max(1, Math.min(newQuantity, maxQuantity))
    }

    const setActiveTab = (tab: string) => {
        activeTab.value = tab
    }

    const addToCart = async () => {
        if (!canAddToCart.value || !product.value) return

        try {
            // Add to cart using the cart service
            cartAddToCart(
                {
                    id: product.value.id,
                    name: product.value.name,
                    price: product.value.price,
                    originalPrice: product.value.originalPrice,
                    image: product.value.images?.[0] || '',
                    category: product.value.category,
                    description: product.value.shortDescription,
                },
                quantity.value,
            )

            console.log('Added to cart successfully:', {
                product: product.value.name,
                quantity: quantity.value,
            })

            // Optionally update stock
            await productDetailService.updateProductStock(
                product.value.id,
                product.value.quantity - quantity.value,
            )

            // Update local state
            if (product.value.quantity) {
                product.value.quantity -= quantity.value
            }

            // Reset quantity
            quantity.value = 1

            return true
        } catch (err) {
            console.error('Error adding to cart:', err)
            return false
        }
    }

    const addToWishlist = async () => {
        if (!product.value) return false

        try {
            const wishlistItem = {
                productId: product.value.id.toString(),
                name: product.value.name,
                price: product.value.price,
                originalPrice: product.value.originalPrice,
                image: product.value.images?.[0] || '',
                category: product.value.category,
                description: product.value.shortDescription,
                rating: product.value.rating,
                reviewCount: product.value.reviewCount,
                inStock: product.value.inStock,
            }

            return toggleWishlist(wishlistItem)
        } catch (err) {
            console.error('Error adding to wishlist:', err)
            return false
        }
    }

    // Initialize
    const initialize = async () => {
        await loadProductDetail()
        if (product.value) {
            await loadRelatedProducts()
        }
    }

    return {
        // State
        product,
        reviews,
        relatedProducts,
        loading,
        error,
        selectedImageIndex,
        quantity,
        activeTab,
        reviewsPage,
        reviewsTotal,
        hasMoreReviews,

        // Computed
        selectedImage,
        discountAmount,
        discountPercentage,
        averageRating,
        ratingDistribution,
        isInStock,
        canAddToCart,

        // Methods
        loadProductDetail,
        loadRelatedProducts,
        loadMoreReviews,
        selectImage,
        updateQuantity,
        setActiveTab,
        addToCart,
        addToWishlist,
        initialize,
    }
}
