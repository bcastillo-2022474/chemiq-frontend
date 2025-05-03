import { api } from "@/lib/http";

const API_URL = `/api/images`;

export const getImages = async () => {
  return api
    .get(`${API_URL}`)
    .then((response) => {
      return [null, response.data];
    })
    .catch((error) => {
      return [error, null];
    });
};

export const createImageRequest = async (image) => {
  return api
    .post(`${API_URL}/create`, image)
    .then((response) => {
      return [null, response.data];
    })
    .catch((error) => {
      return [error, null];
    });
};

export const updateImageRequest = async ({ id, image }) => {
  return api
    .put(`${API_URL}/${id}`, image)
    .then((response) => {
      return [null, response.data];
    })
    .catch((error) => {
      return [error, null];
    });
};

export const deleteImageRequest = async ( id ) => {
  return api
    .delete(`${API_URL}/${id}`)
    .then((response) => {
      return [null, response.data];
    })
    .catch((error) => {
      return [error, null];
    });
};
