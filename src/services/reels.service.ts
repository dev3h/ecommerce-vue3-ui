import type { Reel, ReelComment, ReelFormData, ReelCategory } from '@/types/reels'
import reelsData from '@/data/reels.json'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class ReelsService {
    private reels: Reel[] = reelsData as Reel[]
    private comments: ReelComment[] = []

    async getReels(params?: {
        page?: number
        limit?: number
        category?: ReelCategory
        search?: string
    }): Promise<{
        data: Reel[]
        total: number
        hasMore: boolean
    }> {
        await delay(500)
        let filteredReels = [...this.reels]
        if (params?.category && params.category !== 'trending') {
            filteredReels = filteredReels.filter(reel => 
                reel.tags.includes(params.category!)
            )
        }
        if (params?.search) {
            const searchLower = params.search.toLowerCase()
            filteredReels = filteredReels.filter(reel =>
                reel.title.toLowerCase().includes(searchLower) ||
                reel.description.toLowerCase().includes(searchLower) ||
                reel.tags.some(tag => tag.toLowerCase().includes(searchLower))
            )
        }
        const page = params?.page || 1
        const limit = params?.limit || 10
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedReels = filteredReels.slice(startIndex, endIndex)
        return {
            data: paginatedReels,
            total: filteredReels.length,
            hasMore: endIndex < filteredReels.length
        }
    }

    async getReelById(id: string): Promise<Reel | null> {
        await delay(300)
        return this.reels.find(reel => reel.id === id) || null
    }

    async likeReel(id: string): Promise<boolean> {
        await delay(200)
        const reel = this.reels.find(r => r.id === id)
        if (reel) {
            if (reel.is_liked) {
                reel.stats.likes--
                reel.is_liked = false
            } else {
                reel.stats.likes++
                reel.is_liked = true
            }
            return reel.is_liked
        }
        return false
    }

    async shareReel(id: string): Promise<void> {
        await delay(200)
        const reel = this.reels.find(r => r.id === id)
        if (reel) {
            reel.stats.shares++
        }
    }

    async addView(id: string): Promise<void> {
        await delay(100)
        const reel = this.reels.find(r => r.id === id)
        if (reel) {
            reel.stats.views++
        }
    }

    async getComments(reelId: string, page = 1, limit = 20): Promise<{
        data: ReelComment[]
        total: number
        hasMore: boolean
    }> {
        await delay(400)
        const reelComments = this.comments.filter(c => c.reel_id === reelId)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        return {
            data: reelComments.slice(startIndex, endIndex),
            total: reelComments.length,
            hasMore: endIndex < reelComments.length
        }
    }

    async addComment(reelId: string, content: string): Promise<ReelComment> {
        await delay(300)
        const newComment: ReelComment = {
            id: `comment_${Date.now()}`,
            reel_id: reelId,
            user: {
                id: 'current_user',
                name: 'Current User',
                avatar: 'https://picsum.photos/100/100?random=999'
            },
            content,
            likes: 0,
            is_liked: false,
            replies_count: 0,
            created_at: new Date().toISOString()
        }
        this.comments.unshift(newComment)
        const reel = this.reels.find(r => r.id === reelId)
        if (reel) {
            reel.stats.comments++
        }
        return newComment
    }

    async getTrendingTags(): Promise<string[]> {
        await delay(200)
        const allTags = this.reels.flatMap(reel => reel.tags)
        const tagCounts = allTags.reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1
            return acc
        }, {} as Record<string, number>)
        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([tag]) => tag)
    }
}

export const reelsService = new ReelsService()
