"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Calendar, Eye } from "lucide-react"
import { getColors } from "@/actions/personalization"

export function NewsListView({ news, onEdit, onDelete }) {
  const [theme, setTheme] = useState({
    colors: {},
  })

  const fetchColors = async () => {
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      return
    }
    const formattedColors = Object.fromEntries(colors.map((color) => [color.nombre, color.hex]))
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
  }

  useEffect(() => {
    fetchColors()
  }, [])

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  return (
    <div className="w-full space-y-4">
      {news.map((newsItem) => (
        <div
          key={newsItem.id}
          className="group flex flex-col md:flex-row gap-6 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}
        >
          {/* Image Section */}
          <div className="relative flex-shrink-0 w-full md:w-80 h-48 md:h-32 overflow-hidden rounded-xl">
            <img
              src={newsItem.img || "/placeholder.svg?height=200&width=320"}
              alt={newsItem.titulo}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2" style={{ color: theme.colors.Accent || "#505050" }}>
                {newsItem.titulo}
              </h3>
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
                {truncateText(newsItem.contenido)}
              </p>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between mt-4 pt-4 border-t border-opacity-20"
              style={{ borderColor: theme.colors.Tertiary || "#5f5f5f" }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: theme.colors.Tertiary || "#5f5f5f" }} />
                <span className="text-xs" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
                  {newsItem.fecha || "Fecha no disponible"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                  style={{
                    backgroundColor: theme.colors.Primary + "20" || "#fc500020",
                    color: theme.colors.Primary || "#fc5000",
                  }}
                >
                  <Eye className="w-3 h-3" />
                  Leer más
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(newsItem)}
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: theme.colors.Primary + "20" || "#fc500020",
                      color: theme.colors.Primary || "#fc5000",
                    }}
                    title="Editar noticia"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(newsItem.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-200"
                    title="Eliminar noticia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {news.length === 0 && (
        <div className="text-center py-16">
          <div
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: theme.colors.Tertiary + "20" || "#5f5f5f20" }}
          >
            <Calendar className="w-12 h-12" style={{ color: theme.colors.Tertiary || "#5f5f5f" }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.colors.Accent || "#505050" }}>
            No hay noticias disponibles
          </h3>
          <p className="text-sm" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
            Comienza creando tu primera noticia
          </p>
        </div>
      )}
    </div>
  )
}
