
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend)

export function NewsDistributionChart({ data }) {
  // Normalize data - combine similar categories (e.g., "Educacion", "Educación", "Education")
  const normalizedData = data.reduce((acc, item) => {
    const normalizedType = item.tipo.toLowerCase().replace(/ó/g, "o")
    const existingItem = acc.find((i) => i.tipo.toLowerCase().replace(/ó/g, "o") === normalizedType)

    if (existingItem) {
      existingItem.total = (Number.parseInt(existingItem.total) + Number.parseInt(item.total)).toString()
    } else {
      acc.push({ ...item })
    }

    return acc
  }, [])


  const generateColors = (count) => {
    const baseColors = [
      { bg: "rgba(99, 102, 241, 0.8)", border: "rgba(99, 102, 241, 1)" }, // Indigo
      { bg: "rgba(16, 185, 129, 0.8)", border: "rgba(16, 185, 129, 1)" }, // Green
      { bg: "rgba(245, 158, 11, 0.8)", border: "rgba(245, 158, 11, 1)" }, // Amber
      { bg: "rgba(239, 68, 68, 0.8)", border: "rgba(239, 68, 68, 1)" }, // Red
      { bg: "rgba(59, 130, 246, 0.8)", border: "rgba(59, 130, 246, 1)" }, // Blue
      { bg: "rgba(168, 85, 247, 0.8)", border: "rgba(168, 85, 247, 1)" }, // Purple
    ]

    // If we have more categories than base colors, we'll cycle through them
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length])
  }

  const colors = generateColors(normalizedData.length)

  // Calculate total news for percentage
  const totalNews = normalizedData.reduce((sum, item) => sum + Number.parseInt(item.total), 0)

  // Prepare data for Chart.js
  const chartData = {
    labels: normalizedData.map((item) => item.tipo),
    datasets: [
      {
        data: normalizedData.map((item) => Number.parseInt(item.total)),
        backgroundColor: colors.map((color) => color.bg),
        borderColor: colors.map((color) => color.border),
        borderWidth: 1,
      },
    ],
  }

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = normalizedData[context.dataIndex]
            const percentage = ((Number.parseInt(item.total) / totalNews) * 100).toFixed(1)
            return `${item.tipo}: ${item.total} (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Distribución de Noticias</CardTitle>
        <CardDescription>Distribución de noticias por tipo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <Pie data={chartData} options={options} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {normalizedData.map((item, index) => (
            <div key={item.tipo} className="flex flex-col items-center">
              <div className="mb-1 h-3 w-3 rounded-full" style={{ backgroundColor: colors[index].bg }} />
              <p className="text-sm font-medium">{item.tipo}</p>
              <p className="text-xs text-muted-foreground">{item.total} noticias</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

