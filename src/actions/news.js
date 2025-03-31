import { api } from "@/lib/http"

export const getNewsRequest = async () => {
  return api
    .get(`/api/news`)
    .then(response => [null, response.data])
    .catch(error => [error, null])
}

export const getNewByIdRequest = async ({ id }) => {
  return api
    .get(`/api/news/${id}`)
    .then(response => [null, response.data])
    .catch(error => [error, null])
}

export const createNewsRequest = async (newsData) => {
  return api
    .post(`/api/news/create`, newsData)
    .then(response => [null, response.data])
    .catch(error => [error, null])
}

export const updateNewsRequest = async (id, newsData) => {
  return api
    .put(`/api/news/${id}`, newsData)
    .then(response => [null, response.data])
    .catch(error => [error, null])
}

export const deleteNewsRequest = async (id) => {
  return api
    .delete(`/api/news/${id}`)
    .then(response => [null, response.data])
    .catch(error => [error, null])
}