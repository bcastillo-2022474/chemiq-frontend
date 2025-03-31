import { Edit, Trash2 } from "lucide-react";

export const PodcastTable = ({ podcasts, onEdit, onDelete }) => {
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
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {podcasts.map((podcast) => {
                const embedUrl = getYouTubeEmbedUrl(podcast.link);
                return (
                  <tr key={podcast.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {podcast.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onEdit(podcast)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Editar"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => onDelete(podcast.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
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