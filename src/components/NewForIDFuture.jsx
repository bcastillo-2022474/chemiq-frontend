"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { getNewByIdRequest } from "../actions/news"
import {
  Calendar,
  Clock,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronUp,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Eye,
  MessageSquare,
  ThumbsUp,
  User,
  ChevronRight,
  Tag,
} from "lucide-react"

export function NewsDetail() {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [relatedNews, setRelatedNews] = useState([])
  const contentRef = useRef(null)
  const [viewCount] = useState(Math.floor(Math.random() * 500) + 100)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10)
  const [hasLiked, setHasLiked] = useState(false)

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const [error, data] = await getNewByIdRequest({ id })

        if (error) {
          throw new Error("Failed to fetch news")
        }

        setNews(data)

        // Generate mock related news
        generateMockRelatedNews(data.titulo)

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

    // Check if article is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedNews") || "[]")
    setIsBookmarked(bookmarks.includes(id))

    // Setup scroll listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [id])

  // Generate mock related news based on title
  const generateMockRelatedNews = (title) => {
    if (!title) return

    const words = title.split(" ").filter((word) => word.length > 3)
    const mockNews = []

    for (let i = 0; i < 3; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)]
      mockNews.push({
        id: `mock-${i}`,
        title: `Noticia relacionada con ${randomWord}`,
        date: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
        image: `/placeholder.svg?height=${200 + i * 50}&width=${300 + i * 50}`,
      })
    }

    setRelatedNews(mockNews)
  }

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

  // Share functionality
  const handleShare = async (platform = null) => {
    const url = window.location.href
    const title = news?.titulo || "Noticia interesante"

    if (platform) {
      let shareUrl

      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          break
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
          break
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
          break
        case "email":
          shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
          break
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank")
      }

      return
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "Mira esta noticia interesante",
          url: url,
        })
      } catch (err) {
        console.error("Error al compartir:", err)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(url)
      alert("Enlace copiado al portapapeles")
    }
  }

  // Bookmark functionality
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedNews") || "[]")

    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter((item) => item !== id)
      localStorage.setItem("bookmarkedNews", JSON.stringify(updatedBookmarks))
    } else {
      bookmarks.push(id)
      localStorage.setItem("bookmarkedNews", JSON.stringify(bookmarks))
    }

    setIsBookmarked(!isBookmarked)
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Handle like
  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount(likeCount + 1)
      setHasLiked(true)
    } else {
      setLikeCount(likeCount - 1)
      setHasLiked(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-8"></div>
          <div className="h-[50vh] bg-gray-200 rounded-xl mb-8"></div>
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="lg:w-2/3">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-60 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
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

  // Generate random tags based on title
  const generateTags = () => {
    if (!news.titulo) return []

    const words = news.titulo
      .split(" ")
      .filter((word) => word.length > 3)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

    // Get unique words and limit to 5
    return [...new Set(words)].slice(0, 5)
  }

  const tags = generateTags()

  return (
    <div className="bg-gray-50">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a noticias
        </button>
      </div>

      {/* Hero Section - Full width */}
      <div className="relative w-full bg-gradient-to-r from-[#0B2F33] to-[#28BC98] mb-8">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl">
            {/* Category and reading time */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                Noticia
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {getReadingTime(news.contenido)}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {viewCount} vistas
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{news.titulo}</h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
              {news.created_at && (
                <div className="flex items-center text-white/90 text-sm">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>Publicado: {formatDateTime(news.created_at)}</span>
                </div>
              )}
              {news.updated_at && news.created_at !== news.updated_at && (
                <div className="flex items-center text-white/90 text-sm">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>Actualizado: {formatDateTime(news.updated_at)}</span>
                </div>
              )}
            </div>

            {/* Social sharing */}
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm mr-2">Compartir:</span>
              <button
                onClick={() => handleShare("facebook")}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Compartir en Facebook"
              >
                <Facebook className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Compartir en Twitter"
              >
                <Twitter className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Compartir en LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => handleShare("email")}
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Compartir por Email"
              >
                <Mail className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>
      </div>

      {/* Featured Image - Full width with overlay */}
      {news.img && (
        <div className="relative w-full max-w-7xl mx-auto px-4 -mt-20 mb-12">
          <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[21/9]">
            <img
              src={news.img || "/placeholder.svg"}
              alt={news.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg"
              }}
            />
          </div>
        </div>
      )}

      {/* Main content with sidebar layout */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - Author info and stats */}
          <div className="lg:w-1/6 order-3 lg:order-1">
            <div className="sticky top-8 space-y-8">
              {/* Author info */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#28BC98]/10 rounded-full flex items-center justify-center mb-3">
                    <User className="w-8 h-8 text-[#28BC98]" />
                  </div>
                  <h3 className="font-medium text-gray-900">Administrador</h3>
                  <p className="text-sm text-gray-500 mt-1">Asociación de Química UVG</p>
                </div>
              </div>

              {/* Article stats */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-gray-400" />
                      Vistas
                    </span>
                    <span className="font-medium text-gray-900">{viewCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
                      Comentarios
                    </span>
                    <span className="font-medium text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-2 text-gray-400" />
                      Me gusta
                    </span>
                    <span className="font-medium text-gray-900">{likeCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      Tiempo de lectura
                    </span>
                    <span className="font-medium text-gray-900">{getReadingTime(news.contenido)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons - vertical */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-colors ${
                      hasLiked
                        ? "bg-[#28BC98]/10 text-[#28BC98] border-[#28BC98]/20"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{hasLiked ? "Me gusta" : "Me gusta"}</span>
                  </button>

                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-colors ${
                      isBookmarked
                        ? "bg-[#28BC98]/10 text-[#28BC98] border-[#28BC98]/20"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    <span>{isBookmarked ? "Guardado" : "Guardar"}</span>
                  </button>

                  <button
                    onClick={() => handleShare()}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content column */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            {/* Summary box - only if we have non-URL content */}
            {!isContentUrl && getSummary() && (
              <div className="bg-[#28BC98]/5 border-l-4 border-[#28BC98] p-5 mb-8 rounded-r-lg">
                <p className="text-lg text-gray-700 italic font-light leading-relaxed">{getSummary()}</p>
              </div>
            )}

            {/* Main content */}
            <div ref={contentRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              {isContentUrl ? (
                <div className="flex flex-col items-center justify-center p-8">
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

                  <div className="w-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">¿Qué encontrarás en este enlace?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-[#28BC98]/10 p-1 rounded-full mr-3 mt-1">
                          <div className="w-4 h-4 bg-[#28BC98] rounded-full"></div>
                        </div>
                        <span>Información detallada sobre este tema</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-[#28BC98]/10 p-1 rounded-full mr-3 mt-1">
                          <div className="w-4 h-4 bg-[#28BC98] rounded-full"></div>
                        </div>
                        <span>Recursos adicionales relacionados</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-[#28BC98]/10 p-1 rounded-full mr-3 mt-1">
                          <div className="w-4 h-4 bg-[#28BC98] rounded-full"></div>
                        </div>
                        <span>Contenido oficial de la fuente original</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  {/* Content with styled first letter */}
                  <div className="prose max-w-none text-gray-800 text-base md:text-lg leading-relaxed">
                    {news.contenido ? (
                      <div className="text-gray-800 [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:text-[#28BC98] [&>p:first-of-type]:first-letter:mr-2 [&>p:first-of-type]:first-letter:float-left">
                        <div dangerouslySetInnerHTML={{ __html: news.contenido }} />
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 italic py-8">
                        No hay contenido disponible para esta noticia.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-[#28BC98]" />
                  Etiquetas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments section placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-[#28BC98]" />
                Comentarios (0)
              </h3>

              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28BC98] focus:border-transparent transition-all"
                      placeholder="Escribe un comentario..."
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button className="px-4 py-2 bg-[#28BC98] text-white rounded-lg hover:bg-[#22a484] transition-colors text-sm">
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-500 py-4">No hay comentarios aún. ¡Sé el primero en comentar!</div>
            </div>

            {/* Back button */}
            <div className="flex justify-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-5 py-2.5 bg-[#28BC98] text-white rounded-lg hover:bg-[#22a484] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Noticias
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:w-1/3 order-2 lg:order-3">
            <div className="sticky top-8 space-y-8">
              {/* Table of contents - if we had sections */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">En esta página</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="flex items-center text-[#28BC98] hover:underline">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      <span>Introducción</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-700 hover:text-[#28BC98] hover:underline">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      <span>Desarrollo</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-700 hover:text-[#28BC98] hover:underline">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      <span>Conclusiones</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-gray-700 hover:text-[#28BC98] hover:underline">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      <span>Referencias</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Related news */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Noticias relacionadas</h3>
                <div className="space-y-4">
                  {relatedNews.map((item, index) => (
                    <div key={index} className="flex gap-3 group cursor-pointer">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 group-hover:text-[#28BC98] transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{formatDateTime(item.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href="#"
                    className="text-[#28BC98] hover:underline text-sm font-medium flex items-center justify-center"
                  >
                    Ver todas las noticias
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>

              {/* Newsletter signup */}
              <div className="bg-gradient-to-br from-[#0B2F33] to-[#28BC98] rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Suscríbete al boletín</h3>
                <p className="text-white/80 mb-4">
                  Recibe las últimas noticias y actualizaciones directamente en tu correo.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button className="w-full py-3 bg-white text-[#0B2F33] font-medium rounded-lg hover:bg-white/90 transition-colors">
                    Suscribirse
                  </button>
                </div>
                <p className="text-white/60 text-xs mt-3">Al suscribirte, aceptas nuestra política de privacidad.</p>
              </div>

              {/* Info card */}
              <div className="bg-[#28BC98]/5 rounded-xl p-6 border border-[#28BC98]/20">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Sobre la Asociación</h3>
                <p className="text-gray-700 mb-4">
                  La Asociación de Química UVG trabaja para promover el conocimiento científico y crear una comunidad
                  activa de estudiantes interesados en la química.
                </p>
                <button className="w-full py-2 bg-[#28BC98] text-white rounded-lg hover:bg-[#22a484] transition-colors">
                  Conocer más
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-[#28BC98] text-white rounded-full shadow-lg hover:bg-[#22a484] transition-colors z-50"
          aria-label="Volver arriba"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
