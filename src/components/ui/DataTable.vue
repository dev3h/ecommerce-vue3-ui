<template>
    <div class="space-y-4">
        <!-- Header Slot -->
        <div v-if="showHeader" class="flex items-center justify-between">
            <slot name="header" />
        </div>

        <!-- Global Filter Slot -->
        <div v-if="showGlobalFilter" class="flex items-center justify-between">
            <slot name="filter" :globalFilter="globalFilter" :setGlobalFilter="setGlobalFilter">
                <Input
                    :placeholder="filterPlaceholder"
                    :model-value="globalFilter"
                    @update:model-value="(value: string | number) => setGlobalFilter(String(value))"
                    class="max-w-sm"
                />
            </slot>
        </div>

        <!-- Data Table -->
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <div
                                v-if="!header.isPlaceholder"
                                class="flex items-center space-x-2"
                                :class="{
                                    'cursor-pointer select-none': header.column.getCanSort(),
                                }"
                                @click="header.column.getToggleSortingHandler()?.($event)"
                            >
                                <component
                                    :is="flexRender"
                                    :render="header.column.columnDef.header"
                                    :props="header.getContext()"
                                />
                                <div v-if="header.column.getCanSort()">
                                    <ArrowUpDown
                                        v-if="!header.column.getIsSorted()"
                                        class="ml-2 h-4 w-4"
                                    />
                                    <ArrowUp
                                        v-else-if="header.column.getIsSorted() === 'asc'"
                                        class="ml-2 h-4 w-4"
                                    />
                                    <ArrowDown v-else class="ml-2 h-4 w-4" />
                                </div>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <TableRow
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                            :data-state="row.getIsSelected() && 'selected'"
                            @click="$emit('rowClick', row.original, row)"
                        >
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <component
                                    :is="flexRender"
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()"
                                />
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableCell :colspan="columns.length" class="h-24 text-center">
                                <slot name="empty">
                                    <div v-if="loading" class="flex items-center justify-center">
                                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                                        {{ loadingText }}
                                    </div>
                                    <div v-else>{{ noDataText }}</div>
                                </slot>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>

        <!-- Pagination -->
        <div v-if="showPagination" class="flex items-center justify-between space-x-2 py-4">
            <slot
                name="pagination-left"
                :table="table"
                :selected-count="table.getFilteredSelectedRowModel().rows.length"
                :total-count="table.getFilteredRowModel().rows.length"
            >
                <div class="flex-1 text-sm text-muted-foreground">
                    {{ table.getFilteredSelectedRowModel().rows.length }} of
                    {{ table.getFilteredRowModel().rows.length }} row(s) selected.
                </div>
            </slot>

            <slot
                name="pagination-center"
                :table="table"
                :pageSize="pageSize"
                :setPageSize="setPageSize"
                :pageSizes="pageSizes"
            >
                <div class="flex items-center space-x-6 lg:space-x-8">
                    <div class="flex items-center space-x-2">
                        <p class="text-sm font-medium">{{ rowsPerPageText }}</p>
                        <Select
                            :model-value="pageSize.toString()"
                            @update:model-value="(value: any) => setPageSize(String(value))"
                        >
                            <SelectTrigger class="h-8 w-[70px]">
                                <SelectValue :placeholder="pageSize.toString()" />
                            </SelectTrigger>
                            <SelectContent side="top">
                                <SelectItem
                                    v-for="size in pageSizes"
                                    :key="String(size)"
                                    :value="String(size)"
                                >
                                    {{ size }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex w-[100px] items-center justify-center text-sm font-medium">
                        {{ pageText }} {{ table.getState().pagination.pageIndex + 1 }} {{ ofText }}
                        {{ table.getPageCount() }}
                    </div>

                    <!-- Simple pagination without PaginationRoot -->
                    <div class="flex items-center space-x-1">
                        <!-- First Page -->
                        <Button
                            variant="outline"
                            size="sm"
                            class="h-8 px-2"
                            :disabled="!table.getCanPreviousPage()"
                            @click="table.setPageIndex(0)"
                        >
                            {{ goToFirstPageText }}
                        </Button>

                        <!-- Previous Page -->
                        <Button
                            variant="outline"
                            size="sm"
                            class="h-8 px-2"
                            :disabled="!table.getCanPreviousPage()"
                            @click="table.previousPage()"
                        >
                            {{ goToPreviousPageText }}
                        </Button>

                        <!-- Page Numbers -->
                        <div class="flex items-center space-x-1">
                            <template v-for="pageNum in getVisiblePageNumbers()" :key="pageNum">
                                <Button
                                    v-if="pageNum !== null"
                                    :variant="
                                        pageNum === table.getState().pagination.pageIndex + 1
                                            ? 'default'
                                            : 'outline'
                                    "
                                    size="sm"
                                    class="h-8 w-8 p-0"
                                    @click="table.setPageIndex(pageNum - 1)"
                                >
                                    {{ pageNum }}
                                </Button>
                                <span v-else class="px-2 text-muted-foreground">...</span>
                            </template>
                        </div>

                        <!-- Next Page -->
                        <Button
                            variant="outline"
                            size="sm"
                            class="h-8 px-2"
                            :disabled="!table.getCanNextPage()"
                            @click="table.nextPage()"
                        >
                            {{ goToNextPageText }}
                        </Button>

                        <!-- Last Page -->
                        <Button
                            variant="outline"
                            size="sm"
                            class="h-8 px-2"
                            :disabled="!table.getCanNextPage()"
                            @click="table.setPageIndex(table.getPageCount() - 1)"
                        >
                            {{ goToLastPageText }}
                        </Button>
                    </div>
                </div>
            </slot>

            <slot name="pagination-right" :table="table" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
    FlexRender,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
} from '@tanstack/vue-table'

