"use client"

import { useState, useEffect } from "react"
import { Beaker, Users, Home, Settings, ChevronLeft, ChevronRight, Search } from "lucide-react"

const sideNavItems = [
  { icon: Home, label: "Inicio", href: "#" },
  { icon: Users, label: "Usuarios", href: "#" },
  { icon: Beaker, label: "Experimentos", href: "#" },
  { icon: Settings, label: "Configuración", href: "#" },
]

const initialUsers = [
  { id: 1, name: "María García", email: "maria@example.com", role: "Estudiante" },
  { id: 2, name: "Carlos Rodríguez", email: "carlos@example.com", role: "Profesor" },
  { id: 3, name: "Ana Martínez", email: "ana@example.com", role: "Investigador" },
  { id: 4, name: "Juan López", email: "juan@example.com", role: "Estudiante" },
  { id: 5, name: "Laura Sánchez", email: "laura@example.com", role: "Profesor" },
  { id: 6, name: "Pedro Gómez", email: "pedro@example.com", role: "Estudiante" },
  { id: 7, name: "Sofía Ruiz", email: "sofia@example.com", role: "Investigador" },
  { id: 8, name: "Diego Fernández", email: "diego@example.com", role: "Profesor" },
  { id: 9, name: "Lucía Torres", email: "lucia@example.com", role: "Estudiante" },
  { id: 10, name: "Javier Moreno", email: "javier@example.com", role: "Investigador" },
  { id: 11, name: "Carmen Ortiz", email: "carmen@example.com", role: "Profesor" },
  { id: 12, name: "Andrés Navarro", email: "andres@example.com", role: "Estudiante" },
]

function JuntaPage() {
  const [activeNavItem, setActiveNavItem] = useState("Usuarios")
  const [users, setUsers] = useState(initialUsers)
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const usersPerPage = 10

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "" || user.role === roleFilter),
  )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, []) //Corrected useEffect dependency array

  const handleEdit = (id, field, value) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, [field]: value } : user)))
  }

  const handleSave = (id) => {
    setEditingId(null)
    // Aquí podrías implementar la lógica para guardar en el backend
    console.log("Guardando cambios para el usuario con ID:", id)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* SideNav */}
      <nav className="w-64 bg-tertiary py-8 px-4">
        <h1 className="text-xl font-light mb-8 px-4 text-gray-700"><img src="./src/assets/img/ChemiqTextLogo.png" className="w-full h-[50px]" /></h1>
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
            <option value="Estudiante">Estudiante</option>
            <option value="Profesor">Profesor</option>
            <option value="Investigador">Investigador</option>
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
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="py-4 pr-4">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => handleEdit(user.id, "name", e.target.value)}
                        className="border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="py-4 pr-4 text-gray-500">
                    {editingId === user.id ? (
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => handleEdit(user.id, "email", e.target.value)}
                        className="border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-4">
                    {editingId === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleEdit(user.id, "role", e.target.value)}
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
                    {editingId === user.id ? (
                      <button onClick={() => handleSave(user.id)} className="text-blue-600 hover:text-blue-800">
                        Guardar
                      </button>
                    ) : (
                      <button onClick={() => setEditingId(user.id)} className="text-gray-600 hover:text-gray-800">
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
  )
}

export default JuntaPage

