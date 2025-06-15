"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search, Plus, Edit3, Trash2, Eye, X, ImageIcon } from "lucide-react"
import { getNewsRequest, createNewsRequest, updateNewsRequest, deleteNewsRequest } from "@/actions/news"
import Swal from "sweetalert2"

function NewsSection() {
  const [news, setNews] = useState([])
  const [selectedNews, setSelectedNews] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 12

  const fetchNews = async () => {
    setLoading(true)
    const [error, news] = await getNewsRequest()
    if (error) {
      console.error("Error fetching news:", error)
      setLoading(false)
      return
    }
    setNews(news)
    setLoading(false)
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const filteredNews = news.filter((item) => item.titulo.toLowerCase().includes(searchTerm.toLowerCase()))

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)

  const handleSaveNews = async (id) => {
    const newsToUpdate = news.find((item) => item.id === id)
    if (!newsToUpdate) return
    const updatedData = {
      titulo: selectedNews.titulo,
      contenido: selectedNews.contenido,
      img: selectedNews.img,
      tipo: selectedNews.tipo,
    }
    const [error, updatedNews] = await updateNewsRequest({ id, news: updatedData })
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar la noticia." })
      return
    }
    setNews((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedNews } : item)))
    setEditingId(null)
    setSelectedNews(null)
    void Swal.fire({ icon: "success", title: "Éxito", text: "Noticia actualizada correctamente." })
  }

  const handleDeleteNews = async (id) => {
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
    const [error] = await deleteNewsRequest({ id })
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar la noticia." })
      return
    }
    setNews((prev) => prev.filter((item) => item.id !== id))
    setSelectedNews(null)
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Noticia eliminada con éxito." })
  }

  const handleCreateNews = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Nueva Noticia",
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input id="titulo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Título de la noticia">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
            <textarea id="contenido" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4" placeholder="Contenido de la noticia"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
            <input id="img" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://ejemplo.com/imagen.jpg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <input id="tipo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Tipo de noticia">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => ({
        titulo: document.getElementById("titulo").value,
        contenido: document.getElementById("contenido").value,
        img: document.getElementById("img").value,
        tipo: document.getElementById("tipo").value,
      }),
    })
    if (formValues) {
      const [error, newNews] = await createNewsRequest(formValues)
      if (error) {
        void Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear la noticia." })
        return
      }
      setNews((prev) => [...prev, newNews])
      void Swal.fire({ icon: "success", title: "Éxito", text: "Noticia creada correctamente." })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Noticias</h1>
          <p className="text-gray-600">Administra las noticias y artículos del portal</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={handleCreateNews}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nueva Noticia
            </button>
          </div>
        </div>

        {/* News Grid */}
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
            {currentNews.length > 0 ? (
              currentNews.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.img || "/placeholder.svg?height=200&width=300"}
                      alt={item.titulo}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Eye className="h-4 w-4 text-gray-700" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.titulo}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {item.tipo}
                      </span>
                      <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay noticias disponibles</p>
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

        {/* Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedNews.img || "/placeholder.svg?height=300&width=600"}
                  alt={selectedNews.titulo}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              <div className="p-6">
                {editingId === selectedNews.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={selectedNews.titulo}
                      onChange={(e) => setSelectedNews({ ...selectedNews, titulo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold text-xl"
                    />
                    <textarea
                      value={selectedNews.contenido}
                      onChange={(e) => setSelectedNews({ ...selectedNews, contenido: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                    />
                    <input
                      type="text"
                      value={selectedNews.img}
                      onChange={(e) => setSelectedNews({ ...selectedNews, img: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL de la imagen"
                    />
                    <input
                      type="text"
                      value={selectedNews.tipo}
                      onChange={(e) => setSelectedNews({ ...selectedNews, tipo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tipo"
                    />
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleSaveNews(selectedNews.id)}
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
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedNews.titulo}</h2>
                        <span className="inline-block text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {selectedNews.tipo}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">{selectedNews.contenido}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingId(selectedNews.id)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteNews(selectedNews.id)}
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
        )}
      </div>
    </div>
  )
}

export default NewsSection
