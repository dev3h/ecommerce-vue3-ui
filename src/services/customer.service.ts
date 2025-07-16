import customersData from '@/data/customers.json'

export type Customer = {
    id: number
    name: string
    email: string
    phone: string
    active: boolean
}

export async function fetchCustomersService(keyword = ''): Promise<Customer[]> {
    await new Promise((resolve) => setTimeout(resolve, 700))
    let data = customersData as Customer[]
    if (keyword) {
        const lower = keyword.toLowerCase()
        data = data.filter(
            (c) =>
                c.name.toLowerCase().includes(lower) ||
                c.email.toLowerCase().includes(lower) ||
                c.phone.includes(keyword),
        )
    }
    return data
}
