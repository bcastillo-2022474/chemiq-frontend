import { useState } from "react"
import { X } from "lucide-react"


export function AddProjectModal({ onAddProject, onClose }) {
  const [projectName, setProjectName] = useState("")
  const [projectInfo, setProjectInfo] = useState("")
  const [projectImage, setProjectImage] = useState("")
  const [youtubeLink, setYoutubeLink] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await onAddProject({
        nombre: projectName,
        informacion: projectInfo,
        img: projectImage,
        youtube: youtubeLink,
        integrantes: [],
      })
      onClose()
    } catch (error) {
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

