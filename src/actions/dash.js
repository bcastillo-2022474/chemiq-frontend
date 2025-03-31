import { api } from "@/lib/http"

export const getStats = async () => {
  return api
    .get(`/api/stats`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}