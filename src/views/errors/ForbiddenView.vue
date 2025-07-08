<template>
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
        <div class="text-center max-w-md">
            <!-- Error Icon -->
            <div class="mb-8">
                <div
                    class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-4"
                >
                    <ShieldX class="w-12 h-12 text-destructive" />
                </div>
            </div>

            <!-- Error Content -->
            <div class="space-y-4">
                <h1 class="text-6xl font-bold text-foreground">403</h1>
                <h2 class="text-2xl font-semibold text-foreground">
                    {{ t('errors.forbidden.title') }}
                </h2>
                <p class="text-muted-foreground">
                    {{ t('errors.forbidden.message') }}
                </p>
            </div>

            <!-- Actions -->
            <div class="mt-8 space-y-4">
                <Button @click="goBack" variant="default" size="lg" class="w-full sm:w-auto">
                    <ArrowLeft class="w-4 h-4 mr-2" />
                    {{ t('common.back') }}
                </Button>

                <div>
                    <RouterLink
                        to="/"
                        class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {{ t('common.backToHome') }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/composables/useI18n'
import { Button } from '@/components/ui/button'
import { ShieldX, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const { t } = useAppI18n()

const goBack = () => {
    router.back()
}
</script>
