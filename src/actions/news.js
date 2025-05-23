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

export const getNewByIdRequest = async ({id}) => {
  return api
    .get(`/api/news/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const createNewsRequest = async news => {
  return api
    .post(`api/news/create`, news)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const updateNewsRequest = async ({ id, news }) => {
  return api
    .put(`api/news/${id}`, news)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}

export const deleteNewsRequest = async ({ id }) => {
  return api
    .delete(`api/news/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}
        
