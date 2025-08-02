export interface Coupon {
    id: string
    name: string
    description: string
    has_limit: boolean
    usage_limit?: number
    discount_type: 'fixed' | 'percentage'
    discount_value: number
    start_date: string
    end_date: string
    status: 'active' | 'inactive' | 'expired'
    usage_count: number
    created_at: string
    updated_at: string
}

export interface CouponFormData {
    name: string
    description: string
    has_limit: boolean
    usage_limit?: number
    discount_type: 'fixed' | 'percentage'
    discount_value: number
    start_date: string
    end_date: string
    status: 'active' | 'inactive'
}

export type CouponStatus = 'active' | 'inactive' | 'expired'
export type CouponDiscountType = 'fixed' | 'percentage'
