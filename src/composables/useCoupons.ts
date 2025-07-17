import { ref, computed } from 'vue'
import { couponService, type Coupon, type CouponFormData } from '@/services/coupon.service'

const coupons = ref<Coupon[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useCoupons() {
    // Computed
    const couponsList = computed(() => coupons.value)

    // Actions
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
        alert(1);
        try {
            loading.value = true
            error.value = null
            const newCoupon = await couponService.createCoupon(data)
            coupons.value.push(newCoupon)
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

    const getCoupon = (id: string) => {
        return coupons.value.find((c) => c.id === id) || null
    }

    return {
        coupons: couponsList,
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        loadCoupons,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        getCoupon,
    }
}
