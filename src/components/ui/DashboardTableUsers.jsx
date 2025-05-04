import { useState, useEffect } from "react"
import { getColors } from "@/actions/personalization"

export function UserTable({ users, onEdit, onDelete }) {
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [filterText, setFilterText] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(5)
  const [newUser, setNewUser] = useState({
    carne: "",
    nombre: "",
    correo: "",
    password: "",
    rol_id: "",
    img: ""
  })
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  })

  const fetchColors = async () => {
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      return
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    )
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    console.log("Fetched colors:", formattedColors)
  }

  useEffect(() => {
    fetchColors()
  }, [])

  const roleMapping = users.reduce((map, user) => {
    map[user.rol_id] = user.rol
    return map
  }, {})

  const roles = [...new Set(users.map(user => user.rol_id))]

  useEffect(() => {
    const filtered = users.filter(
      user =>
        (user.carne.toLowerCase().includes(filterText.toLowerCase()) ||
          user.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
          user.correo.toLowerCase().includes(filterText.toLowerCase())) &&
        (filterRole === "" || user.rol_id === filterRole)
    )
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, filterText, filterRole])

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Nuevo usuario:', newUser)
    setIsModalOpen(false)
    setNewUser({
      carne: "",
      nombre: "",
      correo: "",
      password: "",
      rol_id: "",
      img: ""
    })
  }

  const Pagination = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              currentPage === 1 ? "" : ""
            }`}
            style={{
              backgroundColor: currentPage === 1 ? '#fffaf5' : theme.colors.Background || '#fff8f0',
              color: theme.colors.Tertiary || '#5f5f5f'
            }}
            onMouseEnter={(e) => !currentPage === 1 && (e.target.style.backgroundColor = '#f5e8df')}
            onMouseLeave={(e) => !currentPage === 1 && (e.target.style.backgroundColor = theme.colors.Background || '#fff8f0')}
          >
            Anterior
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              currentPage === totalPages ? "" : ""
            }`}
            style={{
              backgroundColor: currentPage === totalPages ? '#fffaf5' : theme.colors.Background || '#fff8f0',
              color: theme.colors.Tertiary || '#5f5f5f'
            }}
            onMouseEnter={(e) => !currentPage === totalPages && (e.target.style.backgroundColor = '#f5e8df')}
            onMouseLeave={(e) => !currentPage === totalPages && (e.target.style.backgroundColor = theme.colors.Background || '#fff8f0')}
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p style={{ color: theme.colors.Tertiary || '#5f5f5f' }} className="text-sm">
              Mostrando{" "}
              <span className="font-medium">{indexOfFirstUser + 1}</span> a{" "}
              <span className="font-medium">
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{" "}
              de <span className="font-medium">{filteredUsers.length}</span>{" "}
              resultados
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 focus:z-20 focus:outline-offset-0 ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
                style={{
                  color: theme.colors.Tertiary || '#5f5f5f',
                  borderColor: theme.colors.Tertiary || '#5f5f5f'
                }}
                onMouseEnter={(e) => !currentPage === 1 && (e.target.style.backgroundColor = '#f5e8df')}
                onMouseLeave={(e) => !currentPage === 1 && (e.target.style.backgroundColor = 'transparent')}
              >
                <span className="sr-only">Anterior</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:outline-offset-0 ${
                    currentPage === number
                      ? "z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      : ""
                  }`}
                  style={{
                    backgroundColor: currentPage === number ? theme.colors.Primary || '#fc5000' : 'transparent',
                    color: currentPage === number ? theme.colors.Secondary || '#e4e4e4' : theme.colors.Tertiary || '#5f5f5f',
                    borderColor: theme.colors.Tertiary || '#5f5f5f'
                  }}
                  onMouseEnter={(e) => currentPage !== number && (e.target.style.backgroundColor = '#f5e8df')}
                  onMouseLeave={(e) => currentPage !== number && (e.target.style.backgroundColor = 'transparent')}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 focus:z-20 focus:outline-offset-0 ${
                  currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
                style={{
                  color: theme.colors.Tertiary || '#5f5f5f',
                  borderColor: theme.colors.Tertiary || '#5f5f5f'
                }}
                onMouseEnter={(e) => !currentPage === totalPages && (e.target.style.backgroundColor = '#f5e8df')}
                onMouseLeave={(e) => !currentPage === totalPages && (e.target.style.backgroundColor = 'transparent')}
              >
                <span className="sr-only">Siguiente</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl p-6 shadow-lg" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
      <h1 className="text-xl font-semibold mb-6" style={{ color: theme.colors.Accent || '#505050' }}>
        Users
      </h1>

      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium rounded-lg"
          style={{
            backgroundColor: theme.colors.Primary || '#fc5000',
            color: theme.colors.Secondary || '#e4e4e4'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.Accent || '#505050'
            e.target.style.color = theme.colors.Secondary || '#e4e4e4'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.Primary || '#fc5000'
            e.target.style.color = theme.colors.Secondary || '#e4e4e4'
          }}
        >
          Add User
        </button>
      </div> 

      <div className="flex mb-4 gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Filter by Carne, Name, or Email"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
            style={{
              backgroundColor: theme.colors.Background || '#fff8f0',
              color: theme.colors.Tertiary || '#5f5f5f'
            }}
          />
        </div>
        <div className="w-48">
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
            style={{
              backgroundColor: theme.colors.Background || '#fff8f0',
              color: theme.colors.Tertiary || '#5f5f5f'
            }}
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>
                {roleMapping[role]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
              <th className="py-4 px-6 rounded-tl-lg" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                Avatar
              </th>
              <th className="py-4 px-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                Carne
              </th>
              <th className="py-4 px-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                Nombre estudiante
              </th>
              <th className="py-4 px-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                Email
              </th>
              <th className="py-4 px-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                Role
              </th>
              <th className="py-4 px-6 rounded-tr-lg" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.carne} className="shadow-sm rounded-lg" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
                <td className="py-4 px-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#fffaf5' }}>
                    {user.img ? (
                      <img
                        src={user.img}
                        alt={`Avatar de ${user.nombre}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span style={{ color: theme.colors.Tertiary || '#5f5f5f' }} className="font-semibold">
                        {user.nombre[0]}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {user.carne}
                </td>
                <td className="py-4 px-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {user.nombre}
                </td>
                <td className="py-4 px-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {user.correo}
                </td>
                <td className="py-4 px-6" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {roleMapping[user.rol_id]}
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(user)}
                      className="px-4 py-2 text-sm font-medium rounded-lg"
                      style={{
                        backgroundColor: theme.colors.Background || '#fff8f0',
                        color: theme.colors.Tertiary || '#5f5f5f'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user.carne)}
                      className="px-4 py-2 text-sm font-medium rounded-lg"
                      style={{
                        backgroundColor: theme.colors.Primary || '#fc5000',
                        color: theme.colors.Secondary || '#e4e4e4'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = theme.colors.Accent || '#505050'
                        e.target.style.color = theme.colors.Secondary || '#e4e4e4'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = theme.colors.Primary || '#fc5000'
                        e.target.style.color = theme.colors.Secondary || '#e4e4e4'
                      }}
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

      <Pagination />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(95, 95, 95, 0.5)' }}>
          <div className="p-6 rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.Accent || '#505050' }}>
              Add New User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  Carné
                </label>
                <input
                  type="text"
                  name="carne"
                  value={newUser.carne}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
                  style={{
                    borderColor: theme.colors.Tertiary || '#5f5f5f',
                    color: theme.colors.Tertiary || '#5f5f5f',
                    backgroundColor: theme.colors.Background || '#fff8f0'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={newUser.nombre}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
                  style={{
                    borderColor: theme.colors.Tertiary || '#5f5f5f',
                    color: theme.colors.Tertiary || '#5f5f5f',
                    backgroundColor: theme.colors.Background || '#fff8f0'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  Correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={newUser.correo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
                  style={{
                    borderColor: theme.colors.Tertiary || '#5f5f5f',
                    color: theme.colors.Tertiary || '#5f5f5f',
                    backgroundColor: theme.colors.Background || '#fff8f0'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
                  style={{
                    borderColor: theme.colors.Tertiary || '#5f5f5f',
                    color: theme.colors.Tertiary || '#5f5f5f',
                    backgroundColor: theme.colors.Background || '#fff8f0'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  Rol
                </label>
                <select
                  name="rol_id"
                  value={newUser.rol_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
                  style={{
                    borderColor: theme.colors.Tertiary || '#5f5f5f',
                    color: theme.colors.Tertiary || '#5f5f5f',
                    backgroundColor: theme.colors.Background || '#fff8f0'
                  }}
                >
                  <option value="">Seleccionar Rol</option>
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {roleMapping[role]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  URL de imagen
                </label>
                <input
                  type="text"
                  name="img"
                  value={newUser.img}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
                  style={{
                    borderColor: theme.colors.Tertiary || '#5f5f5f',
                    color: theme.colors.Tertiary || '#5f5f5f',
                    backgroundColor: theme.colors.Background || '#fff8f0'
                  }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg"
                  style={{
                    backgroundColor: theme.colors.Background || '#fff8f0',
                    color: theme.colors.Tertiary || '#5f5f5f'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-lg"
                  style={{
                    backgroundColor: theme.colors.Primary || '#fc5000',
                    color: theme.colors.Secondary || '#e4e4e4'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.Accent || '#505050'
                    e.target.style.color = theme.colors.Secondary || '#e4e4e4'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = theme.colors.Primary || '#fc5000'
                    e.target.style.color = theme.colors.Secondary || '#e4e4e4'
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}