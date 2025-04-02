"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { getUsers, updateUserRequest, deleteUserRequest } from "@/actions/users"
import Swal from "sweetalert2"

function UsersSection() {
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
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
    <div className="p-8 overflow-auto">
      <h2 className="text-[50px] font-light mb-8 text-accent">Usuarios</h2>
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
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <UsersTableSkeleton />
        ) : (
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
                        <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-800">
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
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

function UsersTableSkeleton() {
  return (
    <div className="animate-pulse">
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
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="py-4 pr-4">
                <div className="h-4 bg-gray-200 rounded w-32 md:w-40"></div>
              </td>
              <td className="py-4 pr-4">
                <div className="h-4 bg-gray-200 rounded w-40 md:w-56"></div>
              </td>
              <td className="py-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="py-4">
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersSection

