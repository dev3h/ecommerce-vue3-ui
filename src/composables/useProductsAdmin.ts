import { ref } from 'vue'
import { productService, type Product, type ProductFormData } from '@/services/product.service'

export function useProducts() {
    const products = ref<Product[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const loadProducts = async () => {
        try {
            loading.value = true
            error.value = null
            products.value = await productService.getProducts()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load products'
        } finally {
            loading.value = false
        }
    }

    const createProduct = async (data: ProductFormData) => {
        try {
            loading.value = true
            error.value = null
            const newProduct = await productService.createProduct(data)
            products.value.unshift(newProduct) // Add to beginning
            return newProduct
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create product'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateProduct = async (id: string, data: Partial<ProductFormData>) => {
        try {
            loading.value = true
            error.value = null
            const updatedProduct = await productService.updateProduct(id, data)
            const index = products.value.findIndex((p) => p.id === id)
            if (index !== -1) {
                products.value[index] = updatedProduct
            }
            return updatedProduct
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update product'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteProduct = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            await productService.deleteProduct(id)
            products.value = products.value.filter((p) => p.id !== id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete product'
            throw err
        } finally {
            loading.value = false
        }
    }

    const getProduct = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            return await productService.getProduct(id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to get product'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        products,
        loading,
        error,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getProduct,
    }
}
