import { Link } from "react-router-dom";
import { Home, Podcast, Newspaper, Beaker, User, ChevronDown, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const navItems = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Podcast", href: "/podcast", icon: Podcast },
  { name: "Noticias", href: "/noticias", icon: Newspaper },
  { name: "Proyectos", href: "/proyectos", icon: Beaker },
];

export function Sidebar() {
  return (
<aside className="flex flex-col h-screen w-64 bg-background  drop-shadow-lg rounded-r-tl-lg rounded-r-bl-lg text-text" style={{ boxShadow: '0 5px 9px rgba(40, 188, 152, 0.5), 0 2px 4px rgba(40, 188, 152, 0.7)' }}>
      <div className="p-5 flex items-center space-x-2">
        <img src="/src/assets/img/ChemiqLogo.png" className="w-1/4" alt="Logo Nav" />
        <h1 className="text-2xl font-bold text-primary text-[#0B2F33]">CHEMIQ</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-5">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="flex items-center space-x-6 p-3 rounded-lg hover:bg-background hover:text-[#28bc98] transition-all duration-300 group"
              >
                <item.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-5 border-t border-background">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex pl-2 items-center w-full p-2 hover:bg-[#28BC98] rounded-md transition-colors group">
            <img
              src="/placeholder.svg?height=32&width=32"
              alt="Avatar"
              className="w-8 h-8 rounded-full mr-2 bg-[#28BC98]"
            />
            <span className="flex-1 text-left ml-4 text-black group-hover:text-white transition-colors">
              Juan Pérez
            </span>
            <ChevronDown
              size={16}
              className="text-[#28BC98] group-hover:text-white transition-colors mr-4"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-background text-black shadow-lg" align="end" side="right">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}