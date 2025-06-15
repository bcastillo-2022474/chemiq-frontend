"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, Plus, Edit3, Trash2, Play, ExternalLink, X } from "lucide-react"
import { getPodcast, updatePodcastRequest, deletePodcastRequest, createPodcastRequest } from "@/actions/podcast"
import Swal from "sweetalert2"

const getYouTubeEmbedUrl = (url) => {
  try {
    const urlObj = new URL(url)
    let videoId = ""

    // Para URLs de shorts: youtube.com/shorts/ID
    if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.split("/shorts/")[1]
    }
    // Para URLs estándar: youtube.com/watch?v=ID
    else if (urlObj.searchParams.has("v")) {
      videoId = urlObj.searchParams.get("v")
    }
    // Para URLs cortas: youtu.be/ID
    else if (urlObj.hostname === "youtu.be") {
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

function PodcastSection() {
  const [podcast, setPodcast] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedPodcast, setSelectedPodcast] = useState(null)
  const itemsPerPage = 12

  const fetchPodcast = async () => {
    setLoading(true)
    const [error, podcast] = await getPodcast()
    if (error) {
      console.error("Error fetching podcasts:", error)
      setLoading(false)
      return
    }
    setPodcast(podcast)
    setLoading(false)
  }

  useEffect(() => {
    fetchPodcast()
  }, [])

  const filteredPodcast = podcast.filter((pod) => pod.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPodcast = filteredPodcast.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPodcast.length / itemsPerPage)

  const handleEditPodcast = (id, field, value) => {
    setPodcast(podcast.map((pod) => (pod.id === id ? { ...pod, [field]: value } : pod)))
  }

  const handleSavePodcast = async (id) => {
    const podcastToUpdate = podcast.find((pod) => pod.id === id)
    if (!podcastToUpdate) return
    const updatedData = { nombre: podcastToUpdate.nombre, link: podcastToUpdate.link }
    const [error, updatedPodcast] = await updatePodcastRequest({ id, podcast: updatedData })
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el podcast." })
      return
    }
    setPodcast((prev) => prev.map((pod) => (pod.id === id ? { ...pod, ...updatedPodcast } : pod)))
    setEditingId(null)
    void Swal.fire({ icon: "success", title: "Éxito", text: "Podcast actualizado correctamente." })
  }

  const handleDeletePodcast = async (id) => {
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
    const [error] = await deletePodcastRequest({ id })
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el podcast." })
      return
    }
    setPodcast((prev) => prev.filter((pod) => pod.id !== id))
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Podcast eliminado con éxito." })
  }

  const handleCreatePodcast = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Nuevo Podcast",
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Podcast</label>
            <input id="nombre" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nombre del podcast">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL de YouTube</label>
            <input id="link" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.youtube.com/watch?v=...">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => ({
        nombre: document.getElementById("nombre").value,
        link: document.getElementById("link").value,
      }),
    })
    if (formValues) {
      const [error, newPodcast] = await createPodcastRequest(formValues)
      if (error) {
        void Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el podcast." })
        return
      }
      setPodcast((prev) => [...prev, newPodcast])
      void Swal.fire({ icon: "success", title: "Éxito", text: "Podcast creado correctamente." })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Podcasts</h1>
          <p className="text-gray-600">Administra los podcasts y videos de YouTube</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar podcasts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={handleCreatePodcast}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nuevo Podcast
            </button>
          </div>
        </div>

        {/* Podcasts Grid */}
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
            {currentPodcast.length > 0 ? (
              currentPodcast.map((pod) => (
                <div
                  key={pod.id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPodcast(pod)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getYouTubeThumbnail(pod.link) || "/placeholder.svg?height=200&width=300"}
                      alt={pod.nombre}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="h-6 w-6 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {pod.nombre}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">YouTube</span>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay podcasts disponibles</p>
              </div>
            )}
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

        {/* Video Modal */}
        {selectedPodcast && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedPodcast.link)}
                    title={selectedPodcast.nombre}
                    className="w-full h-full rounded-t-2xl"
                    allowFullScreen
                  />
                </div>
                <button
                  onClick={() => setSelectedPodcast(null)}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="p-6">
                {editingId === selectedPodcast.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={selectedPodcast.nombre}
                      onChange={(e) => handleEditPodcast(selectedPodcast.id, "nombre", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-semibold text-xl"
                    />
                    <input
                      type="text"
                      value={selectedPodcast.link}
                      onChange={(e) => handleEditPodcast(selectedPodcast.id, "link", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="URL de YouTube"
                    />
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleSavePodcast(selectedPodcast.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPodcast.nombre}</h2>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingId(selectedPodcast.id)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePodcast(selectedPodcast.id)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                      <a
                        href={selectedPodcast.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver en YouTube
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PodcastSection
