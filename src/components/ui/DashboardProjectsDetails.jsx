export function ProjectDetails({ project, onAddMember }) {
    return (
      <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img src={project.proyecto_img || "/placeholder.svg"} alt={project.proyecto_nombre} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">{project.proyecto_nombre}</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Information</h3>
            <p className="text-gray-600">{project.informacion}</p>
          </div>
          {project.youtube && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">YouTube Video</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${project.youtube.split("v=")[1]}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Team Members</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.integrantes.map((integrante) => (
                <li key={integrante.carne} className="flex items-center space-x-2">
                  {/* Mostrar la imagen del usuario */}
                  <img
                    src={integrante.img || "/placeholder.svg"} 
                    alt={integrante.nombre}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-600">{integrante.nombre}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onAddMember}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
            >
              Add Member
            </button>
          </div>
        </div>
      </div>
    );
  }