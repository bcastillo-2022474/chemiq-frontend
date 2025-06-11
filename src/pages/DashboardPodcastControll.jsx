import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal } from "../components/ui/DashboardModalEditUsers";
import { PodcastTable } from "../components/ui/DashboardTablePodcasts";
import { CreatePodcastForm } from "../components/ui/CreatePodcastForm";
import { EditPodcastForm } from "../components/ui/EditPodcastForm";
import { usePodcasts } from "../hooks/usePodcasts";
import LoaderCustom from "../components/ui/LoaderCustom";
import { getColors } from "@/actions/personalization";

export default function PodcastHome() {
  const {
    podcasts,
    loading,
    error,
    createPodcast,
    updatePodcast,
    deletePodcast
  } = usePodcasts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  });

  const fetchColors = async () => {
    const [error, colors] = await getColors();
    if (error) {
      console.error("Error fetching colors:", error);
      return;
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    );
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }));
    console.log("Fetched colors:", formattedColors);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  // Manejador para crear nuevo podcast
  const handleCreate = async (podcastData) => {
    try {
      const [error] = await createPodcast(podcastData);
      if (!error) {
        setIsCreateModalOpen(false);
        Swal.fire({
          title: "¡Éxito!",
          text: "El podcast ha sido creado correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: theme.colors.Primary || '#fc5000'
        });
      } else {
        throw new Error(error);
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el podcast",
        icon: "error",
        confirmButtonColor: theme.colors.Primary || '#fc5000'
      });
    }
  };

  // Manejador para editar
  const handleEdit = podcast => {
    setEditingPodcast(podcast);
    setIsModalOpen(true);
  };

  // Manejador para eliminar
  const handleDelete = async (podcastId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.colors.Primary || '#fc5000',
      cancelButtonColor: theme.colors.Tertiary || '#5f5f5f',
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const [error] = await deletePodcast(podcastId);
        if (!error) {
          Swal.fire({
            title: "¡Eliminado!",
            text: "El podcast ha sido eliminado correctamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            confirmButtonColor: theme.colors.Primary || '#fc5000'
          });
        } else {
          throw new Error(error);
        }
      } catch {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el podcast",
          icon: "error",
          confirmButtonColor: theme.colors.Primary || '#fc5000'
        });
      }
    }
  };

  // Manejador para guardar cambios
  const handleSave = async (updatedPodcast) => {
    try {
      const [error] = await updatePodcast(updatedPodcast.id, updatedPodcast);
      if (!error) {
        setIsModalOpen(false);
        setEditingPodcast(null);
        Swal.fire({
          title: "¡Éxito!",
          text: "El podcast ha sido actualizado correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: theme.colors.Primary || '#fc5000'
        });
      } else {
        throw new Error(error);
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el podcast",
        icon: "error",
        confirmButtonColor: theme.colors.Primary || '#fc5000'
      });
    }
  };

  // Manejador para cerrar modales
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsCreateModalOpen(false);
    setEditingPodcast(null);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center" style={{ color: theme.colors.Primary || '#fc5000' }}>
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-8" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
      {/* Header con título y botón de crear */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.colors.Accent || '#505050' }}>
          Gestión de Podcasts
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
          style={{
            backgroundColor: theme.colors.Primary || '#fc5000',
            color: theme.colors.Secondary || '#e4e4e4'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.Accent || '#505050';
            e.target.style.color = theme.colors.Secondary || '#e4e4e4';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.Primary || '#fc5000';
            e.target.style.color = theme.colors.Secondary || '#e4e4e4';
          }}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          Crear Nuevo Podcast
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <LoaderCustom />
      ) : (
        /* Tabla de podcasts */
        <div className="rounded-lg shadow" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
          <PodcastTable 
            podcasts={podcasts} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      )}

      {/* Modal para editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModals}
        title="Editar Podcast"
      >
        {editingPodcast && (
          <EditPodcastForm
            podcast={editingPodcast}
            onSave={handleSave}
            onCancel={handleCloseModals}
          />
        )}
      </Modal>

      {/* Modal para crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        title="Crear Nuevo Podcast"
      >
        <CreatePodcastForm
          onSubmit={handleCreate}
          onCancel={handleCloseModals}
        />
      </Modal>
    </main>
  );
}