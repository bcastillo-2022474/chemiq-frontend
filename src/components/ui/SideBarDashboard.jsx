"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, FlaskRoundIcon as Flask, Settings, LogOut, Newspaper, Podcast, X } from "lucide-react"
import { useAuth } from "@/context/auth.jsx"
import { getColors } from "@/actions/personalization"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard/stats" },
  { name: "Usuarios", icon: Users, href: "/dashboard/users" },
  { name: "Proyectos", icon: Flask, href: "/dashboard/projects" },
  { name: "Noticias", icon: Newspaper, href: "/dashboard/news" },
  { name: "Podcast", icon: Podcast, href: "/dashboard/podcast" },
  { name: "Ajustes", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
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

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      const event = new CustomEvent("closeSidebar")
      window.dispatchEvent(event)
    }
  }

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
      style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
    >
      <button
        className="md:hidden self-end p-4"
        style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
        onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.Primary || '#fc5000'}
        onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.Tertiary || '#5f5f5f'}
        onClick={() => window.dispatchEvent(new CustomEvent("closeSidebar"))}
      >
        <X className="h-6 w-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }} />
      </button>

      <div className="p-6 flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8" style={{ color: theme.colors.Accent || '#505050' }}>
          Chemistry Lab
        </h1>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 transition-colors ${
                location.pathname === item.href ? 'font-medium' : ''
              }`}
              style={{
                color: location.pathname === item.href 
                  ? theme.colors.Primary || '#fc5000' 
                  : theme.colors.Tertiary || '#5f5f5f'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.Primary || '#fc5000'}
              onMouseLeave={(e) => e.currentTarget.style.color = location.pathname === item.href
                ? theme.colors.Primary || '#fc5000'
                : theme.colors.Tertiary || '#5f5f5f'}
              onClick={closeSidebarOnMobile}
            >
              <item.icon 
                className="h-5 w-5" 
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6" style={{ borderTop: `1px solid ${theme.colors.Tertiary || '#5f5f5f'}` }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors"
          style={{
            backgroundColor: theme.colors.Primary || '#fc5000',
            color: theme.colors.Secondary || '#e4e4e4'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.Accent || '#505050'
            e.currentTarget.style.color = theme.colors.Secondary || '#e4e4e4'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.Primary || '#fc5000'
            e.currentTarget.style.color = theme.colors.Secondary || '#e4e4e4'
          }}
        >
          <LogOut className="h-5 w-5" style={{ color: theme.colors.Secondary || '#e4e4e4' }} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}