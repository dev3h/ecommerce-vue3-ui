<template>
    <div ref="containerRef" class="relative inline-block text-left">
        <Button variant="ghost" size="sm" @click="toggleOpen" :class="triggerClass">
            <slot name="trigger">
                <MoreHorizontal class="h-4 w-4" />
            </slot>
        </Button>

        <Teleport to="body">
            <div
                v-if="isOpen"
                ref="menuRef"
                class="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                :style="menuStyle"
            >
                <slot />
            </div>
        </Teleport>

        <div v-if="isOpen" class="fixed inset-0 z-40" @click="close" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-vue-next'

interface Props {
    align?: 'start' | 'end' | 'center'
    triggerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
    align: 'end',
    triggerClass: '',
})

const emit = defineEmits<{
    'update:open': [value: boolean]
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()

const menuStyle = computed(() => {
    if (!containerRef.value) return {}

    const rect = containerRef.value.getBoundingClientRect()
    const style: Record<string, string> = {
        top: `${rect.bottom + 4}px`,
    }

    if (props.align === 'end') {
        style.right = `${window.innerWidth - rect.right}px`
    } else if (props.align === 'start') {
        style.left = `${rect.left}px`
    } else {
        style.left = `${rect.left + rect.width / 2}px`
        style.transform = 'translateX(-50%)'
    }

    return style
})

const toggleOpen = () => {
    isOpen.value = !isOpen.value
    emit('update:open', isOpen.value)

    if (isOpen.value) {
        nextTick(() => {
            if (menuRef.value) {
                menuRef.value.focus()
            }
        })
    }
}

const close = () => {
    isOpen.value = false
    emit('update:open', false)
}

defineExpose({
    close,
})
</script>
