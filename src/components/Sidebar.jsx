import { Link, useLocation } from "react-router-dom"
import {
  Home,
  Podcast,
  Newspaper,
  Beaker,
  User,
  ChevronDown,
  LogOut,
  Settings,
  FlaskRound
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth.jsx";

const navItems = [
  { name: "Inicio", component: "", icon: Home },
  { name: "Podcast", component: "podcast", icon: Podcast },
  { name: "Noticias", component: "news", icon: Newspaper },
  { name: "Proyectos", component: "project", icon: Beaker }
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isSectionSelected = navItems.some(item => item.component === location.pathname.split("/")[2])

  return (
    <aside className="flex flex-col h-screen w-16 md:w-64 bg-[#0B2F33] text-[#FFF8F0] transition-all duration-300">
      <div className="p-4 border-b border-[#FFF8F0]/10 flex items-center justify-center md:justify-start">
        <div className="w-8 h-8 rounded-full bg-[#28BC98] flex items-center justify-center">
          <FlaskRound className="w-4 h-4 text-[#0B2F33]" />
        </div>
        <h1 className="ml-3 text-xl font-bold text-[#FFF8F0] hidden md:block">
          CHEMIQ
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map(item => {
            const isActive = isSectionSelected ? item.component === location.pathname.split("/")[2] : item.component === ""

            return (
              <Link
                to={item.component && `./${item.component}`}
                key={item.name}
                className={`flex items-center justify-center md:justify-start w-full p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#28BC98] text-[#0B2F33]"
                    : "hover:bg-[#28BC98]/10"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "" : "text-[#FFF8F0]"}`}
                />
                <span className="ml-3 font-medium hidden md:block">
                  {item.name}
                </span>
              </Link>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#FFF8F0]/10">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center md:justify-start w-full p-2 rounded-lg hover:bg-[#28BC98]/10 transition-colors">
            <div className="relative w-8 h-8 rounded-full bg-[#28BC98]/20 flex items-center justify-center overflow-hidden">
              {user.img ? (
                <img
                  src={user.img || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-[#FFF8F0]" />
              )}
            </div>
            <span className="ml-3 hidden md:block truncate">
              {user.nombre}
            </span>
            <ChevronDown size={16} className="ml-auto hidden md:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 bg-[#0B2F33] border border-[#28BC98]/20 text-[#FFF8F0]"
            align="end"
          >
            <DropdownMenuItem className="hover:bg-[#28BC98]/10 focus:bg-[#28BC98]/10 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#28BC98]/10 focus:bg-[#28BC98]/10 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#FFF8F0]/10" />
            <DropdownMenuItem
              className="text-[#7DE2A6] hover:bg-[#28BC98]/10 focus:bg-[#28BC98]/10 cursor-pointer"
              onClick={logout}
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