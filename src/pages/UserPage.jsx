import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { FeaturedPodcast } from "@/components/FeaturedPodcast";
import { FeaturedNews } from "@/components/FeaturedNews";
import { FeaturedProject } from "@/components/FeaturedProject";
import { NewsRoutes } from "@/components/NewsSection";
import { YouTubeVideos } from "@/components/YouTubeVideos";
import { ProjectsSection } from "@/components/ProjectsSection";
import { LoadingBeaker } from "@/components/LoadingBeaker";
import { Outlet, Route, Routes } from "react-router-dom";
import { NewsDetail } from "../components/NewForID";
import { Calendar, Users } from "lucide-react";
import { getColors } from "../actions/personalization";
function UserPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
    images: {}, // Otros datos del tema
  });
  const fetchColors = async () => {
      setLoading(true)
      const [error, colors] = await getColors()
      if (error) {
        console.error("Error fetching colors:", error)
        setLoading(false)
        return
      }
      const formattedColors = Object.fromEntries(
        colors.map((color) => [color.nombre, color.hex])
      )
      setTheme((prevTheme) => ({
        ...prevTheme,
        colors: formattedColors,
      }))
      console.log("Fetched colors:", formattedColors) // Verifica los colores aquí
      setLoading(false)
    }
  useEffect(() => {
    fetchColors();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingBeaker />;
  }

  return (
    <div className="flex h-screen" style={{backgroundColor: theme.colors.Background}}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [modalContent, setModalContent] = useState(null);
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
    images: {}, // Otros datos del tema
  });
  console.log(theme.colors)
  const fetchColors = async () => {
    setLoading(true)
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      setLoading(false)
      return
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    )
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    console.log("Fetched colors:", formattedColors) // Verifica los colores aquí
    setLoading(false)
  }
  useEffect(() => {
    fetchColors();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = (content) => {
    console.log("Modal content recibido:", content);
    setModalContent(content);
  };

  const handleCloseModal = () => {
    console.log("Cerrando modal");
    setModalContent(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <header className="relative h-48 mb-12 rounded-xl overflow-hidden" style={{backgroundColor: theme.colors.Primary}}>
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
                <stop offset="0%" stopColor="#7DE2A6" />
                <stop offset="100%" stopColor="#28BC98" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="text-5xl font-light text-center tracking-tight text-[#0B2F33]">
            <span className="font-bold">Asociación de Química</span>
          </h1>
          <p className="mt-2 text-center text-lg text-[#0B2F33]/80">
            Novedades: Noticias, proyectos y podcasts más recientes
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden border border-[#7DE2A6]/20 shadow-[rgba(0,_0,_0,_0.1)_0px_4px_12px] animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : (
          <>
          <h2 className="text-3xl font-light text-left tracking-tight text-[#0B2F33]"><span className="font-bold">Noticia más reciente</span></h2>
            <div className="bg-white rounded-xl overflow-hidden border border-[#7DE2A6]/20 shadow-[rgba(0,_0,_0,_0.1)_0px_4px_12px] hover:-translate-y-1 transition-all duration-300">
              <FeaturedNews />
            </div>
            <h2 className="text-3xl font-light text-left  tracking-tight text-[#0B2F33]"><span className="font-bold">Proyecto más reciente</span></h2>

            <div className="bg-white rounded-xl overflow-hidden border border-[#7DE2A6]/20 shadow-[rgba(0,_0,_0,_0.1)_0px_4px_12px] hover:-translate-y-1 transition-all duration-300">
              <FeaturedProject onOpenModal={handleOpenModal} />
            </div>
            <h2 className="text-3xl font-light text-left  tracking-tight text-[#0B2F33]"><span className="font-bold">Podcast más reciente</span></h2>

            <div className="bg-white rounded-xl overflow-hidden border border-[#7DE2A6]/20 shadow-[rgba(0,_0,_0,_0.1)_0px_4px_12px] hover:-translate-y-1 transition-all duration-300">
              <FeaturedPodcast onOpenModal={handleOpenModal} />
            </div>
          </>
        )}
      </div>

      {/* Modal personalizado para FeaturedProject */}
      {modalContent && !modalContent.latestVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            {/* Contenido del modal */}
            <h2 className="text-2xl font-bold text-[#0B2F33] mb-4">
              {modalContent.nombre}
            </h2>
            <div className="space-y-6">
              <img
                src={modalContent.img || "/placeholder.svg"}
                alt={modalContent.nombre}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-gray-700 leading-relaxed">{modalContent.informacion}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-[#28BC98]" />
                      Creado: {formatDate(modalContent.created_at)}
                    </span>
                    {modalContent.updated_at && (
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-[#28BC98]" />
                        Actualizado: {formatDate(modalContent.updated_at)}
                      </span>
                    )}
                    {modalContent.count_members && (
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-[#28BC98]" />
                        {modalContent.count_members} miembros
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal personalizado para FeaturedPodcast */}
      {modalContent && modalContent.latestVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full relative">
            {/* Botón de cerrar */}
            <Button
              onClick={handleCloseModal}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
            >
              ✕
              <span className="sr-only">Cerrar</span>
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
  );
}

export function PortalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserPage />}>
        <Route index element={<HomePage />} />
        <Route path="podcast" element={<YouTubeVideos />} />
        <Route path="news/*" element={<NewsRoutes />} />
        <Route path="project" element={<ProjectsSection />} />
        <Route path="noticias/:id" element={<NewsDetail />} />
      </Route>
    </Routes>
  );
}