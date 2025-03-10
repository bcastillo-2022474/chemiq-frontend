import { BASE_URL } from "@/lib/constants";
import { jwtDecode } from "jwt-decode";
import { JwtPayload, Result } from "@/types/dto";
import axios from "axios";

export interface Credentials {
  email: string;
  password: string;
}

export const loginRequest = async ({ email, password }: Credentials): Promise<Result<JwtPayload>> => {
  return axios.post<{ token?: string }>(`${BASE_URL}/api/login`, {
    correo: email,
    password: password,
    obtenerToken: 'true'
  }).then(response => {
    return [null, jwtDecode<JwtPayload>(response.data.token)];
  }).catch(error => {
    return [error, null]
  })
}

export const resetPasswordRequest = async ({password}: {password: string}): Promise<Result<{message: string}>> => {
  return axios.post<{ message: string }>(`${BASE_URL}/api/resetPassword`, { password })
    .then(response => {
      return [null, response.data];
    })
    .catch(error => {
      return [error, null];
    });
}