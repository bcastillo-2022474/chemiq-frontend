import { api } from "@/lib/http"

const API_URL = `/api/podcasts`

export const getPodcast = async () => {
  return api
    .get(`${API_URL}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const getPodcastByIdRequest = async ({ id }) => {
  return api
    .get(`${API_URL}/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const createPodcastRequest = async podcast => {
  return api
    .post(`${API_URL}/create`, podcast)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const updatePodcastRequest = async ({ id, podcast }) => {
  return api
    .put(`${API_URL}/${id}`, podcast)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const deletePodcastRequest = async ({ id }) => {
  return api
    .delete(`${API_URL}/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}
        
