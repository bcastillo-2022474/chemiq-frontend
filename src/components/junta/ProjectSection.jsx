import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  getProjectsRequest,
  updateProjectRequest,
  deleteProjectRequest,
  createProjectRequest,
} from "@/actions/projects";
import {
  getMembersByProjectIdRequest,
  addMembersToProjectRequest,
  deleteMemberRequest,
} from "@/actions/members";
import { getUsers } from "@/actions/users"; // Asegúrate de importar la función para obtener usuarios
import Swal from "sweetalert2";

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]); // Nuevo estado para almacenar todos los usuarios
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProjectData, setEditingProjectData] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedSearchTerm, setAssignedSearchTerm] = useState("");
  const [availableSearchTerm, setAvailableSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchProjects = async () => {
    const [error, projects] = await getProjectsRequest();
    if (error) {
      console.error("Error fetching projects:", error);
      return;
    }
    setProjects(projects);
  };

  const fetchUsers = async () => {
    const [error, users] = await getUsers();
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    setUsers(users); // Guarda la lista completa de usuarios
  };

  const fetchProjectMembers = async (projectId) => {
    const [error, members] = await getMembersByProjectIdRequest({ id: projectId });
    if (error) {
      console.error("Error fetching project members:", error);
      return;
    }
    setProjectMembers(members);
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers(); // Llama a fetchUsers al montar el componente
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectMembers(selectedProject.id);
      setEditingProjectData(selectedProject);
    } else {
      setProjectMembers([]);
      setEditingProjectData(null);
    }
  }, [selectedProject]);

  const filteredProjects = projects.filter((project) =>
    project.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignedUsers = projectMembers
    .map((member) => {
      if (!member.user) return null;
      return {
        memberId: member.id,
        carne: member.user.carne,
        name: member.user.nombre || member.user.name,
        email: member.user.correo || member.user.email,
        img: member.user.img,
        rol: member.user.rol,
      };
    })
    .filter(Boolean)
    .filter((user) =>
      user.name.toLowerCase().includes(assignedSearchTerm.toLowerCase())
    );

  const availableUsers = users
    .filter(
      (user) => !projectMembers.some((member) => member.user?.carne === user.carne)
    )
    .filter((user) =>
      user.nombre.toLowerCase().includes(availableSearchTerm.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleEditProject = (field, value) => {
    setEditingProjectData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProject = async (id) => {
    const [error, updatedProject] = await updateProjectRequest({ id, project: editingProjectData });
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el proyecto." });
      return;
    }
    setProjects((prev) =>
      prev.map((project) => (project.id === id ? { ...project, ...updatedProject } : project))
    );
    setSelectedProject(updatedProject);
    setEditingId(null);
    void Swal.fire({ icon: "success", title: "Éxito", text: "Proyecto actualizado correctamente." });
  };

  const handleDeleteProject = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;
    const [error] = await deleteProjectRequest({ id });
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el proyecto." });
      return;
    }
    setProjects((prev) => prev.filter((project) => project.id !== id));
    setSelectedProject(null);
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Proyecto eliminado con éxito." });
  };

  const handleCreateProject = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Proyecto",
      html:
        '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
        '<input id="youtube" class="swal2-input" placeholder="URL de YouTube">' +
        '<textarea id="informacion" class="swal2-textarea" placeholder="Información" rows="4"></textarea>' +
        '<input id="img" class="swal2-input" placeholder="URL de la imagen">' +
        '<input id="dueno_id" class="swal2-input" placeholder="Carné de encargado">',
      focusConfirm: false,
      preConfirm: () => ({
        nombre: document.getElementById("nombre").value,
        youtube: document.getElementById("youtube").value,
        informacion: document.getElementById("informacion").value,
        img: document.getElementById("img").value,
        dueno_id: document.getElementById("dueno_id").value,
      }),
    });
    if (formValues) {
      const [error, newProject] = await createProjectRequest(formValues);
      if (error) {
        void Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el proyecto." });
        return;
      }
      setProjects((prev) => [...prev, newProject]);
      void Swal.fire({ icon: "success", title: "Éxito", text: "Proyecto creado correctamente." });
    }
  };

  const handleAssignUser = async (projectId, userId) => {
    const [error, newMemberArray] = await addMembersToProjectRequest({ user_id: userId, project_id: projectId });
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo asignar el usuario." });
      return;
    }
    const newMember = Array.isArray(newMemberArray) ? newMemberArray[0] : newMemberArray;
    if (!newMember.id) return;
    const assignedUser = users.find((user) => user.carne === userId);
    if (!assignedUser) return;
    const memberWithUser = {
      ...newMember,
      memberId: newMember.id,
      user: {
        carne: assignedUser.carne,
        nombre: assignedUser.nombre,
        correo: assignedUser.correo,
        img: assignedUser.img,
        rol: assignedUser.rol,
      },
    };
    setProjectMembers((prev) => [...prev, memberWithUser]);
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, count_members: p.count_members + 1 } : p))
    );
    await Swal.fire({ icon: "success", title: "Éxito", text: "Usuario asignado correctamente." });
  };

  const handleUnassignUser = async (memberId, projectId) => {
    const [error] = await deleteMemberRequest({ id: memberId });
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo desasignar el usuario." });
      return;
    }
    setProjectMembers((prev) => prev.filter((m) => m.id !== memberId));
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, count_members: p.count_members - 1 } : p))
    );
    await Swal.fire({ icon: "success", title: "Éxito", text: "Usuario desasignado correctamente." });
  };

  return (
    <div className="p-8 overflow-auto">
      <h2 className="text-[50px] font-light mb-8 text-accent">Proyectos</h2>
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleCreateProject}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Crear Proyecto
        </button>
      </div>
      {!selectedProject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.img}
                alt={project.nombre}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-medium">{project.nombre}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <button
            onClick={() => setSelectedProject(null)}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            Volver
          </button>
          <div className="flex space-x-6">
            <img
              src={editingProjectData?.img || selectedProject.img}
              alt={editingProjectData?.nombre || selectedProject.nombre}
              className="w-48 h-48 object-cover rounded-md"
            />
            <div className="flex-1">
              {editingId === selectedProject.id ? (
                <>
                  <input
                    type="text"
                    value={editingProjectData.nombre}
                    onChange={(e) => handleEditProject("nombre", e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                  />
                  <input
                    type="text"
                    value={editingProjectData.youtube}
                    onChange={(e) => handleEditProject("youtube", e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                  />
                  <textarea
                    value={editingProjectData.informacion}
                    onChange={(e) => handleEditProject("informacion", e.target.value)}
                    className="border rounded-md p-2 focus:border-blue-500 outline-none mb-4 w-full h-24"
                  />
                  <input
                    type="text"
                    value={editingProjectData.img}
                    onChange={(e) => handleEditProject("img", e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-medium mb-2">{selectedProject.nombre}</h3>
                  <p className="text-gray-600 mb-2">
                    <a href={selectedProject.youtube} target="_blank" className="text-blue-600">
                      YouTube
                    </a>
                  </p>
                  <p className="text-gray-600 mb-2">{selectedProject.informacion}</p>
                  <p className="text-gray-600">Miembros: {selectedProject.count_members}</p>
                </>
              )}
              <div className="mt-4">
                {editingId === selectedProject.id ? (
                  <>
                    <button
                      onClick={() => handleSaveProject(selectedProject.id)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingId(selectedProject.id)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProject(selectedProject.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Usuarios Asignados</h4>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Buscar asignados..."
                  value={assignedSearchTerm}
                  onChange={(e) => setAssignedSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                {assignedUsers.length > 0 ? (
                  assignedUsers.map((user) => (
                    <div
                      key={user.carne}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <span>
                        {user.name} ({user.email})
                      </span>
                      <button
                        onClick={() => handleUnassignUser(user.memberId, selectedProject.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Desasignar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No hay usuarios asignados.</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-2">Usuarios Disponibles</h4>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Buscar disponibles..."
                  value={availableSearchTerm}
                  onChange={(e) => setAvailableSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4 ">
                {availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <div
                      key={user.carne}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <span>
                        {user.nombre} ({user.correo})
                      </span>
                      <button
                        onClick={() => handleAssignUser(selectedProject.id, user.carne)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Asignar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No hay usuarios disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {!selectedProject && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectsSection;