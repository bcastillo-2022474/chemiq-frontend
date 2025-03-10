import axios from 'axios'
import { BASE_URL } from "@/lib/constants";
import type { New, Result } from "@/types/dto";

export const getNewsRequest = async (): Promise<Result<New[]>> => {
  return axios.get(`${BASE_URL}/api/news`)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}

export const getNewByIdRequest = async ({ id }: { id: string }): Promise<Result<New>> => {
  return axios.get(`${BASE_URL}/api/news/${id}`)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}