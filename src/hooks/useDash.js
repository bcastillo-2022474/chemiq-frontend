import { useState, useEffect } from "react"
import { getStats } from "@/actions/dash"

export function useProyectos() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch dashboard data
  const fetchStats = async () => {
    try {
      setLoading(true)
      const [err, response] = await getStats()

      if (err) {
        setError(err.message || 'Error al cargar los datos')
        setDashboardData(null)
      } else if (response && response.success) {
        setDashboardData(response.data)
        setError(null)
      } else {
        setError('No se pudieron cargar los datos')
        setDashboardData(null)
      }
    } catch (e) {
      setError(e.message || 'Error inesperado')
      setDashboardData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    dashboardData,
    loading,
    error
  }
}