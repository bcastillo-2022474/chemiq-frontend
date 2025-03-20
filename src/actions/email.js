import { api } from "@/lib/http";

export const sendEmailRequest = async ({ name, subject, message, email }) => {
  return api
    .post(`email`, {
      name,
      subject,
      message,
      email,
      // obtenerToken: "true"
    })
    .then(() => {
      return [null]
    })
    .catch(error => {
      return [error, null]
    })
}
