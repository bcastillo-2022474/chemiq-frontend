"use client"

import { useState, useEffect } from "react"
import { getProjectsRequest } from "@/actions/projects"
import { getMembersByProjectIdRequest, addMembersToProjectRequest } from "@/actions/members"
import { getMyProjects, updateMyProject, deleteMyProject } from "@/actions/getMyProjects"
import { ProjectCard } from "./ProjectCard"
import { AddMemberModal } from "@/components/ui/DashboardModalProjectMember"
import { getColors } from "@/actions/personalization"

export const ProjectsSection = () => {
  const [activeTab, setActiveTab] = useState("proyectos")
  const [projects, setProjects] = useState([])
  const [myProjects, setMyProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState("general")
  const [searchTerm, setSearchTerm] = useState("")
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
    const fetchProjects = async () => {
      const [error, projects] = await getProjectsRequest()
      if (!error) {
        setProjects(projects)
      }
      setLoading(false)
    }

    const fetchMyProjects = async () => {
      const [error, response] = await getMyProjects()
      if (!error) {
        setMyProjects(response.proyectos)
      }
    }

    fetchProjects()
    fetchMyProjects()
  }, [])

  const handleDeleteProject = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este proyecto?")) {
      const [error] = await deleteMyProject(id)
      if (!error) {
        alert("Proyecto eliminado correctamente.")
        const [error, response] = await getMyProjects()
        if (!error) {
          setMyProjects(response.proyectos)
        }
      } else {
        alert("Error al eliminar proyecto.")
      }
    }
  }

  const handleUpdateProject = async () => {
    if (!editingProject) return

    const [error] = await updateMyProject({
      id: editingProject.id,
      nombre: editingProject.nombre,
      informacion: editingProject.informacion,
      youtube: editingProject.youtube,
      img: editingProject.img,
    })

    if (!error) {
      alert("Proyecto actualizado correctamente.")
      setEditingProject(null)
      const [error, response] = await getMyProjects()
      if (!error) {
        setMyProjects(response.proyectos)
      }
    } else {
      alert("Error al actualizar proyecto.")
    }
  }

  const handleAddMember = async (projectId, userId) => {
    try {
      const [error, data] = await addMembersToProjectRequest({
        user_id: userId,
        project_id: projectId,
      })
      console.log(data)
      console.log(error)
      if (error) {
        throw new Error("Error al agregar miembro")
      }
      // Refresh my projects
      const [errorMyProjects, response] = await getMyProjects()
      if (!errorMyProjects) {
        setMyProjects(response.proyectos)
      }
      // If editing project is open, update its members
      if (editingProject && editingProject.id === projectId) {
        const [errorMembers, members] = await getMembersByProjectIdRequest({ id: projectId })
        if (!errorMembers) {
          setEditingProject((prev) => ({
            ...prev,
            members: members,
          }))
        }
      }
      return data
    } catch (error) {
      console.error("Error al agregar miembro:", error)
      alert("Error al agregar miembro.")
    }
  }

  // Filtrar proyectos según el término de búsqueda
  const filteredProjects = (activeTab === "proyectos" ? projects : myProjects).filter(
    (proyecto) =>
      proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.informacion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div
        className="rounded-xl p-6 shadow-sm"
        style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: theme.colors.Accent || '#505050' }}
        >
          Proyectos de la Asociación
        </h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex gap-4 border-b">
            <button
              className={`pb-3 px-4 font-medium ${
                activeTab === "proyectos"
                  ? `border-b-2 text-[${theme.colors.Primary || '#fc5000'}]`
                  : `text-[${theme.colors.Tertiary || '#5f5f5f'}] hover:text-[${theme.colors.Accent || '#505050'}]`
              }`}
              style={{
                borderBottomColor: activeTab === "proyectos" ? theme.colors.Primary || '#fc5000' : 'transparent'
              }}
              onClick={() => setActiveTab("proyectos")}
            >
              Todos los Proyectos
            </button>
            <button
              className={`pb-3 px-4 font-medium ${
                activeTab === "misProyectos"
                  ? `border-b-2 text-[${theme.colors.Primary || '#fc5000'}]`
                  : `text-[${theme.colors.Tertiary || '#5f5f5f'}] hover:text-[${theme.colors.Accent || '#505050'}]`
              }`}
              style={{
                borderBottomColor: activeTab === "misProyectos" ? theme.colors.Primary || '#fc5000' : 'transparent'
              }}
              onClick={() => setActiveTab("misProyectos")}
            >
              Mis Proyectos
            </button>
          </div>

          {/* Buscador */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4"
                style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-2.5 pl-10 text-sm rounded-lg focus:ring-2 transition-all"
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                color: theme.colors.Accent || '#505050',
                borderColor: theme.colors.Secondary || '#e4e4e4',
                backgroundColor: theme.colors.Background || '#fff8f0',
                focusRingColor: theme.colors.Primary || '#fc5000'
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div
                className="h-48 rounded-t-xl"
                style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
              ></div>
              <div
                className="rounded-b-xl p-5 space-y-3"
                style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
              >
                <div
                  className="h-5 rounded w-3/4"
                  style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
                ></div>
                <div
                  className="h-4 rounded w-full"
                  style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
                ></div>
                <div
                  className="h-4 rounded w-2/3"
                  style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
                ></div>
                <div className="flex justify-between pt-2">
                  <div
                    className="h-7 w-7 rounded-full"
                    style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
                  ></div>
                  <div
                    className="h-5 rounded w-20"
                    style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proyecto) => (
            <div key={proyecto.id} className="relative group">
              <ProjectCard proyecto={proyecto} onClick={() => setSelectedProject(proyecto)} />
              {activeTab === "misProyectos" && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingProject({ ...proyecto })
                    }}
                    className="p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                    style={{
                      backgroundColor: theme.colors.Primary || '#fc5000',
                      color: theme.colors.Secondary || '#e4e4e4'
                    }}
                    title="Editar proyecto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteProject(proyecto.id)
                    }}
                    className="p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                    style={{
                      backgroundColor: theme.colors.Accent || '#505050',
                      color: theme.colors.Secondary || '#e4e4e4'
                    }}
                    title="Eliminar proyecto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl p-10 text-center"
          style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3
              className="text-xl font-medium"
              style={{ color: theme.colors.Accent || '#505050' }}
            >
              No hay proyectos disponibles
            </h3>
            <p
              className="max-w-md"
              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
            >
              {searchTerm
                ? `No se encontraron proyectos que coincidan con "${searchTerm}"`
                : "No hay proyectos disponibles en este momento."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 font-medium"
                style={{ color: theme.colors.Primary || '#fc5000' }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.Accent || '#505050'}
                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.Primary || '#fc5000'}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal de detalles del proyecto */}
      {selectedProject && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}80` }}
        >
          <div
            className="rounded-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
          >
            <button
              className="absolute top-4 right-4 rounded-full p-2 transition-colors"
              style={{
                color: theme.colors.Tertiary || '#5f5f5f',
                backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33`,
                ':hover': { backgroundColor: theme.colors.Secondary || '#e4e4e4' }
              }}
              onClick={() => setSelectedProject(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <h2
                className="text-2xl font-bold"
                style={{ color: theme.colors.Accent || '#505050' }}
              >
                {selectedProject.nombre}
              </h2>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${theme.colors.Primary || '#fc5000'}e6`,
                  color: theme.colors.Secondary || '#e4e4e4'
                }}
              >
                Activo
              </span>
            </div>

            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={selectedProject.img || "/placeholder.svg"}
                  alt={selectedProject.nombre}
                  className="w-full h-80 object-cover"
                />
                {selectedProject.youtube && (
                  <a
                    href={selectedProject.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center transition-colors group"
                    style={{ backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}4d` }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.Tertiary || '#5f5f5f'}80`}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${theme.colors.Tertiary || '#5f5f5f'}4d`}
                  >
                    <div
                      className="p-4 rounded-full group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: theme.colors.Primary || '#fc5000',
                        color: theme.colors.Secondary || '#e4e4e4'
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    </div>
                  </a>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{ color: theme.colors.Accent || '#505050' }}
                  >
                    Descripción
                  </h3>
                  <p
                    className="leading-relaxed whitespace-pre-line"
                    style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                  >
                    {selectedProject.informacion}
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
                >
                  <MembersSection projectId={selectedProject.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de proyecto */}
      {editingProject && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}80` }}
        >
          <div
            className="rounded-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
          >
            <button
              className="absolute top-4 right-4 rounded-full p-2 transition-colors"
              style={{
                color: theme.colors.Tertiary || '#5f5f5f',
                backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33`,
                ':hover': { backgroundColor: theme.colors.Secondary || '#e4e4e4' }
              }}
              onClick={() => setEditingProject(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2
              className="text-xl font-bold mb-4"
              style={{ color: theme.colors.Accent || '#505050' }}
            >
              Editar Proyecto
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 border-b">
                <button
                  className={`pb-3 px-4 font-medium ${
                    currentTab === "general"
                      ? `border-b-2 text-[${theme.colors.Primary || '#fc5000'}]`
                      : `text-[${theme.colors.Tertiary || '#5f5f5f'}] hover:text-[${theme.colors.Accent || '#505050'}]`
                  }`}
                  style={{
                    borderBottomColor: currentTab === "general" ? theme.colors.Primary || '#fc5000' : 'transparent'
                  }}
                  onClick={() => setCurrentTab("general")}
                >
                  Datos Generales
                </button>
                <button
                  className={`pb-3 px-4 font-medium ${
                    currentTab === "members"
                      ? `border-b-2 text-[${theme.colors.Primary || '#fc5000'}]`
                      : `text-[${theme.colors.Tertiary || '#5f5f5f'}] hover:text-[${theme.colors.Accent || '#505050'}]`
                  }`}
                  style={{
                    borderBottomColor: currentTab === "members" ? theme.colors.Primary || '#fc5000' : 'transparent'
                  }}
                  onClick={() => setCurrentTab("members")}
                >
                  Miembros
                </button>
              </div>

              {currentTab === "general" && (
                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label
                      className="text-sm font-medium block mb-1"
                      style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                    >
                      Nombre del Proyecto
                    </label>
                    <input
                      type="text"
                      value={editingProject.nombre}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          nombre: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border rounded-lg focus:ring-2 transition-all"
                      style={{
                        borderColor: theme.colors.Secondary || '#e4e4e4',
                        focusRingColor: theme.colors.Primary || '#fc5000'
                      }}
                    />
                  </div>

                  {/* Información */}
                  <div>
                    <label
                      className="text-sm font-medium block mb-1"
                      style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                    >
                      Descripción
                    </label>
                    <textarea
                      value={editingProject.informacion}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          informacion: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border rounded-lg focus:ring-2 transition-all"
                      style={{
                        borderColor: theme.colors.Secondary || '#e4e4e4',
                        focusRingColor: theme.colors.Primary || '#fc5000'
                      }}
                      rows="4"
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label
                      className="text-sm font-medium block mb-1"
                      style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                    >
                      Enlace YouTube
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={editingProject.youtube}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            youtube: e.target.value,
                          })
                        }
                        className="w-full p-2.5 pl-10 border rounded-lg focus:ring-2 transition-all"
                        placeholder="https://youtube.com/watch?v="
                        style={{
                          borderColor: theme.colors.Secondary || '#e4e4e4',
                          focusRingColor: theme.colors.Primary || '#fc5000'
                        }}
                      />
                    </div>
                  </div>

                  {/* Imagen */}
                  <div>
                    <label
                      className="text-sm font-medium block mb-1"
                      style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                    >
                      URL de la Imagen
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={editingProject.img}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            img: e.target.value,
                          })
                        }
                        className="w-full p-2.5 pl-10 border rounded-lg focus:ring-2 transition-all"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        style={{
                          borderColor: theme.colors.Secondary || '#e4e4e4',
                          focusRingColor: theme.colors.Primary || '#fc5000'
                        }}
                      />
                    </div>

                    {editingProject.img && (
                      <div className="mt-3">
                        <p
                          className="text-sm mb-2"
                          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                        >
                          Vista previa:
                        </p>
                        <div
                          className="relative rounded-lg overflow-hidden border"
                          style={{ borderColor: theme.colors.Secondary || '#e4e4e4' }}
                        >
                          <img
                            src={editingProject.img || "/placeholder.svg"}
                            alt="Vista previa"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleUpdateProject}
                    className="py-2.5 px-4 rounded-lg w-full font-medium transition-colors"
                    style={{
                      backgroundColor: theme.colors.Primary || '#fc5000',
                      color: theme.colors.Secondary || '#e4e4e4'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.Accent || '#505050'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.Primary || '#fc5000'}
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}

              {/* Pestaña de Miembros */}
              {currentTab === "members" && (
                <div className="py-2">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setIsAddMemberModalOpen(true)}
                      className="py-2 px-4 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: theme.colors.Primary || '#fc5000',
                        color: theme.colors.Secondary || '#e4e4e4'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.Accent || '#505050'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.Primary || '#fc5000'}
                    >
                      Agregar Miembros
                    </button>
                  </div>
                  <MembersSection
                    projectId={editingProject.id}
                    onMembersUpdated={() => {
                      // Refresh members when updated
                      getMembersByProjectIdRequest({ id: editingProject.id }).then(([error, members]) => {
                        if (!error) {
                          setEditingProject((prev) => ({
                            ...prev,
                            members: members,
                          }))
                        }
                      })
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar miembros */}
      {isAddMemberModalOpen && (
        <AddMemberModal
          projectId={editingProject?.id ?? 0}
          onAddMember={handleAddMember}
          onClose={() => setIsAddMemberModalOpen(false)}
        />
      )}
    </div>
  )
}

