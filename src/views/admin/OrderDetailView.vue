<template>
    <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
            <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Loader2 class="h-5 w-5 animate-spin" />
                {{ t('common.loading') }}...
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="max-w-md mx-auto">
                <AlertCircle class="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {{ t('admin.ordersManagement.detail.orderNotFound') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ error }}</p>
                <Button @click="goBack" variant="outline">
                    <ArrowLeft class="h-4 w-4 mr-2" />
                    {{ t('common.back') }}
                </Button>
            </div>
        </div>

        <!-- Order Detail Content -->
        <div v-else-if="currentOrder" class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <Button @click="goBack" variant="outline" size="sm">
                        <ArrowLeft class="h-4 w-4 mr-2" />
                        {{ t('common.back') }}
                    </Button>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {{ t('admin.ordersManagement.detail.orderInfo') }} #{{
                                currentOrder.number
                            }}
                        </h1>
                        <p class="text-gray-600 dark:text-gray-300">
                            {{ t('admin.ordersManagement.detail.orderPlaced') }}
                            {{ formatDate(currentOrder.date) }}
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <!-- Status Update -->
                    <Select
                        v-model="selectedStatus"
                        @update:model-value="updateStatus"
                        :disabled="!isStatusChangeAllowed"
                    >
                        <SelectTrigger class="w-[160px]" :disabled="!isStatusChangeAllowed">
                            <SelectValue>
                                <template v-if="selectedStatus">
                                    {{ t(`admin.ordersManagement.status.${selectedStatus}`) }}
                                </template>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="status in availableStatuses"
                                :key="status"
                                :value="status"
                            >
                                {{ t(`admin.ordersManagement.status.${status}`) }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <!-- Export Invoice Button -->
                    <Button variant="outline" @click="showInvoiceModal = true">
                        <FileText class="h-4 w-4 mr-2" />
                        {{ t('admin.ordersManagement.detail.exportInvoice') }}
                    </Button>
                </div>
            </div>

            <!-- Invoice Modal -->
            <Dialog v-model:open="showInvoiceModal">
                <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div class="invoice-container bg-white text-black p-8">
                        <!-- Invoice Header -->
                        <div class="flex justify-between items-start mb-8">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center"
                                >
                                    <Package class="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 class="text-2xl font-bold text-emerald-600">
                                        {{ t('common.companyName') }}
                                    </h1>
                                    <p class="text-sm text-gray-600">
                                        {{ t('common.companyTagline') }}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <h2 class="text-xl font-bold text-gray-800 mb-1">INVOICE</h2>
                                <p class="text-sm text-gray-600">
                                    {{ t('admin.ordersManagement.detail.invoiceNumber') }}:
                                    {{ currentOrder.number }}
                                </p>
                                <p class="text-sm text-gray-600">
                                    {{ t('admin.ordersManagement.detail.date') }}:
                                    {{ formatDate(currentOrder.date) }}
                                </p>
                            </div>
                        </div>

                        <!-- Invoice Details -->
                        <div class="grid grid-cols-2 gap-8 mb-8">
                            <!-- Invoice To -->
                            <div>
                                <h3 class="font-semibold text-gray-800 mb-3">
                                    {{ t('admin.ordersManagement.detail.invoiceTo') }}
                                </h3>
                                <div class="text-sm text-gray-600 space-y-1">
                                    <p class="font-medium">{{ currentOrder.customerName }}</p>
                                    <p>{{ currentOrder.customerEmail }}</p>
                                    <p>{{ currentOrder.shippingAddress.address }}</p>
                                    <p>
                                        {{ currentOrder.shippingAddress.city }},
                                        {{ currentOrder.shippingAddress.state }}
                                        {{ currentOrder.shippingAddress.zipCode }}
                                    </p>
                                    <p>{{ currentOrder.shippingAddress.country }}</p>
                                </div>
                            </div>

                            <!-- Bill To -->
                            <div>
                                <h3 class="font-semibold text-gray-800 mb-3">
                                    {{ t('admin.ordersManagement.detail.billTo') }}
                                </h3>
                                <div class="text-sm text-gray-600 space-y-1">
                                    <p class="font-medium">{{ currentOrder.customerName }}</p>
                                    <p>{{ currentOrder.customerEmail }}</p>
                                    <p>{{ currentOrder.shippingAddress.address }}</p>
                                    <p>
                                        {{ currentOrder.shippingAddress.city }},
                                        {{ currentOrder.shippingAddress.state }}
                                        {{ currentOrder.shippingAddress.zipCode }}
                                    </p>
                                    <p>{{ currentOrder.shippingAddress.country }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Payment Info -->
                        <div class="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 class="font-semibold text-gray-800 mb-3">
                                    {{ t('admin.ordersManagement.detail.dueDate') }}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {{ formatDate(currentOrder.date) }}
                                </p>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-800 mb-3">
                                    {{ t('admin.ordersManagement.detail.paymentMethod') }}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {{ formatPaymentMethod(currentOrder.paymentMethod) }}
                                </p>
                            </div>
                        </div>

                        <!-- Items Table -->
                        <div class="mb-8">
                            <table class="w-full border-collapse">
                                <thead>
                                    <tr class="border-b border-gray-300">
                                        <th
                                            class="text-left py-3 text-sm font-semibold text-gray-800"
                                        >
                                            {{ t('admin.ordersManagement.detail.itemName') }}
                                        </th>
                                        <th
                                            class="text-center py-3 text-sm font-semibold text-gray-800"
                                        >
                                            {{ t('admin.ordersManagement.detail.unitPrice') }}
                                        </th>
                                        <th
                                            class="text-center py-3 text-sm font-semibold text-gray-800"
                                        >
                                            {{ t('admin.ordersManagement.detail.quantity') }}
                                        </th>
                                        <th
                                            class="text-right py-3 text-sm font-semibold text-gray-800"
                                        >
                                            {{ t('admin.ordersManagement.detail.amount') }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="item in currentOrder.items"
                                        :key="item.id"
                                        class="border-b border-gray-200"
                                    >
                                        <td class="py-3 text-sm text-gray-700">
                                            <div>
                                                <p class="font-medium">{{ item.name }}</p>
                                                <p class="text-xs text-gray-500">
                                                    SKU: {{ item.productId }}
                                                </p>
                                            </div>
                                        </td>
                                        <td class="py-3 text-center text-sm text-gray-700">
                                            {{ formatCurrency(item.price) }}
                                        </td>
                                        <td class="py-3 text-center text-sm text-gray-700">
                                            {{ item.quantity }}
                                        </td>
                                        <td class="py-3 text-right text-sm text-gray-700">
                                            {{ formatCurrency(item.price * item.quantity) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Totals -->
                        <div class="flex justify-end mb-8">
                            <div class="w-64 space-y-2">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600"
                                        >{{ t('admin.ordersManagement.detail.subtotal') }}:</span
                                    >
                                    <span class="text-gray-800">{{
                                        formatCurrency(currentOrder.subtotal)
                                    }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600"
                                        >{{ t('admin.ordersManagement.detail.tax') }}:</span
                                    >
                                    <span class="text-gray-800">{{
                                        formatCurrency(currentOrder.tax)
                                    }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600"
                                        >{{ t('admin.ordersManagement.detail.shipping') }}:</span
                                    >
                                    <span class="text-gray-800">{{
                                        formatCurrency(currentOrder.shipping)
                                    }}</span>
                                </div>
                                <div class="border-t border-gray-300 pt-2">
                                    <div class="flex justify-between font-semibold text-base">
                                        <span class="text-gray-800"
                                            >{{
                                                t('admin.ordersManagement.detail.grandTotal')
                                            }}:</span
                                        >
                                        <span class="text-gray-800">{{
                                            formatCurrency(currentOrder.total)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Important Notes -->
                        <div class="mb-8">
                            <h3 class="font-semibold text-gray-800 mb-3">
                                {{ t('admin.ordersManagement.detail.importantNote') }}
                            </h3>
                            <div class="text-sm text-gray-600 space-y-1">
                                <p>{{ t('admin.ordersManagement.detail.note1') }}</p>
                                <p>{{ t('admin.ordersManagement.detail.note2') }}</p>
                                <p>{{ t('admin.ordersManagement.detail.note3') }}</p>
                                <p>{{ t('admin.ordersManagement.detail.note4') }}</p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="text-center border-t border-gray-300 pt-6">
                            <p class="text-sm text-gray-600 mb-2">
                                {{ t('admin.ordersManagement.detail.thankYou') }}
                            </p>
                            <p class="text-sm text-gray-600">{{ t('common.companyName') }}</p>

                            <!-- Social Links -->
                            <div class="flex justify-center gap-2 mt-4">
                                <div class="w-6 h-6 bg-emerald-500 rounded-full"></div>
                                <div class="w-6 h-6 bg-blue-500 rounded-full"></div>
                                <div class="w-6 h-6 bg-red-500 rounded-full"></div>
                                <div class="w-6 h-6 bg-purple-500 rounded-full"></div>
                                <div class="w-6 h-6 bg-yellow-500 rounded-full"></div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-center mt-8 pt-6 border-t border-gray-300">
                            <Button
                                @click="printInvoice"
                                class="bg-slate-600 hover:bg-slate-700 text-white px-6"
                            >
                                <Printer class="h-4 w-4 mr-2" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <!-- Status Badge -->
            <div class="flex items-center gap-2">
                <Badge :variant="getStatusVariant(currentOrder.status)" class="text-sm px-3 py-1">
                    {{ t(`admin.ordersManagement.status.${currentOrder.status}`) }}
                </Badge>
                <span v-if="currentOrder.tracking" class="text-sm text-gray-600 dark:text-gray-400">
                    {{ t('admin.ordersManagement.detail.tracking') }}: {{ currentOrder.tracking }}
                </span>
            </div>

            <!-- Main Content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Order Items -->
                    <Card>
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {{ t('admin.ordersManagement.detail.orderItems') }}
                            </h3>
                        </div>
                        <div class="p-6">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="border-b border-gray-200 dark:border-gray-700">
                                            <th
                                                class="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                {{ t('admin.ordersManagement.detail.product') }}
                                            </th>
                                            <th
                                                class="text-center py-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                {{ t('admin.ordersManagement.detail.quantity') }}
                                            </th>
                                            <th
                                                class="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                {{ t('admin.ordersManagement.detail.unitPrice') }}
                                            </th>
                                            <th
                                                class="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                {{ t('admin.ordersManagement.detail.amount') }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="item in currentOrder.items"
                                            :key="item.id"
                                            class="border-b border-gray-100 dark:border-gray-800"
                                        >
                                            <td class="py-4">
                                                <div class="flex items-center gap-3">
                                                    <div
                                                        class="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                                                    >
                                                        <img
                                                            v-if="item.image"
                                                            :src="item.image"
                                                            :alt="item.name"
                                                            class="h-full w-full object-cover"
                                                            @error="handleImageError"
                                                        />
                                                        <div
                                                            v-else
                                                            class="h-full w-full flex items-center justify-center"
                                                        >
                                                            <Package
                                                                class="h-5 w-5 text-gray-400"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p
                                                            class="text-sm font-medium text-gray-900 dark:text-gray-100"
                                                        >
                                                            {{ item.name }}
                                                        </p>
                                                        <p
                                                            class="text-xs text-gray-500 dark:text-gray-400"
                                                        >
                                                            ID: {{ item.productId }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                class="py-4 text-center text-sm text-gray-900 dark:text-gray-100"
                                            >
                                                {{ item.quantity }}
                                            </td>
                                            <td
                                                class="py-4 text-right text-sm text-gray-900 dark:text-gray-100"
                                            >
                                                {{
                                                    formatCurrency(
                                                        item.price,
                                                        currentOrder.currency,
                                                    )
                                                }}
                                            </td>
                                            <td
                                                class="py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100"
                                            >
                                                {{
                                                    formatCurrency(
                                                        item.price * item.quantity,
                                                        currentOrder.currency,
                                                    )
                                                }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Order Total -->
                            <div class="mt-6 space-y-2">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600 dark:text-gray-400">{{
                                        t('admin.ordersManagement.detail.subtotal')
                                    }}</span>
                                    <span class="text-gray-900 dark:text-gray-100">{{
                                        formatCurrency(currentOrder.subtotal, currentOrder.currency)
                                    }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600 dark:text-gray-400">{{
                                        t('admin.ordersManagement.detail.shipping')
                                    }}</span>
                                    <span class="text-gray-900 dark:text-gray-100">{{
                                        formatCurrency(currentOrder.shipping, currentOrder.currency)
                                    }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600 dark:text-gray-400">{{
                                        t('admin.ordersManagement.detail.tax')
                                    }}</span>
                                    <span class="text-gray-900 dark:text-gray-100">{{
                                        formatCurrency(currentOrder.tax, currentOrder.currency)
                                    }}</span>
                                </div>
                                <div class="border-t border-gray-200 dark:border-gray-700 pt-2">
                                    <div class="flex justify-between text-base font-medium">
                                        <span class="text-gray-900 dark:text-gray-100">{{
                                            t('admin.ordersManagement.detail.total')
                                        }}</span>
                                        <span class="text-gray-900 dark:text-gray-100">{{
                                            formatCurrency(
                                                currentOrder.total,
                                                currentOrder.currency,
                                            )
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                    <!-- Customer Info -->
                    <Card class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            {{ t('admin.ordersManagement.detail.customerInfo') }}
                        </h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <div
                                    class="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
                                >
                                    <User class="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {{ currentOrder.customerName }}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ currentOrder.customerEmail }}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" class="w-full">
                                <User class="h-4 w-4 mr-2" />
                                {{ t('admin.ordersManagement.detail.viewProfile') }}
                            </Button>
                        </div>
                    </Card>

                    <!-- Delivery Address -->
                    <Card class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            {{ t('admin.ordersManagement.detail.deliverTo') }}
                        </h3>
                        <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <p>
                                {{ currentOrder.shippingAddress.firstName }}
                                {{ currentOrder.shippingAddress.lastName }}
                            </p>
                            <p>{{ currentOrder.shippingAddress.address }}</p>
                            <p>
                                {{ currentOrder.shippingAddress.city }},
                                {{ currentOrder.shippingAddress.state }}
                                {{ currentOrder.shippingAddress.zipCode }}
                            </p>
                            <p>{{ currentOrder.shippingAddress.country }}</p>
                            <p v-if="currentOrder.shippingAddress.phone">
                                {{ currentOrder.shippingAddress.phone }}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" class="w-full mt-3">
                            <MapPin class="h-4 w-4 mr-2" />
                            {{ t('common.viewOnMap') }}
                        </Button>
                    </Card>

                    <!-- Payment Info -->
                    <Card class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            {{ t('admin.ordersManagement.detail.paymentInfo') }}
                        </h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <div
                                    class="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                                >
                                    <CreditCard class="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {{ formatPaymentMethod(currentOrder.paymentMethod) }}
                                    </p>
                                    <p
                                        v-if="currentOrder.paymentMethod?.last4"
                                        class="text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        {{ t('admin.ordersManagement.detail.cardEnding') }}
                                        {{ currentOrder.paymentMethod.last4 }}
                                    </p>
                                </div>
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">
                                <p>
                                    {{ t('admin.ordersManagement.detail.orderTotal') }}:
                                    {{ formatCurrency(currentOrder.total, currentOrder.currency) }}
                                </p>
                                <p class="text-green-600 dark:text-green-400">
                                    {{ t('common.confirmed') }}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <!-- Notes -->
                    <Card class="p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            {{ t('admin.ordersManagement.detail.notes') }}
                        </h3>
                        <textarea
                            v-model="orderNotes"
                            :placeholder="t('admin.ordersManagement.detail.notes')"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                        <Button size="sm" class="w-full mt-3" @click="saveNotes">
                            {{ t('admin.ordersManagement.detail.saveNote') }}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersAdmin } from '@/composables/useOrdersAdmin'
import { useAppI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Badge from '@/components/ui/badge/Badge.vue'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
    ArrowLeft,
    Loader2,
    AlertCircle,
    User,
    Package,
    MapPin,
    CreditCard,
    Printer,
    FileText,
} from 'lucide-vue-next'
import type { Order } from '@/stores/orders'

const route = useRoute()
const router = useRouter()
const { t } = useAppI18n()
const { success, error: errorToast } = useToast()

// Composables
const {
    currentOrder,
    loading,
    error,
    loadOrder,
    updateOrderStatus,
    getStatusVariant,
    formatCurrency,
    formatDate,
} = useOrdersAdmin()

// Import validation functions from service
import { orderService } from '@/services/order.service'

// Helper methods from service
const { formatPaymentMethod } = orderService

// Local state
const orderNotes = ref('')
const selectedStatus = ref<Order['status']>('pending')
const showInvoiceModal = ref(false)

// Computed
const orderId = computed(() => route.params.id as string)

const availableStatuses = computed(() => {
    if (!currentOrder.value) return []
    return orderService.getAvailableStatusTransitions(currentOrder.value.status)
})

const isStatusChangeAllowed = computed(() => {
    if (!currentOrder.value) return false
    return currentOrder.value.status !== 'delivered' && currentOrder.value.status !== 'cancelled'
})

// Methods
const goBack = () => {
    router.push('/admin/orders')
}

const updateStatus = async (newStatus: any) => {
    if (!currentOrder.value || !newStatus || typeof newStatus !== 'string') return

    const statusValue = newStatus as Order['status']

    // Kiểm tra xem có được phép thay đổi status không
    if (!isStatusChangeAllowed.value) {
        errorToast(t('admin.ordersManagement.messages.statusChangeNotAllowed'))
        // Reset về status hiện tại
        selectedStatus.value = currentOrder.value.status
        return
    }

    // Kiểm tra xem status mới có trong danh sách cho phép không (sử dụng service)
    if (!orderService.isStatusTransitionValid(currentOrder.value.status, statusValue)) {
        errorToast(t('admin.ordersManagement.messages.invalidStatusTransition'))
        // Reset về status hiện tại
        selectedStatus.value = currentOrder.value.status
        return
    }

    const isSuccess = await updateOrderStatus(currentOrder.value.id, statusValue)
    if (isSuccess) {
        success(t('admin.ordersManagement.messages.updateStatusSuccess'))
    } else {
        errorToast(t('admin.ordersManagement.messages.updateStatusError'))
        // Revert selection
        selectedStatus.value = currentOrder.value.status
    }
}

const saveNotes = () => {
    // Implement note saving logic here
    success(t('admin.ordersManagement.messages.saveNoteSuccess'))
}

const printInvoice = () => {
    let hasStartedPrinting = false

    const handleBeforePrint = () => {
        hasStartedPrinting = true
    }

    const handleAfterPrint = () => {
        // Remove event listeners to avoid memory leaks
        window.removeEventListener('beforeprint', handleBeforePrint)
        window.removeEventListener('afterprint', handleAfterPrint)

        // Close modal regardless
        showInvoiceModal.value = false

        // Only show success toast if user actually started printing
        if (hasStartedPrinting) {
            success(t('admin.ordersManagement.messages.printSuccess'))
        }
    }

    // Set up event listeners
    window.addEventListener('beforeprint', handleBeforePrint)
    window.addEventListener('afterprint', handleAfterPrint)

    // Add fallback timeout in case print events don't fire
    setTimeout(() => {
        if (!hasStartedPrinting) {
            window.removeEventListener('beforeprint', handleBeforePrint)
            window.removeEventListener('afterprint', handleAfterPrint)
            showInvoiceModal.value = false
        }
    }, 2000)

    // Trigger print dialog
    window.print()
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    // Set a placeholder image
    img.style.display = 'none'
}

// Watchers
watch(
    currentOrder,
    (newOrder) => {
        if (newOrder) {
            selectedStatus.value = newOrder.status
        }
    },
    { immediate: true },
)

// Lifecycle
onMounted(async () => {
    if (orderId.value) {
        await loadOrder(orderId.value)
    }
})
</script>
