import { useState, useEffect } from "react"
import { Calendar, Users, Play, ExternalLink, X, Clock } from 'lucide-react'

export function ProjectModal2({ project, isOpen, onClose, theme }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setImageLoaded(false)
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

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

  const handleYouTubeClick = () => {
    if (project?.youtube) {
      window.open(project.youtube, "_blank", "noopener,noreferrer")
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen || !project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300"
      style={{ backgroundColor: `${theme.colors.Tertiary || "#5f5f5f"}90` }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}
      >
        {/* Header con imagen */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={project.img || "/placeholder.svg?height=320&width=800"}
            alt={project.nombre || project.proyecto_nombre}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? "scale-100 blur-0" : "scale-110 blur-sm"
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm hover:scale-110 transition-all duration-300 border-0 bg-white/20 text-white hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Badge de tiempo */}
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
            style={{
              backgroundColor: `${theme.colors.Background || "#fff8f0"}90`,
              color: theme.colors.Tertiary || "#5f5f5f",
            }}
          >
            <Clock className="inline h-4 w-4 mr-1" />
            {formatTimeAgo(project.created_at)}
          </div>

          {/* Título y metadatos superpuestos */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1
              className="text-4xl font-bold mb-4 drop-shadow-lg"
              style={{ color: theme.colors.Secondary || "#e4e4e4" }}
            >
              {project.nombre || project.proyecto_nombre}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span
                className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: `${theme.colors.Background || "#fff8f0"}20`,
                  color: theme.colors.Secondary || "#e4e4e4",
                }}
              >
                <Calendar className="h-4 w-4" />
                {formatDate(project.created_at)}
              </span>

              {project.count_members && (
                <span
                  className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm"
                  style={{
                    backgroundColor: `${theme.colors.Background || "#fff8f0"}20`,
                    color: theme.colors.Secondary || "#e4e4e4",
                  }}
                >
                  <Users className="h-4 w-4" />
                  {project.count_members} miembros
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="max-h-[calc(95vh-320px)] overflow-y-auto">
          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contenido principal */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4" style={{ color: theme.colors.Accent || "#505050" }}>
                    Descripción del Proyecto
                  </h2>
                  <p className="text-lg leading-relaxed" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
                    {project.informacion}
                  </p>
                </div>

                {/* Acciones principales */}
                <div className="flex flex-wrap gap-4">
                  {project.youtube && (
                    <button
                      onClick={handleYouTubeClick}
                      className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg border-0"
                      style={{
                        backgroundColor: theme.colors.Primary || "#fc5000",
                        color: theme.colors.Background || "#fff8f0",
                      }}
                    >
                      <Play className="h-5 w-5" fill="currentColor" />
                      Ver en YouTube
                    </button>
                  )}

                  <button
                    className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 border-2"
                    style={{
                      borderColor: theme.colors.Primary || "#fc5000",
                      color: theme.colors.Primary || "#fc5000",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.Primary || "#fc5000"
                      e.currentTarget.style.color = theme.colors.Background || "#fff8f0"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color = theme.colors.Primary || "#fc5000"
                    }}
                  >
                    <ExternalLink className="h-5 w-5" />
                    Más información
                  </button>
                </div>
              </div>

              {/* Sidebar con información adicional */}
              <div className="space-y-6">
                {/* Card de información */}
                <div
                  className="p-6 rounded-xl border"
                  style={{
                    backgroundColor: `${theme.colors.Secondary || "#e4e4e4"}10`,
                    borderColor: `${theme.colors.Secondary || "#e4e4e4"}20`,
                  }}
                >
                  <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.Accent || "#505050" }}>
                    Detalles del Proyecto
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
                        Fecha de creación
                      </span>
                      <span className="text-sm" style={{ color: theme.colors.Accent || "#505050" }}>
                        {formatDate(project.created_at)}
                      </span>
                    </div>

                    {project.updated_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
                          Última actualización
                        </span>
                        <span className="text-sm" style={{ color: theme.colors.Accent || "#505050" }}>
                          {formatDate(project.updated_at)}
                        </span>
                      </div>
                    )}

                    {project.count_members && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
                          Miembros del equipo
                        </span>
                        <span className="text-sm font-semibold" style={{ color: theme.colors.Primary || "#fc5000" }}>
                          {project.count_members}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enlaces rápidos */}
                {project.youtube && (
                  <div
                    className="p-6 rounded-xl border"
                    style={{
                      backgroundColor: `${theme.colors.Primary || "#fc5000"}10`,
                      borderColor: `${theme.colors.Primary || "#fc5000"}20`,
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.Accent || "#505050" }}>
                      Recursos
                    </h3>

                    <button
                      onClick={handleYouTubeClick}
                      className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-105 border-0"
                      style={{
                        backgroundColor: `${theme.colors.Primary || "#fc5000"}20`,
                        color: theme.colors.Primary || "#fc5000",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.Primary || "#fc5000"
                        e.currentTarget.style.color = theme.colors.Background || "#fff8f0"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.colors.Primary || "#fc5000"}20`
                        e.currentTarget.style.color = theme.colors.Primary || "#fc5000"
                      }}
                    >
                      <Play className="h-5 w-5" fill="currentColor" />
                      <span className="font-medium">Video del proyecto</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
