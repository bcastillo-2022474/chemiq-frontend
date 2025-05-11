import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Calendar, Clock, Info, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { getVideoId, getVideoDetails } from "@/utils/youtube";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getColors } from "@/actions/personalization";

export function FeaturedPodcast({ onOpenModal }) {
  const [latestVideo, setLatestVideo] = useState(null);
  const [videoDetails, setVideoDetails] = useState({});
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  });

  const fetchColors = async () => {
    const [error, colors] = await getColors();
    if (error) {
      console.error("Error fetching colors:", error);
      return;
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    );
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }));
    console.log("Fetched colors:", formattedColors);
  };

  useEffect(() => {
    fetchColors();
    const fetchLatestVideo = async () => {
      try {
        const response = await fetch("https://backend-postgresql.vercel.app/api/podcasts");
        const podcasts = await response.json();
        const video = podcasts[0];
        setLatestVideo(video);

        const videoId = getVideoId(video.link);
        if (videoId) {
          const videoInfo = await getVideoDetails(videoId);
          if (videoInfo) {
            setVideoDetails(videoInfo);
          }
        }
      } catch (error) {
        console.error("Error fetching latest video:", error);
      }
    };
    void fetchLatestVideo();
  }, []);

  const handlePlayClick = () => {
    const videoId = getVideoId(latestVideo.link);
    console.log("Abriendo modal para podcast:", { latestVideo, videoDetails, videoId });
    onOpenModal({ latestVideo, videoDetails, videoId });
  };

  if (!latestVideo) {
    return (
      <Card
        className="h-64 animate-pulse"
        style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
      />
    );
  }

  const videoId = getVideoId(latestVideo.link);

  return (
    <Card
      className="overflow-hidden hover:-translate-y-1 transition-all duration-300"
      style={{
        borderColor: `${theme.colors.Tertiary || '#5f5f5f'}20`,
        boxShadow: '0 4px 12px rgba(95,95,95,0.1)'
      }}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-80 h-48 md:h-full flex-shrink-0 relative group">
            <img
              src={videoDetails.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={videoDetails.title || latestVideo.nombre}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <Button
              onClick={handlePlayClick}
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
          <div
            className="flex-1 p-6"
            style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3
                  className="text-2xl font-semibold mb-3"
                  style={{ color: theme.colors.Accent || '#505050' }}
                >
                  {videoDetails.title || latestVideo.nombre}
                </h3>
                <p
                  className="text-base line-clamp-2 mb-4"
                  style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                >
                  {videoDetails.description || "Sin descripción disponible"}
                </p>
                <div
                  className="flex flex-wrap items-center gap-4 text-sm"
                  style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                >
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 font-normal"
                    style={{
                      color: theme.colors.Accent || '#505050',
                      borderColor: `${theme.colors.Tertiary || '#5f5f5f'}20`
                    }}
                  >
                    <Calendar
                      className="h-3.5 w-3.5"
                      style={{ color: theme.colors.Primary || '#fc5000' }}
                    />
                    {videoDetails.publishedAt
                      ? formatDistanceToNow(new Date(videoDetails.publishedAt), {
                          addSuffix: true,
                          locale: es
                        })
                      : "Fecha no disponible"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 font-normal"
                    style={{
                      color: theme.colors.Accent || '#505050',
                      borderColor: `${theme.colors.Tertiary || '#5f5f5f'}20`
                    }}
                  >
                    <Clock
                      className="h-3.5 w-3.5"
                      style={{ color: theme.colors.Primary || '#fc5000' }}
                    />
                    {videoDetails.duration || "N/A"}
                  </Badge>
                  {videoDetails.viewCount && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 font-normal"
                      style={{
                        color: theme.colors.Accent || '#505050',
                        borderColor: `${theme.colors.Tertiary || '#5f5f5f'}20`
                      }}
                    >
                      <Info
                        className="h-3.5 w-3.5"
                        style={{ color: theme.colors.Primary || '#fc5000' }}
                      />
                      {videoDetails.viewCount} visualizaciones
                    </Badge>
                  )}
                  {videoDetails.likeCount && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 font-normal"
                      style={{
                        color: theme.colors.Accent || '#505050',
                        borderColor: `${theme.colors.Tertiary || '#5f5f5f'}20`
                      }}
                    >
                      <ThumbsUp
                        className="h-3.5 w-3.5"
                        style={{ color: theme.colors.Primary || '#fc5000' }}
                      />
                      {videoDetails.likeCount}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handlePlayClick}
                  style={{
                    backgroundColor: theme.colors.Primary || '#fc5000',
                    color: theme.colors.Secondary || '#e4e4e4'
                  }}
                  className="hover:opacity-80 transition-opacity"
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
  );
}