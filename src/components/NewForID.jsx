import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingBeaker } from "@/components/LoadingBeaker";
import { getNewByIdRequest } from "../actions/news";

export function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const [error, data] = await getNewByIdRequest({ id });

        if (error) {
          throw new Error("Failed to fetch news");
        }

        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // Function to parse and format the ISO 8601 date
  const formatDateTime = (dateString) => {
    if (!dateString) return "Fecha no disponible";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // If the date is invalid, return the original string
      }

      // Format as "año-mes-día hora:minutos:segundos"
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (err) {
      return dateString; // Fallback to the original string if parsing fails
    }
  };

  if (isLoading) {
    return <LoadingBeaker />;
  }

  if (error || !news) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-white/80">
            {error || "News article not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      {/* Header Image */}
      {news.img && (
        <div className="relative h-64 md:h-96 mb-6 rounded-xl overflow-hidden">
          <img
            src={news.img}
            alt={news.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {news.titulo}
            </h1>
            {news.created_at && (
              <p className="text-white/80 text-sm md:text-base">
                Publicado el {formatDateTime(news.created_at)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-[#0B2F33] rounded-xl p-6 md:p-8 border border-[#7DE2A6]/20 shadow-[rgba(0,_0,_0,_0.1)_0px_4px_12px]">
        {/* Title (if no image) */}
        {!news.img && (
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {news.titulo}
          </h1>
        )}

        {/* Metadata */}
        {(news.created_at || news.updated_at) && (
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-6 text-white/80 text-sm md:text-base">
            {news.created_at && (
              <span>Publicado el {formatDateTime(news.created_at)}</span>
            )}
            {news.created_at && news.updated_at && <span>•</span>}
            {news.updated_at && (
              <span>Actualizado el {formatDateTime(news.updated_at)}</span>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="prose max-w-none text-white text-base leading-relaxed">
          {news.contenido ? (
            // Check if contenido is a URL; if so, render it as a link
            /^https?:\/\//.test(news.contenido) ? (
              <p>
                Más información:{" "}
                <a
                  href={news.contenido}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7DE2A6] hover:underline"
                >
                  {news.contenido}
                </a>
              </p>
            ) : (
              // If it's not a URL, assume it's HTML or plain text
              <div
                className="text-white"
                dangerouslySetInnerHTML={{ __html: news.contenido }}
              />
            )
          ) : (
            <p>No content available for this news article.</p>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-[#28BC98] text-white rounded-lg hover:bg-[#22a484] transition-colors text-sm "
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a Página Principal
        </button>
      </div>
    </article>
  );
}