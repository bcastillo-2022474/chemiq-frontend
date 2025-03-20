"use client"

import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Home, Podcast, Newspaper, Beaker, User, ChevronDown, LogOut, Settings, FlaskRound } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "Inicio", component: "", icon: Home },
  { name: "Podcast", component: "podcast", icon: Podcast },
  { name: "Noticias", component: "news", icon: Newspaper },
  { name: "Proyectos", component: "project", icon: Beaker },
]

export function Sidebar() {
  const [userData, setUserData] = useState({
    nombre: "Usuario",
    img: "/placeholder.svg",
  })
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUserData({
          nombre: decoded.nombre || "Usuario",
          img: decoded.img || "/placeholder.svg?height=40&width=40",
        })
      } catch (error) {
        console.error("Error al decodificar el token:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  // Enfoque híbrido: usar clases de Tailwind directamente pero con componentes shadcn para el dropdown
  return (
    <aside className="flex flex-col h-screen w-16 md:w-64 bg-accent text-background transition-all duration-300">
      <div className="p-4 border-b border-background/10 flex items-center justify-center md:justify-start">
        <div className="w-8 h-8 rounded-full bg-base flex items-center justify-center">
          <FlaskRound className="w-4 h-4 text-accent" />
        </div>
        <h1 className="ml-3 text-xl font-bold text-background hidden md:block">CHEMIQ</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === `/${item.component}`
            return (
              <Link
                to={`./${item.component}`}
                key={item.name}
                className={`flex items-center justify-center md:justify-start w-full p-2 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-base text-accent" : "hover:bg-base/10"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "" : "text-background"}`} />
                <span className="ml-3 font-medium hidden md:block">{item.name}</span>
              </Link>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-background/10">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center md:justify-start w-full p-2 rounded-lg hover:bg-base/10 transition-colors">
            <div className="relative w-8 h-8 rounded-full bg-base/20 flex items-center justify-center overflow-hidden">
              {userData.img ? (
                <img src={userData.img || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-background" />
              )}
            </div>
            <span className="ml-3 hidden md:block truncate">{userData.nombre}</span>
            <ChevronDown size={16} className="ml-auto hidden md:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-accent border border-base/20 text-background" align="end">
            <DropdownMenuItem className="hover:bg-base/10 focus:bg-base/10 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-base/10 focus:bg-base/10 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-background/10" />
            <DropdownMenuItem
              className="text-subase hover:bg-base/10 focus:bg-base/10 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

