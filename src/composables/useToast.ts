import { ref, readonly } from 'vue'

export interface Toast {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    description?: string
    duration?: number
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = `toast-${++toastId}`
        const newToast: Toast = {
            id,
            duration: 3000,
            ...toast,
        }

        toasts.value.push(newToast)

        // Auto remove after duration
        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, newToast.duration)
        }

        return id
    }

    const removeToast = (id: string) => {
        const index = toasts.value.findIndex((toast) => toast.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    const success = (title: string, description?: string) => {
        return addToast({ type: 'success', title, description })
    }

    const error = (title: string, description?: string) => {
        return addToast({ type: 'error', title, description })
    }

    const warning = (title: string, description?: string) => {
        return addToast({ type: 'warning', title, description })
    }

    const info = (title: string, description?: string) => {
        return addToast({ type: 'info', title, description })
    }

    return {
        toasts: readonly(toasts),
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
    }
}
