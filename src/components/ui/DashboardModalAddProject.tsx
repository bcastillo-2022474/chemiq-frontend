import { useState } from "react"
import { X } from "lucide-react"
import { useProyectos } from "@/hooks/useProjects"
import { useUsers } from "@/hooks/useUsers"

export function AddProjectModal({ onClose }) {
  const [projectName, setProjectName] = useState("")
  const [projectInfo, setProjectInfo] = useState("")
  const [projectImage, setProjectImage] = useState("")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [dueno_id, setDueno] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const { createProyecto } = useProyectos()
  const { users, loading: usersLoading, error: usersError } = useUsers()

  const handleSubmit = async (e) => {
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
      integrantes: [], 
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
  
        {/* Título */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Add New Project
        </h2>
  
        {/* Mensaje de error */}
        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded-md text-center">
            {errorMessage}
          </div>
        )}
  
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre del proyecto */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow-sm px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              required
            />
          </div>
  
          {/* Información del proyecto */}
          <div>
            <label htmlFor="projectInfo" className="block text-sm font-medium text-gray-700">
              Project Information
            </label>
            <textarea
              id="projectInfo"
              value={projectInfo}
              onChange={(e) => setProjectInfo(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow-sm px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              rows={3}
              required
            />
          </div>
  
          {/* Imagen del proyecto */}
          <div>
            <label htmlFor="projectImage" className="block text-sm font-medium text-gray-700">
              Project Image URL
            </label>
            <input
              type="url"
              id="projectImage"
              value={projectImage}
              onChange={(e) => setProjectImage(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow-sm px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>
  
          {/* Enlace de YouTube */}
          <div>
            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700">
              YouTube Link
            </label>
            <input
              type="url"
              id="youtubeLink"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow-sm px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>
  
          {/* Dueño del proyecto */}
          <div>
            <label htmlFor="dueno" className="block text-sm font-medium text-gray-700">
              Project Owner
            </label>
            <select
              id="dueno"
              value={dueno_id}
              onChange={(e) => setDueno(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow-sm px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              required
            >
              <option value="">Select an owner</option>
              {usersLoading ? (
                <option disabled>Loading users...</option>
              ) : usersError ? (
                <option disabled>Error loading users</option>
              ) : (
                users.map((usuario) => (
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
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}
