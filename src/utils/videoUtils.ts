// Video utility functions for Reels
export const VIDEO_FALLBACKS = [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
]

export const getWorkingVideoUrl = async (urls: string[]): Promise<string | null> => {
    for (const url of urls) {
        try {
            const response = await fetch(url, { method: 'HEAD' })
            if (response.ok) {
                return url
            }
        } catch (error) {
            console.warn(`Video URL failed: ${url}`, error)
        }
    }
    return null
}

export const validateVideoUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const video = document.createElement('video')
        video.src = url
        video.muted = true
        
        video.oncanplay = () => resolve(true)
        video.onerror = () => resolve(false)
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(false), 5000)
    })
}

export const getRandomFallbackVideo = (): string => {
    const randomIndex = Math.floor(Math.random() * VIDEO_FALLBACKS.length)
    return VIDEO_FALLBACKS[randomIndex]
}
