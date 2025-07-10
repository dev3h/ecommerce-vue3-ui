<template>
    <div v-if="hasAccess" class="admin-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <!-- Left Sidebar - Fixed Position -->
        <AdminSidebar
            :isOpen="sidebarOpen"
            :isCollapsed="sidebarCollapsed"
            :isMobile="isMobile"
            @close="closeSidebar"
        />

        <!-- Right Content Area -->
        <div class="admin-right-area">
            <!-- Header -->
            <AdminHeader @toggle-sidebar="toggleSidebar" />

            <!-- Main Content -->
            <main class="admin-content">
                <div class="admin-content-inner">
                    <router-view />
                </div>
            </main>
        </div>

        <!-- Mobile Overlay -->
        <div
            v-if="sidebarOpen && isMobile"
            class="admin-mobile-overlay md:hidden"
            @click="closeSidebar"
        />

        <!-- Toast Notifications -->
        <Toast />
    </div>
    <div v-else class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h2 class="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
            <p class="text-muted-foreground">Checking your credentials...</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminHeader from './AdminHeader.vue'
import AdminSidebar from './AdminSidebar.vue'
import Toast from '@/components/Toast.vue'
import { useAuthGuard } from '@/composables/useAuthGuard'

// Auth protection
const { hasAccess } = useAuthGuard()

const sidebarOpen = ref(true)
const sidebarCollapsed = ref(false)
const isMobile = ref(false)

const toggleSidebar = () => {
    console.log('AdminBaseLayout - Toggle sidebar:', {
        isMobile: isMobile.value,
        sidebarOpen: sidebarOpen.value,
        sidebarCollapsed: sidebarCollapsed.value,
    })
    // On mobile: toggle open/close
    // On desktop: toggle collapsed/expanded
    if (isMobile.value) {
        sidebarOpen.value = !sidebarOpen.value
    } else {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }
}

const closeSidebar = () => {
    if (isMobile.value) {
        sidebarOpen.value = false
    }
}

// Initialize sidebar state based on screen size
const checkMobile = () => {
    const wasMobile = isMobile.value
    isMobile.value = window.innerWidth < 768

    // Handle transition between mobile and desktop
    if (wasMobile && !isMobile.value) {
        // Switching from mobile to desktop
        sidebarOpen.value = true
        sidebarCollapsed.value = false
    } else if (!wasMobile && isMobile.value) {
        // Switching from desktop to mobile
        sidebarOpen.value = false
        sidebarCollapsed.value = false
    }
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Cleanup event listener
    return () => {
        window.removeEventListener('resize', checkMobile)
    }
})
</script>

<style scoped>
.admin-layout {
    min-height: 100vh;
    background: hsl(var(--background));
    display: flex;
    position: relative;
}

.admin-right-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: all 0.3s ease;
    position: relative;
    z-index: 25;
    /* Default: Always leave space for sidebar */
    margin-left: 16rem; /* Default sidebar width (256px) */
    width: calc(100% - 16rem);
}

/* Mobile: Full width, no margin, allow sidebar overlay */
@media (max-width: 767px) {
    .admin-right-area {
        margin-left: 0 !important;
        width: 100% !important;
        z-index: 1; /* Lower z-index on mobile to allow sidebar overlay */
    }
}

/* Desktop: Adjust for sidebar width */
@media (min-width: 768px) {
    .admin-right-area {
        margin-left: 16rem; /* Default sidebar width (256px) */
        width: calc(100% - 16rem);
        z-index: 25;
    }

    /* Desktop collapsed state */
    .admin-layout.sidebar-collapsed .admin-right-area {
        margin-left: 4rem; /* Collapsed sidebar width (64px) */
        width: calc(100% - 4rem);
    }
}

.admin-content {
    flex: 1;
    background: hsl(var(--background));
    overflow-y: auto;
    position: relative;
}

.admin-content-inner {
    padding: 1.5rem;
    max-width: 100%;
    min-height: calc(100vh - 4rem); /* Header height */
}

/* Mobile Overlay */
.admin-mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40; /* Between sidebar and content */
    transition: opacity 0.3s ease;
}
</style>
