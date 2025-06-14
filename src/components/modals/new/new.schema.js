import { z } from "zod"

export const newsSchema = z.object({
  titulo: z.string().min(1, "Title is required"),
  contenido: z.string().min(1, "Content is required"),
  img: z.string().min(1, "Image is required"),
  tipo: z.enum(["general", "evento", "noticia"], "Invalid news type"),
})