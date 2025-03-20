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

export const generateResetLinkRequest = async ({ email }) => {
  return api
    .post(`${API_URL}/forgot-password`, { email })
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const resetPasswordRequest = async ({ password, token }) => {
  return api
    .post(`${API_URL}/restore-password`, { password, token })
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}
