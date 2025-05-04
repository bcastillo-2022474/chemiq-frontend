import { useState, useEffect } from "react"
import { SummaryCards } from "../components/ui/kpi/summary-cards"
import { RoleDistributionChart } from "../components/ui/kpi/RoleDistributionChart"
import { NewsDistributionChart } from "../components/ui/kpi/news-distribution-chart"
import { MemberEngagementCard } from "../components/ui/kpi/member-engagement-card"
import { ProjectTimelineCard } from "../components/ui/kpi/project-timeline-card"
import { useProyectos } from "@/hooks/useDash"
import LoaderCustom from "../components/ui/LoaderCustom"
import { getColors } from "@/actions/personalization"

export default function DashboardPage() {
  const { dashboardData, loading, error } = useProyectos()
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  })

  const fetchColors = async () => {
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      return
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    )
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    console.log("Fetched colors:", formattedColors)
  }

  useEffect(() => {
    fetchColors()
  }, [])

  if (loading) {
    return (
      <LoaderCustom />
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="flex h-screen w-full items-center justify-center" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
        <p style={{ color: theme.colors.Primary || '#fc5000' }}>
          Error: {error || "No se pudieron cargar los datos"}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
      <main className="w-full h-full p-6">
        <h1 className="mb-6 text-3xl font-bold" style={{ color: theme.colors.Accent || '#505050' }}>
          Panel de Control
        </h1>

        <SummaryCards data={dashboardData} />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RoleDistributionChart data={dashboardData.roleDistribution} />
          <NewsDistributionChart data={dashboardData.newsDistribution} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MemberEngagementCard data={dashboardData.memberEngagement} />
          <ProjectTimelineCard data={dashboardData.projectTimeline} />
        </div>
      </main>
    </div>
  )
}