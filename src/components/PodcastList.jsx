import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, Calendar, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function PodcastList() {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/podcasts");
        const data = await response.json();
        setPodcasts(data);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    void fetchPodcasts();
  }, []);

  const handlePlayClick = (link) => {
    setSelectedPodcast(link);
  };

  const handleCloseModal = () => {
    setSelectedPodcast(null);
  };

  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="space-y-4 p-4">
      {podcasts.map((podcast) => (
        <Card
          key={podcast.id}
          className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-[#28BC98]"
          onClick={() => handlePlayClick(podcast.link)}
        >
          <CardContent className="p-0">
            <div className="flex">
              {/* Thumbnail */}
              <div className="w-48 h-36 flex-shrink-0">
                <img
                  src={`https://img.youtube.com/vi/${getVideoId(podcast.link)}/hqdefault.jpg`}
                  alt={podcast.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0B2F33] mb-2">
                      {podcast.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {podcast.descripcion || "Sin descripción disponible"}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(new Date(podcast.fecha || Date.now()), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {podcast.duracion || "N/A"}
                      </span>
                      {podcast.vistas && (
                        <span className="flex items-center">
                          <Info className="h-4 w-4 mr-1" />
                          {podcast.vistas} visualizaciones
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <button
                      className="bg-[#28BC98] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#7DE2A6] transition-colors duration-300 flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClick(podcast.link);
                      }}
                    >
                      <Play className="h-4 w-4" />
                      Reproducir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedPodcast && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg w-full max-w-4xl">
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
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${getVideoId(selectedPodcast)}`}
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
  );
}
