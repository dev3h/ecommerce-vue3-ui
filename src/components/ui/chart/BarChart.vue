<script setup lang="ts">
import { computed } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ChartData {
    [key: string]: any
}

interface Props {
    data: ChartData[]
    dataKey?: string
    dataKeys?: string[]
    nameKey?: string
    height?: number
    color?: string
    colors?: string[]
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    dataKey: 'value',
    dataKeys: () => [],
    nameKey: 'name',
    height: 350,
    color: '#3b82f6',
    colors: () => ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ef4444'],
    title: '',
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

const chartData = computed(() => {
    // Function to truncate text to 2 words + "..."
    const truncateLabel = (label: string): string => {
        const words = label.split(' ')
        if (words.length <= 2) {
            return label
        }
        return words.slice(0, 2).join(' ') + '...'
    }

    // Use dataKeys if provided, otherwise fallback to single dataKey
    const keysToUse = props.dataKeys.length > 0 ? props.dataKeys : [props.dataKey]

    if (keysToUse.length === 1) {
        // Single dataset with different colors for each bar
        return {
            labels: props.data.map((item) => truncateLabel(item[props.nameKey])),
            datasets: [
                {
                    label: keysToUse[0].charAt(0).toUpperCase() + keysToUse[0].slice(1),
                    backgroundColor: props.data.map(
                        (_, index) => props.colors[index % props.colors.length],
                    ),
                    borderColor: props.data.map(
                        (_, index) => props.colors[index % props.colors.length],
                    ),
                    data: props.data.map((item) => item[keysToUse[0]]),
                    borderRadius: 4,
                    borderSkipped: false,
                },
            ],
        }
    } else {
        // Multiple datasets with same color per dataset
        return {
            labels: props.data.map((item) => truncateLabel(item[props.nameKey])),
            datasets: keysToUse.map((key, index) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                backgroundColor: props.colors[index % props.colors.length],
                borderColor: props.colors[index % props.colors.length],
                data: props.data.map((item) => item[key]),
                borderRadius: 4,
                borderSkipped: false,
            })),
        }
    }
})

const chartOptions = computed(() => {
    const themeColors = getThemeColors()
    const keysToUse = props.dataKeys.length > 0 ? props.dataKeys : [props.dataKey]

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: keysToUse.length > 1,
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
                callbacks: {
                    title: (context: any) => {
                        // Show full product name in tooltip
                        const dataIndex = context[0].dataIndex
                        return props.data[dataIndex][props.nameKey]
                    },
                    label: (context: any) => {
                        const value = context.parsed.y
                        const label = context.dataset.label || 'Value'

                        // Check if this is sales data (Top Products chart)
                        if (
                            label.toLowerCase().includes('sales') ||
                            context.dataset.label === 'Sales'
                        ) {
                            return `Sales: ${value.toLocaleString()}`
                        }

                        // Format large numbers as millions for revenue
                        if (value >= 1000000) {
                            return `${label}: $${(value / 1000000).toFixed(2)}M`
                        } else if (value >= 1000) {
                            return `${label}: $${(value / 1000).toFixed(0)}K`
                        }
                        return `${label}: $${value.toLocaleString()}`
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
                    maxRotation: 45,
                    minRotation: 0,
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
                    callback: (value: any) => {
                        // Format large numbers as millions
                        if (value >= 1000000) {
                            return '$' + (value / 1000000).toFixed(1) + 'M'
                        } else if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(0) + 'K'
                        }
                        return '$' + value.toLocaleString()
                    },
                },
            },
        },
    }
})
</script>

<template>
    <div :style="{ height: `${height}px` }" class="w-full">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>
