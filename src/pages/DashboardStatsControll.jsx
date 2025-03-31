"use client"

import { Loader2 } from "lucide-react"
import { SummaryCards } from "../components/ui/kpi/summary-cards"
import { RoleDistributionChart } from "../components/ui/kpi/RoleDistributionChart"
import { NewsDistributionChart } from "../components/ui/kpi/news-distribution-chart"
import { MemberEngagementCard } from "../components/ui/kpi/member-engagement-card"
import { ProjectTimelineCard } from "../components/ui/kpi/project-timeline-card"
import { useProyectos } from "@/hooks/useDash"

export default function DashboardPage() {
  const { dashboardData, loading, error } = useProyectos()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando datos del dashboard...</span>
      </div>
    )
  }

  if (error || !dashboardData) {x
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <p className="text-destructive">Error: {error || "No se pudieron cargar los datos"}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full bg-white">
      <main className="w-full h-full p-6">
        <h1 className="mb-6 text-3xl font-bold">Panel de Control</h1>

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