<template>
    <div class="mb-6 sm:mb-8">
        <div class="flex items-center justify-center space-x-4">
            <div
                v-for="step in steps"
                :key="step.number"
                class="flex items-center"
                :class="{ 'opacity-50': step.number > currentStep }"
            >
                <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                    :class="
                        step.number <= currentStep
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                    "
                >
                    {{ step.number }}
                </div>
                <div v-if="step.number < steps.length" class="w-12 h-0.5 bg-muted mx-2">
                    <div
                        v-if="step.number < currentStep"
                        class="h-full bg-primary transition-all duration-300"
                    ></div>
                </div>
            </div>
        </div>
        <div class="flex justify-center mt-2">
            <div class="text-sm text-muted-foreground">
                {{ currentStepLabel }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppI18n } from '@/composables/useI18n'

interface Props {
    currentStep: number
}

const props = defineProps<Props>()
const { t } = useAppI18n()

const steps = computed(() => [
    { number: 1, label: t('checkout.shipping') },
    { number: 2, label: t('checkout.payment') },
    { number: 3, label: t('checkout.review') },
])

const currentStepLabel = computed(() => {
    const step = steps.value.find((s) => s.number === props.currentStep)
    return step?.label || ''
})
</script>
