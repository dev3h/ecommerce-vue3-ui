import { ref } from 'vue'
import type { Coupon, CouponFormData } from '@/types/coupon'
import couponsData from '@/data/coupons.json'

class CouponService {
    private coupons = ref<Coupon[]>(couponsData as Coupon[])

    async getCoupons(): Promise<Coupon[]> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Update status based on dates
        const now = new Date()
        const updatedCoupons = this.coupons.value.map((coupon) => {
            const endDate = new Date(coupon.end_date)
            if (endDate < now && coupon.status !== 'expired') {
                return { ...coupon, status: 'expired' as const }
            }
            return coupon
        })

        this.coupons.value = updatedCoupons
        return [...this.coupons.value]
    }

    async getCoupon(id: string): Promise<Coupon> {
        await new Promise((resolve) => setTimeout(resolve, 200))

        const coupon = this.coupons.value.find((c) => c.id === id)
        if (!coupon) {
            throw new Error('Coupon not found')
        }
        return { ...coupon }
    }

    async createCoupon(data: CouponFormData): Promise<Coupon> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if coupon name already exists
        const existingCoupon = this.coupons.value.find(
            (c) => c.name.toLowerCase() === data.name.toLowerCase(),
        )
        if (existingCoupon) {
            throw new Error('Coupon with this name already exists')
        }

        const newCoupon: Coupon = {
            id: (Math.max(...this.coupons.value.map((c) => parseInt(c.id))) + 1).toString(),
            ...data,
            usage_limit: data.has_limit ? data.usage_limit : undefined,
            usage_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        this.coupons.value.unshift(newCoupon)
        return { ...newCoupon }
    }

    async updateCoupon(id: string, data: Partial<CouponFormData>): Promise<Coupon> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const index = this.coupons.value.findIndex((c) => c.id === id)
        if (index === -1) {
            throw new Error('Coupon not found')
        }

        // Check if name is being changed and if it conflicts with existing
        if (data.name) {
            const existingCoupon = this.coupons.value.find(
                (c) => c.id !== id && c.name.toLowerCase() === data.name!.toLowerCase(),
            )
            if (existingCoupon) {
                throw new Error('Coupon with this name already exists')
            }
        }

        const updatedCoupon: Coupon = {
            ...this.coupons.value[index],
            ...data,
            usage_limit:
                data.has_limit !== undefined
                    ? data.has_limit
                        ? data.usage_limit
                        : undefined
                    : this.coupons.value[index].usage_limit,
            updated_at: new Date().toISOString(),
        }

        this.coupons.value[index] = updatedCoupon
        return { ...updatedCoupon }
    }

    async deleteCoupon(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 300))

        const index = this.coupons.value.findIndex((c) => c.id === id)
        if (index === -1) {
            throw new Error('Coupon not found')
        }

        this.coupons.value.splice(index, 1)
    }

    async bulkUpdateStatus(ids: string[], status: 'active' | 'inactive'): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500))

        for (const id of ids) {
            const index = this.coupons.value.findIndex((c) => c.id === id)
            if (index !== -1) {
                this.coupons.value[index] = {
                    ...this.coupons.value[index],
                    status,
                    updated_at: new Date().toISOString(),
                }
            }
        }
    }

    async validateCouponName(name: string, excludeId?: string): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 200))

        const existingCoupon = this.coupons.value.find(
            (c) => c.id !== excludeId && c.name.toLowerCase() === name.toLowerCase(),
        )
        return !existingCoupon
    }
}

export const couponService = new CouponService()
export * from '@/types/coupon'
