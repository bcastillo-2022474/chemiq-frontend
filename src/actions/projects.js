import { api } from "@/lib/http"

const API_URL = `/api/proyects`

export const getProjectsRequest = async () => {
  return api
    .get(`${API_URL}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const getProjectByIdRequest = async ({ id }) => {
  return api
    .get(`${API_URL}/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const createProjectRequest = async project => {
  return api
    .post(`${API_URL}/create`, project)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const updateProjectRequest = async ({ id, project }) => {
  return api
    .put(`${API_URL}/${id}`, project)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const deleteProjectRequest = async ({ id }) => {
  return api
    .delete(`${API_URL}/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}
