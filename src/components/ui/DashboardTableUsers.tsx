import { useState, useEffect } from "react"

export function UserTable({ users, onEdit, onDelete }) {
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [filterText, setFilterText] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    carne: "",
    nombre: "",
    correo: "",
    password: "",
    rol_id: "",
    img: ""
  })

  // Mapa de roles
  const roleMapping = {
    1: "Admin",
    2: "Junta",
    3: "User"
  }

  // Obtener roles únicos de los usuarios
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

  const handleAddUser = () => {
    // Aquí se puede agregar la lógica para llamar a la API y crear un nuevo usuario
    // Por ejemplo, podrías usar fetch para hacer una solicitud POST al backend
    fetch("/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          alert("Usuario creado correctamente");
          setIsModalOpen(false);  // Cerrar el modal después de agregar el usuario
        }
      })
      .catch((error) => {
        console.error("Error al crear el usuario:", error);
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-xl font-semibold mb-6 text-gray-800">Users</h1>

      {/* Agregar usuario botón */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

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
                {roleMapping[role]} {/* Mostrar el texto en lugar del ID */}
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
                <td className="py-4 px-6 text-gray-700">{roleMapping[user.rol_id]}</td> {/* Mostrar el texto del rol */}
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
          </tbody>
        </table>
      </div>

      {/* Modal para agregar nuevo usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New User</h2>
            <div className="space-y-4">
              <div className="mb-4">
                <input
                  type="text"
                  name="carne"
                  value={newUser.carne}
                  onChange={handleInputChange}
                  placeholder="Carne"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="nombre"
                  value={newUser.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="correo"
                  value={newUser.correo}
                  onChange={handleInputChange}
                  placeholder="Correo"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <select
                  name="rol_id"
                  value={newUser.rol_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {roleMapping[role]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="img"
                  value={newUser.img}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-between mt-5 gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
