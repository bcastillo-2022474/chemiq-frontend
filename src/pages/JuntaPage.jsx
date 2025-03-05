"use client";

import { useState, useEffect } from "react";
import { Beaker, Users, Home, Settings, ChevronLeft, ChevronRight, Search, LogOut } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/lib/constants.js";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const usersPerPage = 10;
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.clear();
    navigate("/login")
  };
  // Función para obtener usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`); // Asegúrate de que la URL apunte a tu servidor backend
      const data = response.data;

      // Mapea los usuarios para agregar la propiedad 'role' con base en 'rol_id'
      const mappedUsers = data.map((user) => {
        let role = "";
        switch (user.rol_id) {
          case 1:
            role = "Administrator";
            break;
          case 2:
            role = "Junta Directiva";
            break;
          case 3:
            role = "Usuario";
            break;
          default:
            role = "Desconocido";
        }

        return {
          ...user,
          role,
        };
      });

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  // Llamada a la API para obtener usuarios cuando se monta el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "" || user.role === roleFilter),
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleEdit = (id, field, value) => {
    setUsers(users.map((user) => (user.carne === id ? { ...user, [field]: value } : user)));
  };

  const handleSave = (id) => {
    setEditingId(null);
    console.log("Guardando cambios para el usuario con ID:", id);
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
            className={`w-full flex items-center p-4 mb-2 rounded-lg transition-colors duration-200 ${activeNavItem === item.label ? "bg-subase text-accent" : "text-gray-600 hover:bg-base"}`}
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
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los roles</option>
            <option value="Administrador">Administrador</option>
            <option value="Junta Directiva">Profesor</option>
            <option value="Usuario">Usuario</option>
          </select>
        </div>

        {/* Users Table */}
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
                        onChange={(e) => handleEdit(user.carne, "nombre", e.target.value)}
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
                        onChange={(e) => handleEdit(user.carne, "correo", e.target.value)}
                        className="border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      user.correo
                    )}
                  </td>
                  <td className="py-4">
                    {editingId === user.carne ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleEdit(user.carne, "role", e.target.value)}
                        className="border-b border-gray-300 focus:border-blue-500 outline-none"
                      >
                        <option value="Estudiante">Estudiante</option>
                        <option value="Profesor">Profesor</option>
                        <option value="Investigador">Investigador</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="py-4">
                    {editingId === user.carne ? (
                      <button onClick={() => handleSave(user.carne)} className="text-blue-600 hover:text-blue-800">
                        Guardar
                      </button>
                    ) : (
                      <button onClick={() => setEditingId(user.carne)} className="text-gray-600 hover:text-gray-800">
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
