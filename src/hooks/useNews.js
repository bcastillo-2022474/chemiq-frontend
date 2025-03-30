import { useState, useEffect } from "react";
import { getNewsRequest, getNewByIdRequest } from "../actions/news"; 

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las noticias
  const fetchNews = async () => {
    setLoading(true);
    const [err, data] = await getNewsRequest();
    if (err) {
      setError(err.message || "Error al cargar las noticias");
      setNews([]);
    } else {
      setNews(data);
      setError(null);
    }
    setLoading(false);
  };

  // Obtener noticia por ID
  const fetchNewsById = async (id) => {
    setLoading(true);
    const [err, data] = await getNewByIdRequest({ id });
    setLoading(false);
    if (err) {
      setError(err.message || "Error al cargar la noticia");
      return null;
    }
    return data;
  };

  // Cargar las noticias al montar el hook
  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    fetchNewsById,
  };
};