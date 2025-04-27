"use client"

import { useState, useEffect } from "react"
import { X, Calendar, User, Youtube } from "lucide-react"
import { BASE_URL } from "@/lib/constants"

export default function ProjectModal({ isOpen, onClose, projectId }) {
  const [animateIn, setAnimateIn] = useState(false)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      // Pequeño retraso para permitir que la animación se ejecute
      setTimeout(() => setAnimateIn(true), 50)
    } else {
      setAnimateIn(false)
    }
  }, [isOpen])

  // Cargar datos del proyecto cuando se abre el modal
  useEffect(() => {
    if (isOpen && projectId) {
      const fetchProjectDetails = async () => {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch(`${BASE_URL}/api/proyects/${projectId}`)
          if (!response.ok) {
            throw new Error("No se pudo cargar el proyecto")
          }
          const data = await response.json()
          setProject(data)
        } catch (err) {
          console.error("Error al cargar el proyecto:", err)
          setError("No se pudo cargar la información del proyecto")
        } finally {
          setLoading(false)
        }
      }

      fetchProjectDetails()
    }
  }, [isOpen, projectId])

  if (!isOpen) return null

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando información del proyecto...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si ocurre
  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  // Si no hay proyecto, mostrar mensaje
  if (!project) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md text-center">
          <p className="text-gray-700 mb-4">No se encontró información del proyecto</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  // Formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Extraer ID del video de YouTube
  const getYoutubeEmbedUrl = (youtubeUrl) => {
    if (!youtubeUrl) return null

    // Intentar extraer el ID del video de diferentes formatos de URL de YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = youtubeUrl.match(regExp)

    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(project.youtube)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-300"
      style={{ opacity: animateIn ? 1 : 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-xl shadow-2xl transition-all duration-500 ${animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        {/* Header con imagen de fondo */}
        <div className="relative h-72 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70 z-10"></div>
          <img
            src={project.img || "/placeholder.svg"}
            alt={project.nombre}
            className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />

          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors duration-300"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </button>

          {/* Título superpuesto en la imagen */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{project.nombre}</h2>
            <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(project.created_at)}
              </div>
              {project.count_members && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {project.count_members}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8">

          {/* Información del proyecto */}
          <div className="prose prose-lg max-w-none mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Información</h3>
            <p className="text-lg leading-relaxed">{project.informacion}</p>
          </div>

          {/* Video de YouTube si existe */}
          {youtubeEmbedUrl && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-600" />
                Video del proyecto
              </h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={youtubeEmbedUrl}
                  title={project.nombre}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

