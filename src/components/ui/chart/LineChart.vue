<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface ChartData {
    [key: string]: any
}

interface Props {
    data: ChartData[]
    dataKey?: string
    nameKey?: string
    height?: number
    color?: string
    strokeWidth?: number
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    dataKey: 'value',
    nameKey: 'name',
    height: 350,
    color: '#3b82f6',
    strokeWidth: 2,
    title: '',
})

// Reactive theme detection
const isDark = ref(false)

const updateTheme = () => {
    isDark.value = document.documentElement.classList.contains('dark')
}

// Watch for theme changes
let observer: MutationObserver | null = null

onMounted(() => {
    updateTheme()
    // Watch for class changes on document element
    observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    })
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})

// Get computed colors based on theme
const getThemeColors = computed(() => {
    return {
        foreground: isDark.value ? '#ffffff' : '#000000',
        mutedForeground: isDark.value ? '#a1a1aa' : '#71717a',
        background: isDark.value ? '#000000' : '#ffffff',
        border: isDark.value ? '#27272a' : '#e4e4e7',
    }
})

const chartData = computed(() => ({
    labels: props.data.map((item) => item[props.nameKey]),
    datasets: [
        {
            label: props.title || 'Data',
            borderColor: props.color,
            backgroundColor: props.color + '20',
            data: props.data.map((item) => item[props.dataKey]),
            borderWidth: props.strokeWidth,
            tension: 0.4,
            pointBackgroundColor: getThemeColors.value.background,
            pointBorderColor: props.color,
            pointBorderWidth: 2,
        },
    ],
}))

const chartOptions = computed(() => {
    const themeColors = getThemeColors.value
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: themeColors.background,
                titleColor: themeColors.foreground,
                bodyColor: themeColors.foreground,
                borderColor: themeColors.border,
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: themeColors.mutedForeground,
                },
            },
            y: {
                grid: {
                    color: themeColors.border,
                },
                ticks: {
                    color: themeColors.mutedForeground,
                },
            },
        },
    }
})
</script>

<template>
    <div :style="{ height: `${height}px` }" class="w-full">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>
