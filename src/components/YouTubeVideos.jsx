import { useState, useEffect } from "react"
import { Play, Calendar, Clock, Info, ThumbsUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { getVideoId, getVideoDetails } from "@/utils/youtube"

export const YouTubeVideos = () => {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videoDetails, setVideoDetails] = useState({})

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/podcasts")
        const podcasts = await response.json()
        setVideos(podcasts)

        // Obtener detalles de YouTube para cada video
        const details = {}
        for (const video of podcasts) {
          const videoId = getVideoId(video.link)
          if (videoId) {
            const videoInfo = await getVideoDetails(videoId)
            if (videoInfo) {
              details[videoId] = videoInfo
            }
          }
        }
        setVideoDetails(details)
      } catch (error) {
        console.error("Error fetching podcasts:", error)
      }
    }

    void fetchPodcasts()
  }, [])

  const handlePlayClick = (video) => {
    setSelectedVideo(video)
  }

  const handleCloseModal = () => {
    setSelectedVideo(null)
  }

  return (
    <div>
      {/* Header con gradiente */}
      <header className="relative h-48 mb-12 rounded-xl overflow-hidden bg-[#28BC98]">
        <div className="absolute inset-0">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="url(#header-gradient)"
            />
            <defs>
              <linearGradient
                id="header-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#7DE2A6" />
                <stop offset="100%" stopColor="#28BC98" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="text-5xl font-light text-center tracking-tight text-[#0B2F33]">
            <span className="font-bold">Podcasts y Videos</span>
          </h1>
          <p className="mt-2 text-center text-lg text-[#0B2F33]/80">
            Explora nuestro contenido audiovisual más reciente
          </p>
        </div>
      </header>

      {/* Contenido de videos */}
      <div className="space-y-6">
        {videos.map((video) => {
          const videoId = getVideoId(video.link)
          const details = videoDetails[videoId] || {}
          
          return (
            <div
              key={video.id}
              className="bg-white rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 border border-[#7DE2A6]/20 shadow-[rgba(0,_0,_0,_0.1)_0px_4px_12px]"
            >
              <div className="flex">
                {/* Thumbnail */}
                <div className="w-80 h-full flex-shrink-0 relative group">
                  <img
                    src={details.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={details.title || video.nombre}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    onClick={() => handlePlayClick(video)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Play className="h-12 w-12 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#0B2F33] mb-3">
                        {details.title || video.nombre}
                      </h3>
                      <p className="text-gray-600 text-base line-clamp-2 mb-4">
                        {details.description || "Sin descripción disponible"}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-[#28BC98]" />
                          {details.publishedAt ? 
                            formatDistanceToNow(new Date(details.publishedAt), {
                              addSuffix: true,
                              locale: es,
                            }) : 
                            "Fecha no disponible"
                          }
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-[#28BC98]" />
                          {details.duration || "N/A"}
                        </span>
                        {details.viewCount && (
                          <span className="flex items-center">
                            <Info className="h-4 w-4 mr-2 text-[#28BC98]" />
                            {details.viewCount} visualizaciones
                          </span>
                        )}
                        {details.likeCount && (
                          <span className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2 text-[#28BC98]" />
                            {details.likeCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handlePlayClick(video)}
                        className="bg-[#28BC98] text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-[#7DE2A6] transition-colors duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Play className="h-4 w-4" />
                        Reproducir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de video */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl w-full max-w-4xl overflow-hidden">
            <button
              onClick={handleCloseModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.link)}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[500px]"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}