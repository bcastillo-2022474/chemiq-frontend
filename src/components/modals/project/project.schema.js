import { z } from "zod"

export const projectSchema = z.object({
  nombre: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters"),
  informacion: z
    .string()
    .min(1, "Project information is required")
    .min(10, "Project information must be at least 10 characters")
    .max(1000, "Project information must be less than 1000 characters"),
  img: z.string().optional(),
  youtube: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
        return youtubeRegex.test(value)
      },
      { message: "Please enter a valid YouTube URL" }
    ),
  dueno_id: z.string().min(1, "Project owner is required"),
})