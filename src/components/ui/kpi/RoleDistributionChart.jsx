
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend)

export function RoleDistributionChart({ data }) {
  // Define colors for each role
  const COLORS = {
    Admin: "rgba(99, 102, 241, 0.8)", // Indigo
    Junta: "rgba(16, 185, 129, 0.8)", // Green
    User: "rgba(245, 158, 11, 0.8)", // Amber
    default: "rgba(156, 163, 175, 0.8)", // Gray for any other roles
  }

  const BORDER_COLORS = {
    Admin: "rgba(99, 102, 241, 1)",
    Junta: "rgba(16, 185, 129, 1)",
    User: "rgba(245, 158, 11, 1)",
    default: "rgba(156, 163, 175, 1)",
  }

  // Calculate total users for percentage
  const totalUsers = data.reduce((sum, item) => sum + Number.parseInt(item.total_users), 0)

  // Prepare data for Chart.js
  const chartData = {
    labels: data.map((item) => item.role_name),
    datasets: [
      {
        data: data.map((item) => Number.parseInt(item.total_users)),
        backgroundColor: data.map((item) => COLORS[item.role_name] || COLORS.default),
        borderColor: data.map((item) => BORDER_COLORS[item.role_name] || BORDER_COLORS.default),
        borderWidth: 1,
      },
    ],
  }

  // Chart options
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
          {data.map((item) => (
            <div key={item.role_name} className="flex flex-col items-center">
              <div
                className="mb-1 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORS[item.role_name] || COLORS.default,
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

