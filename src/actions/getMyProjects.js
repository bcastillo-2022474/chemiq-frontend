import { api } from "@/lib/http";

export const getMyProjects = async () => {
  return api
    .get(`/api/projects/`)
    .then(response => {
      return [null, response.data];
    })
    .catch(error => {
      return [error, null];
    });
};

export const updateMyProject = async ({ id, nombre, informacion }) => {
  return api
    .put(`/api/projects/${id}`, { nombre, informacion })
    .then(response => {
      return [null, response.data];
    })
    .catch(error => {
      return [error, null];
    });
};


export const deleteMyProject = async (id) => {
  return api
    .delete(`/api/projects/${id}`)
    .then(response => {
      return [null, response.data];
    })
    .catch(error => {
      return [error, null];
    });
};
