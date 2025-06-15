"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, Edit3, Trash2, User, Mail, Shield } from "lucide-react"
import { getUsers, updateUserRequest, deleteUserRequest } from "@/actions/users"
import Swal from "sweetalert2"

function UsersSection() {
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 12

  const fetchUsers = async () => {
    setLoading(true)
    const [error, users] = await getUsers()
    if (error) {
      console.error("Error fetching users:", error)
      setLoading(false)
      return
    }
    setUsers(users)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      (user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.rol.toLowerCase().includes(searchTerm.toLowerCase())) &&
      user.rol === "User",
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handleEditUser = (id, field, value) => {
    setUsers(users.map((user) => (user.carne === id ? { ...user, [field]: value } : user)))
  }

  const handleSaveUser = async (carne) => {
    const userToUpdate = users.find((user) => user.carne === carne)
    if (!userToUpdate) return
    const [error, updatedUser] = await updateUserRequest({ id: carne, user: userToUpdate })
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el usuario." })
      return
    }
    setUsers((prev) => prev.map((user) => (user.carne === carne ? { ...user, ...updatedUser } : user)))
    setEditingId(null)
    void Swal.fire({ icon: "success", title: "Éxito", text: "Usuario actualizado correctamente." })
  }

  const handleDeleteUser = async (carne) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (!confirm.isConfirmed) return
    const [error] = await deleteUserRequest({ id: carne })
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el usuario." })
      return
    }
    setUsers((prev) => prev.filter((user) => user.carne !== carne))
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Usuario eliminado con éxito." })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios registrados en el sistema</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <div
                  key={user.carne}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={user.img || "/placeholder.svg?height=64&width=64"}
                      alt={user.nombre}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      {editingId === user.carne ? (
                        <input
                          type="text"
                          value={user.nombre}
                          onChange={(e) => handleEditUser(user.carne, "nombre", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                        />
                      ) : (
                        <h3 className="font-semibold text-gray-900 truncate">{user.nombre}</h3>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{user.rol}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {editingId === user.carne ? (
                        <input
                          type="email"
                          value={user.correo}
                          onChange={(e) => handleEditUser(user.carne, "correo", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-600 truncate">{user.correo}</span>
                      )}
                    </div>

                    {editingId === user.carne && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={user.img || ""}
                          onChange={(e) => handleEditUser(user.carne, "img", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="URL de la imagen"
                        />
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {editingId === user.carne ? (
                        <>
                          <button
                            onClick={() => handleSaveUser(user.carne)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(user.carne)}
                            className="flex items-center justify-center gap-1 flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Edit3 className="h-3 w-3" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.carne)}
                            className="flex items-center justify-center gap-1 flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay usuarios disponibles</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersSection
