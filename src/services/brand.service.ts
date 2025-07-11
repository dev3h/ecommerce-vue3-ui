import brandsData from '@/data/brands.json'

export interface Brand {
    id: string
    name: string
    slug: string
    description?: string
    logo: string
    items: number
    created_at: string
    updated_at: string
}

export interface BrandFormData {
    name: string
    slug: string
    description?: string
    logo: string
}

// Simulate localStorage for persistence
const BRANDS_KEY = 'brands_data'

class BrandService {
    private getStoredBrands(): Brand[] {
        try {
            const stored = localStorage.getItem(BRANDS_KEY)
            if (stored) {
                const brands = JSON.parse(stored)
                // Check if brands have created_at field, if not, it's old format
                const needsUpdate = brands.some((brand: any) => !brand.created_at)

                if (needsUpdate) {
                    // Update old format to new format
                    const updatedBrands = brands.map((brand: any, index: number) => {
                        const createdAt =
                            brand.created_at ||
                            new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
                        return {
                            ...brand,
                            created_at: createdAt,
                            updated_at: brand.updated_at || createdAt,
                            slug: brand.slug || this.generateSlug(brand.name),
                            description: brand.description || '',
                            items: brand.items || Math.floor(Math.random() * 400) + 10,
                        }
                    })
                    this.saveBrands(updatedBrands)
                    return updatedBrands
                }

                return brands
            }
            // Initialize with mock data and convert to new format
            const initialBrands = brandsData.map((brand: any, index: number) => {
                // Create different creation times (newest first in the original data)
                const createdAt = new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString() // Each brand is 1 day older
                return {
                    id: brand.id.toString(),
                    name: brand.name,
                    slug: this.generateSlug(brand.name),
                    description: '',
                    logo: brand.image,
                    items: brand.items || Math.floor(Math.random() * 400) + 10, // Random number for item count
                    created_at: createdAt,
                    updated_at: createdAt,
                }
            })

            localStorage.setItem(BRANDS_KEY, JSON.stringify(initialBrands))
            return initialBrands
        } catch {
            // If there's an error, initialize with empty array
            return []
        }
    }

    private saveBrands(brands: Brand[]): void {
        localStorage.setItem(BRANDS_KEY, JSON.stringify(brands))
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

    async getBrands(): Promise<Brand[]> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))
        const brands = this.getStoredBrands()

        // Sort brands by creation date (newest first)
        return brands.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
            return dateB - dateA
        })
    }

    async getBrand(id: string): Promise<Brand | null> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const brands = this.getStoredBrands()
        return brands.find((brand) => brand.id === id) || null
    }

    async createBrand(data: BrandFormData): Promise<Brand> {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const brands = this.getStoredBrands()
        const newBrand: Brand = {
            id: this.generateId(),
            name: data.name,
            slug: data.slug || this.generateSlug(data.name),
            description: data.description || '',
            logo: data.logo,
            items: 0, // New brands start with 0 items
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        brands.push(newBrand) // Add new brand to the list
        this.saveBrands(brands)
        return newBrand
    }

    async updateBrand(id: string, data: Partial<BrandFormData>): Promise<Brand> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const brands = this.getStoredBrands()
        const index = brands.findIndex((brand) => brand.id === id)

        if (index === -1) {
            throw new Error('Brand not found')
        }

        const updatedBrand = {
            ...brands[index],
            ...data,
            slug: data.slug || this.generateSlug(data.name || brands[index].name),
            updated_at: new Date().toISOString(),
        }

        brands[index] = updatedBrand
        this.saveBrands(brands)
        return updatedBrand
    }

    async deleteBrand(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 800))

        const brands = this.getStoredBrands()
        const filteredBrands = brands.filter((brand) => brand.id !== id)
        this.saveBrands(filteredBrands)
    }

    // Helper method to upload/process logo image (mock implementation)
    async uploadLogo(file: File): Promise<string> {
        // In a real app, this would upload to a server
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                // Return the data URL as the "uploaded" image URL
                resolve(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        })
    }
}

export const brandService = new BrandService()
