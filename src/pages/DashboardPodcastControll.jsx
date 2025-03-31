import { useState } from "react"
import Swal from "sweetalert2"
import { Modal } from "../components/ui/DashboardModalEditUsers" // Asumo que este componente es reutilizable
import { PodcastTable } from "../components/ui/DashboardTablePodcasts" // Deberías crear este componente
import { usePodcasts } from "../hooks/usePodcasts" // Deberías crear este hook

export default function Podcast() {
  const {
    podcasts,
    loading,
    error,
    updatePodcast,
    deletePodcast
  } = usePodcasts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPodcast, setEditingPodcast] = useState(null)

  const handleEdit = podcast => {
    console.log("Podcast a editar: " + podcast)
    setEditingPodcast(podcast)
    setIsModalOpen(true)
  }

  const handleDelete = podcastId => {
    console.log("Podcast a eliminar: " + podcastId)
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
        deletePodcast(podcastId)
        Swal.fire("Eliminado!", "El podcast ha sido eliminado.", "success")
      }
    })
  }

  const handleSave = updatedPodcast => {
    updatePodcast(updatedPodcast.id, updatedPodcast)
    setIsModalOpen(false)
    Swal.fire(
      "Guardado!",
      "La información del podcast ha sido actualizada.",
      "success"
    )
  }

  if (error) return <p>Error: {error}</p>

  return (
    <main className="flex-1 overflow-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Podcasts</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <PodcastTable 
          podcasts={podcasts} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Podcast"
      >
        {editingPodcast && (
          <EditPodcastForm
            podcast={editingPodcast}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </main>
  )
}

function EditPodcastForm({ podcast, onSave, onCancel }) {
  const [editedPodcast, setEditedPodcast] = useState(podcast)

  const handleChange = e => {
    const { name, value } = e.target
    setEditedPodcast(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave(editedPodcast)
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
          value={editedPodcast.title || ""}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={editedPodcast.description || ""}
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