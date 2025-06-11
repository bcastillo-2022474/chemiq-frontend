"use client"

import { useState, useEffect } from "react"
import NewsCard from "./NewsCard"
import { getNewByIdRequest, getNewsRequest } from "@/actions/news"
import { ChevronLeft, Newspaper, Search, Calendar, Clock } from 'lucide-react'
import { getColors } from "@/actions/personalization"

export function NewsSection() {
  const [theme, setTheme] = useState({ colors: {} })
  const [selectedId, setSelectedId] = useState(null) // Nuevo estado para el id seleccionado

  const fetchColors = async () => {
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      return
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    )
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
  }

  useEffect(() => {
    fetchColors()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Newspaper className="h-6 w-6" style={{ color: theme.colors.Primary || '#fc5000' }} />
          <h1 className="text-3xl font-bold" style={{ color: theme.colors.Accent || '#505050' }}>
            Noticias
          </h1>
        </div>
        <p className="ml-9" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
          Mantente actualizado con noticias, anuncios y más de la Asociación de Química UVG
        </p>
      </div>
      {/* Renderiza el detalle si hay id seleccionado, si no la lista */}
      {selectedId ? (
        <ArticleDetail id={selectedId} theme={theme} onBack={() => setSelectedId(null)} />
      ) : (
        <ListArticles theme={theme} onSelect={setSelectedId} />
      )}
    </div>
  )
}

function ListArticles({ theme = { colors: {} }, onSelect }) {
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchNews() {
      const [error, news] = await getNewsRequest()
      if (error) {
        console.error("Error fetching news:", error)
        return
      }
      setNewsItems(news)
      setLoading(false)
    }
    void fetchNews()
  }, [])

  const filteredNews = newsItems.filter(
    (item) =>
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contenido.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative w-full md:w-96 mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4" style={{ color: theme.colors.Tertiary || '#5f5f5f' }} />
        </div>
        <input
          type="search"
          className="block w-full p-3 pl-10 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all"
          placeholder="Buscar noticias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            color: theme.colors.Tertiary || '#5f5f5f',
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            focusRingColor: theme.colors.Primary || '#fc5000'
          }}
        />
      </div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse flex flex-col md:flex-row h-64 rounded-xl overflow-hidden" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
              <div className="md:w-2/5 lg:w-1/3 h-48 md:h-full" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
              <div className="md:w-3/5 lg:w-2/3 p-5 md:p-6 space-y-4">
                <div className="h-6 rounded" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
                <div className="h-4 rounded" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
                <div className="h-4 rounded" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
                <div className="h-4 rounded" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
                <div className="pt-4 flex justify-between">
                  <div className="h-4 rounded w-24" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
                  <div className="h-4 rounded w-20" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((item) => {
            const content =
              item.contenido.split(" ").slice(0, 50).join(" ") +
              (item.contenido.split(" ").length > 50 ? "..." : "")
            const showReadMore = item.contenido.split(" ").length > 50

            return (
              <div key={item.id} onClick={() => onSelect(item.id)} style={{ cursor: "pointer" }}>
                <NewsCard
                  id={item.id}
                  title={item.titulo}
                  description={content}
                  imageUrl={item.img}
                  showReadMore={showReadMore}
                  createdAt={item.created_at}
                  theme={theme}
                />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl p-10 text-center" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Newspaper className="h-16 w-16" style={{ color: theme.colors.Tertiary || '#5f5f5f' }} />
            <h3 className="text-xl font-medium" style={{ color: theme.colors.Accent || '#505050' }}>
              No hay noticias disponibles
            </h3>
            <p className="max-w-md" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
              {searchTerm
                ? `No se encontraron noticias que coincidan con "${searchTerm}"`
                : "No hay noticias disponibles en este momento."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 font-medium"
                style={{ color: theme.colors.Primary || '#fc5000' }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.Accent || '#505050'}
                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.Primary || '#fc5000'}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ArticleDetail({ id, theme = { colors: {} }, onBack }) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      const newsItem = await getNewByIdRequest({id})
      setArticle(newsItem)
      setLoading(false)
    }
    void fetchNews()
  }, [id])

  if (loading) {
    return (
      <div className="mt-6 animate-pulse">
        <div className="w-32 h-10 rounded mb-6" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
          <div className="w-full h-72" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
          <div className="p-8 space-y-6">
            <div className="h-8 rounded w-3/4" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
            <div className="h-4 rounded w-1/2" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
            <div className="space-y-3">
              <div className="h-4 rounded w-full" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
              <div className="h-4 rounded w-full" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
              <div className="h-4 rounded w-5/6" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
              <div className="h-4 rounded w-full" style={{ backgroundColor: theme.colors.Tertiary || '#5f5f5f' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <button
        className="inline-flex items-center px-4 py-2 mb-6 rounded-lg transition-colors"
        style={{ backgroundColor: '#f5e8df', color: theme.colors.Tertiary || '#5f5f5f' }}
        onClick={onBack}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Volver a noticias
      </button>

      <article className="rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: theme.colors.Background || '#fff8f0', borderColor: `${theme.colors.Tertiary || '#5f5f5f'}20` }}>
        {/* Hero Image */}
        <div className="relative">
          <img
            src={article[1].img || "/placeholder.svg"}
            alt={article[1].titulo}
            className="w-full object-cover h-72"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg"
            }}
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${theme.colors.Tertiary || '#5f5f5f'}b3, transparent)` }}></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: theme.colors.Secondary || '#e4e4e4' }}>
              {article[1].titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-4" style={{ color: `${theme.colors.Secondary || '#e4e4e4'}cc` }}>
              {article[1].created_at && (
                <span className="text-sm flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" style={{ color: theme.colors.Secondary || '#e4e4e4' }} />
                  Publicado: {formatDate(article[1].created_at)}
                </span>
              )}
              {article[1].updated_at && article[1].updated_at !== article[1].created_at && (
                <span className="text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" style={{ color: theme.colors.Secondary || '#e4e4e4' }} />
                  Actualizado: {formatDate(article[1].updated_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 lg:p-10">
          <div className="prose max-w-none leading-relaxed" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
            {article[1].contenido ? (
              /^https?:\/\//.test(article[1].contenido) ? (
                <p>
                  Más información:{" "}
                  <a
                    href={article[1].contenido}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: theme.colors.Primary || '#fc5000' }}
                  >
                    {article[1].contenido}
                  </a>
                </p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: article[1].contenido }} />
              )
            ) : (
              <p className="italic" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                No hay contenido disponible para esta noticia.
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return "Sin fecha"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return "Fecha inválida"
  }
}

