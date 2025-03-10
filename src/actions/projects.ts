import { BASE_URL } from "@/lib/constants"
import type { CreateProjectDTO, Project, Result } from "@/types/dto"
import axios from 'axios'

const API_URL = `${BASE_URL}/api/proyects`;

export const getProjectsRequest = async (): Promise<Result<Project[]>> => {
  return axios.get(`${API_URL}`)
    .then((response) => {
      return [null, response.data]
    }).catch((error) => {
      return [error, null]
    })
}

export const getProjectByIdRequest = async ({ id }: { id: string }): Promise<Result<Project>> => {
  return axios.get(`${API_URL}/${id}`)
    .then((response) => {
      return [null, response.data]
    }).catch((error) => {
      return [error, null]
    })
}

export const createProjectRequest = async (project: CreateProjectDTO): Promise<Result<Project>> => {
  return axios.post(`${API_URL}/create`, project)
    .then((response) => {
      return [null, response.data]
    }).catch((error) => {
      return [error, null]
    })
}

export const updateProjectRequest = async ({ id, project }: {
  id: string,
  project: CreateProjectDTO
}): Promise<Result<Project>> => {
  return axios.put(`${API_URL}/${id}`, project)
    .then((response) => {
      return [null, response.data]
    }).catch((error) => {
      return [error, null]
    })
}

export const deleteProjectRequest = async ({ id }: { id: string }): Promise<Result<undefined>> => {
  return axios.delete(`${API_URL}/${id}`)
    .then((response) => {
      return [null, response.data]
    }).catch((error) => {
      return [error, null]
    })
}