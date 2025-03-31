
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, ChartTooltip, Legend);

export function ProjectStatusChart({ data }) {
  // Formatear etiquetas de estado para mejor visualización
  const formattedData = data.map((item) => ({
    ...item,
    name: item.status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));

  // Definir colores para cada estado
  const COLORS = {
    in_progress: "rgba(99, 102, 241, 0.8)", // Indigo
    completed: "rgba(16, 185, 129, 0.8)", // Green
    pending: "rgba(245, 158, 11, 0.8)", // Amber
  };

  const BORDER_COLORS = {
    in_progress: "rgba(99, 102, 241, 1)",
    completed: "rgba(16, 185, 129, 1)",
    pending: "rgba(245, 158, 11, 1)",
  };

  // Preparar datos para Chart.js
  const chartData = {
    labels: formattedData.map((item) => item.name),
    datasets: [
      {
        data: formattedData.map((item) => item.count),
        backgroundColor: formattedData.map((item) => COLORS[item.status]),
        borderColor: formattedData.map((item) => BORDER_COLORS[item.status]),
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico
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
            const item = formattedData[context.dataIndex];
            return `${item.name}: ${item.count} (${item.percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Project Status Distribution</CardTitle>
        <CardDescription>Current distribution of projects by status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {formattedData.map((item) => (
            <div key={item.status} className="flex flex-col items-center">
              <div
                className="mb-1 h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[item.status] }}
              />
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.count} projects</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
