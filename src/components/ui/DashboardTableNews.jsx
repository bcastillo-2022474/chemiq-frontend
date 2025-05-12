import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { getColors } from "@/actions/personalization";

export const NewsTable = ({ news, onEdit, onDelete }) => {
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-md shadow-sm" style={{ backgroundColor: theme.colors.Background || '#fff8f0', borderColor: theme.colors.Tertiary || '#5f5f5f' }}>
        <thead style={{ backgroundColor: '#f5e8df' }}>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: theme.colors.Accent || '#505050' }}>
              Image
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: theme.colors.Accent || '#505050' }}>
              Título
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: theme.colors.Accent || '#505050' }}>
              Contenido
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider" style={{ color: theme.colors.Accent || '#505050' }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: theme.colors.Tertiary || '#5f5f5f' }}>
          {news.map((newsItem) => (
            <tr
              key={newsItem.id}
              className="transition-colors"
              style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5e8df'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.Background || '#fff8f0'}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <img src={newsItem.img || "/placeholder.svg"} alt={newsItem.titulo} className="w-[160px] rounded-lg object-cover mr-4" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                {newsItem.titulo}
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: theme.colors.Tertiary || '#5f5f5f', width: "140ch" }}>
                {newsItem.contenido}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(newsItem)}
                  className="mr-4"
                  title="Editar"
                  style={{ color: theme.colors.Primary || '#fc5000' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.Accent || '#505050'}
                  onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.Primary || '#fc5000'}
                >
                  <Edit />
                </button>
                <button
                  onClick={() => onDelete(newsItem.id)}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};