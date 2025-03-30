import { useState, useEffect } from "react";
import {
  getPodcast,
  getPodcastByIdRequest,
  createPodcastRequest,
  updatePodcastRequest,
  deletePodcastRequest,
} from "../actions/podcast"; // Ajusta la ruta según tu estructura

export const usePodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los podcasts
  const fetchPodcasts = async () => {
    setLoading(true);
    const [err, data] = await getPodcast();
    if (err) {
      setError(err.message || "Error al cargar los podcasts");
      setPodcasts([]);
    } else {
      setPodcasts(data);
      setError(null);
    }
    setLoading(false);
  };

  // Obtener podcast por ID
  const fetchPodcastById = async (id) => {
    setLoading(true);
    const [err, data] = await getPodcastByIdRequest({ id });
    setLoading(false);
    if (err) {
      setError(err.message || "Error al cargar el podcast");
      return null;
    }
    return data;
  };

  // Crear podcast
  const createPodcast = async (podcast) => {
    setLoading(true);
    const [err, data] = await createPodcastRequest(podcast);
    if (err) {
      setError(err.message || "Error al crear el podcast");
    } else {
      setPodcasts((prev) => [...prev, data]);
    }
    setLoading(false);
    return [err, data];
  };

  // Actualizar podcast
  const updatePodcast = async (id, podcast) => {
    setLoading(true);
    const [err, data] = await updatePodcastRequest({ id, podcast });
    if (err) {
      setError(err.message || "Error al actualizar el podcast");
    } else {
      setPodcasts((prev) =>
        prev.map((item) => (item.id === id ? data : item))
      );
    }
    setLoading(false);
    return [err, data];
  };

  // Eliminar podcast
  const deletePodcast = async (id) => {
    setLoading(true);
    const [err, data] = await deletePodcastRequest({ id });
    if (err) {
      setError(err.message || "Error al eliminar el podcast");
    } else {
      setPodcasts((prev) => prev.filter((item) => item.id !== id));
    }
    setLoading(false);
    return [err, data];
  };

  // Cargar los podcasts al montar el hook
  useEffect(() => {
    fetchPodcasts();
  }, []);

  return {
    podcasts,
    loading,
    error,
    fetchPodcastById,
    createPodcast,
    updatePodcast,
    deletePodcast,
  };
};