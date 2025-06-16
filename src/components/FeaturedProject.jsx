"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users, Calendar, Play, ExternalLink, Clock } from "lucide-react"
import { getProjectsRequest } from "@/actions/projects"
import { getColors } from "@/actions/personalization"

export function FeaturedProject({ onOpenModal }) {
  const [project, setProject] = useState(null)
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
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
    console.log("Fetched colors:", formattedColors)
  }

  useEffect(() => {
    fetchColors()
    const fetchProject = async () => {
      const [error, projects] = await getProjectsRequest()
      if (!error && projects?.length) {
        setProject(projects[projects.length - 1])
      }
    }
    fetchProject()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTimeAgo = (dateString) => {
    if (!dateString) return ""
    const now = new Date()
    const date = new Date(dateString)
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Hoy"
    if (diffInDays === 1) return "Ayer"
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
    return `Hace ${Math.floor(diffInDays / 30)} meses`
  }

  const handleYouTubeClick = (e) => {
    e.stopPropagation()
    if (project?.youtube) {
      window.open(project.youtube, "_blank", "noopener,noreferrer")
    }
  }

  if (!project) {
    return (
      <Card
        className="h-[500px] animate-pulse relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.Background || "#fff8f0"}, ${theme.colors.Secondary || "#e4e4e4"}20)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        <div className="relative h-64 bg-gray-300" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded" />
            <div className="h-3 bg-gray-300 rounded w-5/6" />
            <div className="h-3 bg-gray-300 rounded w-4/6" />
          </div>
        </div>
      </Card>
    )
  }

  const handleClick = () => {
    console.log("Abriendo modal para proyecto:", project)
    onOpenModal(project)
  }

  return (
    <Card
      className="group h-[500px] overflow-hidden hover:shadow-[0_8px_25px_rgba(95,95,95,0.15)] transition-all duration-500 cursor-pointer relative"
      style={{
        backgroundColor: theme.colors.Background || "#fff8f0",
        borderColor: `${theme.colors.Tertiary || "#5f5f5f"}30`,
      }}
      onClick={handleClick}
    >
      {/* Header con imagen y overlay */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={project.img || "/placeholder.svg?height=256&width=400"}
          alt={project.nombre || project.proyecto_nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badge de tiempo */}
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
          style={{
            backgroundColor: `${theme.colors.Background || "#fff8f0"}90`,
            color: theme.colors.Tertiary || "#5f5f5f",
          }}
        >
          <Clock className="inline h-3 w-3 mr-1" />
          {formatTimeAgo(project.created_at)}
        </div>

        {/* Botón de YouTube */}
        {project.youtube && (
          <button
            onClick={handleYouTubeClick}
            className="absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 group/youtube"
            style={{
              backgroundColor: `${theme.colors.Primary || "#fc5000"}20`,
              border: `1px solid ${theme.colors.Primary || "#fc5000"}40`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.Primary || "#fc5000"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.Primary || "#fc5000"}20`
            }}
          >
            <Play
              className="h-4 w-4 transition-colors duration-300 group-hover/youtube:text-white"
              style={{ color: theme.colors.Primary || "#fc5000" }}
              fill="currentColor"
            />
          </button>
        )}

        {/* Título superpuesto */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3
            className="text-2xl font-bold mb-2 line-clamp-2 drop-shadow-lg"
            style={{ color: theme.colors.Secondary || "#e4e4e4" }}
          >
            {project.nombre || project.proyecto_nombre}
          </h3>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Metadatos */}
        <div
          className="flex items-center gap-4 text-sm flex-wrap"
          style={{ color: theme.colors.Tertiary || "#5f5f5f" }}
        >
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" style={{ color: theme.colors.Primary || "#fc5000" }} />
            {formatDate(project.created_at)}
          </span>
          {project.count_members && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" style={{ color: theme.colors.Primary || "#fc5000" }} />
              {project.count_members} miembros
            </span>
          )}
        </div>

        {/* Descripción */}
        <p
          className="text-sm leading-relaxed line-clamp-3 flex-1"
          style={{ color: theme.colors.Tertiary || "#5f5f5f" }}
        >
          {project.informacion}
        </p>

        {/* Footer con acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md"
            style={{
              backgroundColor: `${theme.colors.Primary || "#fc5000"}10`,
              color: theme.colors.Primary || "#fc5000",
              border: `1px solid ${theme.colors.Primary || "#fc5000"}20`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.Primary || "#fc5000"
              e.currentTarget.style.color = theme.colors.Background || "#fff8f0"
              e.currentTarget.style.transform = "translateY(-1px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.colors.Primary || "#fc5000"}10`
              e.currentTarget.style.color = theme.colors.Primary || "#fc5000"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Ver detalles
          </span>

          {project.youtube && (
            <button
              onClick={handleYouTubeClick}
              className="text-xs px-3 py-1 rounded-full transition-all duration-300 hover:shadow-sm"
              style={{
                backgroundColor: `${theme.colors.Secondary || "#e4e4e4"}20`,
                color: theme.colors.Tertiary || "#5f5f5f",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.colors.Secondary || "#e4e4e4"}40`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.colors.Secondary || "#e4e4e4"}20`
              }}
            >
              YouTube
            </button>
          )}
        </div>
      </div>

      {/* Efecto de hover en el borde */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.Primary || "#fc5000"}20, ${theme.colors.Secondary || "#e4e4e4"}20)`,
          padding: "1px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
        }}
      />
    </Card>
  )
}
