import { ref } from 'vue'
import { couponService, type Coupon, type CouponFormData } from '@/services/coupon.service'

export function useCoupons() {
    const coupons = ref<Coupon[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const loadCoupons = async () => {
        try {
            loading.value = true
            error.value = null
            coupons.value = await couponService.getCoupons()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load coupons'
        } finally {
            loading.value = false
        }
    }

    const createCoupon = async (data: CouponFormData) => {
        try {
            loading.value = true
            error.value = null
            const newCoupon = await couponService.createCoupon(data)
            coupons.value.unshift(newCoupon) // Add to beginning
            return newCoupon
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to create coupon'
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateCoupon = async (id: string, data: Partial<CouponFormData>) => {
        try {
            loading.value = true
            error.value = null
            const updatedCoupon = await couponService.updateCoupon(id, data)
            const index = coupons.value.findIndex((c) => c.id === id)
            if (index !== -1) {
                coupons.value[index] = updatedCoupon
            }
            return updatedCoupon
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update coupon'
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteCoupon = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            await couponService.deleteCoupon(id)
            coupons.value = coupons.value.filter((c) => c.id !== id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to delete coupon'
            throw err
        } finally {
            loading.value = false
        }
    }

    const getCoupon = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            return await couponService.getCoupon(id)
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to get coupon'
            throw err
        } finally {
            loading.value = false
        }
    }

    const bulkUpdateStatus = async (ids: string[], status: 'active' | 'inactive') => {
        try {
            loading.value = true
            error.value = null
            await couponService.bulkUpdateStatus(ids, status)
            // Update local state
            for (const id of ids) {
                const index = coupons.value.findIndex((c) => c.id === id)
                if (index !== -1) {
                    coupons.value[index] = {
                        ...coupons.value[index],
                        status,
                        updated_at: new Date().toISOString(),
                    }
                }
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to update coupon status'
            throw err
        } finally {
            loading.value = false
        }
    }

    const validateCouponName = async (name: string, excludeId?: string) => {
        try {
            return await couponService.validateCouponName(name, excludeId)
        } catch (err) {
            console.error('Failed to validate coupon name:', err)
            return false
        }
    }

    return {
        coupons,
        loading,
        error,
        loadCoupons,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        getCoupon,
        bulkUpdateStatus,
        validateCouponName,
    }
}
