import { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";
import NewsModal from "./NewsModal";

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [expandedNews, setExpandedNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://backend-postgresql.vercel.app/api/news');
        setNewsItems(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const handleReadMore = (item) => {
    setExpandedNews(item);
  };

  const handleCloseModal = () => {
    setExpandedNews(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Noticias</h1>
      <p className="text-gray-600 mb-8">
        Mantente actualizado con noticias, anuncios y más de la Asociación de Química UVG
      </p>

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
              />
            </div>
          );
        })}
      </div>

      {expandedNews && (
        <NewsModal
          isOpen={!!expandedNews}
          onClose={handleCloseModal}
          title={expandedNews.titulo}
          content={expandedNews.contenido}
          imageUrl={expandedNews.img}
        />
      )}
    </div>
  );
};

export default NewsSection;

