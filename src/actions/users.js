import { api } from "@/lib/http"

const API_URL = `/api/users`

export const getUsers = async () => {
  return api
    .get(`${API_URL}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const createUserRequest = async user => {
  return api
    .post(`${API_URL}/create`, user)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const updateUserRequest = async ({ id, user }) => {
  return api
    .put(`${API_URL}/${id}`, user)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const deleteUserRequest = async ({ id }) => {
  return api
    .delete(`${API_URL}/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}
