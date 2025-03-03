import { Link } from "react-router-dom";
import { Home, Podcast, Newspaper, Beaker, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Inicio", component: "home", icon: Home },
  { name: "Podcast", component: "podcast", icon: Podcast },
  { name: "Noticias", component: "news", icon: Newspaper },
  { name: "Proyectos", component: "project", icon: Beaker },
];

export function Sidebar({ onSelect }) {
  const [userData, setUserData] = useState({ nombre: "Usuario", img: "/placeholder.svg" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData({
          nombre: decoded.nombre || "Usuario",
          img: "/src/assets/img/ChemiqLogo.png",
        });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <aside className="flex flex-col h-screen w-1/4 bg-background drop-shadow-lg rounded-r-tl-lg rounded-r-bl-lg text-text pl-8 pr-8" 
           style={{ boxShadow: '0 5px 9px rgba(40, 188, 152, 0.5), 0 2px 4px rgba(116, 116, 116, 0.7)' }}>
      <div className="p-5 flex items-center space-x-2">
        <img src="/src/assets/img/ChemiqLogo.png" className="w-1/4" alt="Logo Nav" />
        <h1 className="text-2xl font-bold text-primary text-[#0B2F33]">CHEMIQ</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-5 p-5">
          {navItems.map((item) => (
            <li key={item.name}>
              <button onClick={() => onSelect(item.component)} className="flex items-center space-x-6 p-3 rounded-lg hover:bg-background hover:text-[#28bc98] transition-all duration-300 group">
                <item.icon className="h-8 w-8 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xl">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-5 border-t border-background space-y-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex pl-2 items-center w-full p-2 hover:bg-[#28BC98] rounded-md transition-colors group">
            <img src={userData.img} 
                 alt="Avatar"
                 className="w-8 h-8 rounded-full mr-2 bg-[#28BC98] object-cover" />
            <span className="flex-1 text-left ml-4 text-black group-hover:text-white transition-colors">
              {userData.nombre}
            </span>
            <ChevronDown size={16} className="text-[#28BC98] group-hover:text-white transition-colors mr-4" />
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
          </DropdownMenuContent>
        </DropdownMenu>
        
        <button className="text-white flex pl-2 items-center w-full p-2 bg-[#d1081c] hover:bg-[#a1020a] rounded-md transition-colors group " onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
