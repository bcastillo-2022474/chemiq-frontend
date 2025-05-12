import { useState, useEffect } from "react";
import { getColors } from "@/actions/personalization";

export function RecentProjects({ projects }) {
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
    <div className="rounded-2xl p-5 shadow-lg" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
      <h2 className="text-base font-semibold mb-4" style={{ color: theme.colors.Accent || '#505050' }}>
        Recent Projects
      </h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between rounded-xl px-5 py-3 shadow-sm"
            style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full text-xs font-semibold flex items-center justify-center" style={{ backgroundColor: '#f5e8df', color: theme.colors.Tertiary || '#5f5f5f' }}>
                {project.code}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {project.name}
                </p>
                <p className="text-xs" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  ${project.budget.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}