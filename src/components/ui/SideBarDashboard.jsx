"use client"

import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, FlaskRoundIcon as Flask, Settings, LogOut, Newspaper, Podcast, X } from "lucide-react"
import { useAuth } from "@/context/auth.jsx"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/stats" },
  { name: "Usuarios", icon: Users, href: "/dashboard/users" },
  { name: "Proyectos", icon: Flask, href: "/dashboard/projects" },
  { name: "Noticias", icon: Newspaper, href: "/dashboard/news" },
  { name: "Podcast", icon: Podcast, href: "/dashboard/podcast" },
  { name: "Ajustes", icon: Settings, href: "/settings" },
]

export function Sidebar({
  colors = {
    background: "white",
    text: "text-gray-600",
    textHover: "hover:text-blue-600",
    activeText: "text-blue-600 font-medium",
    buttonBackground: "bg-red-500",
    buttonHover: "hover:bg-red-600",
    buttonText: "text-white",
  },
}) {
  const location = useLocation()
  const { logout } = useAuth()

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Function to close sidebar on mobile when navigating
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
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
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: colors.background }} // Apply background color
    >
      {/* Close button only visible on mobile */}
      <button
        className={`md:hidden self-end p-4 ${colors.text} ${colors.textHover}`}
        onClick={() => window.dispatchEvent(new CustomEvent("closeSidebar"))}
      >
        <X className="h-6 w-6" />
      </button>

      <div className="p-6 flex-1 overflow-y-auto">
        <h1 className={`text-2xl font-bold mb-8 ${colors.text}`}>Chemistry Lab</h1>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 transition-colors ${
                location.pathname === item.href ? colors.activeText : `${colors.text} ${colors.textHover}`
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
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 ${colors.buttonBackground} p-3 rounded-lg ${colors.buttonText} ${colors.buttonHover} transition-colors`}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

