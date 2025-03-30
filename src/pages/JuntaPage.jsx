import { useState, useEffect } from "react";
import {
  Beaker,
  Users,
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  LogOut,
  Podcast,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers, updateUserRequest, deleteUserRequest } from "@/actions/users";
import {
  getProjectsRequest,
  updateProjectRequest,
  deleteProjectRequest,
  createProjectRequest,
} from "@/actions/projects";
import {
  getPodcast,
  updatePodcastRequest,
  deletePodcastRequest,
  createPodcastRequest,
} from "../actions/podcast";
import { getMembersByProjectIdRequest, addMembersToProjectRequest, deleteMemberRequest } from "../actions/members";
import Swal from "sweetalert2";
import { api } from "@/lib/http";

const sideNavItems = [
  { icon: Home, label: "Inicio", href: "#" },
  { icon: Users, label: "Usuarios", href: "#" },
  { icon: Beaker, label: "Proyectos", href: "#" },
  { icon: Podcast, label: "Podcast", href: "#" },
  { icon: Settings, label: "Configuración", href: "#" },
];

function JuntaPage() {
  const [activeNavItem, setActiveNavItem] = useState("Usuarios");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [podcast, setPodcast] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProjectData, setEditingProjectData] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [assignedSearchTerm, setAssignedSearchTerm] = useState(""); // Search for assigned users
  const [availableSearchTerm, setAvailableSearchTerm] = useState(""); // Search for available users
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Fetch users
  const fetchUsers = async () => {
    const [error, users] = await getUsers();
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    setUsers(users);
  };

  // Fetch projects
  const fetchProjects = async () => {
    const [error, projects] = await getProjectsRequest();
    if (error) {
      console.error("Error fetching projects:", error);
      return;
    }
    setProjects(projects);
  };

  // Fetch podcasts
  const fetchPodcast = async () => {
    const [error, podcast] = await getPodcast();
    if (error) {
      console.error("Error fetching podcasts:", error);
      return;
    }
    setPodcast(podcast);
  };

  // Fetch project members
  const fetchProjectMembers = async (projectId) => {
    const [error, members] = await getMembersByProjectIdRequest({ id: projectId });
    if (error) {
      console.error("Error fetching project members:", error);
      return;
    }
    setProjectMembers(members);
    console.log("Project members:", members);
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchPodcast();
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

  // Filter logic
  const filteredUsers = users.filter(
    (user) =>
      (user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      user.rol === "User"
  );

  const filteredProjects = projects.filter((project) =>
    project.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPodcast = podcast.filter((pod) =>
    pod.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mapeo de usuarios asignados
  const assignedUsers = projectMembers
    .map((member) => {
      if (!member.user) {
        console.error("El miembro no tiene datos de usuario:", member);
        return null;
      }
      return {
        memberId: member.id, // Incluimos el ID del miembro
        carne: member.user.carne,
        name: member.user.nombre || member.user.name, // Normalizamos el nombre
        email: member.user.correo || member.user.email, // Normalizamos el correo
        img: member.user.img,
        rol: member.user.rol,
      };
    })
    .filter(Boolean); // Filtra valores nulos o indefinidos

  // Filtro de usuarios disponibles
  const availableUsers = users.filter(
    (user) => !projectMembers.some((member) => member.user?.carne === user.carne)
  );
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const currentPodcast = filteredPodcast.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(
    activeNavItem === "Usuarios"
      ? filteredUsers.length
      : activeNavItem === "Proyectos"
      ? filteredProjects.length
      : filteredPodcast.length / itemsPerPage
  );

  // User handlers
  const handleEditUser = (id, field, value) => {
    setUsers(users.map((user) => (user.carne === id ? { ...user, [field]: value } : user)));
  };

  const handleSaveUser = async (carne) => {
    const userToUpdate = users.find((user) => user.carne === carne);
    if (!userToUpdate) return;

    const [error, updatedUser] = await updateUserRequest({ id: carne, user: userToUpdate });
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el usuario." });
      return;
    }
    setUsers((prev) => prev.map((user) => (user.carne === carne ? { ...user, ...updatedUser } : user)));
    setEditingId(null);
    void Swal.fire({ icon: "success", title: "Éxito", text: "Usuario actualizado correctamente." });
  };

  const handleDeleteUser = async (carne) => {
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

    const [error] = await deleteUserRequest({ id: carne });
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el usuario." });
      return;
    }
    setUsers((prev) => prev.filter((user) => user.carne !== carne));
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Usuario eliminado con éxito." });
  };

  // Project handlers
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
      console.log(formValues);
      const [error, newProject] = await createProjectRequest(formValues);
      if (error) {
        void Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el proyecto." });
        return;
      }
      setProjects((prev) => [...prev, newProject]);
      void Swal.fire({ icon: "success", title: "Éxito", text: "Proyecto creado correctamente." });
    }
  };

  // Podcast handlers
  const handleEditPodcast = (id, field, value) => {
    setPodcast(podcast.map((pod) => (pod.id === id ? { ...pod, [field]: value } : pod)));
  };

  const handleSavePodcast = async (id) => {
    const podcastToUpdate = podcast.find((pod) => pod.id === id);
    if (!podcastToUpdate) return;

    const updatedData = {
      nombre: podcastToUpdate.nombre,
      link: podcastToUpdate.link,
    };

    const [error, updatedPodcast] = await updatePodcastRequest({ id, podcast: updatedData });
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el podcast." });
      return;
    }
    setPodcast((prev) => prev.map((pod) => (pod.id === id ? { ...pod, ...updatedPodcast } : pod)));
    setEditingId(null);
    void Swal.fire({ icon: "success", title: "Éxito", text: "Podcast actualizado correctamente." });
  };

  const handleDeletePodcast = async (id) => {
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

    const [error] = await deletePodcastRequest({ id });
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el podcast." });
      return;
    }
    setPodcast((prev) => prev.filter((pod) => pod.id !== id));
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Podcast eliminado con éxito." });
  };

  const handleCreatePodcast = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Podcast",
      html:
        '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
        '<input id="link" class="swal2-input" placeholder="Link">',
      focusConfirm: false,
      preConfirm: () => ({
        nombre: document.getElementById("nombre").value,
        link: document.getElementById("link").value,
      }),
    });

    if (formValues) {
      const [error, newPodcast] = await createPodcastRequest(formValues);
      if (error) {
        void Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el podcast." });
        return;
      }
      setPodcast((prev) => [...prev, newPodcast]);
      void Swal.fire({ icon: "success", title: "Éxito", text: "Podcast creado correctamente." });
    }
  };

  // Assign handler
    const handleAssignUser = async (projectId, userId) => {
      const [error, newMemberArray] = await addMembersToProjectRequest({ user_id: userId, project_id: projectId });
      if (error) {
        await Swal.fire({ icon: "error", title: "Error", text: "No se pudo asignar el usuario." });
        return;
      }
    
      // Asegúrate de que la respuesta sea un array y toma el primer elemento
      const newMember = Array.isArray(newMemberArray) ? newMemberArray[0] : newMemberArray;
    
    
      // Verificar si newMember.id está presente
      if (!newMember.id) {
        console.error("El ID del nuevo miembro no está definido:", newMember);
        return;
      }
    
      // Buscar el usuario correspondiente en la lista de usuarios
      const assignedUser = users.find((user) => user.carne === userId);
      if (!assignedUser) {
        console.error("No se encontró el usuario con el ID:", userId);
        return;
      }
    
      // Combinar los datos del miembro con los datos del usuario
      const memberWithUser = {
        ...newMember,
        memberId: newMember.id, // Guardar el ID del miembro
        user: {
          carne: assignedUser.carne,
          nombre: assignedUser.nombre, // Normalizamos el nombre
          correo: assignedUser.correo, // Normalizamos el correo
          img: assignedUser.img,
          rol: assignedUser.rol,
        },
      };
    
      // Actualizar los miembros del proyecto
      setProjectMembers((prev) => [...prev, memberWithUser]);
    
    
      // Incrementar el contador de miembros en el proyecto
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, count_members: p.count_members + 1 } : p))
      );
    
      await Swal.fire({ icon: "success", title: "Éxito", text: "Usuario asignado correctamente." });
    };

  // Unassign handler
  const handleUnassignUser = async (memberId, projectId) => {
    const [error] = await deleteMemberRequest({ id: memberId }); // Enviar el ID del miembro
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo desasignar el usuario." });
      return;
    }
    setProjectMembers((prev) => prev.filter((m) => m.id !== memberId)); // Filtrar por el ID del miembro
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, count_members: p.count_members - 1 } : p))
    );
    await Swal.fire({ icon: "success", title: "Éxito", text: "Usuario desasignado correctamente." });
  };

  return (
    <div className="flex h-screen bg-white">
      {/* SideNav */}
      <nav className="w-64 bg-tertiary py-8 px-4">
        <h1 className="text-xl font-light mb-8 px-4 text-gray-700">
          <img src="./src/assets/img/ChemiqTextLogo.png" className="w-full h-[50px]" />
        </h1>
        {sideNavItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center p-4 mb-2 rounded-lg transition-colors duration-200 ${
              activeNavItem === item.label ? "bg-subase text-accent" : "text-gray-600 hover:bg-base"
            }`}
            onClick={() => setActiveNavItem(item.label)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="mt-5 w-full flex items-center gap-3 bg-red-500 p-3 rounded-lg text-gray-300 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-[50px] font-light mb-8 text-accent">{activeNavItem}</h2>

        {/* Search and Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder={`Buscar ${activeNavItem.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {activeNavItem === "Proyectos" && (
            <button
              onClick={handleCreateProject}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Crear Proyecto
            </button>
          )}
          {activeNavItem === "Podcast" && (
            <button
              onClick={handleCreatePodcast}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Crear Podcast
            </button>
          )}
        </div>

        {/* Users Table */}
        {activeNavItem === "Usuarios" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 font-normal text-gray-400">Nombre</th>
                  <th className="pb-3 font-normal text-gray-400">Email</th>
                  <th className="pb-3 font-normal text-gray-400">Rol</th>
                  <th className="pb-3 font-normal text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.carne} className="border-b last:border-b-0">
                    <td className="py-4 pr-4">
                      {editingId === user.carne ? (
                        <input
                          type="text"
                          value={user.nombre}
                          onChange={(e) => handleEditUser(user.carne, "nombre", e.target.value)}
                          className="border-b border-gray-300 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        user.nombre
                      )}
                    </td>
                    <td className="py-4 pr-4 text-gray-500">
                      {editingId === user.carne ? (
                        <input
                          type="email"
                          value={user.correo}
                          onChange={(e) => handleEditUser(user.carne, "correo", e.target.value)}
                          className="border-b border-gray-300 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        user.correo
                      )}
                    </td>
                    <td className="py-4">{user.rol}</td>
                    <td className="py-4">
                      {editingId === user.carne ? (
                        <>
                          <button
                            onClick={() => handleSaveUser(user.carne)}
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
                            onClick={() => setEditingId(user.carne)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.carne)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Projects Cards */}
        {activeNavItem === "Proyectos" && !selectedProject && (
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
        )}

        {/* Project Detail View */}
        {activeNavItem === "Proyectos" && selectedProject && (
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

            {/* User Assignment Section */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              {/* Assigned Users */}
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
                <div className="max-h-40 overflow-y-auto border rounded-lg p-4">
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
                          onClick={() => handleUnassignUser(user.memberId, selectedProject.id)} // Enviar el ID del miembro
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

              {/* Available Users */}
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
                <div className="max-h-40 overflow-y-auto border rounded-lg p-4">
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

        {/* Podcast Table */}
        {activeNavItem === "Podcast" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 font-normal text-gray-400">ID</th>
                  <th className="pb-3 font-normal text-gray-400">Nombre</th>
                  <th className="pb-3 font-normal text-gray-400">Link</th>
                  <th className="pb-3 font-normal text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPodcast.map((pod) => (
                  <tr key={pod.id} className="border-b last:border-b-0">
                    <td className="py-4 pr-4">{pod.id}</td>
                    <td className="py-4 pr-4">
                      {editingId === pod.id ? (
                        <input
                          type="text"
                          value={pod.nombre}
                          onChange={(e) => handleEditPodcast(pod.id, "nombre", e.target.value)}
                          className="border-b border-gray-300 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        pod.nombre
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      {editingId === pod.id ? (
                        <input
                          type="text"
                          value={pod.link}
                          onChange={(e) => handleEditPodcast(pod.id, "link", e.target.value)}
                          className="border-b border-gray-300 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <a
                          href={pod.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {pod.link}
                        </a>
                      )}
                    </td>
                    <td className="py-4">
                      {editingId === pod.id ? (
                        <>
                          <button
                            onClick={() => handleSavePodcast(pod.id)}
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
                            onClick={() => setEditingId(pod.id)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletePodcast(pod.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
      </main>
    </div>
  );
}

export default JuntaPage;