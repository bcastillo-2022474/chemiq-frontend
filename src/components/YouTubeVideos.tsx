import { useState, useEffect } from "react";
import axios from "axios";
import { Podcast, Play, Clock, Calendar, Users } from "lucide-react";

const YouTubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Obtener videos
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`
        );
        
        // Obtener los IDs de los videos para consultar estadísticas
        const videoIds = response.data.items.map(item => item.id.videoId).join(',');
        
        // Obtener estadísticas y duración de los videos
        const detailsResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=statistics,contentDetails`
        );
        
        // Mapear detalles a los videos
        const videoItems = response.data.items.map((video, index) => {
          const details = detailsResponse.data.items.find(item => item.id === video.id.videoId) || {};
          
          return {
            id: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.high.url,
            publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
            views: details.statistics?.viewCount || "0",
            duration: formatDuration(details.contentDetails?.duration || "PT0S")
          };
        });
        
        setVideos(videoItems);
      } catch (error) {
        console.error("Error al obtener videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const formatDuration = (duration) => {
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const match = duration.match(regex);

    const hours = match[1] ? match[1].slice(0, -1) : null;
    const minutes = match[2] ? match[2].slice(0, -1) : "00";
    const seconds = match[3] ? match[3].slice(0, -1).padStart(2, '0') : "00";

    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds}`;
    } else {
      return `${minutes}:${seconds}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        <Podcast className="h-8 w-8 mr-2 text-[#1d896e]" />
        Últimos Podcasts
      </h1>
      <p className="text-gray-600 mb-8">Explora los últimos episodios de nuestro canal</p>

      <div className="flex flex-col space-y-6">
        {videos.map((video, index) => (
          <div 
            key={video.id} 
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedVideo(video)}
          >
            {index % 2 === 0 ? (
              <>
                {/* Imagen a la izquierda (índices pares) */}
                <div className="md:w-2/5 relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                </div>
                {/* Información a la derecha */}
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-blue-600 mb-2">{video.title}</h2>
                    <p className="text-gray-700 mt-2">
                      {video.description.length > 150
                        ? `${video.description.substring(0, 150)}...`
                        : video.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{video.publishedAt}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{parseInt(video.views).toLocaleString()} vistas</span>
                      </div>
                    </div>
                    <div className="bg-[#1d896e] text-white px-3 py-1 rounded-full group-hover:bg-blue-700 transition-colors duration-300 flex items-center">
                      <Play className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Ver más</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Información a la izquierda (índices impares) */}
                <div className="p-6 md:w-3/5 order-2 md:order-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-blue-600 mb-2">{video.title}</h2>
                    <p className="text-gray-700 mt-2">
                      {video.description.length > 150
                        ? `${video.description.substring(0, 150)}...`
                        : video.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{video.publishedAt}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{parseInt(video.views).toLocaleString()} vistas</span>
                      </div>
                    </div>
                    <div className="bg-[#1d896e] text-white px-3 py-1 rounded-full group-hover:bg-blue-700 transition-colors duration-300 flex items-center">
                      <Play className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Ver más</span>
                    </div>
                  </div>
                </div>
                {/* Imagen a la derecha */}
                <div className="md:w-2/5 order-1 md:order-2 relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-4xl w-full">
            <div className="absolute top-2 right-2 p-2 cursor-pointer bg-red-500 text-white rounded-full" onClick={() => setSelectedVideo(null)}>
              <span className="text-xl font-bold">X</span>
            </div>
            <h2 className="text-xl font-bold mb-2 pr-8">{selectedVideo.title}</h2>
            <div className="flex items-center text-gray-500 space-x-4 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{selectedVideo.publishedAt}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{selectedVideo.duration}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{parseInt(selectedVideo.views).toLocaleString()} vistas</span>
              </div>
            </div>
            <iframe
              className="w-full h-96"
              src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className="mt-4 text-gray-700">{selectedVideo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeVideos;