import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { getProjectsRequest } from "@/actions/projects";
import { getColors } from "@/actions/personalization";

export function FeaturedProject({ onOpenModal }) {
  const [project, setProject] = useState(null);
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  });

  const fetchColors = async () => {
    const [error, colors] = await getColors();
    if (error) {
      console.error("Error fetching colors:", error);
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
  };

  useEffect(() => {
    fetchColors();
    const fetchProject = async () => {
      const [error, projects] = await getProjectsRequest();
      if (!error && projects?.length) {
        setProject(projects[projects.length - 1]);
      }
    };
    fetchProject();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!project) {
    return (
      <Card
        className="h-96 animate-pulse"
        style={{
          background: `linear-gradient(to bottom right, ${theme.colors.Background || '#fff8f0'}, ${theme.colors.Tertiary || '#5f5f5f'})`
        }}
      />
    );
  }

  const handleClick = () => {
    console.log("Abriendo modal para proyecto:", project);
    onOpenModal(project);
  };

  return (
    <Card
      className="group h-full overflow-hidden hover:shadow-[0_4px_12px_rgba(95,95,95,0.2)] transition-all duration-300 cursor-pointer"
      style={{
        backgroundColor: theme.colors.Background || '#fff8f0',
        borderColor: `${theme.colors.Tertiary || '#5f5f5f'}20`
      }}
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.img || "/placeholder.svg"}
          alt={project.proyecto_nombre}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${theme.colors.Tertiary || '#5f5f5f'}99, transparent)` }}
        />
        <h3
          className="absolute bottom-4 left-4 text-xl font-semibold"
          style={{ color: theme.colors.Secondary || '#e4e4e4' }}
        >
          {project.proyecto_nombre}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div
          className="flex items-center gap-4 text-sm"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
        >
          <span className="flex items-center">
            <Calendar
              className="h-4 w-4 mr-1"
              style={{ color: theme.colors.Primary || '#fc5000' }}
            />
            {formatDate(project.created_at)}
          </span>
          {project.count_members && (
            <span className="flex items-center">
              <Users
                className="h-4 w-4 mr-1"
                style={{ color: theme.colors.Primary || '#fc5000' }}
              />
              {project.count_members}
            </span>
          )}
        </div>
        <p
          className="line-clamp-3"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
        >
          {project.informacion}
        </p>
        <span
          className="inline-block px-4 py-1 rounded-full text-sm font-medium transition-colors"
          style={{
            backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}1a`,
            color: theme.colors.Primary || '#fc5000'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.Primary || '#fc5000';
            e.currentTarget.style.color = theme.colors.Secondary || '#e4e4e4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.colors.Secondary || '#e4e4e4'}1a`;
            e.currentTarget.style.color = theme.colors.Primary || '#fc5000';
          }}
        >
          Ver detalles
        </span>
      </div>
    </Card>
  );
}