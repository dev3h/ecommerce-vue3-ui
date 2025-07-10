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
    Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
)

interface ChartData {
    [key: string]: any
}

interface Props {
    data: ChartData[]
    dataKeys: string[]
    nameKey?: string
    height?: number
    colors?: string[]
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    nameKey: 'name',
    height: 350,
    colors: () => ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ef4444'],
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
    datasets: props.dataKeys.map((key, index) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        backgroundColor: props.colors[index % props.colors.length] + '80',
        data: props.data.map((item) => item[key]),
        fill: true,
        pointBackgroundColor: getThemeColors.value.background,
        pointBorderColor: props.colors[index % props.colors.length],
        pointBorderWidth: 2,
    })),
}))

const chartOptions = computed(() => {
    const themeColors = getThemeColors.value
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: props.dataKeys.length > 1,
                labels: {
                    color: themeColors.foreground,
                },
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
