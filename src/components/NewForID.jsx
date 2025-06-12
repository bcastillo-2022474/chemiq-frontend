"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { LoadingBeaker } from "@/components/LoadingBeaker"
import { getNewByIdRequest } from "../actions/news"
import { Calendar, Clock, ArrowLeft, ExternalLink, AlertCircle, Share2 } from "lucide-react"

export function NewsDetail() {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showShareMessage, setShowShareMessage] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const [error, data] = await getNewByIdRequest({ id })

        if (error) {
          throw new Error("Failed to fetch news")
        }

        setNews(data)

        // Set page title
        document.title = `${data.titulo} | Noticias`
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()

    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [id])

  // Function to parse and format the ISO 8601 date
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

  // Extract reading time from content
  const getReadingTime = (content) => {
    if (!content) return "1 min"
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200) // Average reading speed
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
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      setShowShareMessage(true)
      setTimeout(() => setShowShareMessage(false), 3000)
    }
  }

  if (isLoading) {
    return <LoadingBeaker />
  }

  if (error || !news) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-white/80">{error || "No se encontró la noticia"}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
        </div>
      </div>
    )
  }

  // Check if content is a URL
  const isContentUrl = news.contenido && /^https?:\/\//.test(news.contenido)

  // Extract first paragraph for summary
  const getSummary = () => {
    if (!news.contenido || isContentUrl) return ""

    // Try to extract first paragraph from HTML
    const match = news.contenido.match(/<p>(.*?)<\/p>/)
    if (match && match[1]) {
      // Remove HTML tags
      return match[1].replace(/<\/?[^>]+(>|$)/g, "")
    }

    // Fallback to first 150 characters
    return news.contenido.substring(0, 150).replace(/<\/?[^>]+(>|$)/g, "") + "..."
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a noticias
        </button>
        <div className="flex justify-end w-full px-5">
    <button
      onClick={handleShare}
      className="inline-flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <Share2 className="w-4 h-4 mr-2" />
      Compartir
    </button>
</div>

      </div>
      

      {/* Article container */}
      <article className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
        {/* Hero Image */}
        <div className="relative">
          <img
            src={news.img || "/placeholder.svg"}
            alt={news.titulo}
            className="w-full object-cover h-64 md:h-96"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          {/* Category badge and reading time */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-[#28BC98] text-white text-xs font-medium px-2.5 py-1 rounded-full">Noticia</span>
            <span className="bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {getReadingTime(news.contenido)}
            </span>
          </div>

          {/* Title and metadata */}
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">{news.titulo}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              {news.created_at && (
                <span className="text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Publicado: {formatDateTime(news.created_at)}
                </span>
              )}
              {news.updated_at && news.updated_at !== news.created_at && (
                <span className="text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Actualizado: {formatDateTime(news.updated_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Summary - only if we have non-URL content */}
          {!isContentUrl && getSummary() && (
            <div className="bg-[#28BC98]/5 border-l-4 border-[#28BC98] p-4 mb-6 rounded-r-lg">
              <p className="text-lg text-gray-700 italic font-light">{getSummary()}</p>
            </div>
          )}

          {/* Main content */}
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {isContentUrl ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-gray-50 p-6 rounded-xl w-full mb-6 text-center">
                  <p className="text-lg mb-6">Para más información, visita el siguiente enlace:</p>
                  <a
                    href={news.contenido}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#28BC98] text-white rounded-lg hover:bg-[#22a484] transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visitar enlace
                  </a>
                  <p className="text-sm text-gray-500 mt-6 break-all">{news.contenido}</p>
                </div>
              </div>
            ) : (
              <div className="text-gray-700">
                {news.contenido ? (
                  <div dangerouslySetInnerHTML={{ __html: news.contenido }} />
                ) : (
                  <p className="text-center text-gray-500 italic py-8">
                    No hay contenido disponible para esta noticia.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Action buttons */}
      <div className="mt-8 flex justify-between items-center">

        <div className="relative">

          {/* Share message toast */}
          {showShareMessage && (
            <div className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-sm py-2 px-3 rounded shadow-lg whitespace-nowrap">
              Enlace copiado al portapapeles
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
