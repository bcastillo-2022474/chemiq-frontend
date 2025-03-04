import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/lib/constants.js";

const API_URL = `${BASE_URL}/api/proyects`;

export function useProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all proyectos
  const fetchProyectos = async () => {
    setLoading(true);
    try {
      console.log({API_URL})
      const response = await axios.get(API_URL);
      console.log(response.data);
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
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data; // Return the proyecto data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProyecto = async (proyectoData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, proyectoData);
    
  
      await fetchProyectos();
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error("Error al crear proyecto:", err.message);
    }
  };
  
  

  // Update a proyecto
  const updateProyecto = async (id, proyectoData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, proyectoData);
      fetchProyectos(); // Refresh the proyectos list
      return response.data; // Return the updated proyecto data
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a proyecto
  const deleteProyecto = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
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
    fetchProyectos,
    fetchProyectoById,
    createProyecto,
    updateProyecto,
    deleteProyecto,
  };
}