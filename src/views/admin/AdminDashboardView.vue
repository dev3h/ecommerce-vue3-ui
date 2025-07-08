<template>
    <div class="p-6">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-foreground mb-2">
                {{ t('admin.dashboard.title') }}
            </h1>
            <p class="text-muted-foreground">
                {{ t('admin.dashboard.subtitle') }}
            </p>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card class="p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-muted-foreground">
                            {{ t('admin.dashboard.totalOrders') }}
                        </p>
                        <p class="text-2xl font-bold">1,234</p>
                    </div>
                    <Package class="h-8 w-8 text-primary" />
                </div>
            </Card>

            <Card class="p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-muted-foreground">
                            {{ t('admin.dashboard.totalCustomers') }}
                        </p>
                        <p class="text-2xl font-bold">856</p>
                    </div>
                    <Users class="h-8 w-8 text-primary" />
                </div>
            </Card>

            <Card class="p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-muted-foreground">
                            {{ t('admin.dashboard.totalProducts') }}
                        </p>
                        <p class="text-2xl font-bold">342</p>
                    </div>
                    <ShoppingBag class="h-8 w-8 text-primary" />
                </div>
            </Card>

            <Card class="p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-muted-foreground">
                            {{ t('admin.dashboard.totalRevenue') }}
                        </p>
                        <p class="text-2xl font-bold">$24,567</p>
                    </div>
                    <DollarSign class="h-8 w-8 text-primary" />
                </div>
            </Card>
        </div>

        <!-- Welcome Message -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card class="p-6">
                <div class="text-center">
                    <Shield class="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 class="text-xl font-semibold mb-2">
                        {{ t('admin.dashboard.welcomeMessage') }}
                    </h2>
                    <p class="text-muted-foreground">
                        {{ t('admin.dashboard.welcomeDescription') }}
                    </p>
                </div>
            </Card>

            <!-- Account Settings -->
            <Card class="p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings class="h-5 w-5" />
                    {{ t('admin.dashboard.accountSettings') }}
                </h3>
                <div class="space-y-3">
                    <RouterLink
                        to="/admin/change-password"
                        class="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                        <Key class="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        <div>
                            <p class="font-medium">{{ t('admin.changePassword') }}</p>
                            <p class="text-sm text-muted-foreground">
                                {{ t('admin.changePasswordDescription') }}
                            </p>
                        </div>
                    </RouterLink>
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppI18n } from '@/composables/useI18n'
import { Card } from '@/components/ui/card'
import { Package, Users, ShoppingBag, DollarSign, Shield, Settings, Key } from 'lucide-vue-next'

const { t } = useAppI18n()
</script>
