import { JwtPayload as JWTPayload } from "jwt-decode";

export interface Project {
  id: number,
  proyecto_nombre: string,
  informacion: string,
  proyecto_img: string,
  count_members: number,
}

interface NestedUser {
  carne: string,
  name: string,
  email: string,
  rol: string,
  img?: string
}

export interface Member {
  id: string,
  project_id: string,
  is_owner: boolean,
  user: NestedUser
}

export interface Project {
  proyecto_img: string
  proyecto_nombre: string
  informacion: string
  created_at: Date
}

export type JwtPayload = JWTPayload & { rol: "Admin" | "Junta" | "User" }