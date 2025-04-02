"use client"

import { useState } from "react"
import { Sidebar } from "@/components/ui/SideBarDashboard"
import { Outlet } from "react-router-dom"
import { Menu } from "lucide-react"

export function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          transition-transform duration-300 ease-in-out
          fixed md:relative z-40 h-full w-64 bg-white shadow-md
        `}
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

