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