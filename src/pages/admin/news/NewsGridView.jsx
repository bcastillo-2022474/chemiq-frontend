"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Calendar, Eye } from "lucide-react"
import { getColors } from "@/actions/personalization"

export function NewsGrid({ news, onEdit, onDelete }) {
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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  return (
    <div className="w-full">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {news.map((newsItem) => (
          <div
            key={newsItem.id}
            className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}
          >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={newsItem.img || "/placeholder.svg?height=200&width=400"}
                alt={newsItem.titulo}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => onEdit(newsItem)}
                  className="p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: theme.colors.Primary || "#fc5000" }}
                  title="Editar noticia"
                >
                  <Edit className="w-4 h-4" style={{ color: theme.colors.Secondary || "#e4e4e4" }} />
                </button>
                <button
                  onClick={() => onDelete(newsItem.id)}
                  className="p-2 rounded-full bg-red-500 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-red-600"
                  title="Eliminar noticia"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Title */}
              <h3
                className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-opacity-80 transition-colors"
                style={{ color: theme.colors.Accent || "#505050" }}
              >
                {newsItem.titulo}
              </h3>

              {/* Content Preview */}
              <p
                className="text-sm leading-relaxed mb-4 line-clamp-4"
                style={{ color: theme.colors.Tertiary || "#5f5f5f" }}
              >
                {truncateText(newsItem.contenido)}
              </p>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-4 border-t border-opacity-20"
                style={{ borderColor: theme.colors.Tertiary || "#5f5f5f" }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: theme.colors.Tertiary || "#5f5f5f" }} />
                  <span className="text-xs" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
                    {newsItem.fecha || "Fecha no disponible"}
                  </span>
                </div>

                <button
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: theme.colors.Primary + "20" || "#fc500020",
                    color: theme.colors.Primary || "#fc5000",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.Primary || "#fc5000"
                    e.target.style.color = theme.colors.Secondary || "#e4e4e4"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = theme.colors.Primary + "20" || "#fc500020"
                    e.target.style.color = theme.colors.Primary || "#fc5000"
                  }}
                >
                  <Eye className="w-3 h-3" />
                  Leer más
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
