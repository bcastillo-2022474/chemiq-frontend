import { useState, useEffect } from "react";
import { Beaker, Users, Home, Settings, ChevronLeft, ChevronRight, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "@/actions/users";

const sideNavItems = [
  { icon: Home, label: "Inicio", href: "#" },
  { icon: Users, label: "Usuarios", href: "#" },
  { icon: Beaker, label: "Proyectos", href: "#" },
  { icon: Settings, label: "Configuración", href: "#" },
];

function JuntaPage() {
  const [activeNavItem, setActiveNavItem] = useState("Usuarios");
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
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

  // Llamada a la API para obtener usuarios cuando se monta el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic for users
  const filteredUsers = users.filter(
    (user) =>
      (user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      user.rol === "User"
  );

  // Filter logic for projects
  const filteredProjects = projects.filter((project) =>
    project.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    activeNavItem === "Usuarios" ? filteredUsers.length : filteredProjects.length / itemsPerPage
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
  const handleEditProject = (id, field, value) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)));
  };

  const handleSaveProject = async (id) => {
    const projectToUpdate = projects.find((project) => project.id === id);
    if (!projectToUpdate) return;

    const [error, updatedProject] = await updateProjectRequest({ id, project: projectToUpdate });
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el proyecto." });
      return;
    }
    setProjects((prev) =>
      prev.map((project) => (project.id === id ? { ...project, ...updatedProject } : project))
    );
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
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Proyecto eliminado con éxito." });
  };

  const handleCreateProject = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Proyecto",
      html:
        '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
        '<input id="youtube" class="swal2-input" placeholder="URL de YouTube">' +
        '<input id="informacion" class="swal2-input" placeholder="Información">' +
        '<input id="img" class="swal2-input" placeholder="URL de la imagen">',
      focusConfirm: false,
      preConfirm: () => ({
        nombre: document.getElementById("nombre").value,
        youtube: document.getElementById("youtube").value,
        informacion: document.getElementById("informacion").value,
        img: document.getElementById("img").value,
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

  // Placeholder for assigning/unassigning users to projects
  const handleAssignUser = (projectId, userId) => {
    // Implement API call to assign user to project
    console.log(`Assigning user ${userId} to project ${projectId}`);
  };

  const handleUnassignUser = (projectId, userId) => {
    // Implement API call to unassign user from project
    console.log(`Unassigning user ${userId} from project ${projectId}`);
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
                <img src={project.img} alt={project.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-lg font-medium">{project.nombre}</h3>
              </div>
            ))}
          </div>
        )}

        {/* Project Detail View */}
        {activeNavItem === "Proyectos" && selectedProject && (
          <div className="border rounded-lg p-6">
            <button onClick={() => setSelectedProject(null)} className="mb-4 text-blue-600 hover:text-blue-800">
              Volver
            </button>
            <div className="flex space-x-6">
              <img src={selectedProject.img} alt={selectedProject.nombre} className="w-48 h-48 object-cover rounded-md" />
              <div className="flex-1">
                {editingId === selectedProject.id ? (
                  <>
                    <input
                      type="text"
                      value={selectedProject.nombre}
                      onChange={(e) => handleEditProject(selectedProject.id, "nombre", e.target.value)}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                    />
                    <input
                      type="text"
                      value={selectedProject.youtube}
                      onChange={(e) => handleEditProject(selectedProject.id, "youtube", e.target.value)}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                    />
                    <input
                      type="text"
                      value={selectedProject.informacion}
                      onChange={(e) => handleEditProject(selectedProject.id, "informacion", e.target.value)}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                    />
                    <input
                      type="text"
                      value={selectedProject.img}
                      onChange={(e) => handleEditProject(selectedProject.id, "img", e.target.value)}
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
                      <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-800">
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
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Asignar/Desasignar Usuarios</h4>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-4">
                {users.map((user) => (
                  <div key={user.carne} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span>{user.nombre} ({user.correo})</span>
                    <div>
                      <button
                        onClick={() => handleAssignUser(selectedProject.id, user.carne)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        Asignar
                      </button>
                      <button
                        onClick={() => handleUnassignUser(selectedProject.id, user.carne)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Desasignar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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