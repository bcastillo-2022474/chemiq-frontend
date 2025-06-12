import { api } from "@/lib/http"

const API_URL = `/api/colors`

export const getColors = async () => {
  return api
    .get(`${API_URL}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const getColorByIdRequest = async ({ id }) => {
  return api
    .get(`${API_URL}/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const getColorByNameRequest = async ({ name }) => {
  return api
    .get(`${API_URL}/${name}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const updateColorRequest = async ({ nombre, color }) => {
  return api
    .put(`${API_URL}/${nombre}`, color)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}