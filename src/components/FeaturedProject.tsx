import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Beaker, Users, Target } from 'lucide-react';
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/lib/constants.js";
import type { Project } from "@/types/dto";

export function FeaturedProject() {
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/proyects`);
        const projects = response.data as Project[];
        const mostRecentProject = projects[projects.length - 1];
        setProject(mostRecentProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    void fetchProject();
  }, []);

  if (!project) {
    return <Card className="h-64 animate-pulse bg-[#7DE2A6]/10" />;
  }

  return (
    <Link to={`/proyectos/${project.id}`}>
      <Card className="h-64 overflow-hidden bg-white hover:shadow-md transition-all duration-300">
        <div className="flex h-full">
          <div className="w-1/3 relative">
            <img
              src={project.proyecto_img || "/placeholder.svg"}
              alt={project.proyecto_nombre}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0" />
          </div>
          <CardContent className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Beaker className="h-5 w-5 mr-2 text-[#28BC98]" />
                <h3 className="text-xl font-semibold text-[#0B2F33] truncate">
                  {project.proyecto_nombre}
                </h3>
              </div>
              <p className="text-sm text-[#0B2F33]/70 line-clamp-2">
                {project.informacion}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-[#28BC98] mr-1" />
                  <span className="text-xs text-[#0B2F33]/70">
                    {project.count_members} miembros
                  </span>
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-[#28BC98] mr-1" />
                  <span className="text-xs text-[#0B2F33]/70">
                    En progreso
                  </span>
                </div>
              </div>
              <div className="bg-[#28BC98] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#7DE2A6] transition-colors duration-300">
                Ver proyecto
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
