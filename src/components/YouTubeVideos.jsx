"use client"

import { useState, useEffect } from "react"
import { Play, Calendar, Clock, Info, ThumbsUp, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { getVideoId, getVideoDetails } from "@/utils/youtube"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { getColors } from "@/actions/personalization"

export const YouTubeVideos = () => {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videoDetails, setVideoDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  })

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
    console.log("Fetched colors:", formattedColors)
  }

  useEffect(() => {
    fetchColors()
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("https://backend-postgresql.vercel.app/api/podcasts")
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
      } finally {
        setLoading(false)
      }
    }

    void fetchPodcasts()
  }, [])

  const handlePlayClick = (video) => {
    setSelectedVideo(video)
  }

  return (
    <div>
      {/* Header con gradiente */}
      <div className="relative h-48 mb-12 rounded-xl overflow-hidden">
        <div className="absolute inset-0">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              style={{ fill: `url(#header-gradient)` }}
            />
            <defs>
              <linearGradient id="header-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: theme.colors.Secondary || '#e4e4e4' }} />
                <stop offset="100%" style={{ stopColor: theme.colors.Primary || '#fc5000' }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1
            className="text-5xl font-light text-center tracking-tight"
            style={{ color: theme.colors.Accent || '#505050' }}
          >
            <span className="font-bold">Podcasts y Videos</span>
          </h1>
          <p
            className="mt-2 text-center text-lg"
            style={{ color: `${theme.colors.Accent || '#505050'}cc` }}
          >
            Explora nuestro contenido audiovisual más reciente
          </p>
        </div>
      </div>

      {/* Contenido de videos */}
      <div className="space-y-6">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden shadow-[rgba(0,_0,_0,_0.1)_0px_4px_12px]"
                style={{ borderColor: `${theme.colors.Primary || '#fc5000'}33` }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row animate-pulse">
                    {/* Skeleton Thumbnail */}
                    <div
                      className="w-full md:w-80 h-48 md:h-full flex-shrink-0"
                      style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}4d` }}
                    ></div>

                    {/* Skeleton Content */}
                    <div className="flex-1 p-6">
                      <div className="space-y-4">
                        <div
                          className="h-6 rounded"
                          style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}4d` }}
                        ></div>
                        <div
                          className="h-4 rounded w-3/4"
                          style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}4d` }}
                        ></div>
                        <div className="flex space-x-4">
                          <div
                            className="h-4 rounded w-1/4"
                            style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}4d` }}
                          ></div>
                          <div
                            className="h-4 rounded w-1/4"
                            style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}4d` }}
                          ></div>
                          <div
                            className="h-4 rounded w-1/4"
                            style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}4d` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : videos.map((video) => {
              const videoId = getVideoId(video.link)
              const details = videoDetails[videoId] || {}

              return (
                <Card
                  key={video.id}
                  className="overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-[rgba(0,_0,_0,_0.1)_0px_4px_12px]"
                  style={{ borderColor: `${theme.colors.Primary || '#fc5000'}33` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail */}
                      <div className="w-full md:w-80 h-48 md:h-full flex-shrink-0 relative group">
                        <img
                          src={details.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt={details.title || video.nombre}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <Button
                          onClick={() => handlePlayClick(video)}
                          variant="ghost"
                          size="icon"
                          className="absolute inset-0 w-full h-full rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}66` }}
                        >
                          <Play
                            className="h-12 w-12"
                            style={{ color: theme.colors.Secondary || '#e4e4e4' }}
                          />
                          <span className="sr-only">Reproducir video</span>
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3
                              className="text-2xl font-semibold mb-3"
                              style={{ color: theme.colors.Accent || '#505050' }}
                            >
                              {details.title || video.nombre}
                            </h3>
                            <p
                              className="text-base line-clamp-2 mb-4"
                              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                            >
                              {details.description || "Sin descripción disponible"}
                            </p>
                            <div
                              className="flex flex-wrap items-center gap-4 text-sm"
                              style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                            >
                              <Badge variant="outline" className="flex items-center gap-1 font-normal">
                                <Calendar
                                  className="h-3.5 w-3.5"
                                  style={{ color: theme.colors.Primary || '#fc5000' }}
                                />
                                {details.publishedAt
                                  ? formatDistanceToNow(new Date(details.publishedAt), {
                                      addSuffix: true,
                                      locale: es,
                                    })
                                  : "Fecha no disponible"}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1 font-normal">
                                <Clock
                                  className="h-3.5 w-3.5"
                                  style={{ color: theme.colors.Primary || '#fc5000' }}
                                />
                                {details.duration || "N/A"}
                              </Badge>
                              {details.viewCount && (
                                <Badge variant="outline" className="flex items-center gap-1 font-normal">
                                  <Info
                                    className="h-3.5 w-3.5"
                                    style={{ color: theme.colors.Primary || '#fc5000' }}
                                  />
                                  {details.viewCount} visualizaciones
                                </Badge>
                              )}
                              {details.likeCount && (
                                <Badge variant="outline" className="flex items-center gap-1 font-normal">
                                  <ThumbsUp
                                    className="h-3.5 w-3.5"
                                    style={{ color: theme.colors.Primary || '#fc5000' }}
                                  />
                                  {details.likeCount}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button
                              onClick={() => handlePlayClick(video)}
                              className="transition-colors"
                              style={{
                                backgroundColor: theme.colors.Primary || '#fc5000',
                                color: theme.colors.Secondary || '#e4e4e4'
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = theme.colors.Accent || '#505050')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = theme.colors.Primary || '#fc5000')
                              }
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Reproducir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {/* Modal de video */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent
          className="max-w-4xl p-0 overflow-hidden"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="relative">
            <Button
              onClick={() => setSelectedVideo(null)}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full transition-colors"
              style={{
                backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}33`,
                color: theme.colors.Secondary || '#e4e4e4'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = `${theme.colors.Tertiary || '#5f5f5f'}66`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = `${theme.colors.Tertiary || '#5f5f5f'}33`)
              }
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </Button>
            <div className="aspect-video w-full">
              {selectedVideo && (
                <iframe
                  src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.link)}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}