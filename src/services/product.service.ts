export interface ProductVariant {
    id: string
    name: string
    sku: string
    price: number
    sale_price?: number
    stock_quantity: number
    attributes: Record<string, string>
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string
    short_description?: string
    sku: string
    price: number
    sale_price?: number
    currency: string
    status: 'draft' | 'published' | 'archived'
    featured: boolean
    stock_quantity: number
    manage_stock: boolean
    stock_status: 'in_stock' | 'out_of_stock' | 'low_stock'
    category_id: string
    brand_id: string
    tags: string[]
    images: string[]
    variants?: ProductVariant[]
    attributes: Record<string, any>
    created_at: string
    updated_at: string
}

export interface ProductFormData {
    name: string
    slug?: string
    description: string
    short_description?: string
    sku: string
    price: number
    sale_price?: number
    currency: string
    status: 'draft' | 'published' | 'archived'
    featured: boolean
    stock_quantity: number
    manage_stock: boolean
    category_id: string
    brand_id: string
    tags: string[]
    images: string[]
    variants?: Omit<ProductVariant, 'id'>[]
    attributes: Record<string, any>
}

// Simulate localStorage for persistence
const PRODUCTS_KEY = 'products_data'

class ProductService {
    private getStoredProducts(): Product[] {
        try {
            const stored = localStorage.getItem(PRODUCTS_KEY)
            if (stored) {
                const products = JSON.parse(stored)
                return products
            }

            // Initialize with empty array - let users create their own products
            const initialProducts: Product[] = []

            this.saveProducts(initialProducts)
            return initialProducts
        } catch {
            return []
        }
    }

