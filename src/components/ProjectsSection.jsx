import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectsRequest } from "@/actions/projects";
import { getMembersByProjectIdRequest } from "@/actions/members";

export const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState("proyectos");
  const [projects, setProjects] = useState([]);
  const [myProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProjects = async () => {
      const [error, projects] = await getProjectsRequest();
      if (error) {
        console.error("Error fetching project:", error);
        return;
      }
      setProjects(projects);
      setLoading(false); // Set loading to false after fetching
    };

    void fetchProjects();
  }, []);

  const handleReadMore = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDetails = () => {
    setSelectedProject(null);
  };

  const displayedProjects = activeTab === "proyectos" ? projects : myProjects;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      {/* Tabs */}
      <p className="text-gray-600 mb-8">
        Mantente informado sobre los proyectos de la Asociación de Química
      </p>
      <div className="flex border-b">
        <button
          className={`px-6 py-3 font-semibold text-lg ${
            activeTab === "proyectos"
              ? "border-b-2 border-black"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("proyectos")}
        >
          Proyectos
        </button>
        {myProjects.length > 0 && (
          <button
            className={`px-6 py-3 font-semibold text-lg ${
              activeTab === "misProyectos"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("misProyectos")}
          >
            Mis Proyectos
          </button>
        )}
      </div>

      {/* Lista de proyectos */}
      {!selectedProject ? (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            : displayedProjects.map((proyecto) => (
                <ProjectCard
                  key={proyecto.id}
                  proyecto={proyecto}
                  onReadMore={() => handleReadMore(proyecto)}
                />
              ))}
        </div>
      ) : (
        <div className="mt-6">
          <button
            onClick={handleCloseDetails}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Volver
          </button>
          {loading ? (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse p-6">
              <div className="w-full h-64 bg-gray-300 rounded-t-2xl mb-4"></div>
              <div className="p-6 space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
              <img
                src={selectedProject.proyecto_img || "/placeholder.svg"}
                alt={selectedProject.proyecto_nombre}
                className="w-full object-cover rounded-t-2xl mb-4"
                style={{ aspectRatio: "16/9" }}
              />
              <div className="m-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-bold mb-4">
                    {selectedProject.proyecto_nombre}
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4 text-justify">
                    {selectedProject.informacion}
                  </p>
                </div>
                <MembersSection projectId={selectedProject.id} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function MembersSection({ projectId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function fetchMembers() {
      const [error, members] = await getMembersByProjectIdRequest({
        id: projectId,
      });

      if (error) {
        console.error("Error fetching members:", error);
        return;
      }

      setMembers(members);
      setLoading(false); // Set loading to false after fetching
    }

    void fetchMembers();
  }, [projectId]);

  if (loading) {
    // Skeleton for MembersSection
    return (
      <div className="ml-8 animate-pulse">
        <h3 className="h-6 bg-gray-300 rounded w-1/4 mb-4"></h3>
        <ul className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="ml-8">
      <h3 className="text-2xl font-bold mb-2 text-[#1d896e]">Integrantes</h3>
      <ul className="list-disc list-inside">
        {members.map(({ user: member }) => (
          <li
            key={member.carne}
            className="text-gray-700 text-lg flex items-center space-x-4"
          >
            <img
              src={member?.img || "/placeholder.svg"}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>
              {member.name} ({member.carne})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}