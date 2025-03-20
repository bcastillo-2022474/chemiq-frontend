import { api } from "@/lib/http";

export const sendEmailToSelfRequest = async ({ name, subject, message, email }) => {
  return api
    .post(`email-self`, {
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
