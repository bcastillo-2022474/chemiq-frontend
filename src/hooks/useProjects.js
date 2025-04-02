import { useState, useEffect } from "react"
import {
  createProjectRequest,
  deleteProjectRequest,
  getProjectByIdRequest,
  getProjectsRequest,
  updateProjectRequest
} from "@/actions/projects"

export function useProyectos() {
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all proyectos
  const fetchProyectos = async () => {
    setLoading(true)
    const [error, projects] = await getProjectsRequest()

    if (error) {
      setError(error.message)
    } else {
      setProyectos(projects)
    }
    setLoading(false)
  }

  // Fetch a single proyecto by ID
  const fetchProyectoById = async id => {
    setLoading(true)
    const [error, project] = await getProjectByIdRequest({ id })

    if (error) {
      setError(error.message)
    } else {
      setProyectos([project])
    }
    setLoading(false)
    return project
  }

  const createProyecto = async projectDTO => {
    const [error, project] = await createProjectRequest(projectDTO)
    if (error) {
      setError(error.message)
      return
    }
    void fetchProyectos()

    
  }

  // Update a proyecto
  const updateProyecto = async (id, projectDTO) => {
    const [error, project] = await updateProjectRequest({
      id,
      project: projectDTO
    })
    if (error) {
      setError(error.message)
      return
    }
    void fetchProyectos()
    return project
  }

  // Delete a proyecto
  const deleteProyecto = async id => {
    const [error] = await deleteProjectRequest({ id })
    if (error) {
      setError(error.message)
      return
    }
    void fetchProyectos()
  }

  // Fetch proyectos on component mount
  useEffect(() => {
    void fetchProyectos()
  }, [])

  return {
    proyectos,
    loading,
    error,
    fetchProyectos,
    fetchProyectoById,
    createProyecto,
    updateProyecto,
    deleteProyecto
  }
}
