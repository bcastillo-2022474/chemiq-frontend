import { useState } from "react";
import { Beaker, Users, Home, Settings, LogOut, Podcast, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UsersSection from "@/components/junta/UsersSection";
import ProjectsSection from "@/components/junta/ProjectSection";
import PodcastSection from "@/components/junta/PodcastSection";
import NewsSection from "@/components/junta/NewsSection";

const sideNavItems = [
  { icon: Users, label: "Usuarios", href: "#" },
  { icon: Beaker, label: "Proyectos", href: "#" },
  { icon: Podcast, label: "Podcast", href: "#" },
  { icon: Podcast, label: "News", href: "#" },
  { icon: Settings, label: "Configuración", href: "#" },
];

function JuntaPage() {
  const [activeNavItem, setActiveNavItem] = useState("Usuarios");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
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
    <div className="h-screen flex bg-white">
      {/* Burger Button for Mobile */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-tertiary py-8 px-4 z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:col-span-3`}
      >
        <h1 className="text-xl font-light mb-8 px-4 text-gray-700">
          <img src="https://i.ibb.co/WpHRPRWS/Imagen-de-Whats-App-2025-04-02-a-las-20-45-15-1a4bcc2f-removebg-preview.png" className="w-full h-[50px]" />
        </h1>
        {sideNavItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center p-4 mb-2 rounded-lg transition-colors duration-200 ${
              activeNavItem === item.label ? "bg-subase text-accent" : "text-gray-600 hover:bg-base"
            }`}
            onClick={() => {
              setActiveNavItem(item.label);
              setIsSidebarOpen(false); // Close sidebar on item click
            }}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="mt-5 w-full flex items-center gap-3 bg-red-500 p-3 rounded-lg text-gray-300 hover:text-white transition-colors"
        >
          <LogOut className="h-2 w-2" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 md:ml-0">{renderSection()}</main>
    </div>
  );
}

export default JuntaPage;