import { useState } from "react"
import Swal from "sweetalert2"
import { Modal } from "../components/ui/DashboardModalEditUsers" // Asumo que este componente es reutilizable
import { NewsTable } from "../components/ui/DashboardTableNews" // Deberías crear este componente
import { useNews } from "../hooks/useNews" // Deberías crear este hook

export default function NewsHome() {
  const {
    news,
    loading,
    error,
    updateNews,
    deleteNews
  } = useNews()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState(null)

  const handleEdit = newsItem => {
    console.log("Noticia a editar: " + newsItem)
    setEditingNews(newsItem)
    setIsModalOpen(true)
  }

  const handleDelete = newsId => {
    console.log("Noticia a eliminar: " + newsId)
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        deleteNews(newsId)
        Swal.fire("Eliminado!", "La noticia ha sido eliminada.", "success")
      }
    })
  }

  const handleSave = updatedNews => {
    updateNews(updatedNews.id, updatedNews)
    setIsModalOpen(false)
    Swal.fire(
      "Guardado!",
      "La información de la noticia ha sido actualizada.",
      "success"
    )
  }

  if (error) return <p>Error: {error}</p>

  return (
    <main className="flex-1 overflow-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Noticias</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <NewsTable 
          news={news} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Noticia"
      >
        {editingNews && (
          <EditNewsForm
            news={editingNews}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </main>
  )
}

function EditNewsForm({ news, onSave, onCancel }) {
  const [editedNews, setEditedNews] = useState(news)

  const handleChange = e => {
    const { name, value } = e.target
    setEditedNews(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave(editedNews)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Título
        </label>
        <input
          id="title"
          name="title"
          value={editedNews.title || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Contenido
        </label>
        <textarea
          id="content"
          name="content"
          value={editedNews.content || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  )
}