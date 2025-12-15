<script lang="ts" setup>
import type { DrawerRootProps } from 'vaul-vue'
import { DrawerRoot } from 'vaul-vue'

defineProps<DrawerRootProps>()

</script>

<template>
    <DrawerRoot data-slot="drawer">
        <slot />
    </DrawerRoot>
</template>
