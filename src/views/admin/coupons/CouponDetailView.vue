<template>
    <AdminBaseLayout>
        <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="flex items-center gap-2">
                <div
                    class="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
                ></div>
                <span>{{ t('common.loading') }}</span>
            </div>
        </div>

        <div v-else-if="coupon" class="max-w-4xl mx-auto space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">{{ coupon.name }}</h1>
                    <p class="text-muted-foreground">{{ coupon.description }}</p>
                </div>
                <div class="flex items-center gap-2">
                    <Button variant="outline" @click="navigateToEdit">
                        <Edit class="mr-2 h-4 w-4" />
                        {{ t('admin.couponsManagement.actions.edit') }}
                    </Button>
                    <Button variant="outline" @click="router.push('/admin/coupons')">
                        {{ t('common.back') }}
                    </Button>
                </div>
            </div>

            <!-- Status Badge -->
            <div>
                <Badge :variant="getStatusBadgeVariant(coupon.status)">
                    {{ t(`admin.couponsManagement.status.${coupon.status}`) }}
                </Badge>
            </div>

            <!-- Basic Information -->
            <Card>
                <CardHeader>
                    <CardTitle>{{ t('admin.couponsManagement.detail.basicInfo') }}</CardTitle>
                </CardHeader>
                <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.form.name')
                        }}</Label>
                        <p class="mt-1">{{ coupon.name }}</p>
                    </div>
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.form.status')
                        }}</Label>
                        <p class="mt-1">
                            {{ t(`admin.couponsManagement.status.${coupon.status}`) }}
                        </p>
                    </div>
                    <div class="md:col-span-2">
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.form.description')
                        }}</Label>
                        <p class="mt-1">{{ coupon.description }}</p>
                    </div>
                </CardContent>
            </Card>

            <!-- Discount Settings -->
            <Card>
                <CardHeader>
                    <CardTitle>{{ t('admin.couponsManagement.form.discountSettings') }}</CardTitle>
                </CardHeader>
                <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.form.discountType')
                        }}</Label>
                        <div class="mt-1 flex items-center gap-2">
                            <component
                                :is="coupon.discount_type === 'percentage' ? Percent : DollarSign"
                                class="h-4 w-4"
                            />
                            <span>{{
                                t(`admin.couponsManagement.discountType.${coupon.discount_type}`)
                            }}</span>
                        </div>
                    </div>
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.form.discountValue')
                        }}</Label>
                        <p class="mt-1 font-medium">{{ formatDiscountValue(coupon) }}</p>
                    </div>
                </CardContent>
            </Card>

            <!-- Usage Limits -->
            <Card>
                <CardHeader>
                    <CardTitle>{{ t('admin.couponsManagement.detail.statistics') }}</CardTitle>
                </CardHeader>
                <CardContent class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.detail.usageCount')
                        }}</Label>
                        <div class="mt-1 flex items-center gap-2">
                            <Users class="h-4 w-4 text-muted-foreground" />
                            <span class="font-medium">{{ coupon.usage_count }}</span>
                        </div>
                    </div>
                    <div v-if="coupon.has_limit && coupon.usage_limit">
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.form.usageLimit')
                        }}</Label>
                        <p class="mt-1 font-medium">{{ coupon.usage_limit }}</p>
                    </div>
                    <div v-if="coupon.has_limit && coupon.usage_limit">
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.detail.remainingUses')
                        }}</Label>
                        <p class="mt-1 font-medium">
                            {{ coupon.usage_limit - coupon.usage_count }}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <!-- Validity Period -->
            <Card>
                <CardHeader>
                    <CardTitle>{{ t('admin.couponsManagement.form.validityPeriod') }}</CardTitle>
                </CardHeader>
                <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.form.startDate')
                        }}</Label>
                        <div class="mt-1 flex items-center gap-2">
                            <Calendar class="h-4 w-4 text-muted-foreground" />
                            <span>{{ formatDate(coupon.start_date) }}</span>
                        </div>
                    </div>
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.form.endDate')
                        }}</Label>
                        <div class="mt-1 flex items-center gap-2">
                            <Calendar class="h-4 w-4 text-muted-foreground" />
                            <span>{{ formatDate(coupon.end_date) }}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Metadata -->
            <Card>
                <CardHeader>
                    <CardTitle>{{ t('common.metadata') }}</CardTitle>
                </CardHeader>
                <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.detail.createdAt')
                        }}</Label>
                        <p class="mt-1">{{ formatDateTime(coupon.created_at) }}</p>
                    </div>
                    <div>
                        <Label class="text-sm font-medium">{{
                            t('admin.couponsManagement.detail.lastUpdated')
                        }}</Label>
                        <p class="mt-1">{{ formatDateTime(coupon.updated_at) }}</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div v-else class="flex items-center justify-center h-64">
            <div class="text-center">
                <h2 class="text-2xl font-bold">
                    {{ t('admin.couponsManagement.messages.couponNotFound') }}
                </h2>
                <Button class="mt-4" @click="router.push('/admin/coupons')">
                    {{ t('common.back') }}
                </Button>
            </div>
        </div>
    </AdminBaseLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Coupon } from '@/types/coupon'

// Composables
import { useCoupons } from '@/composables/useCoupons'
import { useToast } from '@/composables/useToast'
import { useAppI18n } from '@/composables/useI18n'

// Components
import AdminBaseLayout from '@/components/admin/AdminBaseLayout.vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Badge from '@/components/ui/badge/Badge.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Icons
import { Edit, Calendar, Users, Percent, DollarSign } from 'lucide-vue-next'

// Composables
const router = useRouter()
const route = useRoute()
const { error: errorToast } = useToast()
const { getCoupon } = useCoupons()
const { t } = useAppI18n()

// Component state
const loading = ref(true)
const coupon = ref<Coupon | null>(null)
const couponId = computed(() => route.params.id as string)

// Helper functions
const formatDiscountValue = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
        return `${coupon.discount_value}%`
    } else {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(coupon.discount_value)
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'active':
            return 'default'
        case 'inactive':
            return 'secondary'
        case 'expired':
            return 'destructive'
        default:
            return 'outline'
    }
}

const navigateToEdit = () => {
    router.push(`/admin/coupons/${couponId.value}/edit`)
}

// Load data on mount
onMounted(async () => {
    try {
        loading.value = true
        coupon.value = await getCoupon(couponId.value)
    } catch (err) {
        errorToast(
            t('common.error'),
            t('admin.couponsManagement.messages.couponNotFound') ||
                (typeof err === 'object' && err !== null && 'message' in err ? (err as { message: string }).message : ''),
        )
        router.push('/admin/coupons')
    } finally {
        loading.value = false
    }
})
</script>
