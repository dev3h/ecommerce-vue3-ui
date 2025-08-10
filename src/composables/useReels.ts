import { ref, computed } from 'vue'
import type { Reel, ReelComment, ReelCategory } from '@/types/reels'
import { reelsService } from '@/services/reels.service'
import { useToast } from '@/composables/useToast'

export function useReels() {
    const reels = ref<Reel[]>([])
    const currentReel = ref<Reel | null>(null)
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const hasMore = ref(true)
    const currentPage = ref(1)
    const currentCategory = ref<ReelCategory>('trending')
    const searchQuery = ref('')

    const { toast } = useToast()

    const loadReels = async (reset = false) => {
        if (reset) {
            currentPage.value = 1
            hasMore.value = true
        }
        if (!hasMore.value) return
        isLoading.value = reset
        isLoadingMore.value = !reset
        try {
            const response = await reelsService.getReels({
                page: currentPage.value,
                limit: 10,
                category: currentCategory.value,
                search: searchQuery.value || undefined
            })
            if (reset) {
                reels.value = response.data
            } else {
                reels.value.push(...response.data)
            }
            hasMore.value = response.hasMore
            if (response.hasMore) {
                currentPage.value++
            }
        } catch (error) {
            console.error('Error loading reels:', error)
            toast({
                title: 'Lỗi',
                description: 'Không thể tải video. Vui lòng thử lại.',
                variant: 'destructive'
            })
        } finally {
            isLoading.value = false
            isLoadingMore.value = false
        }
    }

    const loadMore = () => {
        if (!isLoadingMore.value && hasMore.value) {
            loadReels(false)
        }
    }

    const getReelById = async (id: string) => {
        try {
            const reel = await reelsService.getReelById(id)
            currentReel.value = reel
            return reel
        } catch (error) {
            console.error('Error getting reel:', error)
            return null
        }
    }

    const toggleLike = async (id: string) => {
        try {
            const isLiked = await reelsService.likeReel(id)
            const reel = reels.value.find(r => r.id === id)
            if (reel) {
                reel.is_liked = isLiked
            }
            if (currentReel.value?.id === id) {
                currentReel.value.is_liked = isLiked
            }
            toast({
                title: isLiked ? 'Đã thích' : 'Bỏ thích',
                description: isLiked ? 'Đã thêm vào danh sách yêu thích' : 'Đã xóa khỏi danh sách yêu thích'
            })
        } catch (error) {
            console.error('Error toggling like:', error)
            toast({
                title: 'Lỗi',
                description: 'Không thể thực hiện. Vui lòng thử lại.',
                variant: 'destructive'
            })
        }
    }

    const shareReel = async (reel: Reel, platform?: string) => {
        try {
            await reelsService.shareReel(reel.id)
            const localReel = reels.value.find(r => r.id === reel.id)
            if (localReel) {
                localReel.stats.shares++
            }
            const shareUrl = `${window.location.origin}/reels/${reel.id}`
            const shareText = `${reel.title} - Xem video này trên cửa hàng của chúng tôi!`
            if (platform === 'facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
            } else if (platform === 'twitter') {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)
            } else if (platform === 'copy') {
                await navigator.clipboard.writeText(shareUrl)
                toast({
                    title: 'Đã sao chép',
                    description: 'Link video đã được sao chép vào clipboard'
                })
            } else if (navigator.share) {
                await navigator.share({
                    title: reel.title,
                    text: shareText,
                    url: shareUrl
                })
            }
        } catch (error) {
            console.error('Error sharing reel:', error)
            toast({
                title: 'Lỗi',
                description: 'Không thể chia sẻ. Vui lòng thử lại.',
                variant: 'destructive'
            })
        }
    }

    const addView = async (id: string) => {
        try {
            await reelsService.addView(id)
        } catch (error) {
            console.error('Error adding view:', error)
        }
    }

    const changeCategory = (category: ReelCategory) => {
        currentCategory.value = category
        loadReels(true)
    }

    const search = (query: string) => {
        searchQuery.value = query
        loadReels(true)
    }

    const isEmpty = computed(() => !isLoading.value && reels.value.length === 0)

    return {
        reels,
        currentReel,
        isLoading,
        isLoadingMore,
        hasMore,
        currentCategory,
        searchQuery,
        isEmpty,
        loadReels,
        loadMore,
        getReelById,
        toggleLike,
        shareReel,
        addView,
        changeCategory,
        search
    }
}

export function useReelComments(reelId: string) {
    const comments = ref<ReelComment[]>([])
    const isLoading = ref(false)
    const isLoadingMore = ref(false)
    const hasMore = ref(true)
    const currentPage = ref(1)
    const { toast } = useToast()
    const loadComments = async (reset = false) => {
        if (reset) {
            currentPage.value = 1
            hasMore.value = true
        }
        if (!hasMore.value) return
        isLoading.value = reset
        isLoadingMore.value = !reset
        try {
            const response = await reelsService.getComments(reelId, currentPage.value)
            if (reset) {
                comments.value = response.data
            } else {
                comments.value.push(...response.data)
            }
            hasMore.value = response.hasMore
            if (response.hasMore) {
                currentPage.value++
            }
        } catch (error) {
            console.error('Error loading comments:', error)
            toast({
                title: 'Lỗi',
                description: 'Không thể tải bình luận. Vui lòng thử lại.',
                variant: 'destructive'
            })
        } finally {
            isLoading.value = false
            isLoadingMore.value = false
        }
    }
    const addComment = async (content: string) => {
        if (!content.trim()) return
        try {
            const newComment = await reelsService.addComment(reelId, content.trim())
            comments.value.unshift(newComment)
            toast({
                title: 'Thành công',
                description: 'Bình luận của bạn đã được thêm'
            })
        } catch (error) {
            console.error('Error adding comment:', error)
            toast({
                title: 'Lỗi',
                description: 'Không thể thêm bình luận. Vui lòng thử lại.',
                variant: 'destructive'
            })
        }
    }
    return {
        comments,
        isLoading,
        isLoadingMore,
        hasMore,
        loadComments,
        addComment
    }
}
