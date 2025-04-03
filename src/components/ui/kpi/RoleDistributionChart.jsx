
import { useMemo } from "react"
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateRandomColors } from "@/utils/colors"
ChartJS.register(ArcElement, ChartTooltip, Legend)

export function RoleDistributionChart({ data }) {
  const colors = useMemo(() => ({
    backgrounds: generateRandomColors(data.length, 0.8),
    borders: generateRandomColors(data.length, 1)
  }), [data.length])

  const totalUsers = data.reduce((sum, item) => sum + Number.parseInt(item.total_users), 0)

  const chartData = {
    labels: data.map((item) => item.role_name),
    datasets: [
      {
        data: data.map((item) => Number.parseInt(item.total_users)),
        backgroundColor: colors.backgrounds,
        borderColor: colors.borders,
        borderWidth: 1,
      },
    ],
  }


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
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
            const item = data[context.dataIndex]
            const percentage = ((Number.parseInt(item.total_users) / totalUsers) * 100).toFixed(1)
            return `${item.role_name}: ${item.total_users} (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Distribución de Roles</CardTitle>
        <CardDescription>Distribución de usuarios por rol</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {data.map((item, index) => (
            <div key={item.role_name} className="flex flex-col items-center">
              <div
                className="mb-1 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: colors.backgrounds[index],
                }}
              />
              <p className="text-sm font-medium">{item.role_name}</p>
              <p className="text-xs text-muted-foreground">{item.total_users} usuarios</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}