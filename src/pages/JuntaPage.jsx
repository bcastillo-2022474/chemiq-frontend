import { useState } from "react";
import { Beaker, Users, Home, Settings, LogOut, Podcast } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UsersSection from "@/components/junta/UsersSection";
import ProjectsSection from "@/components/junta/ProjectSection";
import PodcastSection from "@/components/junta/PodcastSection";
import NewsSection from "@/components/junta/NewsSection";

const sideNavItems = [
  { icon: Home, label: "Inicio", href: "#" },
  { icon: Users, label: "Usuarios", href: "#" },
  { icon: Beaker, label: "Proyectos", href: "#" },
  { icon: Podcast, label: "Podcast", href: "#" },
  { icon: Podcast, label: "News", href: "#" },
  { icon: Settings, label: "Configuración", href: "#" },
];

function JuntaPage() {
  const [activeNavItem, setActiveNavItem] = useState("Usuarios");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderSection = () => {
    switch (activeNavItem) {
      case "Usuarios":
        return <UsersSection />;
      case "Proyectos":
        return <ProjectsSection />;
      case "Podcast":
        return <PodcastSection />;
      case "News":
        return <NewsSection />;
      default:
        return <div>Selecciona una sección</div>;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <nav className="w-64 bg-tertiary py-8 px-4">
        <h1 className="text-xl font-light mb-8 px-4 text-gray-700">
          <img src="./src/assets/img/ChemiqTextLogo.png" className="w-full h-[50px]" />
        </h1>
        {sideNavItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center p-4 mb-2 rounded-lg transition-colors duration-200 ${
              activeNavItem === item.label ? "bg-subase text-accent" : "text-gray-600 hover:bg-base"
            }`}
            onClick={() => setActiveNavItem(item.label)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="mt-5 w-full flex items-center gap-3 bg-red-500 p-3 rounded-lg text-gray-300 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
      <main className="flex-1">{renderSection()}</main>
    </div>
  );
}

export default JuntaPage;