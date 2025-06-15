import { useEffect, useState } from "react";
import { Beaker, Users, Home, Brush, Settings, LogOut, Podcast, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UsersSection from "@/components/junta/UsersSection";
import ProjectsSection from "@/components/junta/ProjectSection";
import PodcastSection from "@/components/junta/PodcastSection";
import NewsSection from "@/components/junta/NewsSection";
import Config from "@/components/junta/Config";
import Personalization from "@/components/junta/Personalization";
import { getColors } from "../actions/personalization";
import DashboardPage from "./DashboardStatsControll";

const sideNavItems = [
  { icon: Home, label: "Estadisticas", href: "#" },
  { icon: Users, label: "Usuarios", href: "#" },
  { icon: Beaker, label: "Proyectos", href: "#" },
  { icon: Podcast, label: "Podcast", href: "#" },
  { icon: Podcast, label: "News", href: "#" },
  { icon: Settings, label: "Configuración", href: "#" },
  { icon: Brush, label: "Personalization", href: "#" },
];

function JuntaPage() {
  const [activeNavItem, setActiveNavItem] = useState("Estadisticas");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState({
    colors: {}, // Default empty colors
    images: {},
  });

  const fetchColors = async () => {
    setLoading(true);
    const [error, colors] = await getColors();
    if (error) {
      console.error("Error fetching colors:", error);
      setLoading(false);
      return;
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    );
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }));
    console.log("Fetched colors:", formattedColors);
    setLoading(false);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderSection = () => {
    switch (activeNavItem) {
      case "Estadisticas":
        return <DashboardPage />;
      case "Usuarios":
        return <UsersSection />;
      case "Proyectos":
        return <ProjectsSection />;
      case "Podcast":
        return <PodcastSection />;
      case "News":
        return <NewsSection />;
      case "Configuración":
        return <Config />;
      case "Personalization":
        return <Personalization />;
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
        <Menu className="h-6 w-6" style={{ color: theme.colors.Primary || "#4B5563" }} />
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full py-8 px-4 z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:col-span-3`}
        style={{ backgroundColor: theme.colors.Tertiary || "#F3F4F6" }} // Fallback color
      >
        <h1 className="text-xl font-light mb-8 px-4" style={{ color: theme.colors.Primary || "#4B5563" }}>
          <img
            src="https://i.ibb.co/WpHRPRWS/Imagen-de-Whats-App-2025-04-02-a-las-20-45-15-1a4bcc2f-removebg-preview.png"
            className="w-full h-[50px]"
            alt="Logo"
          />
        </h1>
        {sideNavItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center p-4 mb-2 rounded-lg transition-colors duration-200 ${
              activeNavItem === item.label
                ? "text-white"
                : `text-[${theme.colors.Secondary || "#6B7280"}] hover:text-[${theme.colors.Primary || "#4B5563"}]`
            }`}
            style={{
              backgroundColor:
                activeNavItem === item.label
                  ? theme.colors.Primary || "#3B82F6" // Active background
                  : "transparent",
              ...(activeNavItem !== item.label && {
                ":hover": {
                  backgroundColor: theme.colors.Secondary || "#E5E7EB", // Hover background
                },
              }),
            }}
            onClick={() => {
              setActiveNavItem(item.label);
              setIsSidebarOpen(false);
            }}
          >
            <item.icon
              className="h-5 w-5 mr-3"
              style={{
                color:
                  activeNavItem === item.label
                    ? "#FFFFFF" // White icon for active state
                    : theme.colors.Secondary || "#6B7280", // Secondary color for inactive
              }}
            />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="mt-5 w-full flex items-center gap-3 p-3 rounded-lg transition-colors"
          style={{
            backgroundColor: theme.colors.Error || "#EF4444", // Error color for logout
            color: "#FFFFFF",
          }}
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