import dashboardData from '@/data/dashboard.json'

export interface RevenueData {
    name: string
    revenue: number
    profit: number
}

export interface OrdersData {
    name: string
    orders: number
    completed: number
}

export interface CustomerActivityData {
    name: string
    active: number
}

export interface YearlyComparisonData {
    name: string
    revenue: number
}

export interface QuickStats {
    totalRevenue: string
    totalOrders: string
    activeCustomers: string
    conversionRate: string
    revenueGrowth: string
    ordersGrowth: string
    customersGrowth: string
    conversionGrowth: string
}

export interface ProductCategory {
    name: string
    value: number
}

export interface TopProduct {
    product: string
    sales: number
}

export interface RecentOrder {
    id: string
    customer: string
    amount: number
    status: string
    date: string
    paymentMethod: string
}

export interface NewMember {
    name: string
    email: string
    joinDate: string
    orders: number
}

export interface RecentActivity {
    type: string
    message: string
    time: string
    status: string
}

export interface DashboardData {
    revenueOverview: RevenueData[]
    ordersStatistics: OrdersData[]
    customerActivity: CustomerActivityData[]
    yearlyComparison: YearlyComparisonData[]
    quickStats: QuickStats
    productCategories: ProductCategory[]
    topProducts: TopProduct[]
    recentOrders: RecentOrder[]
    newMembers: NewMember[]
    recentActivities: RecentActivity[]
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class DashboardService {
    /**
     * Get all dashboard data
     */
    async getDashboardData(): Promise<DashboardData> {
        await delay(500) // Simulate API delay
        return dashboardData as DashboardData
    }

    /**
     * Get revenue overview data (12 months)
     */
    async getRevenueOverview(): Promise<RevenueData[]> {
        await delay(300)
        return dashboardData.revenueOverview as RevenueData[]
    }

    /**
     * Get orders statistics data (12 months)
     */
    async getOrdersStatistics(): Promise<OrdersData[]> {
        await delay(300)
        return dashboardData.ordersStatistics as OrdersData[]
    }

    /**
     * Get customer activity data (12 months)
     */
    async getCustomerActivity(): Promise<CustomerActivityData[]> {
        await delay(300)
        return dashboardData.customerActivity as CustomerActivityData[]
    }

    /**
     * Get yearly comparison data (3 years)
     */
    async getYearlyComparison(): Promise<YearlyComparisonData[]> {
        await delay(300)
        return dashboardData.yearlyComparison as YearlyComparisonData[]
    }

    /**
     * Get quick stats
     */
    async getQuickStats(): Promise<QuickStats> {
        await delay(200)
        return dashboardData.quickStats as QuickStats
    }

    /**
     * Get product categories
     */
    async getProductCategories(): Promise<ProductCategory[]> {
        await delay(200)
        return dashboardData.productCategories as ProductCategory[]
    }

    /**
     * Get top products
     */
    async getTopProducts(): Promise<TopProduct[]> {
        await delay(200)
        return dashboardData.topProducts as TopProduct[]
    }

    /**
     * Get recent orders
     */
    async getRecentOrders(): Promise<RecentOrder[]> {
        await delay(200)
        return dashboardData.recentOrders as RecentOrder[]
    }

    /**
     * Get new members
     */
    async getNewMembers(): Promise<NewMember[]> {
        await delay(200)
        return dashboardData.newMembers as NewMember[]
    }

    /**
     * Get recent activities
     */
    async getRecentActivities(): Promise<RecentActivity[]> {
        await delay(200)
        return dashboardData.recentActivities as RecentActivity[]
    }
}

export const dashboardService = new DashboardService()
export default dashboardService
