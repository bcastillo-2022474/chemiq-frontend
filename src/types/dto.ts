import { JwtPayload as JWTPayload } from "jwt-decode";

type Rol = "Admin" | "Junta" | "User";

export interface Project {
  id: number,
  nombre: string,
  informacion: string,
  img: string,
  count_members: number,
  created_at: Date,
  updated_at: Date,
  created_by: string,
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

export interface New {
  id: string,
  titulo: string,
  contenido: string,
  img: string,
  tipo: string,
  created_at: Date,
  created_by: string,
  updated_at: Date

}

export interface User {
  carne: string,
  nombre: string,
  correo: string,
  rol_id: string,
  rol: Rol,
  img?: string
  created_at: Date,
  updated_at: Date,
  created_by: string
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  views: string;
  duration: string;
}

export interface Credentials {
  email: string;
  password: string;
}


export type CreateProjectDTO = Omit<Project, 'id' | 'count_members' | 'created_by' | 'created_at' | 'updated_at'>

export type CreateUserDTO = Omit<User, 'id' | 'rol' | 'created_at' | 'created_by' | 'updated_at'> & { password: string }


export type Result<T> = [error: Error, value: null] | [error: null, value: T];


export type JwtPayload = JWTPayload & { rol: Rol, nombre: string, correo: string, img: string }