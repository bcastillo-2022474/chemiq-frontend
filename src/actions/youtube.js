import { formatDuration } from "@/lib/utils"
import axios from "axios"

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID

export const getVideosRequest = async () => {
  let ytResponseVids = null

  return axios
    .get(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`
    )
    .then(response => {
      const ytResponseVids = response.data
      const videoIds = ytResponseVids.items
        .map(item => item.id.videoId)
        .join(",")
      return axios.get(
        `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=statistics,contentDetails`
      )
    })
    .then(detailsResponse => {
      const res = ytResponseVids.items.map((video) => {
        const details = detailsResponse.data.items.find(
          item => item.id === video.id.videoId
        )

        return {
          id: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.high.url,
          publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
          views: details.statistics?.viewCount || "0",
          duration: formatDuration(details.contentDetails?.duration || "PT0S")
        }
      })
      return [null, res]
    })
    .catch(error => {
      return [error, null]
    })
}
