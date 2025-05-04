import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Modal } from "../components/ui/DashboardModalEditUsers"
import { UserTable } from "../components/ui/DashboardTableUsers"
import { useUsers } from "../hooks/useUsers"
import { Loader2 } from "lucide-react"
import LoaderCustom from "../components/ui/LoaderCustom"
import { getColors } from "@/actions/personalization"

export default function Home() {
  const {
    users,
    loading,
    error,
    updateUser,
    deleteUser
  } = useUsers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
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

  const handleEdit = user => {
    console.log("soy el usuario a editar " + user)
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = userId => {
    console.log("Usuario a eliminar: " + userId)
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        deleteUser(userId)
        Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success")
      }
    })
  }

  const handleSave = updatedUser => {
    updateUser(updatedUser.carne, updatedUser)
    setIsModalOpen(false)
    Swal.fire(
      "Guardado!",
      "La información del usuario ha sido actualizada.",
      "success"
    )
  }

  if (error) return <p style={{ color: theme.colors.Primary || '#fc5000' }}>Error: {error}</p>

  return (
    <main className="flex-1 overflow-auto p-8" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: theme.colors.Accent || '#505050' }}>
        Usuarios
      </h1>
      {loading ? (
        <LoaderCustom />
      ) : (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Usuario"
      >
        {editingUser && (
          <EditUserForm
            user={editingUser}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </main>
  )
}

function EditUserForm({ user, onSave, onCancel }) {
  const [editedUser, setEditedUser] = useState(user)
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

  const handleChange = e => {
    const { name, value } = e.target
    setEditedUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave(editedUser)
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6" 
      style={{ backgroundColor: theme.colors.Background || '#fff8f0', padding: '1.5rem' }}
    >
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
        >
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          value={editedUser.nombre || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
      </div>

      <div>
        <label
          htmlFor="correo"
          className="block text-sm font-medium"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
        >
          Email
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={editedUser.correo || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
      </div>

      <div>
        <label
          htmlFor="rol_id"
          className="block text-sm font-medium"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
        >
          Rol
        </label>
        <input
          id="rol_id"
          name="rol_id"
          value={editedUser.rol_id || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            color: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
          onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
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
          Guardar Cambios
        </button>
      </div>
    </form>
  )
}