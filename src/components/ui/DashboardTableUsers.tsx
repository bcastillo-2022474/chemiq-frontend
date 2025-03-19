import { useState, useEffect } from "react"
import type { User } from "@/types/dto";

interface Props {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (carne: string) => void
}

export function UserTable({ users, onEdit, onDelete }: Props) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
  const [filterText, setFilterText] = useState("")
  const [filterRole, setFilterRole] = useState("")

<<<<<<< HEAD:src/components/ui/DashboardTableUsers.tsx
  const roleMapping = users.reduce((map, user) => {
    map[user.rol_id] = user.rol
    return map
  }, {})


  // Obtener roles únicos de los usuarios
=======
  // Get unique roles from users
>>>>>>> parent of 3577632 (alpha version):src/components/ui/DashboardTableUsers.jsx
  const roles = [...new Set(users.map((user) => user.rol_id))]

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        (user.carne.toLowerCase().includes(filterText.toLowerCase()) ||
          user.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
          user.correo.toLowerCase().includes(filterText.toLowerCase())) &&
        (filterRole === "" || user.rol_id === filterRole),
    )
    setFilteredUsers(filtered)
  }, [users, filterText, filterRole])

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-6 text-gray-800">Users</h1>

      {/* Filtering controls */}
      <div className="flex mb-4 gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Filter by Carne, Name, or Email"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-48">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="py-4 px-6 rounded-tl-lg">Avatar</th>
            <th className="py-4 px-6">Carne</th>
            <th className="py-4 px-6">Nombre estudiante</th>
            <th className="py-4 px-6">Email</th>
            <th className="py-4 px-6">Role</th>
            <th className="py-4 px-6 rounded-tr-lg">Actions</th>
          </tr>
          </thead>
          <tbody>
<<<<<<< HEAD:src/components/ui/DashboardTableUsers.tsx
          {filteredUsers.map((user) => (
            <tr key={user.carne} className="bg-white shadow-sm rounded-lg">
              <td className="py-4 px-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user.img ? (
                    <img
                      src={user.img || "/placeholder.svg"}
                      alt={`Avatar de ${user.nombre}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-700 font-semibold">{user.nombre[0]}</span>
                  )}
                </div>
              </td>
              <td className="py-4 px-6 text-gray-800">{user.carne}</td>
              <td className="py-4 px-6 text-gray-600">{user.nombre}</td>
              <td className="py-4 px-6 text-gray-700">{user.correo}</td>
              <td className="py-4 px-6 text-gray-700">{roleMapping[user.rol_id]}</td>
              {/* Mostrar el texto del rol */}
              <td className="py-4 px-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(user)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user.carne)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
=======
            {filteredUsers.map((user) => (
              <tr key={user.carne} className="bg-white shadow-sm rounded-lg">
                <td className="py-4 px-6">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.img ? (
                      <img
                        src={user.img || "/placeholder.svg"}
                        alt={`Avatar de ${user.nombre}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-700 font-semibold">{user.nombre[0]}</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-800">{user.carne}</td>
                <td className="py-4 px-6 text-gray-600">{user.nombre}</td>
                <td className="py-4 px-6 text-gray-700">{user.correo}</td>
                <td className="py-4 px-6 text-gray-700">{user.rol_id}</td>
                <td className="py-4 px-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(user)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user.carne)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
>>>>>>> parent of 3577632 (alpha version):src/components/ui/DashboardTableUsers.jsx
          </tbody>
        </table>
      </div>
    </div>
  )
}

