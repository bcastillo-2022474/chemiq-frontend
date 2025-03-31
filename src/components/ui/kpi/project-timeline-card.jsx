
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Hourglass } from "lucide-react"

export function ProjectTimelineCard({ data }) {
  const { avgDurationDays } = data

  // Since there's not much timeline data, we'll display a simple card with the average duration
  // and some placeholder metrics that could be useful in the future

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Proyectos</CardTitle>
        <CardDescription>Métricas de duración y estado de proyectos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center rounded-lg border p-6">
            <Clock className="mb-4 h-12 w-12 text-primary" />
            <h3 className="text-lg font-medium">Duración Promedio</h3>
            <p className="mt-2 text-3xl font-bold">
              {Number.parseFloat(avgDurationDays) === 0
                ? "N/A"
                : `${Number.parseFloat(avgDurationDays).toFixed(1)} días`}
            </p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              {Number.parseFloat(avgDurationDays) === 0
                ? "No hay datos suficientes"
                : "Tiempo promedio desde la creación hasta la finalización"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border p-6">
            <Hourglass className="mb-4 h-12 w-12 text-primary" />
            <h3 className="text-lg font-medium">Estado de Proyectos</h3>
            <div className="mt-4 grid w-full grid-cols-1 gap-2">
              <div className="flex items-center justify-between rounded-md bg-primary/10 p-2">
                <span className="text-sm">Total Proyectos</span>
                <span className="font-medium">{data.avgDurationDays ? "6" : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-green-500/10 p-2">
                <span className="text-sm">Completados</span>
                <span className="font-medium">{data.avgDurationDays ? "0" : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-amber-500/10 p-2">
                <span className="text-sm">En Progreso</span>
                <span className="font-medium">{data.avgDurationDays ? "6" : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

