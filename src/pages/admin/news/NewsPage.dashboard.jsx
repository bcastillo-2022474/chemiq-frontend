import { useState, useEffect } from "react"
import { Grid, List } from "lucide-react"
import { getColors } from "@/actions/personalization.js"
import { NewsGrid } from "@/pages/admin/news/NewsGridView.jsx";
import { NewsListView } from "@/pages/admin/news/NewsListView.jsx";

export function NewsTable({ news, onEdit, onDelete }) {
  const [theme, setTheme] = useState({
    colors: {},
  })
  const [viewMode, setViewMode] = useState("grid") // 'grid' or 'list'

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

  return (
    <div className="w-full">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold" style={{ color: theme.colors.Accent || "#505050" }}>
            Gestión de Noticias
          </h2>
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: theme.colors.Primary + "20" || "#fc500020",
              color: theme.colors.Primary || "#fc5000",
            }}
          >
            {news.length} {news.length === 1 ? "noticia" : "noticias"}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg p-1" style={{ backgroundColor: theme.colors.Tertiary + "20" || "#5f5f5f20" }}>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all duration-200 ${viewMode === "grid" ? "shadow-sm" : ""}`}
            style={{
              backgroundColor: viewMode === "grid" ? theme.colors.Primary || "#fc5000" : "transparent",
              color: viewMode === "grid" ? theme.colors.Secondary || "#e4e4e4" : theme.colors.Tertiary || "#5f5f5f",
            }}
            title="Vista de cuadrícula"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all duration-200 ${viewMode === "list" ? "shadow-sm" : ""}`}
            style={{
              backgroundColor: viewMode === "list" ? theme.colors.Primary || "#fc5000" : "transparent",
              color: viewMode === "list" ? theme.colors.Secondary || "#e4e4e4" : theme.colors.Tertiary || "#5f5f5f",
            }}
            title="Vista de lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <NewsGrid news={news} onEdit={onEdit} onDelete={onDelete} />
      ) : (
        <NewsListView news={news} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  )
}
