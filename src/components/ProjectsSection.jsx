import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectsRequest } from "@/actions/projects";
import { getMembersByProjectIdRequest } from "@/actions/members";
import { getMyProjects } from "../actions/getMyProjects";
import { updateMyProject, deleteMyProject } from "@/actions/getMyProjects";

export const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState("proyectos");
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("general"); 

  useEffect(() => {
    const fetchProjects = async () => {
      const [error, projects] = await getProjectsRequest();
      if (!error) {
        setProjects(projects);
      }
      setLoading(false);
    };

    const fetchMyProjects = async () => {
      const [error, response] = await getMyProjects();
      if (!error) {
        setMyProjects(response.proyectos);
      }
    };

    fetchProjects();
    fetchMyProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este proyecto?")) {
      const [error] = await deleteMyProject(id);
      if (!error) {
        alert("Proyecto eliminado correctamente.");
        const [error, response] = await getMyProjects();
        if (!error) {
          setMyProjects(response.proyectos);
        }
      } else {
        alert("Error al eliminar proyecto.");
      }
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    const [error] = await updateMyProject({
      id: editingProject.id,
      nombre: editingProject.nombre,
      informacion: editingProject.informacion,
      youtube: editingProject.youtube,
      img: editingProject.img,
    });

    if (!error) {
      alert("Proyecto actualizado correctamente.");
      setEditingProject(null);
      const [error, response] = await getMyProjects();
      if (!error) {
        setMyProjects(response.proyectos);
      }
    } else {
      alert("Error al actualizar proyecto.");
    }
  };

  const displayedProjects = activeTab === "proyectos" ? projects : myProjects;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0B2F33] mb-4">
          Proyectos de la Asociación
        </h2>
        <div className="flex gap-4 border-b">
          <button
            className={`pb-3 px-4 font-medium ${activeTab === "proyectos" ? "border-b-2 border-[#28BC98] text-[#28BC98]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("proyectos")}
          >
            Todos los Proyectos
          </button>
          <button
            className={`pb-3 px-4 font-medium ${activeTab === "misProyectos" ? "border-b-2 border-[#28BC98] text-[#28BC98]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("misProyectos")}
          >
            Mis Proyectos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ))
          : displayedProjects.length > 0 ? (
              displayedProjects.map((proyecto) => (
                <div key={proyecto.id} className="relative">
                  <ProjectCard
                    proyecto={proyecto}
                    onClick={() => setSelectedProject(proyecto)}
                  />
                  {activeTab === "misProyectos" && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => setEditingProject({ ...proyecto })}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full text-xs"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proyecto.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-20">
                No hay proyectos disponibles.
              </div>
            )}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>

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

      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setEditingProject(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Editar Proyecto</h2>
            <div className="space-y-4">
          
              <div className="flex gap-4 border-b">
                <button
                  className={`pb-3 px-4 font-medium ${currentTab === "general" ? "border-b-2 border-[#28BC98] text-[#28BC98]" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setCurrentTab("general")}
                >
                  Datos Generales
                </button>
                <button
                  className={`pb-3 px-4 font-medium ${currentTab === "members" ? "border-b-2 border-[#28BC98] text-[#28BC98]" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setCurrentTab("members")}
                >
                  Miembros
                </button>
              </div>

        
              {currentTab === "general" && (
                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      value={editingProject.nombre}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          nombre: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>
                  {/* Información */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Información</label>
                    <textarea
                      value={editingProject.informacion}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          informacion: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded mt-1"
                      rows="4"
                    />
                  </div>
                  {/* YouTube */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Enlace YouTube</label>
                    <input
                      type="url"
                      value={editingProject.youtube}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          youtube: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>
          
                  <div>
                    <label className="text-sm font-medium text-gray-700">URL de la Imagen</label>
                    <input
                      type="url"
                      value={editingProject.img}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          img: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded mt-1"
                    />
                    {editingProject.img && (
                      <div className="mt-2">
                        <h4 className="text-sm text-gray-500">Vista previa:</h4>
                        <img
                          src={editingProject.img}
                          alt="Vista previa"
                          className="mt-2 w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleUpdateProject}
                    className="bg-[#28BC98] hover:bg-[#239E83] text-white py-2 px-4 rounded w-full"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}

              {/* Pestaña de Miembros */}
              {currentTab === "members" && <MembersSection projectId={editingProject.id} />}
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
