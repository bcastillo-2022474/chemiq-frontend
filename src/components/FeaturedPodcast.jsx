import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Podcast, Play, Clock, Users } from "lucide-react"
import { getVideosRequest } from "@/actions/youtube"

export function FeaturedPodcast() {
  const [latestVideo, setLatestVideo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [videoId, setVideoId] = useState(null)
  const [views, setViews] = useState(0)
  const [duration, setDuration] = useState("")
  useEffect(() => {
    const fetchLatestVideo = async () => {
      const [error, videos] = await getVideosRequest()
      if (error) {
        console.error("Error fetching latest video:", error)
        return
      }
      const video = videos[0]
      setLatestVideo(video)
      setVideoId(video.id)
      setViews(Number(video.views))
      setDuration(video.duration)
    }

    void fetchLatestVideo()
  }, [])

  const handlePlayClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (!latestVideo) {
    return <Card className="h-64 animate-pulse bg-[#7DE2A6]/10" />
  }

  return (
    <>
      <Card
        className="h-64 overflow-hidden bg-white hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={handlePlayClick}
      >
        <div className="flex h-full">
          <div className="w-1/3 relative">
            <img
              src={
                latestVideo.snippet.thumbnails.high.url || "/placeholder.svg"
              }
              alt={latestVideo.snippet.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0" />
          </div>
          <CardContent className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Podcast className="h-5 w-5 mr-2 text-[#28BC98]" />
                <h3 className="text-xl font-semibold text-[#0B2F33] truncate">
                  {latestVideo.snippet.title}
                </h3>
              </div>
              <p className="text-sm text-[#0B2F33]/70 line-clamp-2">
                {latestVideo.snippet.description}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-[#28BC98] mr-1" />
                  <span className="text-xs text-[#0B2F33]/70">{duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-[#28BC98] mr-1" />
                  <span className="text-xs text-[#0B2F33]/70">
                    {views} vistas
                  </span>
                </div>
              </div>
              <div className="bg-[#28BC98] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#7DE2A6] transition-colors duration-300 flex items-center">
                <Play className="h-3 w-3 mr-1" />
                Reproducir
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg">
            <button
              className="absolute top-2 right-2 text-[#0B2F33] hover:text-[#28BC98]"
              onClick={handleCloseModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}
