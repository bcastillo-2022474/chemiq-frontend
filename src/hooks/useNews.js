import { useState, useEffect } from "react";
import { 
  getNewsRequest, 
  getNewByIdRequest, 
  createNewsRequest, 
  updateNewsRequest, 
  deleteNewsRequest 
} from "../actions/news";

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const createNews = async (newsData) => {
    setLoading(true);
    const [err, data] = await createNewsRequest(newsData);
    setLoading(false);
    if (err) {
      setError(err.message || "Error al crear la noticia");
      return false;
    }
    setNews(prev => [...prev, data]);
    return true;
  };

  const updateNews = async (id, newsData) => {
    setLoading(true);
    const [err, data] = await updateNewsRequest(id, newsData);
    setLoading(false);
    if (err) {
      setError(err.message || "Error al actualizar la noticia");
      return false;
    }
    setNews(prev => prev.map(item => item.id === id ? data : item));
    return true;
  };

  const deleteNews = async (id) => {
    setLoading(true);
    const [err] = await deleteNewsRequest(id);
    setLoading(false);
    if (err) {
      setError(err.message || "Error al eliminar la noticia");
      return false;
    }
    setNews(prev => prev.filter(item => item.id !== id));
    return true;
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    fetchNews,
    fetchNewsById,
    createNews,
    updateNews,
    deleteNews,
  };
};