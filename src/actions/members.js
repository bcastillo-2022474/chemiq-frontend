import { api } from "@/lib/http"

export const getMembersByProjectIdRequest = async ({ id }) => {
  return api
    .get(`/api/members/by-project/${id}`)
    .then(response => {
      return [null, response.data]
    })
    .catch(error => {
      return [error, null]
    })
}


export const addMembersToProjectRequest = async ({ user_id, project_id }) => {
  return api
    .post("/api/members", { user_id, project_id })
    .then((response) => [null, response.data]) // Corregido: devuelve [null, response.data]
    .catch((error) => [error, null]);
};


export const deleteMemberRequest = async ({ id }) => {
  return api
    .delete(`/api/members/${id}`)
    .then((response) => [null, response.data])
    .catch((error) => [error, null]);
};
