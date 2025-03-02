import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Beaker, Users, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export function FeaturedProject() {
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get('https://backend-postgresql.vercel.app/api/proyects');
        const projects = response.data;
        const mostRecentProject = projects[projects.length - 1]; // Obtener el proyecto más reciente
        setProject(mostRecentProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, []);

  if (!project) {
    return null; // O un indicador de carga
  }

  return (
    <Link to={`/proyectos/${project.id}`}>
      <Card className="bg-surface text-text hover:shadow-2xl transition-all duration-300 transform hover:scale-102 cursor-pointer overflow-hidden group">
        <div className="flex h-64">
          <div className="w-1/2 relative">
            <img
              src={project.proyecto_img || "/placeholder.svg"}
              alt={project.proyecto_nombre}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent" />
          </div>
          <CardContent className="w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Beaker className="h-6 w-6 mr-2 text-accent" />
                <h3 className="text-2xl font-bold text-accent">
                  {project.proyecto_nombre}
                </h3>
              </div>
              <p className="text-text-muted mb-4">
                {project.informacion.length > 100
                  ? `${project.informacion.substring(0, 100)}...`
                  : project.informacion}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="flex flex-col items-center p-2 bg-background rounded-lg">
                  <Target className="h-4 w-4 text-primary mb-1" />
                  <span className="text-xs font-medium text-text-muted">
                    Reducir plásticos
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg">
                  <Users className="h-4 w-4 text-secondary mb-1" />
                  <span className="text-xs font-medium text-text-muted">
                    {project.integrantes.length} miembros
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-background rounded-lg">
                  <Zap className="h-4 w-4 text-accent mb-1" />
                  <span className="text-xs font-medium text-text-muted">
                    75% completado
                  </span>
                </div>
              </div>
              <div className="bg-background flex items-center bg-accent text-background px-3 py-1 rounded-full group-hover:bg-accent transition-colors duration-300">
                <span className="text-sm font-medium">Unirse al proyecto</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}