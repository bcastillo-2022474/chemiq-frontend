"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/ui/SideBarDashboard"
import { Outlet } from "react-router-dom"
import { Menu } from "lucide-react"
import { getColors } from "@/actions/personalization"

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen relative overflow-hidden" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md"
        style={{
          backgroundColor: theme.colors.Primary || '#fc5000',
          color: theme.colors.Secondary || '#e4e4e4'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.colors.Accent || '#505050'
          e.target.style.color = theme.colors.Secondary || '#e4e4e4'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = theme.colors.Primary || '#fc5000'
          e.target.style.color = theme.colors.Secondary || '#e4e4e4'
        }}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" style={{ color: theme.colors.Secondary || '#e4e4e4' }} />
      </button>

      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          transition-transform duration-300 ease-in-out
          fixed md:relative z-40 h-full w-64 shadow-md
        `}
        style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
      >
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`
          flex-1 overflow-auto transition-all duration-300
          ${sidebarOpen ? "md:ml-0" : "ml-0"} 
          md:ml-0
        `}
      >
        <Outlet />
      </div>
    </div>
  )
}