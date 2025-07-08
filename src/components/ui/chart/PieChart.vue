<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ChartData {
    name: string
    value: number
    [key: string]: any
}

interface Props {
    data: ChartData[]
    height?: number
    colors?: string[]
    showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    height: 350,
    colors: () => [
        '#3b82f6', // blue
        '#22c55e', // green
        '#a855f7', // purple
        '#f59e0b', // amber
        '#ef4444', // red
        '#06b6d4', // cyan
        '#8b5cf6', // violet
    ],
    showLegend: true,
})

// Reactive theme detection
const isDarkMode = ref(false)

const updateTheme = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
    updateTheme()
    // Listen for theme changes
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    })

    onUnmounted(() => {
        observer.disconnect()
    })
})

// Get computed colors based on theme
const getThemeColors = () => {
    return {
        foreground: isDarkMode.value ? '#ffffff' : '#0f172a',
        mutedForeground: isDarkMode.value ? '#94a3b8' : '#64748b',
        background: isDarkMode.value ? '#020817' : '#ffffff',
        border: isDarkMode.value ? '#334155' : '#e2e8f0',
    }
}

const chartData = computed(() => ({
    labels: props.data.map((item) => item.name),
    datasets: [
        {
            data: props.data.map((item) => item.value),
            backgroundColor: props.colors,
            borderColor: props.colors,
            borderWidth: 2,
        },
    ],
}))

const chartOptions = computed(() => {
    const themeColors = getThemeColors()
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: props.showLegend,
                position: 'top' as const,
                labels: {
                    color: themeColors.mutedForeground,
                    padding: 15,
                    font: {
                        size: 12,
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: themeColors.background,
                titleColor: themeColors.foreground,
                bodyColor: themeColors.foreground,
                borderColor: themeColors.border,
                borderWidth: 1,
                cornerRadius: 6,
                displayColors: true,
            },
        },
        cutout: '50%', // Giảm cutout để pie chart to hơn
        layout: {
            padding: {
                top: 10,
                bottom: 10,
            },
        },
    }
})
</script>

<template>
    <div :style="{ height: `${height}px` }" class="w-full">
        <Doughnut :data="chartData" :options="chartOptions" />
    </div>
</template>
