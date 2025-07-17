import couponsData from '@/data/coupons.json'

export interface Coupon {
    id: string
    code: string
    description: string
    discount: number
    type: 'percent' | 'amount' | 'freeship'
    active: boolean
    created_at: string
    updated_at: string
}

export interface CouponFormData {
    code: string
    description: string
    discount: number
    type: 'percent' | 'amount' | 'freeship'
    active: boolean
}

const COUPONS_KEY = 'coupons_data'

class CouponService {
    private getStoredCoupons(): Coupon[] {
        try {
            const stored = localStorage.getItem(COUPONS_KEY)
            if (stored) {
                return JSON.parse(stored)
            }
            // Initialize with default data (flat array), add created_at/updated_at if missing
            const now = new Date().toISOString()
            const initial: Coupon[] = (couponsData as any[]).map((c) => ({
                ...c,
                created_at: c.created_at || now,
                updated_at: c.updated_at || now,
            }))
            localStorage.setItem(COUPONS_KEY, JSON.stringify(initial))
            return initial
        } catch {
            const now = new Date().toISOString()
            return (couponsData as any[]).map((c) => ({
                ...c,
                created_at: c.created_at || now,
                updated_at: c.updated_at || now,
            }))
        }
    }

    private saveCoupons(coupons: Coupon[]): void {
        localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons))
    }

    private generateId(): string {
        return Date.now().toString()
    }

    async getCoupons(): Promise<Coupon[]> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return this.getStoredCoupons()
    }

    async getCoupon(id: string): Promise<Coupon | null> {
        await new Promise((resolve) => setTimeout(resolve, 300))
        const coupons = this.getStoredCoupons()
        return coupons.find((c) => c.id === id) || null
    }

    async createCoupon(data: CouponFormData): Promise<Coupon> {
        await new Promise((resolve) => setTimeout(resolve, 700))
        const coupons = this.getStoredCoupons()
        const newCoupon: Coupon = {
            id: this.generateId(),
            code: data.code,
            description: data.description,
            discount: data.type === 'freeship' ? 0 : data.discount,
            type: data.type,
            active: data.active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        coupons.push(newCoupon)
        this.saveCoupons(coupons)
        return newCoupon
    }

    async updateCoupon(id: string, data: Partial<CouponFormData>): Promise<Coupon> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const coupons = this.getStoredCoupons()
        const index = coupons.findIndex((c) => c.id === id)
        if (index === -1) {
            throw new Error('Coupon not found')
        }
        const updatedCoupon: Coupon = {
            ...coupons[index],
            ...data,
            discount: data.type === 'freeship' ? 0 : (data.discount ?? coupons[index].discount),
            updated_at: new Date().toISOString(),
        }
        coupons[index] = updatedCoupon
        this.saveCoupons(coupons)
        return updatedCoupon
    }

    async deleteCoupon(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 400))
        const coupons = this.getStoredCoupons()
        const filtered = coupons.filter((c) => c.id !== id)
        this.saveCoupons(filtered)
    }
}

export const couponService = new CouponService()
