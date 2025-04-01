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
import {
  getNewsRequest,
  createNewsRequest,
  updateNewsRequest,
  deleteNewsRequest,
} from "../actions/news";
import {
  getMembersByProjectIdRequest,
  addMembersToProjectRequest,
  deleteMemberRequest,
} from "../actions/members";
import Swal from "sweetalert2";

const sideNavItems = [
  { icon: Home, label: "Inicio", href: "#" },
  { icon: Users, label: "Usuarios", href: "#" },
  { icon: Beaker, label: "Proyectos", href: "#" },
  { icon: Podcast, label: "Podcast", href: "#" },
  { icon: Podcast, label: "News", href: "#" },
  { icon: Settings, label: "Configuración", href: "#" },
];

function JuntaPage() {
  const [activeNavItem, setActiveNavItem] = useState("Usuarios");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [podcast, setPodcast] = useState([]);
  const [news, setNews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProjectData, setEditingProjectData] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [assignedSearchTerm, setAssignedSearchTerm] = useState("");
  const [availableSearchTerm, setAvailableSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Fetch data
  const fetchUsers = async () => {
    const [error, users] = await getUsers();
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    setUsers(users);
  };

  const fetchProjects = async () => {
    const [error, projects] = await getProjectsRequest();
    if (error) {
      console.error("Error fetching projects:", error);
      return;
    }
    setProjects(projects);
  };

  const fetchPodcast = async () => {
    const [error, podcast] = await getPodcast();
    if (error) {
      console.error("Error fetching podcasts:", error);
      return;
    }
    setPodcast(podcast);
  };

  const fetchNews = async () => {
    const [error, news] = await getNewsRequest();
    if (error) {
      console.error("Error fetching news:", error);
      return;
    }
    setNews(news);
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
    fetchUsers();
    fetchProjects();
    fetchPodcast();
    fetchNews();
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

  const filteredNews = news.filter((item) =>
    item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignedUsers = projectMembers
    .map((member) => {
      if (!member.user) {
        console.error("Member missing user data:", member);
        return null;
      }
      return {
        memberId: member.id,
        carne: member.user.carne,
        name: member.user.nombre || member.user.name,
        email: member.user.correo || member.user.email,
        img: member.user.img,
        rol: member.user.rol,
      };
    })
    .filter(Boolean);

  const availableUsers = users.filter(
    (user) => !projectMembers.some((member) => member.user?.carne === user.carne)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const currentPodcast = filteredPodcast.slice(indexOfFirstItem, indexOfLastItem);
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(
    activeNavItem === "Usuarios"
      ? filteredUsers.length
      : activeNavItem === "Proyectos"
      ? filteredProjects.length
      : activeNavItem === "Podcast"
      ? filteredPodcast.length
      : filteredNews.length / itemsPerPage
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
    const updatedData = { nombre: podcastToUpdate.nombre, link: podcastToUpdate.link };
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

  // News handlers
  const handleSaveNews = async (id) => {
    const newsToUpdate = news.find((item) => item.id === id);
    if (!newsToUpdate) return;
    const updatedData = {
      titulo: selectedNews.titulo,
      contenido: selectedNews.contenido,
      img: selectedNews.img,
      tipo: selectedNews.tipo,
    };
    const [error, updatedNews] = await updateNewsRequest({ id, news: updatedData });
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar la noticia." });
      return;
    }
    setNews((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedNews } : item)));
    setEditingId(null);
    setSelectedNews(null);
    void Swal.fire({ icon: "success", title: "Éxito", text: "Noticia actualizada correctamente." });
  };

  const handleDeleteNews = async (id) => {
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
    const [error] = await deleteNewsRequest({ id });
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar la noticia." });
      return;
    }
    setNews((prev) => prev.filter((item) => item.id !== id));
    setSelectedNews(null);
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Noticia eliminada con éxito." });
  };

  const handleCreateNews = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Noticia",
      html:
        '<input id="titulo" class="swal2-input" placeholder="Título">' +
        '<textarea id="contenido" class="swal2-input" placeholder="Contenido"></textarea>' +
        '<input id="img" class="swal2-input" placeholder="URL de la imagen">' +
        '<input id="tipo" class="swal2-input" placeholder="Tipo">',
      focusConfirm: false,
      preConfirm: () => ({
        titulo: document.getElementById("titulo").value,
        contenido: document.getElementById("contenido").value,
        img: document.getElementById("img").value,
        tipo: document.getElementById("tipo").value,
      }),
    });
    if (formValues) {
      const [error, newNews] = await createNewsRequest(formValues);
      if (error) {
        void Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear la noticia." });
        return;
      }
      setNews((prev) => [...prev, newNews]);
      void Swal.fire({ icon: "success", title: "Éxito", text: "Noticia creada correctamente." });
    }
  };

  // Assign/Unassign handlers
  const handleAssignUser = async (projectId, userId) => {
    const [error, newMemberArray] = await addMembersToProjectRequest({ user_id: userId, project_id: projectId });
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo asignar el usuario." });
      return;
    }
    const newMember = Array.isArray(newMemberArray) ? newMemberArray[0] : newMemberArray;
    if (!newMember.id) {
      console.error("New member ID not defined:", newMember);
      return;
    }
    const assignedUser = users.find((user) => user.carne === userId);
    if (!assignedUser) {
      console.error("User not found with ID:", userId);
      return;
    }
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
          {activeNavItem === "News" && (
            <button
              onClick={handleCreateNews}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Crear Noticia
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

        {/* News Section */}
        {activeNavItem === "News" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNews.length > 0 ? (
                currentNews.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedNews(item)}
                  >
                    <img
                      src={item.img}
                      alt={item.titulo}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                    <h3 className="text-lg font-medium">{item.titulo}</h3>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay noticias disponibles.</p>
              )}
            </div>
            {selectedNews && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="text-gray-500 hover:text-gray-800 float-right"
                  >
                    ✕
                  </button>
                  <img
                    src={selectedNews.img}
                    alt={selectedNews.titulo}
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                  {editingId === selectedNews.id ? (
                    <>
                      <input
                        type="text"
                        value={selectedNews.titulo}
                        onChange={(e) =>
                          setSelectedNews({ ...selectedNews, titulo: e.target.value })
                        }
                        className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                      />
                      <textarea
                        value={selectedNews.contenido}
                        onChange={(e) =>
                          setSelectedNews({ ...selectedNews, contenido: e.target.value })
                        }
                        className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                      />
                      <input
                        type="text"
                        value={selectedNews.img}
                        onChange={(e) =>
                          setSelectedNews({ ...selectedNews, img: e.target.value })
                        }
                        className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                      />
                      <input
                        type="text"
                        value={selectedNews.tipo}
                        onChange={(e) =>
                          setSelectedNews({ ...selectedNews, tipo: e.target.value })
                        }
                        className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleSaveNews(selectedNews.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-medium mb-2">{selectedNews.titulo}</h3>
                      <p className="text-gray-600 mb-4">{selectedNews.contenido}</p>
                      <p className="text-gray-500 italic">Tipo: {selectedNews.tipo}</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingId(selectedNews.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteNews(selectedNews.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
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