    private saveProducts(products: Product[]): void {
        try {
            // Check storage size before saving
            const currentSize = this.getLocalStorageSize()
            const estimatedSize = JSON.stringify(products).length

            // If storage is getting close to limit (assume 5MB limit, warn at 4MB)
            if (currentSize + estimatedSize > 4 * 1024 * 1024) {
                console.warn('Storage getting close to limit. Pre-emptively clearing old data...')
                this.clearOldData()
            }

            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                // Handle localStorage quota exceeded
                console.warn('localStorage quota exceeded. Clearing old data and retrying...')

                // More aggressive clearing - clear ALL localStorage data
                this.clearAllStorage()

                // Keep only essential product data (remove images and variants for storage)
                const essentialProducts = products.map((product) => ({
                    ...product,
                    images: product.images.slice(0, 1), // Keep only first image
                    variants: undefined, // Remove variants temporarily
                    attributes: {}, // Clear attributes
                }))

                try {
                    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(essentialProducts))
                    console.log('Successfully saved essential product data after clearing storage')
                } catch (retryError) {
                    console.error(
                        'Failed to save products even after clearing localStorage:',
                        retryError,
                    )
                    throw new Error(
                        'Storage quota exceeded. Please refresh the page and try again.',
                    )
                }
            } else {
                console.error('Failed to save products:', error)
                throw new Error('Failed to save product data.')
            }
        }
    }

    private generateId(): string {
        return Date.now().toString()
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
    }

    // Helper method to check localStorage usage
    private getLocalStorageSize(): number {
        let total = 0
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length
            }
        }
        return total
    }

    // Helper method to clear all product data
    clearAllData(): void {
        localStorage.removeItem(PRODUCTS_KEY)
        console.log('All product data cleared from localStorage')
    }

    // Helper method to clear all localStorage (more aggressive)
    private clearAllStorage(): void {
        try {
            localStorage.clear()
            console.log('All localStorage data cleared')
        } catch (error) {
            console.error('Failed to clear localStorage:', error)
        }
    }

    // Helper method to clear old/unnecessary data
    private clearOldData(): void {
        try {
            // List of keys that might be taking up space
            const keysToCheck = ['vue-devtools', 'vuex', 'pinia', 'user-preferences']

            keysToCheck.forEach((key) => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key)
                    console.log(`Cleared ${key} from localStorage`)
                }
            })

            // Also clear any old product data that might be corrupted
            const productData = localStorage.getItem(PRODUCTS_KEY)
            if (productData) {
                try {
                    const parsed = JSON.parse(productData)
                    if (!Array.isArray(parsed)) {
                        localStorage.removeItem(PRODUCTS_KEY)
                        console.log('Cleared corrupted product data')
                    }
                } catch {
                    localStorage.removeItem(PRODUCTS_KEY)
                    console.log('Cleared invalid product data')
                }
            }
        } catch (error) {
            console.error('Failed to clear old data:', error)
        }
    }

    async getProducts(): Promise<Product[]> {
        await new Promise((resolve) => setTimeout(resolve, 800))
        const products = this.getStoredProducts()

        // Sort products by creation date (newest first)
        return products.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return dateB - dateA
        })
    }

    async getProduct(id: string): Promise<Product | null> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const products = this.getStoredProducts()
        return products.find((product) => product.id === id) || null
    }

    async createProduct(data: ProductFormData): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const products = this.getStoredProducts()
        const newProduct: Product = {
            id: this.generateId(),
            ...data,
            slug: data.slug || this.generateSlug(data.name),
            variants: data.variants?.map((variant, index) => ({
                ...variant,
                id: `v${Date.now()}-${index}`,
            })),
            stock_status: data.stock_quantity > 0 ? 'in_stock' : 'out_of_stock',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        products.push(newProduct)
        this.saveProducts(products)
        return newProduct
    }

    async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const products = this.getStoredProducts()
        const index = products.findIndex((product) => product.id === id)

        if (index === -1) {
            throw new Error('Product not found')
        }

        const updatedProduct: Product = {
            ...products[index],
            ...data,
            slug: data.slug || this.generateSlug(data.name || products[index].name),
            variants:
                data.variants?.map((variant, variantIndex) => ({
                    ...variant,
                    id: `v${Date.now()}-${variantIndex}`,
                })) || products[index].variants,
            stock_status:
                (data.stock_quantity ?? products[index].stock_quantity) > 0
                    ? 'in_stock'
                    : 'out_of_stock',
            updated_at: new Date().toISOString(),
        }

        products[index] = updatedProduct
        this.saveProducts(products)
        return updatedProduct
    }

    async deleteProduct(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 800))

        const products = this.getStoredProducts()
        const filteredProducts = products.filter((product) => product.id !== id)
        this.saveProducts(filteredProducts)
    }

    // Helper method to resize image before converting to base64
    private resizeImage(
        file: File,
        maxWidth: number = 800,
        maxHeight: number = 600,
        quality: number = 0.8,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height)
                    width *= ratio
                    height *= ratio
                }

                // Set canvas size
                canvas.width = width
                canvas.height = height

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height)

                // Convert to base64 with compression
                const dataUrl = canvas.toDataURL('image/jpeg', quality)
                resolve(dataUrl)
            }

            img.onerror = () => reject(new Error('Failed to load image for resizing'))

            // Create blob URL from file
            const blobUrl = URL.createObjectURL(file)
            img.src = blobUrl
        })
    }

    // Helper method to upload/process product images
    async uploadImages(files: File[]): Promise<string[]> {
        console.log(`Starting upload of ${files.length} files`)

        // Simulate file upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check storage health before processing large images
        const storageHealth = this.checkStorageHealth()
        if (storageHealth.needsCleanup) {
            console.warn('Storage needs cleanup before uploading images')
            await this.optimizeStorage()
        }

        // Convert files to base64 data URLs for local storage
        const uploadPromises = files.map(async (file, index) => {
            console.log(`Processing file ${index + 1}: ${file.name} (${file.size} bytes)`)

            // Check file size (limit to 5MB before resize)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`)
            }

            try {
                // Resize image to reduce storage usage
                const resizedDataUrl = await this.resizeImage(file)
                console.log(`Successfully resized and converted file ${index + 1} to base64`)
                return resizedDataUrl
            } catch (error) {
                console.error(`Failed to resize image ${file.name}:`, error)
                // Fallback to original FileReader method
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => {
                        if (reader.result && typeof reader.result === 'string') {
                            console.log(
                                `Fallback: Successfully converted file ${index + 1} to base64`,
                            )
                            resolve(reader.result)
                        } else {
                            reject(new Error('Failed to read file'))
                        }
                    }
                    reader.onerror = () => reject(new Error('Failed to read file'))
                    reader.readAsDataURL(file)
                })
            }
        })

        try {
            const base64Images = await Promise.all(uploadPromises)
            console.log(`All ${base64Images.length} files converted to base64`)

            // Test if we can save the images by checking storage quota
            try {
                const testKey = 'test_image_storage'
                const testData = base64Images.join(',')
                localStorage.setItem(testKey, testData)
                localStorage.removeItem(testKey)
                console.log('Storage test successful, returning base64 images')
                return base64Images
            } catch (storageError) {
                console.error(
                    'Storage quota exceeded, optimizing and using fallback:',
                    storageError,
                )
                await this.optimizeStorage()
                throw new Error('Storage quota exceeded. Please try again.')
            }
        } catch (error) {
            console.error('Error converting images to base64:', error)

            // If it's a storage quota error, throw it up
            if (error instanceof Error && error.message.includes('Storage quota')) {
                throw error
            }

            // For file size errors, throw them up
            if (error instanceof Error && error.message.includes('too large')) {
                throw error
            }

            // For other errors, also throw them to inform user
            throw new Error(
                `Failed to process uploaded images: ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
        }
    }

    // Public method to check storage health
    checkStorageHealth(): {
        used: number
        percentage: number
        needsCleanup: boolean
        recommendations: string[]
    } {
        const totalUsed = this.getLocalStorageSize()
        const maxSize = 5 * 1024 * 1024 // Assume 5MB limit
        const percentage = (totalUsed / maxSize) * 100
        const needsCleanup = percentage > 80

        const recommendations: string[] = []
        if (percentage > 90) {
            recommendations.push('Critical: Storage almost full. Clear old data immediately.')
        } else if (percentage > 80) {
            recommendations.push('Warning: Storage usage is high. Consider clearing old data.')
        } else if (percentage > 60) {
            recommendations.push('Storage usage is moderate. Monitor for potential issues.')
        }

        return {
            used: totalUsed,
            percentage: Math.round(percentage),
            needsCleanup,
            recommendations,
        }
    }

    // Public method to optimize storage
    async optimizeStorage(): Promise<void> {
        try {
            console.log('Optimizing storage...')

            // Clear old data first
            this.clearOldData()

            // Get current products
            const products = this.getStoredProducts()

            // Optimize product data by reducing image count and removing unnecessary data
            const optimizedProducts = products.map((product) => ({
                ...product,
                images: product.images.slice(0, 2), // Keep only first 2 images
                variants: product.variants?.slice(0, 3), // Keep only first 3 variants
                attributes:
                    Object.keys(product.attributes || {}).length > 5
                        ? Object.fromEntries(Object.entries(product.attributes).slice(0, 5))
                        : product.attributes,
            }))

            // Save optimized data
            this.saveProducts(optimizedProducts)

            console.log('Storage optimization completed')
        } catch (error) {
            console.error('Storage optimization failed:', error)
            throw new Error('Failed to optimize storage')
        }
    }
}

export const productService = new ProductService()

// Development helper - expose to window for debugging
if (typeof window !== 'undefined' && import.meta.env.DEV) {
    ;(window as any).productService = productService
    ;(window as any).clearProductData = () => {
        productService.clearAllData()
        console.log('Product data cleared! Refresh the page to see changes.')
    }
    ;(window as any).checkStorageHealth = () => {
        const health = productService.checkStorageHealth()
        console.log('Storage Health:', health)
        return health
    }
    ;(window as any).optimizeStorage = async () => {
        try {
            await productService.optimizeStorage()
            console.log('Storage optimized successfully!')
        } catch (error) {
            console.error('Storage optimization failed:', error)
        }
    }
    ;(window as any).getStorageSize = () => {
        let total = 0
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length
            }
        }
        console.log(`localStorage size: ${Math.round(total / 1024)} KB`)
        return total
    }
}
