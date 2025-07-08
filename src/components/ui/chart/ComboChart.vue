<template>
    <div class="relative">
        <canvas :id="chartId" :width="width" :height="height"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    type ChartConfiguration,
    type TooltipItem,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
)

interface ComboChartData {
    name: string
    [key: string]: string | number
}

interface Props {
    data: ComboChartData[]
    barKeys: string[]
    lineKeys: string[]
    height?: number
    width?: number
    barColors?: string[]
    lineColors?: string[]
    showLegend?: boolean
    responsive?: boolean
    useSameYAxis?: boolean // Để line và bar cùng scale
}

const props = withDefaults(defineProps<Props>(), {
    height: 400,
    width: 800,
    barColors: () => ['#3b82f6', '#22c55e'],
    lineColors: () => ['#f59e0b', '#ef4444'],
    showLegend: true,
    responsive: true,
    useSameYAxis: false, // Mặc định sử dụng 2 trục khác nhau
})

const chartId = ref(`combo-chart-${Math.random().toString(36).substr(2, 9)}`)
const chart = ref<ChartJS | null>(null)

const createChart = async () => {
    await nextTick()
    const canvas = document.getElementById(chartId.value) as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Destroy existing chart
    if (chart.value) {
        chart.value.destroy()
    }

    const labels = props.data.map((item) => item.name)

    // Create datasets for bars
    const barDatasets = props.barKeys.map((key, index) => ({
        type: 'bar' as const,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: props.data.map((item) => item[key] as number),
        backgroundColor: props.barColors[index % props.barColors.length],
        borderColor: props.barColors[index % props.barColors.length]
            .replace('0.2)', '1)')
            .replace('rgba(', 'rgba(')
            .replace(/,\s*[\d.]+\)/, ', 1)'),
        borderWidth: 2,
        yAxisID: 'y',
    }))

    // Create datasets for lines
    const lineDatasets = props.lineKeys.map((key, index) => ({
        type: 'line' as const,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        data: props.data.map((item) => item[key] as number),
        borderColor: props.lineColors[index % props.lineColors.length],
        backgroundColor: props.lineColors[index % props.lineColors.length].replace('1)', '0.1)'),
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: props.lineColors[index % props.lineColors.length],
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: props.useSameYAxis ? 'y' : 'y1', // Sử dụng cùng trục y nếu useSameYAxis = true
    }))

    const datasets = [...barDatasets, ...lineDatasets]

    const config: ChartConfiguration = {
        type: 'bar',
        data: {
            labels,
            datasets,
        },
        options: {
            responsive: props.responsive,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: props.showLegend,
                    position: 'top' as const,
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                    },
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: (context: TooltipItem<'bar' | 'line'>) => {
                            const label = context.dataset.label || ''
                            const value = context.parsed.y
                            // Thêm unit dựa vào dataset type thay vì lineKeys
                            const isLineDataset =
                                context.dataset.type === 'line' && !props.useSameYAxis
                            const unit = isLineDataset ? '%' : ''
                            return `${label}: ${value.toLocaleString()}${unit}`
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
                        color: '#6b7280',
                        font: {
                            size: 12,
                        },
                    },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12,
                        },
                        callback: (value) => value.toLocaleString(),
                    },
                    title: {
                        display: true,
                        text: 'Count',
                        color: '#6b7280',
                        font: {
                            size: 12,
                            weight: 'bold',
                        },
                    },
                },
                y1: props.useSameYAxis
                    ? undefined
                    : {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          grid: {
                              drawOnChartArea: false,
                          },
                          ticks: {
                              color: '#6b7280',
                              font: {
                                  size: 12,
                              },
                              callback: (value) => `${value}%`,
                          },
                          title: {
                              display: true,
                              text: 'Rate (%)',
                              color: '#6b7280',
                              font: {
                                  size: 12,
                                  weight: 'bold',
                              },
                          },
                      },
            },
        },
    }

    chart.value = new ChartJS(ctx, config)
}

// Watch for data changes
watch(() => props.data, createChart, { deep: true })
watch(() => props.barKeys, createChart)
watch(() => props.lineKeys, createChart)
watch(() => props.barColors, createChart)
watch(() => props.lineColors, createChart)
watch(() => props.useSameYAxis, createChart)

onMounted(createChart)

onBeforeUnmount(() => {
    if (chart.value) {
        chart.value.destroy()
    }
})
</script>
