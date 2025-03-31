
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend)

export function MemberEngagementCard({ data }) {
  const { totalMembers, totalMemberships, avgProjectsPerMember, totalOwnerships } = data

  // Chart.js data
  const chartData = {
    labels: ["Miembros", "Membresías", "Propietarios"],
    datasets: [
      {
        label: "Cantidad",
        data: [Number.parseInt(totalMembers), Number.parseInt(totalMemberships), Number.parseInt(totalOwnerships)],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)", // Indigo
          "rgba(16, 185, 129, 0.7)", // Green
          "rgba(245, 158, 11, 0.7)", // Amber
        ],
        borderColor: ["rgba(99, 102, 241, 1)", "rgba(16, 185, 129, 1)", "rgba(245, 158, 11, 1)"],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Cantidad: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Participación de Miembros</CardTitle>
        <CardDescription>Resumen de la actividad de los miembros</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Miembros</h3>
              <p className="mt-2 text-2xl font-bold">{totalMembers}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Promedio de Proyectos</h3>
              <p className="mt-2 text-2xl font-bold">{Number.parseFloat(avgProjectsPerMember).toFixed(2)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Por miembro</p>
            </div>
          </div>

          <div className="h-[200px]">
            <Bar data={chartData} options={options} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border p-2">
              <p className="text-xs font-medium text-muted-foreground">Miembros</p>
              <p className="text-lg font-bold">{totalMembers}</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className="text-xs font-medium text-muted-foreground">Membresías</p>
              <p className="text-lg font-bold">{totalMemberships}</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className="text-xs font-medium text-muted-foreground">Propietarios</p>
              <p className="text-lg font-bold">{totalOwnerships}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

