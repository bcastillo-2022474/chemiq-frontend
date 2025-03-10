import { api } from "@/lib/http";
import type { New, Result } from "@/types/dto";

export const getNewsRequest = async (): Promise<Result<New[]>> => {
  return api.get(`/api/news`)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}

export const getNewByIdRequest = async ({ id }: { id: string }): Promise<Result<New>> => {
  return api.get(`/api/news/${id}`)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}