"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { FeaturedPodcast } from "@/components/FeaturedPodcast"
import { FeaturedNews } from "@/components/FeaturedNews"
import { FeaturedProject } from "@/components/FeaturedProject"
import { NewsSection } from "@/components/NewsSection"
import { YouTubeVideos } from "@/components/YouTubeVideos"
import { ProjectsSection } from "@/components/ProjectsSection"
import { LoadingBeaker } from "@/components/LoadingBeaker"
import { Outlet, Route, Routes } from "react-router-dom"
import { NewsDetail } from "../components/NewForID"
import { getColors } from "../actions/personalization"
import { ProjectModal2 } from "../components/ProjectModal2"

function UserPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
    images: {}, // Otros datos del tema
  })

  const fetchColors = async () => {
    setIsLoading(true)
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      setIsLoading(false)
      return
    }
    const formattedColors = Object.fromEntries(colors.map((color) => [color.nombre, color.hex]))
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    console.log("Fetched colors:", formattedColors)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchColors()
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingBeaker />
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function HomePage() {
  const [loading, setLoading] = useState(true)
  const [modalContent, setModalContent] = useState(null)
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
    images: {}, // Otros datos del tema
  })

  const fetchColors = async () => {
    setLoading(true)
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      setLoading(false)
      return
    }
    const formattedColors = Object.fromEntries(colors.map((color) => [color.nombre, color.hex]))
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    console.log("Fetched colors:", formattedColors)
    setLoading(false)
  }

  useEffect(() => {
    fetchColors()
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleOpenModal = (content) => {
    console.log("Modal content recibido:", content)
    setModalContent(content)
  }

  const handleCloseModal = () => {
    console.log("Cerrando modal")
    setModalContent(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <header
        className="relative h-48 mb-12 rounded-xl overflow-hidden"
        style={{ backgroundColor: theme.colors.Primary || "#fc5000" }}
      >
        <div className="absolute inset-0">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#header-gradient)" />
            <defs>
              <linearGradient id="header-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: theme.colors.Primary || "#fc5000" }} />
                <stop offset="100%" style={{ stopColor: theme.colors.Accent || "#505050" }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1
            className="text-5xl font-light text-center tracking-tight"
            style={{ color: theme.colors.Secondary || "#e4e4e4" }}
          >
            <span className="font-bold">Asociación de Química</span>
          </h1>
          <p className="mt-2 text-center text-lg" style={{ color: `${theme.colors.Secondary || "#e4e4e4"}80` }}>
            Novedades: Noticias, proyectos y podcasts más recientes
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden border shadow-[0_4px_12px_rgba(95,95,95,0.1)] animate-pulse"
              style={{
                backgroundColor: theme.colors.Background || "#fff8f0",
                borderColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
              }}
            >
              <div className="w-full h-48" style={{ backgroundColor: theme.colors.Tertiary || "#5f5f5f" }}></div>
              <div className="p-6 space-y-4">
                <div className="h-6 rounded" style={{ backgroundColor: theme.colors.Tertiary || "#5f5f5f" }}></div>
                <div
                  className="h-4 rounded w-3/4"
                  style={{ backgroundColor: theme.colors.Tertiary || "#5f5f5f" }}
                ></div>
                <div
                  className="h-4 rounded w-1/2"
                  style={{ backgroundColor: theme.colors.Tertiary || "#5f5f5f" }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <>
            <h2
              className="text-3xl font-light text-left tracking-tight"
              style={{ color: theme.colors.Accent || "#505050" }}
            >
              <span className="font-bold">Noticia más reciente</span>
            </h2>
            <div
              className="rounded-xl overflow-hidden border shadow-[0_4px_12px_rgba(95,95,95,0.1)] hover:-translate-y-1 transition-all duration-300"
              style={{
                backgroundColor: theme.colors.Background || "#fff8f0",
                borderColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
              }}
            >
              <FeaturedNews />
            </div>
            <h2
              className="text-3xl font-light text-left tracking-tight"
              style={{ color: theme.colors.Accent || "#505050" }}
            >
              <span className="font-bold">Proyecto más reciente</span>
            </h2>
            <div
              className="rounded-xl overflow-hidden border shadow-[0_4px_12px_rgba(95,95,95,0.1)] hover:-translate-y-1 transition-all duration-300"
              style={{
                backgroundColor: theme.colors.Background || "#fff8f0",
                borderColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
              }}
            >
              <FeaturedProject onOpenModal={handleOpenModal} />
            </div>
            <h2
              className="text-3xl font-light text-left tracking-tight"
              style={{ color: theme.colors.Accent || "#505050" }}
            >
              <span className="font-bold">Podcast más reciente</span>
            </h2>
            <div
              className="rounded-xl overflow-hidden border shadow-[0_4px_12px_rgba(95,95,95,0.1)] hover:-translate-y-1 transition-all duration-300"
              style={{
                backgroundColor: theme.colors.Background || "#fff8f0",
                borderColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
              }}
            >
              <FeaturedPodcast onOpenModal={handleOpenModal} />
            </div>
          </>
        )}
      </div>

      {/* Modal mejorado para FeaturedProject */}
      <ProjectModal2
        project={modalContent}
        isOpen={modalContent && !modalContent.latestVideo}
        onClose={handleCloseModal}
        theme={theme}
      />

      {/* Modal personalizado para FeaturedPodcast */}
      {modalContent && modalContent.latestVideo && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: `${theme.colors.Tertiary || "#5f5f5f"}80` }}
        >
          <div
            className="rounded-lg max-w-4xl w-full relative"
            style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}
          >
            {/* Botón de cerrar */}
            <Button
              onClick={handleCloseModal}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full"
              style={{
                backgroundColor: `${theme.colors.Tertiary || "#5f5f5f"}20`,
                color: theme.colors.Secondary || "#e4e4e4",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${theme.colors.Tertiary || "#5f5f5f"}40`)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = `${theme.colors.Tertiary || "#5f5f5f"}20`)}
            >
              ✕<span className="sr-only">Cerrar</span>
            </Button>

            {/* Contenido del modal */}
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${modalContent.videoId}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function PortalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserPage />}>
        <Route index element={<HomePage />} />
        <Route path="podcast" element={<YouTubeVideos />} />
        <Route path="news" element={<NewsSection />} />
        <Route path="project" element={<ProjectsSection />} />
        <Route path="noticias/:id" element={<NewsDetail />} />
      </Route>
    </Routes>
  )
}
