import { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";
import { BASE_URL } from "@/lib/constants.js";

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/news`);
        setNewsItems(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const handleReadMore = (item) => {
    setSelectedNews(item);
  };

  const handleCloseDetails = () => {
    setSelectedNews(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-accent mb-2">Noticias</h1>
      <p className="text-gray-600 mb-8">
        Mantente actualizado con noticias, anuncios y más de la Asociación de Química UVG
      </p>

      {!selectedNews ? (
        <div className="space-y-8">
          {newsItems.map((item) => {
            const content = item.contenido.split(" ").slice(0, 50).join(" ") + (item.contenido.split(" ").length > 50 ? "..." : "");
            const showReadMore = item.contenido.split(" ").length > 50;

            return (
              <div key={item.id}>
                <NewsCard
                  title={item.titulo}
                  description={content}
                  date={item.date}
                  imageUrl={item.img}
                  onReadMore={() => handleReadMore(item)}
                  showReadMore={showReadMore}
                  createdAt={item.created_at}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <button
            onClick={handleCloseDetails}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Volver
          </button>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <img
              src={selectedNews.img || "/placeholder.svg"}
              alt={selectedNews.titulo}
              className="w-full object-cover rounded-t-2xl mb-4"
              style={{ aspectRatio: '16/9' }}
            />
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 space-y-8">
                <h2 className="text-3xl font-bold mb-4">{selectedNews.titulo}</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4 text-justify">{selectedNews.contenido}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsSection;

