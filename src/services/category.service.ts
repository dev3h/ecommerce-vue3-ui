import categoriesData from '@/data/categories.json'

export interface Category {
    id: string
    name: string
    slug: string
    description: string
    icon: string
    color: string
    count: number
    parent_id: string | null
    order: number
    created_at: string
    updated_at: string
}

export interface CategoryFormData {
    name: string
    slug: string
    description: string
    icon: string
    parent_id: string | null
    order: number
}

// Simulate localStorage for persistence
const CATEGORIES_KEY = 'categories_data'

class CategoryService {
    private getStoredCategories(): Category[] {
        try {
            const stored = localStorage.getItem(CATEGORIES_KEY)
            if (stored) {
                return JSON.parse(stored)
            }
            // Initialize with default data
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categoriesData.categories))
            return categoriesData.categories
        } catch {
            return categoriesData.categories
        }
    }

    private saveCategories(categories: Category[]): void {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
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

    async getCategories(): Promise<Category[]> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.getStoredCategories()
    }

    async getCategoriesTree(): Promise<Category[]> {
        const categories = await this.getCategories()
        const parentCategories = categories.filter((cat) => !cat.parent_id)

        return parentCategories.map((parent) => ({
            ...parent,
            children: categories.filter((cat) => cat.parent_id === parent.id),
        })) as any
    }

    async getCategory(id: string): Promise<Category | null> {
        await new Promise((resolve) => setTimeout(resolve, 800))
        const categories = this.getStoredCategories()
        return categories.find((cat) => cat.id === id) || null
    }

    async createCategory(data: CategoryFormData): Promise<Category> {
        await new Promise((resolve) => setTimeout(resolve, 1200))

        const categories = this.getStoredCategories()
        const newCategory: Category = {
            id: this.generateId(),
            name: data.name,
            slug: data.slug || this.generateSlug(data.name),
            description: data.description,
            icon: data.icon,
            color: 'bg-gray-100', // Default color
            count: 0,
            parent_id: data.parent_id,
            order: data.order || categories.length + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        categories.push(newCategory)
        this.saveCategories(categories)
        return newCategory
    }

    async updateCategory(id: string, data: Partial<CategoryFormData>): Promise<Category> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const categories = this.getStoredCategories()
        const index = categories.findIndex((cat) => cat.id === id)

        if (index === -1) {
            throw new Error('Category not found')
        }

        const updatedCategory = {
            ...categories[index],
            ...data,
            slug: data.slug || this.generateSlug(data.name || categories[index].name),
            updated_at: new Date().toISOString(),
        }

        categories[index] = updatedCategory
        this.saveCategories(categories)
        return updatedCategory
    }

    async deleteCategory(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const categories = this.getStoredCategories()

        // Check if category has children
        const hasChildren = categories.some((cat) => cat.parent_id === id)
        if (hasChildren) {
            throw new Error('Cannot delete category with subcategories')
        }

        const filteredCategories = categories.filter((cat) => cat.id !== id)
        this.saveCategories(filteredCategories)
    }

    async getParentCategories(): Promise<Category[]> {
        const categories = await this.getCategories()
        return categories.filter((cat) => !cat.parent_id)
    }

    async reorderCategories(categoryIds: string[]): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const categories = this.getStoredCategories()

        categoryIds.forEach((id, index) => {
            const category = categories.find((cat) => cat.id === id)
            if (category) {
                category.order = index + 1
                category.updated_at = new Date().toISOString()
            }
        })

        this.saveCategories(categories)
    }
}

export const categoryService = new CategoryService()
