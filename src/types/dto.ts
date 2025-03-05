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