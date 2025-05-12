import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useProyectos } from "@/hooks/useProjects"
import { useUsers } from "@/hooks/useUsers"
import { getColors } from "@/actions/personalization"

export function AddProjectModal({ onClose, /*onAddProject*/ }) {
  const [projectName, setProjectName] = useState("")
  const [projectInfo, setProjectInfo] = useState("")
  const [projectImage, setProjectImage] = useState("")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [dueno_id, setDueno] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  })

  const { createProyecto } = useProyectos()
  const { users, loading: usersLoading, error: usersError } = useUsers()

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

  const handleSubmit = async e => {
    e.preventDefault()

    setErrorMessage("") // Limpiar error previo
    if (!dueno_id) {
      setErrorMessage("You must select a project owner.")
      return
    }

    const newProject = {
      nombre: projectName,
      informacion: projectInfo,
      img: projectImage || null,
      youtube: youtubeLink || null,
      dueno_id: Number.parseInt(dueno_id, 10),
      integrantes: []
    }

    try {
      await createProyecto(newProject)
      onClose()
    } catch (error) {
      setErrorMessage("Failed to create project. Please try again.")
      console.error("Error al agregar proyecto:", error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(95, 95, 95, 0.5)' }}>
      <div className="rounded-2xl p-6 w-full max-w-lg shadow-xl relative" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          aria-label="Close"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
          onMouseEnter={(e) => e.target.style.color = theme.colors.Accent || '#505050'}
          onMouseLeave={(e) => e.target.style.color = theme.colors.Tertiary || '#5f5f5f'}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Título */}
        <h2 className="text-3xl font-semibold mb-6 text-center" style={{ color: theme.colors.Accent || '#505050' }}>
          Add New Project
        </h2>

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 text-sm p-2 rounded-md text-center" style={{ color: theme.colors.Primary || '#fc5000', backgroundColor: '#fffaf5' }}>
            {errorMessage}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre del proyecto */}
          <div>
            <label
              htmlFor="projectName"
              className="block text-sm font-medium"
              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
            >
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="mt-1 block w-full rounded-lg border shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
              style={{
                borderColor: theme.colors.Tertiary || '#5f5f5f',
                backgroundColor: theme.colors.Background || '#fff8f0',
                color: theme.colors.Tertiary || '#5f5f5f'
              }}
              required
            />
          </div>

          {/* Información del proyecto */}
          <div>
            <label
              htmlFor="projectInfo"
              className="block text-sm font-medium"
              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
            >
              Project Information
            </label>
            <textarea
              id="projectInfo"
              value={projectInfo}
              onChange={e => setProjectInfo(e.target.value)}
              className="mt-1 block w-full rounded-lg border shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
              style={{
                borderColor: theme.colors.Tertiary || '#5f5f5f',
                backgroundColor: theme.colors.Background || '#fff8f0',
                color: theme.colors.Tertiary || '#5f5f5f'
              }}
              rows={3}
              required
            />
          </div>

          {/* Imagen del proyecto */}
          <div>
            <label
              htmlFor="projectImage"
              className="block text-sm font-medium"
              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
            >
              Project Image URL
            </label>
            <input
              type="url"
              id="projectImage"
              value={projectImage}
              onChange={e => setProjectImage(e.target.value)}
              className="mt-1 block w-full rounded-lg border shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
              style={{
                borderColor: theme.colors.Tertiary || '#5f5f5f',
                backgroundColor: theme.colors.Background || '#fff8f0',
                color: theme.colors.Tertiary || '#5f5f5f'
              }}
            />
          </div>

          {/* Enlace de YouTube */}
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium"
              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
            >
              YouTube Link
            </label>
            <input
              type="url"
              id="youtubeLink"
              value={youtubeLink}
              onChange={e => setYoutubeLink(e.target.value)}
              className="mt-1 block w-full rounded-lg border shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
              style={{
                borderColor: theme.colors.Tertiary || '#5f5f5f',
                backgroundColor: theme.colors.Background || '#fff8f0',
                color: theme.colors.Tertiary || '#5f5f5f'
              }}
            />
          </div>

          {/* Dueño del proyecto */}
          <div>
            <label
              htmlFor="dueno"
              className="block text-sm font-medium"
              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
            >
              Project Owner
            </label>
            <select
              id="dueno"
              value={dueno_id}
              onChange={e => setDueno(e.target.value)}
              className="mt-1 block w-full rounded-lg border shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
              style={{
                borderColor: theme.colors.Tertiary || '#5f5f5f',
                backgroundColor: theme.colors.Background || '#fff8f0',
                color: theme.colors.Tertiary || '#5f5f5f'
              }}
              required
            >
              <option value="">Select an owner</option>
              {usersLoading ? (
                <option disabled>Loading users...</option>
              ) : usersError ? (
                <option disabled>Error loading users</option>
              ) : (
                users.map(usuario => (
                  <option key={usuario.carne} value={usuario.carne}>
                    {usuario.nombre} ({usuario.carne})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Botón de enviar */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 font-medium rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
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
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}