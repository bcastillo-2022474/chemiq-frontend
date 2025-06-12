"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Podcast, Newspaper, Beaker, User, ChevronDown, LogOut, FlaskRound } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth.jsx"
import { useState, useEffect } from "react"
import { getColors } from "@/actions/personalization"
import { MyProfileForm } from "@/components/MyProfileForm.jsx";

const navItems = [
  { name: "Inicio", component: "", icon: Home },
  { name: "Podcast", component: "podcast", icon: Podcast },
  { name: "Noticias", component: "news", icon: Newspaper },
  { name: "Proyectos", component: "project", icon: Beaker },
]

export function Sidebar() {
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

  const navigate = useNavigate()
  const { user } = useAuth()
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isSectionSelected = navItems.some((item) => item.component === location.pathname.split("/")[2])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <>
      <aside
        className="flex flex-col h-screen w-16 md:w-64 transition-all duration-300"
        style={{
          backgroundColor: theme.colors.Tertiary || '#5f5f5f',
          color: theme.colors.Secondary || '#e4e4e4',
        }}
      >
        <div
          className="p-4 border-b flex items-center justify-center md:justify-start"
          style={{ borderColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.colors.Primary || '#fc5000' }}
          >
            <FlaskRound
              className="w-4 h-4"
              style={{ color: theme.colors.Secondary || '#e4e4e4' }}
            />
          </div>
          <h1
            className="ml-3 text-xl font-bold hidden md:block"
            style={{ color: theme.colors.Secondary || '#e4e4e4' }}
          >
            CHEMIQ
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = isSectionSelected
                ? item.component === location.pathname.split("/")[2]
                : item.component === ""

              return (
                <Link
                  to={item.component && `./${item.component}`}
                  key={item.name}
                  className={`flex items-center justify-center md:justify-start w-full p-2 rounded-lg transition-all duration-200 ${
                    isActive ? "font-medium" : ""
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? theme.colors.Primary || '#fc5000'
                      : "transparent",
                    color: isActive
                      ? theme.colors.Secondary || '#e4e4e4'
                      : theme.colors.Secondary || '#e4e4e4',
                  }}
                  onMouseEnter={(e) =>
                    !isActive &&
                    (e.currentTarget.style.backgroundColor = `${theme.colors.Secondary || '#e4e4e4'}1a`)
                  }
                  onMouseLeave={(e) =>
                    !isActive && (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{
                      color: isActive
                        ? theme.colors.Secondary || '#e4e4e4'
                        : theme.colors.Secondary || '#e4e4e4',
                    }}
                  />
                  <span className="ml-3 hidden md:block">{item.name}</span>
                </Link>
              )
            })}
          </ul>
        </nav>

        <div
          className="p-4 border-t"
          style={{ borderColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center justify-center md:justify-start w-full p-2 rounded-lg transition-colors"
              style={{ color: theme.colors.Secondary || '#e4e4e4' }}
            >
              <div
                className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${theme.colors.Primary || '#fc5000'}33` }}
              >
                {user.img ? (
                  <img
                    src={user.img || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    className="w-4 h-4"
                    style={{ color: theme.colors.Secondary || '#e4e4e4' }}
                  />
                )}
              </div>
              <span className="ml-3 hidden md:block truncate">{user.nombre}</span>
              <ChevronDown size={16} className="ml-auto hidden md:block"/>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56"
              style={{
                backgroundColor: theme.colors.Background || '#fff8f0',
                borderColor: `${theme.colors.Primary || '#fc5000'}33`,
                color: theme.colors.Accent || '#505050',
              }}
              align="end"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                style={{ color: theme.colors.Accent || '#505050' }}
                onClick={() => setIsModalOpen(true)}
              >
                <User className="mr-2 h-4 w-4"/>
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
              />
              <DropdownMenuItem
                className="cursor-pointer"
                style={{ color: theme.colors.Primary || '#fc5000' }}
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4"/>
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}b3` }}
        >
          <div
            className="w-full max-w-2xl rounded-xl shadow-lg p-6 m-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: theme.colors.Background || '#fff8f0',
              color: theme.colors.Accent || '#505050',
              borderColor: theme.colors.Primary || '#fc5000',
              boxShadow: `0 4px 6px -1px ${theme.colors.Primary || '#fc5000'}1a`,
            }}
          >
            <div
              className="flex justify-between items-center mb-6 border-b pb-4"
              style={{ borderColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
            >
              <h2
                className="text-2xl font-bold"
                style={{ color: theme.colors.Primary || '#fc5000' }}
              >
                Editar Perfil
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  color: theme.colors.Accent || '#505050',
                  backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}0d`,
                }}
              >
                ✕
              </button>
            </div>

            <MyProfileForm
              theme={theme}
              setIsModalOpen={setIsModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}