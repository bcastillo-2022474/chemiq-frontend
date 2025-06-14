import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { AddNewsModal } from "@/components/modals/new/NewsModal.jsx";
import { useNews } from "../hooks/useNews";
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

  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [theme, setTheme] = useState({ colors: {} });

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
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleCreateNews = async (data) => {
    const newNews = {
      titulo: data.titulo,
      contenido: data.contenido,
      img: data.img,
      tipo: data.tipo,
    };

    const success = await createNews(newNews);
    if (success) {
      Swal.fire({
        title: "¡Éxito!",
        text: "La noticia ha sido creada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        confirmButtonColor: theme.colors.Primary || '#fc5000'
      });
    }
    return success;
  };

  const handleEdit = newsItem => {
    setEditingNews(newsItem);
    setIsEditModalOpen(true);
  };

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

  const handleSave = async (updatedNews) => {
    try {
      const success = await updateNews(editingNews.id, updatedNews);
      if (success) {
        setIsEditModalOpen(false);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.colors.Accent || '#505050' }}>
          Gestión de Noticias
        </h1>
        <button
          onClick={() => setIsAddNewsModalOpen(true)}
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

      {loading ? (
        <LoaderCustom/>
      ) : (
        <div className="rounded-lg shadow" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
          <NewsTable
            news={news}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* New Modal Pattern */}
      {isAddNewsModalOpen && (
        <AddNewsModal
          defaultValues={null}
          onSubmit={handleCreateNews}
          onClose={() => setIsAddNewsModalOpen(false)}
        />
      )}

      {/* Keep existing edit modal for now */}
      {isEditModalOpen && (
        <AddNewsModal
          defaultValues={editingNews}
          onSubmit={handleSave}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingNews(null);
          }}
        />
      )}
    </main>
  );
}