<template>
    <div :style="{ height: `${height}px` }" class="w-full">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

interface TrendData {
    [key: string]: any
}

interface Props {
    data: TrendData[]
    years: string[]
    nameKey?: string
    height?: number
    colors?: string[]
    highlightCurrentYear?: boolean
    currentYear?: string
    showTrendArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    nameKey: 'name',
    height: 350,
    colors: () => [
        '#94a3b8', // 2022 - Light gray
        '#64748b', // 2023 - Dark gray
        '#3b82f6', // 2024 - Blue
        '#22c55e', // 2025 - Green (current year)
    ],
    highlightCurrentYear: true,
    currentYear: '2025',
    showTrendArea: false,
})

// Get computed colors based on theme
const getThemeColors = () => {
    const isDark = document.documentElement.classList.contains('dark')
    return {
        foreground: isDark ? '#ffffff' : '#000000',
        mutedForeground: isDark ? '#a1a1aa' : '#71717a',
        background: isDark ? '#000000' : '#ffffff',
        border: isDark ? '#27272a' : '#e4e4e7',
    }
}

const chartData = computed(() => ({
    labels: props.data.map((item) => item[props.nameKey]),
    datasets: props.years.map((year, index) => {
        const isCurrentYear = props.highlightCurrentYear && year === props.currentYear
        const color = props.colors[index % props.colors.length]

        return {
            label: year,
            data: props.data.map((item) => item[year]),
            borderColor: color,
            backgroundColor: props.showTrendArea ? color + '20' : 'transparent',
            pointBackgroundColor: isCurrentYear ? color : getThemeColors().background,
            pointBorderColor: color,
            pointBorderWidth: isCurrentYear ? 3 : 2,
            pointRadius: isCurrentYear ? 6 : 4,
            pointHoverRadius: isCurrentYear ? 8 : 6,
            borderWidth: isCurrentYear ? 4 : 2,
            tension: 0.4,
            fill: props.showTrendArea,
            order: isCurrentYear ? 1 : 2, // Current year on top
        }
    }),
}))

const chartOptions = computed(() => {
    const themeColors = getThemeColors()
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    color: themeColors.foreground,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 'normal' as const,
                    },
                },
            },
            tooltip: {
                backgroundColor: themeColors.background,
                titleColor: themeColors.foreground,
                bodyColor: themeColors.foreground,
                borderColor: themeColors.border,
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: (context: any) => {
                        const label = context.dataset.label || ''
                        const value = context.parsed.y
                        const isCurrentYear =
                            props.highlightCurrentYear && label === props.currentYear
                        const prefix = isCurrentYear ? '🔥 ' : ''
                        return `${prefix}${label}: $${value.toLocaleString()}`
                    },
                    title: (context: any) => {
                        return `${context[0].label} - Revenue Comparison`
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: themeColors.mutedForeground,
                    font: {
                        size: 11,
                    },
                },
            },
            y: {
                grid: {
                    color: themeColors.border,
                },
                ticks: {
                    color: themeColors.mutedForeground,
                    font: {
                        size: 11,
                    },
                    callback: (value: any) => {
                        return '$' + (value / 1000).toFixed(0) + 'K'
                    },
                },
                title: {
                    display: true,
                    text: 'Revenue (USD)',
                    color: themeColors.mutedForeground,
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                },
            },
        },
        elements: {
            point: {
                hoverBackgroundColor: getThemeColors().background,
            },
        },
    }
})
</script>
