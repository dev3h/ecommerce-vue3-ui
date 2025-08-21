export interface Reel {
    id: string
    title: string
    description: string
    video_url: string
    thumbnail_url: string
    duration: number // seconds
    creator: {
        id: string
        name: string
        avatar: string
        is_verified: boolean
    }
    product?: {
        id: string
        name: string
        price: number
        original_price?: number
        discount_percentage?: number
        image: string
        rating: number
        sold_count: number
    }
    stats: {
        views: number
        likes: number
        comments: number
        shares: number
    }
    is_liked: boolean
    tags: string[]
    created_at: string
    updated_at: string
    // Additional properties for video state management
    hasViewed?: boolean
    isCompleted?: boolean
    watchTime?: number // seconds watched
}

export interface ReelComment {
    id: string
    reel_id: string
    user: {
        id: string
        name: string
        avatar: string
    }
    content: string
    likes: number
    is_liked: boolean
    replies_count: number
    created_at: string
}

export interface ReelFormData {
    title: string
    description: string
    video_file?: File
    product_id?: string
    tags: string[]
}

export type ReelCategory =
    | 'trending'
    | 'fashion'
    | 'beauty'
    | 'food'
    | 'lifestyle'
    | 'tech'
    | 'sports'
