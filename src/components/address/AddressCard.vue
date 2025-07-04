<template>
    <div class="border rounded-lg p-4 sm:p-6 bg-card relative">
        <!-- Default Badge -->
        <div v-if="address.isDefault" class="absolute top-4 right-4">
            <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground"
            >
                {{ t('address.default') }}
            </span>
        </div>

        <!-- Address Content -->
        <div class="space-y-3 pr-16 sm:pr-20">
            <!-- Name -->
            <div class="font-medium text-foreground">
                {{ address.firstName }} {{ address.lastName }}
                <span v-if="address.company" class="text-muted-foreground font-normal">
                    ({{ address.company }})
                </span>
            </div>

            <!-- Address -->
            <div class="text-sm text-muted-foreground space-y-1">
                <div>{{ address.address }}</div>
                <div v-if="address.apartment">{{ address.apartment }}</div>
                <div>{{ address.city }}, {{ address.state }} {{ address.zipCode }}</div>
                <div>{{ address.country }}</div>
                <div class="flex items-center gap-1">
                    <Phone class="w-3 h-3" />
                    {{ address.phone }}
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 pt-4 border-t">
            <Button
                v-if="!address.isDefault"
                variant="outline"
                size="sm"
                @click="handleSetDefault"
                :disabled="isLoading"
                class="w-full sm:w-auto"
            >
                <Star class="w-4 h-4 mr-1" />
                {{ t('address.setAsDefault') }}
            </Button>

            <Button
                variant="outline"
                size="sm"
                @click="$emit('edit')"
                :disabled="isLoading"
                class="w-full sm:w-auto"
            >
                <Edit class="w-4 h-4 mr-1" />
                {{ t('common.edit') }}
            </Button>

            <Button
                variant="outline"
                size="sm"
                @click="handleDelete"
                :disabled="isLoading || !canDelete"
                class="w-full sm:w-auto text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
                <Trash2 class="w-4 h-4 mr-1" />
                {{ t('common.delete') }}
            </Button>
        </div>

        <!-- Loading Overlay -->
        <div
            v-if="isLoading"
            class="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center"
        >
            <div
                class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
            ></div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <ConfirmDialog
            v-model:open="showDeleteDialog"
            :title="t('address.deleteTitle')"
            :description="t('address.deleteConfirmation')"
            :confirm-text="t('common.delete')"
            :cancel-text="t('common.cancel')"
            variant="destructive"
            :loading="isDeleting"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppI18n } from '@/composables/useI18n'
import { useToast } from '@/composables/useToast'
import { useAddressStore, type Address } from '@/stores/addresses'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { Phone, Star, Edit, Trash2 } from 'lucide-vue-next'

interface Props {
    address: Address
    canDelete: boolean
}

interface Emits {
    (e: 'edit'): void
    (e: 'deleted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useAppI18n()
const { success, error } = useToast()
const addressStore = useAddressStore()

const isLoading = ref(false)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)

const handleSetDefault = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
        await addressStore.setDefaultAddress(props.address.id)
        success(t('toast.success'), t('toast.addressSetDefault'))
    } catch (err) {
        console.error('Error setting default address:', err)
        error(t('toast.error'), t('toast.addressSetDefaultFailed'))
    } finally {
        isLoading.value = false
    }
}

const handleDelete = () => {
    if (isLoading.value || !props.canDelete) return
    showDeleteDialog.value = true
}

const confirmDelete = async () => {
    if (isDeleting.value) return

    isDeleting.value = true
    try {
        await addressStore.deleteAddress(props.address.id)
        showDeleteDialog.value = false
        success(t('toast.success'), t('toast.addressDeleted'))
        emit('deleted')
    } catch (err) {
        console.error('Error deleting address:', err)
        error(t('toast.error'), t('toast.addressDeleteFailed'))
    } finally {
        isDeleting.value = false
    }
}
</script>
