import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getColors } from "@/actions/personalization";

export function ProjectList({ onProjectClick, onAddProject, projects }) {
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
  }, []);

  return (
    <div className="w-full lg:w-1/3 rounded-xl shadow-lg overflow-hidden flex flex-col relative" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
      <h2 className="text-2xl font-semibold p-6" style={{ backgroundColor: theme.colors.Accent || '#505050', color: theme.colors.Secondary || '#e4e4e4' }}>
        Projects
      </h2>
      <button
        onClick={onAddProject}
        className="absolute top-4 right-4 p-2 rounded-full shadow-md transition-colors duration-200"
        aria-label="Add new project"
        style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
        onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
      >
        <Plus className="w-6 h-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }} />
      </button>
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin" style={{ scrollbarColor: `${theme.colors.Tertiary || '#5f5f5f'} ${theme.colors.Background || '#fff8f0'}` }}>
        <ul className="divide-y" style={{ borderColor: theme.colors.Tertiary || '#5f5f5f' }}>
          {projects.map(project => (
            <li
              key={project.id}
              className="flex items-center p-6 cursor-pointer transition duration-150 ease-in-out"
              onClick={() => onProjectClick(project)}
              style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
              onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
            >
              <img
                src={project.img || "/placeholder.svg"}
                alt={project.nombre}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {project.nombre}
                </h3>
                <p className="text-sm mt-1 line-clamp-2" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {project.informacion}
                </p>
                <p className="text-xs mt-1" style={{ color: theme.colors.Primary || '#fc5000' }}>
                  Click to view details
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}