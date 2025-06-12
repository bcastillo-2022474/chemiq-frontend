import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal } from "../components/ui/DashboardModalEditUsers";
import { CreateNewsForm } from "../components/ui/CreateNewsForm";
import { useNews } from "../hooks/useNews";
import { EditNewsForm } from "../components/EditNewsForm";
import LoaderCustom from "../components/ui/LoaderCustom";
import { getColors } from "@/actions/personalization";
import { NewsTable } from "@/pages/admin/news/NewsPage.dashboard.jsx";

export default function NewsHome() {
  const {
    news,
    loading,
    error,
    createNews,
    updateNews,
    deleteNews
  } = useNews();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
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

  // Manejador para crear nueva noticia
  const handleCreate = async (newsData) => {
    try {
      const success = await createNews(newsData);
      if (success) {
        setIsCreateModalOpen(false);
        Swal.fire({
          title: "¡Éxito!",
          text: "La noticia ha sido creada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: theme.colors.Primary || '#fc5000'
        });
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo crear la noticia",
        icon: "error",
        confirmButtonColor: theme.colors.Primary || '#fc5000'
      });
    }
  };

  // Manejador para abrir el modal de edición
  const handleEdit = newsItem => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  };

  // Manejador para eliminar noticia
  const handleDelete = async (newsId) => {
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
        const success = await deleteNews(newsId);
        if (success) {
          Swal.fire({
            title: "¡Eliminado!",
            text: "La noticia ha sido eliminada correctamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            confirmButtonColor: theme.colors.Primary || '#fc5000'
          });
        }
      } catch {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la noticia",
          icon: "error",
          confirmButtonColor: theme.colors.Primary || '#fc5000'
        });
      }
    }
  };

  // Manejador para guardar cambios en la edición
  const handleSave = async (updatedNews) => {
    try {
      const success = await updateNews(updatedNews.id, updatedNews);
      if (success) {
        setIsModalOpen(false);
        setEditingNews(null);
        Swal.fire({
          title: "¡Éxito!",
          text: "La noticia ha sido actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: theme.colors.Primary || '#fc5000'
        });
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la noticia",
        icon: "error",
        confirmButtonColor: theme.colors.Primary || '#fc5000'
      });
    }
  };

  // Manejador para cerrar modales
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsCreateModalOpen(false);
    setEditingNews(null);
  };

  // Renderizado condicional para error
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
          Gestión de Noticias
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
          Crear Nueva Noticia
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <LoaderCustom />
      ) : (
        /* Tabla de noticias */
        <div className="rounded-lg shadow" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
          <NewsTable 
            news={news} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      )}

      {/* Modal para editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModals}
        title="Editar Noticia"
      >
        {editingNews && (
          <EditNewsForm
            news={editingNews}
            onSave={handleSave}
            onCancel={handleCloseModals}
          />
        )}
      </Modal>

      {/* Modal para crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        title="Crear Nueva Noticia"
      >
        <CreateNewsForm
          onSubmit={handleCreate}
          onCancel={handleCloseModals}
        />
      </Modal>
    </main>
  );
}