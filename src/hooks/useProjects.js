import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/proyects";

export function useProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all proyectos
  const fetchProyectos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL);
      setProyectos(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single proyecto by ID
  const fetchProyectoById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data; // Return the proyecto data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new proyecto
  const createProyecto = async (proyectoData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, proyectoData);
      fetchProyectos(); // Refresh the proyectos list
      return response.data; // Return the created proyecto data
    } catch (err) {
      setError(err.message);
    }
  };

  // Update a proyecto
  const updateProyecto = async (id, proyectoData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, proyectoData);
      fetchProyectos(); // Refresh the proyectos list
      return response.data; // Return the updated proyecto data
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a proyecto
  const deleteProyecto = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchProyectos(); // Refresh the proyectos list
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch proyectos on component mount
  useEffect(() => {
    fetchProyectos();
  }, []);

  return {
    proyectos,
    loading,
    error,
    fetchProyectoById,
    createProyecto,
    updateProyecto,
    deleteProyecto,
  };
}