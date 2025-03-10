import { api } from "@/lib/http"
import { CreateUserDTO, Result, User } from "@/types/dto";

const API_URL = `/api/users`

export const getUsers = async (): Promise<Result<User[]>> => {
  return api.get(`${API_URL}`)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}

export const createUserRequest = async (user: CreateUserDTO): Promise<Result<User>> => {
  return api.post(`${API_URL}/create`, user)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}

export const updateUserRequest = async ({ id, user }: { id: string, user: CreateUserDTO }): Promise<Result<User>> => {
  return api.put(`${API_URL}/${id}`, user)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}

export const deleteUserRequest = async ({ id }: { id: string }): Promise<Result<undefined>> => {
  return api.delete(`${API_URL}/${id}`)
    .then(response => {
      return [null, response.data]
    }).catch(error => {
      return [error, null]
    })
}
