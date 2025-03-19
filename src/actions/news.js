import { api } from "@/lib/http"

export const getNewsRequest = async () => {
  return api
    .get(`/api/news`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const getNewByIdRequest = async ({ id }) => {
  return api
    .get(`/api/news/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}
