import { Plus } from "lucide-react"

export function ProjectList({ onProjectClick, onAddProject, projects }) {
  return (
    <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col relative">
      <h2 className="text-2xl font-semibold p-6 bg-[#1e2532] text-white">
        Projects
      </h2>
      <button
        onClick={onAddProject}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Add new project"
      >
        <Plus className="w-6 h-6 text-[#1e2532]" />
      </button>
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <ul className="divide-y divide-gray-200">
          {projects.map(project => (
            <li
              key={project.id}
              className="flex items-center p-6 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
              onClick={() => onProjectClick(project)}
            >
              <img
                src={project.img || "/placeholder.svg"}
                alt={project.nombre}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {project.nombre}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {project.informacion}
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  Click to view details
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
