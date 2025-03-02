import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Podcast, Play, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export function FeaturedPodcast() {
  const [latestVideo, setLatestVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [views, setViews] = useState(0);
  const [duration, setDuration] = useState("");
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=1`
        );
        if (response.data.items.length > 0) {
          const video = response.data.items[0];
          setLatestVideo(video);
          setVideoId(video.id.videoId);

          const videoDetails = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${video.id.videoId}&part=statistics,contentDetails`
          );
          setViews(videoDetails.data.items[0].statistics.viewCount);

          const videoDuration = videoDetails.data.items[0].contentDetails.duration;
          setDuration(formatDuration(videoDuration));  // Formatear la duración
        }
      } catch (error) {
        console.error("Error fetching latest video:", error);
      }
    };

    fetchLatestVideo();
  }, []);

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatDuration = (duration) => {
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const match = duration.match(regex);

    const hours = match[1] ? match[1].slice(0, -1) : null;
    const minutes = match[2] ? match[2].slice(0, -1) : "00";
    const seconds = match[3] ? match[3].slice(0, -1) : "00";

    if (hours) {
      return `${hours}:${minutes}:${seconds}`;
    } else {
      return `${minutes}:${seconds}`;
    }
  };

  return (
    <>
      <Card
        className="bg-surface text-text hover:shadow-2xl transition-all duration-300 transform hover:scale-102 cursor-pointer overflow-hidden group"
        onClick={handlePlayClick}
      >
        <div className="flex h-64">
          <div className="w-1/2 relative">
            <img
              src={latestVideo ? latestVideo.snippet.thumbnails.high.url : "/public/podcast.jpg"}
              alt={latestVideo ? latestVideo.snippet.title : "Podcast"}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent" />
          </div>
          <CardContent className="w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Podcast className="h-6 w-6 mr-2 text-primary" />
                <h3 className="text-2xl font-bold text-primary">
                  {latestVideo ? latestVideo.snippet.title : "Cargando..."}
                </h3>
              </div>
              <p className="text-text-muted mb-4">
                {latestVideo ? latestVideo.snippet.description.substring(0, 100) + "..." : "Cargando descripción..."}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-text-muted">
                <Clock className="h-4 w-4 mr-1" />
                <span className="mr-4">{duration}</span>
                <Users className="h-4 w-4 mr-1" />
                <span>{views ? views : "Cargando..."} vistas</span>
              </div>
              <div
                className="flex items-center bg-primary text-background px-3 py-1 rounded-full group-hover:bg-accent transition-colors duration-300 cursor-pointer"
              >
                <Play className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Reproducir</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Modal para el video */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg">
            <div className="absolute top-0 right-0 p-2 cursor-pointer" onClick={handleCloseModal}>
              <span className="text-2xl font-bold text-black">X</span>
            </div>
            <iframe
              width="1000"
              height="600"
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
  );
}
