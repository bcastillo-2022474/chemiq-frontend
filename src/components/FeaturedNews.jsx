import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, ArrowRight, Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export function FeaturedNews() {
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://backend-postgresql.vercel.app/api/news');
        const newsItems = response.data;
        const mostRecentNews = newsItems[newsItems.length - 1]; // Obtener la noticia más reciente
        setNews(mostRecentNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  if (!news) {
    return null; // O un indicador de carga
  }

  return (
    <Link to={`/noticias/${news.id}`}>
      <Card className="bg-surface text-text hover:shadow-2xl transition-all duration-300 transform hover:scale-102 cursor-pointer overflow-hidden group">
        <div className="flex h-64">
          <div className="w-1/2 relative">
            <img
              src={news.img || "/placeholder.svg"}
              alt={news.titulo}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent" />
          </div>
          <CardContent className="w-1/2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Newspaper className="h-6 w-6 mr-2 text-secondary" />
                <h3 className="text-2xl font-bold text-secondary">
                  {news.titulo}
                </h3>
              </div>
              <p className="text-text-muted mb-4">
                {news.contenido.length > 100
                  ? `${news.contenido.substring(0, 100)}...`
                  : news.contenido}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-text-muted">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{news.created_at}</span>
                <Eye className="h-4 w-4 mr-1" />
                <span>5k vistas</span>
              </div>
              <div className="flex items-center bg-secondary text-background px-3 py-1 rounded-full group-hover:bg-accent transition-colors duration-300">
                <span className="text-sm font-medium mr-1">Leer más</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}