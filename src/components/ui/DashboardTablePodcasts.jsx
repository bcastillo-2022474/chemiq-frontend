import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { getColors } from "@/actions/personalization";

export const PodcastTable = ({ podcasts, onEdit, onDelete }) => {
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

  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      let videoId = "";
  
      // Para URLs de shorts: youtube.com/shorts/ID
      if (urlObj.pathname.startsWith("/shorts/")) {
        videoId = urlObj.pathname.split("/shorts/")[1];
      }
      // Para URLs estándar: youtube.com/watch?v=ID
      else if (urlObj.searchParams.has("v")) {
        videoId = urlObj.searchParams.get("v");
      }
      // Para URLs cortas: youtu.be/ID
      else if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      }
  
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    } catch (error) {
      console.error("URL de YouTube inválida:", error);
      return "";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-md shadow-sm" style={{ backgroundColor: theme.colors.Background || '#fff8f0', borderColor: theme.colors.Tertiary || '#5f5f5f' }}>
        <thead style={{ backgroundColor: '#f5e8df' }}>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: theme.colors.Accent || '#505050' }}>
              Link
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: theme.colors.Accent || '#505050' }}>
              Título
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: theme.colors.Accent || '#505050' }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: theme.colors.Tertiary || '#5f5f5f' }}>
          {podcasts.map((podcast) => {
            const embedUrl = getYouTubeEmbedUrl(podcast.link);
            return (
              <tr
                key={podcast.id}
                className="transition-colors"
                style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5e8df'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.Background || '#fff8f0'}
              >
                <td className="px-6 py-4 text-sm" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {embedUrl ? (
                    <iframe
                      width="400"
                      height="200"
                      src={embedUrl}
                      title={podcast.nombre}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <span>Link inválido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                  {podcast.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(podcast)}
                    className="mr-4"
                    title="Editar"
                    style={{ color: theme.colors.Primary || '#fc5000' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.Accent || '#505050'}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.Primary || '#fc5000'}
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => onDelete(podcast.id)}
                    className=""
                    title="Eliminar"
                    style={{ color: theme.colors.Primary || '#fc5000' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.Accent || '#505050'}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.Primary || '#fc5000'}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};