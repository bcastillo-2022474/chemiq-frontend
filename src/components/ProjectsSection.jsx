import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectsRequest } from "@/actions/projects";
import { getMembersByProjectIdRequest } from "@/actions/members";

export const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState("proyectos");
  const [projects, setProjects] = useState([]);
  const [myProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const [error, projects] = await getProjectsRequest();
      if (!error) {
        setProjects(projects);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const displayedProjects = activeTab === "proyectos" ? projects : myProjects;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0B2F33] mb-4">
          Proyectos de la Asociación
        </h2>
        <div className="flex gap-4 border-b">
          <button
            className={`pb-3 px-4 font-medium ${
              activeTab === "proyectos"
                ? "border-b-2 border-[#28BC98] text-[#28BC98]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("proyectos")}
          >
            Todos los Proyectos
          </button>
          {myProjects.length > 0 && (
            <button
              className={`pb-3 px-4 font-medium ${
                activeTab === "misProyectos"
                  ? "border-b-2 border-[#28BC98] text-[#28BC98]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("misProyectos")}
            >
              Mis Proyectos
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-64 bg-gray-100 rounded-xl animate-pulse"
              />
            ))
          : displayedProjects.map((proyecto) => (
              <ProjectCard
                key={proyecto.id}
                proyecto={proyecto}
                onClick={() => setSelectedProject(proyecto)}
              />
            ))}
      </div>

      {/* Modal personalizado sin Dialog */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>

            {/* Contenido del modal */}
            <h2 className="text-2xl font-bold text-[#0B2F33] mb-4">
              {selectedProject.nombre}
            </h2>
            <div className="space-y-6">
              <img
                src={selectedProject.img || "/placeholder.svg"}
                alt={selectedProject.nombre}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProject.informacion}
                  </p>
                </div>
                <MembersSection projectId={selectedProject.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function MembersSection({ projectId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const [error, members] = await getMembersByProjectIdRequest({ id: projectId });
      if (!error) {
        setMembers(members);
        setLoading(false);
      }
    };
    fetchMembers();
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#28BC98]">Integrantes</h3>
      <div className="space-y-3">
        {members.map(({ user: member }) => (
          <div key={member.carne} className="flex items-center gap-3">
            <img
              src={member?.img || "/placeholder.svg"}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#28BC98]/20"
            />
            <span className="text-gray-700">
              {member.name} <span className="text-gray-500">({member.carne})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}