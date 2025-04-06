"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { getNewsRequest, createNewsRequest, updateNewsRequest, deleteNewsRequest } from "@/actions/news"
import Swal from "sweetalert2"

function NewsSection() {
  const [news, setNews] = useState([])
  const [selectedNews, setSelectedNews] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
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
      title: "Crear Noticia",
      html:
        '<input id="titulo" class="swal2-input" placeholder="Título">' +
        '<textarea id="contenido" class="swal2-input" placeholder="Contenido"></textarea>' +
        '<input id="img" class="swal2-input" placeholder="URL de la imagen">' +
        '<input id="tipo" class="swal2-input" placeholder="Tipo">',
      focusConfirm: false,
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
    <div className="p-8 overflow-auto">
      <h2 className="text-[50px] font-light mb-8 text-accent">Noticias</h2>
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button onClick={handleCreateNews} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Crear Noticia
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentNews.length > 0 ? (
            currentNews.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedNews(item)}
              >
                <img
                  src={item.img || "/placeholder.svg"}
                  alt={item.titulo}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-medium">{item.titulo}</h3>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay noticias disponibles.</p>
          )}
        </div>
      )}

      {selectedNews && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedNews(null); // Cierra el modal al presionar Esc
          }}
          tabIndex={-1} // Permite que el contenedor capture eventos de teclado
        >
          <div
            className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedNews(null)}
              className="text-gray-500 hover:text-gray-800 float-right"
            >
              ✕
            </button>
            <img
              src={selectedNews.img || "/placeholder.svg"}
              alt={selectedNews.titulo}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            {editingId === selectedNews.id ? (
              <>
                <input
                  type="text"
                  value={selectedNews.titulo}
                  onChange={(e) => setSelectedNews({ ...selectedNews, titulo: e.target.value })}
                  className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                />
                <textarea
                  value={selectedNews.contenido}
                  onChange={(e) => setSelectedNews({ ...selectedNews, contenido: e.target.value })}
                  className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                />
                <input
                  type="text"
                  value={selectedNews.img}
                  onChange={(e) => setSelectedNews({ ...selectedNews, img: e.target.value })}
                  className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                />
                <input
                  type="text"
                  value={selectedNews.tipo}
                  onChange={(e) => setSelectedNews({ ...selectedNews, tipo: e.target.value })}
                  className="border-b border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleSaveNews(selectedNews.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-medium mb-2">{selectedNews.titulo}</h3>
                <p className="text-gray-600 mb-4">{selectedNews.contenido}</p>
                <p className="text-gray-500 italic">Tipo: {selectedNews.tipo}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingId(selectedNews.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteNews(selectedNews.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default NewsSection

