<template>
    <Teleport to="body">
        <div class="fixed top-4 right-4 z-[10000] flex flex-col gap-2 pointer-events-none">
            <Transition v-for="toast in toasts" :key="toast.id" name="toast" appear>
                <div
                    :class="[
                        'pointer-events-auto max-w-sm w-full bg-card border border-border rounded-lg shadow-lg p-4',
                        getToastClasses(toast.type),
                    ]"
                >
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0">
                            <CheckCircle
                                v-if="toast.type === 'success'"
                                class="w-5 h-5 text-green-500"
                            />
                            <AlertCircle
                                v-else-if="toast.type === 'error'"
                                class="w-5 h-5 text-red-500"
                            />
                            <AlertTriangle
                                v-else-if="toast.type === 'warning'"
                                class="w-5 h-5 text-yellow-500"
                            />
                            <Info v-else class="w-5 h-5 text-blue-500" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-foreground">
                                {{ toast.title }}
                            </p>
                            <p v-if="toast.description" class="text-sm text-muted-foreground mt-1">
                                {{ toast.description }}
                            </p>
                        </div>
                        <button
                            @click="removeToast(toast.id)"
                            class="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()

const getToastClasses = (type: string) => {
    switch (type) {
        case 'success':
            return 'border-green-200 dark:border-green-800'
        case 'error':
            return 'border-red-200 dark:border-red-800'
        case 'warning':
            return 'border-yellow-200 dark:border-yellow-800'
        default:
            return 'border-blue-200 dark:border-blue-800'
    }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease-out;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
