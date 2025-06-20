import { api } from "@/lib/http"

export const loginRequest = async ({ email, password }) => {
  return api
    .post(`login`, {
      correo: email,
      password: password,
      // obtenerToken: "true"
    })
    .then(() => {
      return [null]
    })
    .catch(error => {
      console.log(error)
      return [error, null]
    })
}

export const logoutRequest = async () => {
  return api
    .post(`logout`)
    .then(() => {
      return [null]
    })
    .catch(error => {
      return [error, null]
    })
}

export const verifyAuthRequest = async () => {
  return api
    .get(`verify-auth`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}