function MembersSection({ projectId, onMembersUpdated }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const [error, members] = await getMembersByProjectIdRequest({ id: projectId })
      if (!error) {
        console.log(members)
        setMembers(members)
        setLoading(false)
      }
    }
    fetchMembers()
  }, [projectId, onMembersUpdated])

  if (loading) {
    return (
      <div className="space-y-4">
        <div
          className="h-6 w-1/4 rounded animate-pulse"
          style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
        />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full animate-pulse"
              style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
            />
            <div
              className="h-4 w-1/2 rounded animate-pulse"
              style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` }}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3
        className="text-xl font-semibold"
        style={{ color: theme.colors.Primary || '#fc5000' }}
      >
        Integrantes
      </h3>
      {members.length > 0 ? (
        <div className="space-y-3">
          {members.map(({ user: member }) => (
            <div
              key={member.carne}
              className="flex items-center gap-3 p-2 rounded-lg transition-colors"
              style={{ ':hover': { backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}33` } }}
            >
              <img
                src={member?.img || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover border-2"
                style={{ borderColor: `${theme.colors.Tertiary || '#5f5f5f'}33` }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                }}
              />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: theme.colors.Accent || '#505050' }}
                >
                  {member.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                >
                  {member.carne}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-4"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
        >
          No hay integrantes registrados en este proyecto.
        </div>
      )}
    </div>
  )
}