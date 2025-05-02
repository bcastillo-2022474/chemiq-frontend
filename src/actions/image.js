import { api } from "@/lib/http"

const API_URL = `/api/images`

export const getImages = async () => {
    return api
        .get(`${API_URL}`)
        .then(response => {
            return [null, response.data]
        })
        .catch(error => {
            return [error, null]
        })
}

export const getImageByTypeRequest = async ({ type }) => {
    return api
        .get(`${API_URL}/${type}`)
        .then(response => {
            return [null, response.data]
        })
        .catch(error => {
            return [error, null]
        })
}
