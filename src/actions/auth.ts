import type { Credentials, JwtPayload, Result } from "@/types/dto";
import { api } from "@/lib/http";

export const loginRequest = async ({ email, password }: Credentials): Promise<Result<undefined>> => {
  return api.post<{ token?: string }>(`login`, {
    correo: email,
    password: password,
    obtenerToken: 'true'
  }).then(() => {
    return [null];
  }).catch(error => {
    console.log(error);
    return [error, null]
  })
}

export const resetPasswordRequest = async ({ password }: { password: string }): Promise<Result<{
  message: string
}>> => {
  return api.post<{ message: string }>(`resetPassword`, { password })
    .then(response => {
      return [null, response.data];
    })
    .catch(error => {
      return [error, null];
    });
}

export const verifyAuthRequest = async (): Promise<Result<JwtPayload>> => {
  return api.get(`verify-auth`)
    .then(response => {
      return [null, response.data];
    })
    .catch(error => {
      return [error, null];
    });
}