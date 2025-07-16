<template>
    <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {{ t('admin.customers.title') }}
        </h1>
        <DataTable
            :columns="columns"
            :data="customers"
            :loading="loading"
            show-global-filter
            :filter-placeholder="t('admin.customers.searchPlaceholder')"
            :rows-per-page-text="t('admin.productsManagement.pagination.rowsPerPage')"
            :go-to-first-page-text="t('admin.productsManagement.pagination.first')"
            :go-to-previous-page-text="t('admin.productsManagement.pagination.previous')"
            :go-to-next-page-text="t('admin.productsManagement.pagination.next')"
            :go-to-last-page-text="t('admin.productsManagement.pagination.last')"
            :page-text="t('admin.productsManagement.pagination.page')"
            :of-text="t('admin.productsManagement.pagination.of')"
            :loading-text="t('common.loading')"
            :no-data-text="t('admin.customers.noCustomers')"
        />
    </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import DataTable from '@/components/ui/DataTable.vue'
import { useCustomers } from '@/composables/useCustomers'
import { Button } from '@/components/ui/button'

const router = useRouter()
const { t } = useAppI18n()

const columns = [
    {
        accessorKey: 'name',
        header: () => t('admin.customers.name'),
        cell: ({ row }: any) => row.original.name,
    },
    {
        accessorKey: 'email',
        header: () => t('admin.customers.email'),
        cell: ({ row }: any) => row.original.email,
    },
    {
        accessorKey: 'phone',
        header: () => t('admin.customers.phone'),
        cell: ({ row }: any) => row.original.phone,
    },
    {
        accessorKey: 'status',
        header: () => t('admin.customers.status'),
        cell: ({ row }: any) => {
            return row.original.active
                ? h('span', { class: 'text-green-600 font-medium' }, t('admin.customers.active'))
                : h('span', { class: 'text-gray-400' }, t('admin.customers.inactive'))
        },
    },
    {
        accessorKey: 'actions',
        header: () => t('admin.customers.actions'),
        cell: ({ row }: any) => {
            return h(
                Button,
                {
                    variant: 'default',
                    size: 'default',
                    class: 'px-3 py-1 text-sm',
                    onClick: () => viewCustomer(row.original),
                },
                () => t('admin.customers.view'),
            )
        },
    },
]

const { customers, loading } = useCustomers()

function viewCustomer(customer: any) {
    router.push({ name: 'AdminCustomerDetail', params: { id: customer.id } })
}
</script>
