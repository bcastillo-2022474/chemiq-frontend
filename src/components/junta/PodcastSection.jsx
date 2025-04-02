import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  getPodcast,
  updatePodcastRequest,
  deletePodcastRequest,
  createPodcastRequest,
} from "@/actions/podcast";
import Swal from "sweetalert2";

function PodcastSection() {
  const [podcast, setPodcast] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchPodcast = async () => {
    const [error, podcast] = await getPodcast();
    if (error) {
      console.error("Error fetching podcasts:", error);
      return;
    }
    setPodcast(podcast);
  };

  useEffect(() => {
    fetchPodcast();
  }, []);

  const filteredPodcast = podcast.filter((pod) =>
    pod.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPodcast = filteredPodcast.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPodcast.length / itemsPerPage);

  const handleEditPodcast = (id, field, value) => {
    setPodcast(podcast.map((pod) => (pod.id === id ? { ...pod, [field]: value } : pod)));
  };

  const handleSavePodcast = async (id) => {
    const podcastToUpdate = podcast.find((pod) => pod.id === id);
    if (!podcastToUpdate) return;
    const updatedData = { nombre: podcastToUpdate.nombre, link: podcastToUpdate.link };
    const [error, updatedPodcast] = await updatePodcastRequest({ id, podcast: updatedData });
    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el podcast." });
      return;
    }
    setPodcast((prev) => prev.map((pod) => (pod.id === id ? { ...pod, ...updatedPodcast } : pod)));
    setEditingId(null);
    void Swal.fire({ icon: "success", title: "Éxito", text: "Podcast actualizado correctamente." });
  };

  const handleDeletePodcast = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;
    const [error] = await deletePodcastRequest({ id });
    if (error) {
      await Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el podcast." });
      return;
    }
    setPodcast((prev) => prev.filter((pod) => pod.id !== id));
    await Swal.fire({ icon: "success", title: "Eliminado", text: "Podcast eliminado con éxito." });
  };

  const handleCreatePodcast = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Podcast",
      html:
        '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
        '<input id="link" class="swal2-input" placeholder="Link">',
      focusConfirm: false,
      preConfirm: () => ({
        nombre: document.getElementById("nombre").value,
        link: document.getElementById("link").value,
      }),
    });
    if (formValues) {
      const [error, newPodcast] = await createPodcastRequest(formValues);
      if (error) {
        void Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el podcast." });
        return;
      }
      setPodcast((prev) => [...prev, newPodcast]);
      void Swal.fire({ icon: "success", title: "Éxito", text: "Podcast creado correctamente." });
    }
  };

  return (
    <div className="p-8 overflow-auto">
      <h2 className="text-[50px] font-light mb-8 text-accent">Podcast</h2>
      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar podcasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleCreatePodcast}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Crear Podcast
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3 font-normal text-gray-400">ID</th>
              <th className="pb-3 font-normal text-gray-400">Nombre</th>
              <th className="pb-3 font-normal text-gray-400">Link</th>
              <th className="pb-3 font-normal text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPodcast.map((pod) => (
              <tr key={pod.id} className="border-b last:border-b-0">
                <td className="py-4 pr-4">{pod.id}</td>
                <td className="py-4 pr-4">
                  {editingId === pod.id ? (
                    <input
                      type="text"
                      value={pod.nombre}
                      onChange={(e) => handleEditPodcast(pod.id, "nombre", e.target.value)}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    pod.nombre
                  )}
                </td>
                <td className="py-4 pr-4">
                  {editingId === pod.id ? (
                    <input
                      type="text"
                      value={pod.link}
                      onChange={(e) => handleEditPodcast(pod.id, "link", e.target.value)}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <a
                      href={pod.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {pod.link}
                    </a>
                  )}
                </td>
                <td className="py-4">
                  {editingId === pod.id ? (
                    <>
                      <button
                        onClick={() => handleSavePodcast(pod.id)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(pod.id)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePodcast(pod.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default PodcastSection;