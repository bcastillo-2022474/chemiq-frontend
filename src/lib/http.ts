import { BASE_URL } from "@/lib/constants";
import axios from 'axios';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setUpInterceptors(navigate: (path: string) => void) {
  api.interceptors.response.use((response) => {
    return response
  }, (error) => {
    console.log({ message: error.response.data.mensaje })
    if (error.response.status === 401 && error.response.data.mensaje === "Invalid token.") {
      return api.post(`/refresh-token`).then(() => {
        // retry original request
        axios(error.config)
      }).catch(() => {
        // redirect to login

        if (window.location.pathname !== '/login') navigate('/login')
      })
    }
    console.log({error})
    return Promise.reject(error)
  })
}