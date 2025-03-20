export const getYouTubeVideoDetails = async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=YOUR_YOUTUBE_API_KEY`
      )
      const data = await response.json()
  
      if (data.items.length === 0) {
        throw new Error("No se encontraron detalles para este video.")
      }
  
      const video = data.items[0]
      return {
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high.url,
        publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
        duration: formatDuration(video.contentDetails.duration),
        views: video.statistics.viewCount,
      }
    } catch (error) {
      console.error("Error al obtener detalles del video:", error)
      throw error
    }
  }
  
  // Función para formatear la duración del video (ISO 8601 a formato legible)
  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0
    const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0
    const seconds = match[3] ? parseInt(match[3].replace("S", "")) : 0
  
    return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }