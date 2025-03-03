import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useProyectos } from "../../hooks/useProjects"
import { useUsers } from "../../hooks/useUsers"

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
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="projectInfo" className="block text-sm font-medium text-gray-700">
              Project Information
            </label>
            <textarea
              id="projectInfo"
              value={projectInfo}
              onChange={(e) => setProjectInfo(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="projectImage" className="block text-sm font-medium text-gray-700">
              Project Image URL
            </label>
            <input
              type="url"
              id="projectImage"
              value={projectImage}
              onChange={(e) => setProjectImage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700">
              YouTube Link
            </label>
            <input
              type="url"
              id="youtubeLink"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="dueno" className="block text-sm font-medium text-gray-700">
              Project Owner
            </label>
            <select
              id="dueno"
              value={dueno_id}
              onChange={(e) => setDueno(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
