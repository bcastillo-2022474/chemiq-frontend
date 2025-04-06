import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { getProjectsRequest } from "@/actions/projects";

export function FeaturedProject({ onOpenModal }) {
  const [project, setProject] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchProject = async () => {
      const [error, projects] = await getProjectsRequest();
      if (!error && projects?.length) {
        setProject(projects[projects.length - 1]);
      }
    };
    fetchProject();
  }, []);

  if (!project) {
    return <Card className="h-96 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />;
  }

  const handleClick = () => {
    console.log("Abriendo modal para proyecto:", project); // Depuración
    onOpenModal(project);
  };

  return (
    <Card
      className="group h-full overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-none cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.img || "/placeholder.svg"}
          alt={project.proyecto_nombre}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
          {project.proyecto_nombre}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-[#28BC98]" />
            {formatDate(project.created_at)}
          </span>
          {project.count_members && (
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-[#28BC98]" />
              {project.count_members}
            </span>
          )}
        </div>
        <p className="text-gray-700 line-clamp-3">{project.informacion}</p>
        <span className="inline-block px-4 py-1 bg-[#28BC98]/10 text-[#28BC98] rounded-full text-sm font-medium group-hover:bg-[#28BC98] group-hover:text-white transition-colors">
          Ver detalles
        </span>
      </div>
    </Card>
  );
}