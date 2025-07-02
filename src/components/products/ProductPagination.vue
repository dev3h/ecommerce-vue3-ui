<template>
    <div
        class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border"
    >
        <!-- Results Info -->
        <div class="text-sm text-muted-foreground">
            {{ t('common.showing') }} {{ startItem }}-{{ endItem }} {{ t('common.of') }}
            {{ totalProducts }} {{ t('navigation.products').toLowerCase() }}
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center gap-2">
            <!-- Previous Button -->
            <button
                @click="$emit('prev-page')"
                :disabled="currentPage === 1"
                class="px-3 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
                <ChevronLeft class="w-4 h-4" />
                <span class="hidden sm:inline">{{ t('common.previous') }}</span>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
                <!-- First page -->
                <button
                    v-if="showFirstPage"
                    @click="$emit('page-change', 1)"
                    :class="[
                        'w-10 h-10 rounded-lg transition-colors',
                        currentPage === 1
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent',
                    ]"
                >
                    1
                </button>

                <!-- First ellipsis -->
                <span v-if="showFirstEllipsis" class="px-2 text-muted-foreground">...</span>

                <!-- Visible page numbers -->
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="$emit('page-change', page)"
                    :class="[
                        'w-10 h-10 rounded-lg transition-colors',
                        currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent',
                    ]"
                >
                    {{ page }}
                </button>

                <!-- Last ellipsis -->
                <span v-if="showLastEllipsis" class="px-2 text-muted-foreground">...</span>

                <!-- Last page -->
                <button
                    v-if="showLastPage"
                    @click="$emit('page-change', totalPages)"
                    :class="[
                        'w-10 h-10 rounded-lg transition-colors',
                        currentPage === totalPages
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent',
                    ]"
                >
                    {{ totalPages }}
                </button>
            </div>

            <!-- Next Button -->
            <button
                @click="$emit('next-page')"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
                <span class="hidden sm:inline">{{ t('common.next') }}</span>
                <ChevronRight class="w-4 h-4" />
            </button>
        </div>

        <!-- Per Page Selector (Optional) -->
        <div class="flex items-center gap-2 text-sm">
            <span class="text-muted-foreground hidden sm:inline">{{ t('products.perPage') }}:</span>
            <select
                :value="productsPerPage"
                @change="
                    $emit('per-page-change', Number(($event.target as HTMLSelectElement).value))
                "
                class="px-2 py-1 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
    currentPage: number
    totalPages: number
    totalProducts: number
    productsPerPage: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'page-change': [page: number]
    'prev-page': []
    'next-page': []
    'per-page-change': [perPage: number]
}>()

const { t } = useAppI18n()

const startItem = computed(() => {
    return (props.currentPage - 1) * props.productsPerPage + 1
})

const endItem = computed(() => {
    return Math.min(props.currentPage * props.productsPerPage, props.totalProducts)
})

const visiblePages = computed(() => {
    const pages: number[] = []
    const delta = 2 // Number of pages to show around current page

    let start = Math.max(1, props.currentPage - delta)
    let end = Math.min(props.totalPages, props.currentPage + delta)

    // Adjust if we're near the beginning or end
    if (props.currentPage <= delta + 1) {
        end = Math.min(props.totalPages, 2 * delta + 2)
    }

    if (props.currentPage >= props.totalPages - delta) {
        start = Math.max(1, props.totalPages - 2 * delta - 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

const showFirstPage = computed(() => {
    return !visiblePages.value.includes(1) && props.totalPages > 1
})

const showLastPage = computed(() => {
    return !visiblePages.value.includes(props.totalPages) && props.totalPages > 1
})

const showFirstEllipsis = computed(() => {
    return showFirstPage.value && visiblePages.value[0] > 2
})

const showLastEllipsis = computed(() => {
    return (
        showLastPage.value &&
        visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
    )
})
</script>
