import { api } from "@/lib/http"

export const getMembersByProjectIdRequest = async ({ id }) => {
  return api
    .get(`/api/members/by-project/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}