// Define emit events
const emit = defineEmits<{
    rowClick: [row: any, tableRow: any]
    selectionChange: [selection: any]
    sortingChange: [sorting: SortingState]
    filterChange: [filters: ColumnFiltersState]
    globalFilterChange: [filter: string]
    paginationChange: [pagination: { pageIndex: number; pageSize: number }]
}>()

// Props
const props = withDefaults(
    defineProps<{
        columns: any[]
        data: any[]
        loading?: boolean
        showHeader?: boolean
        showPagination?: boolean
        showGlobalFilter?: boolean
        filterPlaceholder?: string
        rowsPerPageText?: string
        goToFirstPageText?: string
        goToPreviousPageText?: string
        goToNextPageText?: string
        goToLastPageText?: string
        loadingText?: string
        noDataText?: string
        pageText?: string
        ofText?: string
        pageSizes?: number[]
        defaultPageSize?: number
        defaultSorting?: SortingState
        defaultColumnFilters?: ColumnFiltersState
        defaultGlobalFilter?: string
    }>(),
    {
        loading: false,
        showHeader: true,
        showPagination: true,
        showGlobalFilter: false,
        filterPlaceholder: 'Filter data...',
        rowsPerPageText: 'Rows per page',
        goToFirstPageText: 'Go to first page',
        goToPreviousPageText: 'Go to previous page',
        goToNextPageText: 'Go to next page',
        goToLastPageText: 'Go to last page',
        loadingText: 'Loading...',
        noDataText: 'No data found.',
        pageText: 'Page',
        ofText: 'of',
        pageSizes: () => [10, 20, 30, 40, 50],
        defaultPageSize: 10,
        defaultSorting: () => [],
        defaultColumnFilters: () => [],
        defaultGlobalFilter: '',
    },
)

// Reactive state
const sorting = ref<SortingState>(props.defaultSorting)
const columnFilters = ref<ColumnFiltersState>(props.defaultColumnFilters)
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const globalFilter = ref(props.defaultGlobalFilter)
const pageSize = ref(props.defaultPageSize)
const pageIndex = ref(0)

// Helper functions
const setGlobalFilter = (value: string) => {
    globalFilter.value = value
    emit('globalFilterChange', value)
}

const setPageSize = (value: string) => {
    const newSize = Number(value)
    pageSize.value = newSize
    pageIndex.value = 0 // Reset to first page
    emit('paginationChange', { pageIndex: 0, pageSize: newSize })
}

// Generate visible page numbers with ellipsis
const getVisiblePageNumbers = () => {
    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1
    const delta = 2 // Number of pages to show on each side of current page

    const range = []
    const rangeWithDots = []

    // Calculate start and end pages
    let start = Math.max(1, currentPage - delta)
    let end = Math.min(totalPages, currentPage + delta)

    // Adjust start and end if we're near the beginning or end
    if (currentPage <= delta + 1) {
        end = Math.min(totalPages, delta * 2 + 2)
    }
    if (currentPage >= totalPages - delta) {
        start = Math.max(1, totalPages - delta * 2 - 1)
    }

    // Generate the range
    for (let i = start; i <= end; i++) {
        range.push(i)
    }

    // Add first page and dots if needed
    if (start > 1) {
        rangeWithDots.push(1)
        if (start > 2) {
            rangeWithDots.push(null) // null represents ellipsis
        }
    }

    // Add the middle range
    rangeWithDots.push(...range)

    // Add last page and dots if needed
    if (end < totalPages) {
        if (end < totalPages - 1) {
            rangeWithDots.push(null) // null represents ellipsis
        }
        rangeWithDots.push(totalPages)
    }

    return rangeWithDots
}

// Table instance
const table = useVueTable({
    get data() {
        return props.data
    },
    get columns() {
        return props.columns
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
        const newSorting = typeof updater === 'function' ? updater(sorting.value) : updater
        sorting.value = newSorting
        emit('sortingChange', newSorting)
    },
    onColumnFiltersChange: (updater) => {
        const newFilters = typeof updater === 'function' ? updater(columnFilters.value) : updater
        columnFilters.value = newFilters
        emit('filterChange', newFilters)
    },
    onColumnVisibilityChange: (updater) => {
        columnVisibility.value =
            typeof updater === 'function' ? updater(columnVisibility.value) : updater
    },
    onRowSelectionChange: (updater) => {
        const newSelection = typeof updater === 'function' ? updater(rowSelection.value) : updater
        rowSelection.value = newSelection
        emit('selectionChange', newSelection)
    },
    onGlobalFilterChange: (updater) => {
        const newFilter = typeof updater === 'function' ? updater(globalFilter.value) : updater
        globalFilter.value = newFilter
        emit('globalFilterChange', newFilter)
    },
    onPaginationChange: (updater) => {
        const newPagination =
            typeof updater === 'function'
                ? updater({ pageIndex: pageIndex.value, pageSize: pageSize.value })
                : updater
        pageIndex.value = newPagination.pageIndex
        pageSize.value = newPagination.pageSize
        emit('paginationChange', newPagination)
    },
    state: {
        get sorting() {
            return sorting.value
        },
        get columnFilters() {
            return columnFilters.value
        },
        get columnVisibility() {
            return columnVisibility.value
        },
        get rowSelection() {
            return rowSelection.value
        },
        get globalFilter() {
            return globalFilter.value
        },
        get pagination() {
            return {
                pageIndex: pageIndex.value,
                pageSize: pageSize.value,
            }
        },
    },
})

// Watch for page size changes
watch(pageSize, (newSize) => {
    table.setPageSize(newSize)
})

// FlexRender component
const flexRender = FlexRender
</script>
