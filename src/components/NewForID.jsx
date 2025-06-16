"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { LoadingBeaker } from "@/components/LoadingBeaker"
import { getNewByIdRequest } from "../actions/news"
import { getColors } from "../actions/personalization"
import {
  Calendar,
  Clock,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Share2,
  Eye,
  Tag,
  Bookmark,
  Heart,
  MessageCircle,
} from "lucide-react"

export function NewsDetail() {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showShareMessage, setShowShareMessage] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
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

    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const [error, data] = await getNewByIdRequest({ id })

        if (error) {
          throw new Error("Failed to fetch news")
        }

        setNews(data)
        document.title = `${data.titulo} | Noticias`
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
    window.scrollTo(0, 0)
  }, [id])

  const formatDateTime = (dateString) => {
    if (!dateString) return "Fecha no disponible"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString
      }

      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
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

  const getReadingTime = (content) => {
    if (!content) return "1 min"
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min de lectura`
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news?.titulo || "Noticia",
          text: "Mira esta noticia interesante",
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error al compartir:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShowShareMessage(true)
      setTimeout(() => setShowShareMessage(false), 3000)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Aquí podrías agregar lógica para guardar en localStorage o base de datos
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // Aquí podrías agregar lógica para guardar el like
  }

  if (isLoading) {
    return <LoadingBeaker />
  }

  if (error || !news) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div
          className="text-center p-8 rounded-2xl border backdrop-blur-sm max-w-md w-full"
          style={{
            backgroundColor: `${theme.colors.Background || "#fff8f0"}90`,
            borderColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
          }}
        >
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: theme.colors.Primary || "#fc5000" }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.Accent || "#505050" }}>
            ¡Ups! Algo salió mal
          </h2>
          <p className="mb-6" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
            {error || "No se encontró la noticia"}
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: theme.colors.Primary || "#fc5000",
              color: theme.colors.Background || "#fff8f0",
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
        </div>
      </div>
    )
  }

  const isContentUrl = news.contenido && /^https?:\/\//.test(news.contenido)

  const getSummary = () => {
    if (!news.contenido || isContentUrl) return ""

    const match = news.contenido.match(/<p>(.*?)<\/p>/)
    if (match && match[1]) {
      return match[1].replace(/<\/?[^>]+(>|$)/g, "")
    }

    return news.contenido.substring(0, 200).replace(/<\/?[^>]+(>|$)/g, "") + "..."
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}>
      {/* Navigation Bar */}
      <div
        className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{
          backgroundColor: `${theme.colors.Background || "#fff8f0"}95`,
          borderColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105"
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
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a noticias
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isBookmarked ? "scale-110" : ""
                }`}
                style={{
                  backgroundColor: isBookmarked
                    ? theme.colors.Primary || "#fc5000"
                    : `${theme.colors.Secondary || "#e4e4e4"}20`,
                  color: isBookmarked ? theme.colors.Background || "#fff8f0" : theme.colors.Tertiary || "#5f5f5f",
                }}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: `${theme.colors.Secondary || "#e4e4e4"}20`,
                  color: theme.colors.Tertiary || "#5f5f5f",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.Primary || "#fc5000"
                  e.currentTarget.style.color = theme.colors.Background || "#fff8f0"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.colors.Secondary || "#e4e4e4"}20`
                  e.currentTarget.style.color = theme.colors.Tertiary || "#5f5f5f"
                }}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article container */}
        <article
          className="rounded-2xl overflow-hidden shadow-xl border"
          style={{
            backgroundColor: theme.colors.Background || "#fff8f0",
            borderColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
          }}
        >
          {/* Hero Image */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img
              src={news.img || "/placeholder.svg?height=500&width=800"}
              alt={news.titulo}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? "scale-100 blur-0" : "scale-110 blur-sm"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg?height=500&width=800"
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-3">
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm"
                style={{
                  backgroundColor: theme.colors.Primary || "#fc5000",
                  color: theme.colors.Background || "#fff8f0",
                }}
              >
                <Tag className="inline w-4 h-4 mr-1" />
                {news.tipo || "Noticia"}
              </span>

              <span className="bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {getReadingTime(news.contenido)}
              </span>

              <span className="bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatTimeAgo(news.created_at)}
              </span>
            </div>

            {/* Title and metadata */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {news.titulo}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <span className="text-sm flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Publicado: {formatDateTime(news.created_at)}
                </span>

                {news.updated_at && news.updated_at !== news.created_at && (
                  <span className="text-sm flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Actualizado: {formatDateTime(news.updated_at)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Summary */}
            {!isContentUrl && getSummary() && (
              <div
                className="border-l-4 p-6 mb-8 rounded-r-xl"
                style={{
                  backgroundColor: `${theme.colors.Primary || "#fc5000"}10`,
                  borderColor: theme.colors.Primary || "#fc5000",
                }}
              >
                <p
                  className="text-xl font-light italic leading-relaxed"
                  style={{ color: theme.colors.Accent || "#505050" }}
                >
                  {getSummary()}
                </p>
              </div>
            )}

            {/* Main content */}
            <div className="prose max-w-none leading-relaxed">
              {isContentUrl ? (
                <div className="text-center py-12">
                  <div
                    className="p-8 rounded-2xl mb-8 max-w-2xl mx-auto"
                    style={{ backgroundColor: `${theme.colors.Secondary || "#e4e4e4"}20` }}
                  >
                    <ExternalLink
                      className="w-16 h-16 mx-auto mb-6"
                      style={{ color: theme.colors.Primary || "#fc5000" }}
                    />
                    <p className="text-xl mb-8" style={{ color: theme.colors.Accent || "#505050" }}>
                      Para más información, visita el siguiente enlace:
                    </p>
                    <a
                      href={news.contenido}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: theme.colors.Primary || "#fc5000",
                        color: theme.colors.Background || "#fff8f0",
                      }}
                    >
                      <ExternalLink className="w-5 h-5" />
                      Visitar enlace
                    </a>
                    <p
                      className="text-sm mt-6 break-all opacity-60"
                      style={{ color: theme.colors.Tertiary || "#5f5f5f" }}
                    >
                      {news.contenido}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-lg leading-relaxed" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
                  {news.contenido ? (
                    <div dangerouslySetInnerHTML={{ __html: news.contenido }} />
                  ) : (
                    <p
                      className="text-center italic py-12 text-xl"
                      style={{ color: theme.colors.Tertiary || "#5f5f5f" }}
                    >
                      No hay contenido disponible para esta noticia.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Action Bar */}
        <div
          className="mt-8 p-6 rounded-2xl border flex items-center justify-between"
          style={{
            backgroundColor: theme.colors.Background || "#fff8f0",
            borderColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                isLiked ? "scale-105" : ""
              }`}
              style={{
                backgroundColor: isLiked
                  ? `${theme.colors.Primary || "#fc5000"}20`
                  : `${theme.colors.Secondary || "#e4e4e4"}20`,
                color: isLiked ? theme.colors.Primary || "#fc5000" : theme.colors.Tertiary || "#5f5f5f",
              }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{isLiked ? "Te gusta" : "Me gusta"}</span>
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105"
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
              <MessageCircle className="w-4 h-4" />
              <span>Comentar</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm" style={{ color: theme.colors.Tertiary || "#5f5f5f" }}>
            <Eye className="w-4 h-4" />
            <span>Vista detallada</span>
          </div>
        </div>

        {/* Share message toast */}
        {showShareMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
            <div
              className="px-6 py-3 rounded-full shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: theme.colors.Accent || "#505050",
                color: theme.colors.Background || "#fff8f0",
              }}
            >
              Enlace copiado al portapapeles
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
