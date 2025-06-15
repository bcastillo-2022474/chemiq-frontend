"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, Plus, Edit3, Trash2, Users, Play, ArrowLeft, User } from "lucide-react"
import {
  getProjectsRequest,
  updateProjectRequest,
  deleteProjectRequest,
  createProjectRequest,
} from "@/actions/projects"
import { getMembersByProjectIdRequest, addMembersToProjectRequest, deleteMemberRequest } from "@/actions/members"
import { getUsers } from "@/actions/users"
import Swal from "sweetalert2"

const getYouTubeEmbedUrl = (url) => {
  try {
    const urlObj = new URL(url)
    let videoId = ""

    if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.split("/shorts/")[1]
    } else if (urlObj.searchParams.has("v")) {
      videoId = urlObj.searchParams.get("v")
    } else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1)
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
  } catch (error) {
    console.error("URL de YouTube inválida:", error)
    return ""
  }
}

const getYouTubeThumbnail = (url) => {
  try {
    const urlObj = new URL(url)
    let videoId = ""

    if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.split("/shorts/")[1]
    } else if (urlObj.searchParams.has("v")) {
      videoId = urlObj.searchParams.get("v")
    } else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1)
    }

    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ""
  } catch (error) {
    return ""
  }
}

function ProjectsSection() {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [editingProjectData, setEditingProjectData] = useState(null)
  const [projectMembers, setProjectMembers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [assignedSearchTerm, setAssignedSearchTerm] = useState("")
  const [availableSearchTerm, setAvailableSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const itemsPerPage = 12

  const fetchProjects = async () => {
    setLoading(true)
    const [error, projects] = await getProjectsRequest()
    if (error) {
      console.error("Error fetching projects:", error)
      setLoading(false)
      return
    }
    setProjects(projects)
    setLoading(false)
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    const [error, users] = await getUsers()
    if (error) {
      console.error("Error fetching users:", error)
      setLoadingUsers(false)
      return
    }
    setUsers(users)
    setLoadingUsers(false)
  }

  const fetchProjectMembers = async (projectId) => {
    setLoadingMembers(true)
    const [error, members] = await getMembersByProjectIdRequest({ id: projectId })
    if (error) {
      console.error("Error fetching project members:", error)
      setLoadingMembers(false)
      return
    }
    setProjectMembers(members)
    setLoadingMembers(false)
  }

  useEffect(() => {
    fetchProjects()
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchProjectMembers(selectedProject.id)
      setEditingProjectData(selectedProject)
    } else {
      setProjectMembers([])
      setEditingProjectData(null)
    }
  }, [selectedProject])

  const filteredProjects = projects.filter((project) => project.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const assignedUsers = projectMembers
    .map((member) => {
      if (!member.user) return null
      return {
        memberId: member.id,
        carne: member.user.carne,
        name: member.user.nombre || member.user.name,
        email: member.user.correo || member.user.email,
        img: member.user.img,
        rol: member.user.rol,
      }
    })
    .filter(Boolean)
    .filter((user) => user.name.toLowerCase().includes(assignedSearchTerm.toLowerCase()))

  const availableUsers = users
    .filter((user) => !projectMembers.some((member) => member.user?.carne === user.carne))
    .filter((user) => user.nombre.toLowerCase().includes(availableSearchTerm.toLowerCase()))

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)

  const handleEditProject = (field, value) => {
    setEditingProjectData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProject = async (id) => {
    const [error, updatedProject] = await updateProjectRequest({ id, project: editingProjectData })
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el proyecto." })
      return
    }
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...updatedProject } : project)))
    setSelectedProject(updatedProject)
    setEditingId(null)
    void Swal.fire({ icon: "success", title: "Éxito", text: "Proyecto actualizado correctamente." })
  }

  const handleDeleteProject = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (!confirm.isConfirmed) return
    const [error] = await deleteProjectRequest({ id })
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el proyecto." })
      return
    }
    setProjects((prev) => prev.filter((project) => project.id !== id))
    setSelectedProject(null)
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Proyecto eliminado con éxito." })
  }

  const handleCreateProject = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Nuevo Proyecto",
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
            <input id="nombre" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nombre del proyecto">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL de YouTube</label>
            <input id="youtube" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.youtube.com/watch?v=...">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Información</label>
            <textarea id="informacion" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4" placeholder="Descripción del proyecto"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
            <input id="img" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://ejemplo.com/imagen.jpg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Carné del encargado</label>
            <input id="dueno_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Carné del encargado">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => ({
        nombre: document.getElementById("nombre").value,
        youtube: document.getElementById("youtube").value,
        informacion: document.getElementById("informacion").value,
        img: document.getElementById("img").value,
        dueno_id: document.getElementById("dueno_id").value,
      }),
    })
    if (formValues) {
      const [error, newProject] = await createProjectRequest(formValues)
      if (error) {
        void Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el proyecto." })
        return
      }
      setProjects((prev) => [...prev, newProject])
      void Swal.fire({ icon: "success", title: "Éxito", text: "Proyecto creado correctamente." })
    }
  }

  const handleAssignUser = async (projectId, userId) => {
    const [error, newMemberArray] = await addMembersToProjectRequest({ user_id: userId, project_id: projectId })
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo asignar el usuario." })
      return
    }
    const newMember = Array.isArray(newMemberArray) ? newMemberArray[0] : newMemberArray
    if (!newMember.id) return
    const assignedUser = users.find((user) => user.carne === userId)
    if (!assignedUser) return
    const memberWithUser = {
      ...newMember,
      memberId: newMember.id,
      user: {
        carne: assignedUser.carne,
        nombre: assignedUser.nombre,
        correo: assignedUser.correo,
        img: assignedUser.img,
        rol: assignedUser.rol,
      },
    }
    setProjectMembers((prev) => [...prev, memberWithUser])
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, count_members: p.count_members + 1 } : p)))
    await Swal.fire({ icon: "success", title: "Éxito", text: "Usuario asignado correctamente." })
  }

  const handleUnassignUser = async (memberId, projectId) => {
    const [error] = await deleteMemberRequest({ id: memberId })
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo desasignar el usuario." })
      return
    }
    setProjectMembers((prev) => prev.filter((m) => m.id !== memberId))
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, count_members: p.count_members - 1 } : p)))
    await Swal.fire({ icon: "success", title: "Éxito", text: "Usuario desasignado correctamente." })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedProject ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Proyectos</h1>
              <p className="text-gray-600">Administra los proyectos y sus miembros</p>
            </div>

            {/* Search and Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar proyectos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  onClick={handleCreateProject}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Nuevo Proyecto
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          project.img || getYouTubeThumbnail(project.youtube) || "/placeholder.svg?height=200&width=300"
                        }
                        alt={project.nombre}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {project.youtube && (
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                            <Play className="h-5 w-5 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {project.nombre}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{project.count_members} miembros</span>
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          Proyecto
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-300">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Project Detail View */
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver a proyectos
            </button>

            {/* Project Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <img
                    src={
                      editingProjectData?.img ||
                      selectedProject.img ||
                      getYouTubeThumbnail(selectedProject.youtube) ||
                      "/placeholder.svg?height=300&width=400"
                    }
                    alt={editingProjectData?.nombre || selectedProject.nombre}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {selectedProject.youtube && (
                    <div className="aspect-video">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedProject.youtube)}
                        title={selectedProject.nombre}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {editingId === selectedProject.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingProjectData.nombre}
                        onChange={(e) => handleEditProject("nombre", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-xl"
                      />
                      <input
                        type="text"
                        value={editingProjectData.youtube}
                        onChange={(e) => handleEditProject("youtube", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="URL de YouTube"
                      />
                      <textarea
                        value={editingProjectData.informacion}
                        onChange={(e) => handleEditProject("informacion", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                      />
                      <input
                        type="text"
                        value={editingProjectData.img}
                        onChange={(e) => handleEditProject("img", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="URL de la imagen"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSaveProject(selectedProject.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Guardar Cambios
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h1 className="text-3xl font-bold text-gray-900">{selectedProject.nombre}</h1>
                      <p className="text-gray-700 leading-relaxed">{selectedProject.informacion}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">{selectedProject.count_members} miembros</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditingId(selectedProject.id)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProject(selectedProject.id)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Members Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assigned Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Usuarios Asignados</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar asignados..."
                    value={assignedSearchTerm}
                    onChange={(e) => setAssignedSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {loadingMembers ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg animate-pulse"
                        >
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : assignedUsers.length > 0 ? (
                    assignedUsers.map((user) => (
                      <div
                        key={user.carne}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={user.img || "/placeholder.svg?height=40&width=40"}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <button
                          onClick={() => handleUnassignUser(user.memberId, selectedProject.id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                          Desasignar
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No hay usuarios asignados</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Users */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Usuarios Disponibles</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar disponibles..."
                    value={availableSearchTerm}
                    onChange={(e) => setAvailableSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {loadingUsers ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg animate-pulse"
                        >
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  ) : availableUsers.length > 0 ? (
                    availableUsers.map((user) => (
                      <div
                        key={user.carne}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={user.img || "/placeholder.svg?height=40&width=40"}
                          alt={user.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.nombre}</p>
                          <p className="text-sm text-gray-600">{user.correo}</p>
                        </div>
                        <button
                          onClick={() => handleAssignUser(selectedProject.id, user.carne)}
                          className="text-green-600 hover:text-green-700 px-3 py-1 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                        >
                          Asignar
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No hay usuarios disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsSection
