export interface ProductDetail {
    id: string
    name: string
    brand: string
    sku: string
    category: string
    price: number
    originalPrice?: number
    discount?: number
    rating: number
    reviewCount: number
    description: string
    shortDescription: string
    images: string[]
    inStock: boolean
    quantity: number
    weight: string
    dimensions?: {
        length: number
        width: number
        height: number
    }
    ingredients: string[]
    nutritionFacts?: NutritionFacts
    specifications: Specification[]
    tags: string[]
    badge?: string
    tag?: string
    createdAt: string
    updatedAt: string
}

export interface NutritionFacts {
    servingSize: string
    servingsPerContainer: number
    calories: number
    totalFat: string
    saturatedFat: string
    transFat: string
    cholesterol: string
    sodium: string
    totalCarbohydrate: string
    dietaryFiber: string
    sugars: string
    protein: string
    vitaminA?: string
    vitaminC?: string
    calcium?: string
    iron?: string
}

export interface Specification {
    label: string
    value: string
}

export interface ProductReview {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    rating: number
    title: string
    comment: string
    helpful: number
    notHelpful: number
    verified: boolean
    createdAt: string
    images?: string[]
}

export interface RelatedProduct {
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
    brand: string
    category: string
    description: string
    inStock: boolean
    quantity: number
    sku: string
}
