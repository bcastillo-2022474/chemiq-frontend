"use client"

import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, FlaskRoundIcon as Flask, Settings, LogOut, Newspaper, Podcast, X } from "lucide-react"
import { useAuth } from "@/context/auth.jsx"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/stats" },
  { name: "Users", icon: Users, href: "/dashboard/users" },
  { name: "Projects", icon: Flask, href: "/dashboard/projects" },
  { name: "News", icon: Newspaper, href: "/dashboard/news" },
  { name: "Podcast", icon: Podcast, href: "/dashboard/podcast" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  // Function to close sidebar on mobile when navigating
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      // Find the parent component and close the sidebar
      const event = new CustomEvent("closeSidebar")
      window.dispatchEvent(event)
    }
  }

  // Listen for custom closeSidebar event
  useEffect(() => {
    const handleCloseSidebar = () => {
      // This will be handled by the parent component
    }

    window.addEventListener("closeSidebar", handleCloseSidebar)
    return () => {
      window.removeEventListener("closeSidebar", handleCloseSidebar)
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Close button only visible on mobile */}
      <button
        className="md:hidden self-end p-4 text-gray-500 hover:text-gray-700"
        onClick={() => window.dispatchEvent(new CustomEvent("closeSidebar"))}
      >
        <X className="h-6 w-6" />
      </button>

      <div className="p-6 flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8">Chemistry Lab</h1>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 transition-colors ${
                location.pathname === item.href ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={closeSidebarOnMobile}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 bg-red-500 p-3 rounded-lg text-white hover:bg-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

