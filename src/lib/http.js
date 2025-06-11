import { BASE_URL } from "@/lib/constants"
import axios from "axios"

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})

const UNAUTHORIZED_ERRORS = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  MISSING_TOKEN: "MISSING_TOKEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  MISSING_REFRESH_TOKEN: "MISSING_REFRESH_TOKEN",
  INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
}

const needsRefresh = (error_code) => {
  return [UNAUTHORIZED_ERRORS.MISSING_TOKEN, UNAUTHORIZED_ERRORS.INVALID_TOKEN].includes(error_code)
}

export function setUpInterceptors(navigate, setRefreshing, verifyAuth) {
  api.interceptors.response.use(
    response => {
      return response
    },
    error => {
      console.log({
        message: error.response.data.message,
        needsRefresh: needsRefresh(error.response.data.error_code),
      })

      if (
        error.response.status === 401 &&
        needsRefresh(error.response.data.error_code)
      ) {
        setRefreshing(true) // Set refreshing state

        return api
          .post(`/refresh-token`)
          .then(() => {
            // After successful refresh, verify auth to update context
            verifyAuth()
            setRefreshing(false) // Clear refreshing state
            // retry original request
            return axios(error.config)
          })
          .catch((error) => {
            setRefreshing(false) // Clear refreshing state
            console.log(error.response.data)
            // Redirect to login only if refresh fails
            if (window.location.pathname !== "/login") navigate("/login")
            return Promise.reject(error)
          })
      }
      return Promise.reject(error)
    }
  )
}