import { create } from "zustand";
import {
  createProjectRequest,
  deleteProjectRequest,
  getProjectByIdRequest,
  getProjectsRequest,
  updateProjectRequest
} from "@/actions/projects";

export const useProyectosStore = create((set, get) => ({
  proyectos: [],
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchProyectos: async () => {
    console.log("CALLED fetchProyectos");
    set({ loading: true, error: null });
    try {
      const [error, projects] = await getProjectsRequest();
      if (error) {
        set({ error: error.message });
      } else {
        console.log("Updating proyectos state with fetched projects:", projects);
        set({ proyectos: projects });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProyectoById: async (id) => {
    const [error, project] = await getProjectByIdRequest({ id });

    if (error) {
      set({ error: error.message });
      return null;
    }
    return project;
  },

  createProyecto: async (projectDTO) => {
    set({ error: null });
    try {
      const [error, project] = await createProjectRequest(projectDTO);
      if (error) {
        set({ error: error.message });
        return null;
      }
      await get().fetchProyectos();
      return project;
    } catch (err) {
      set({ error: err.message });
      return null;
    }
  },

  updateProyecto: async (id, projectDTO) => {
    set({ error: null });
    try {
      const [error, project] = await updateProjectRequest({ id, project: projectDTO });
      if (error) {
        set({ error: error.message });
        return null;
      }
      await get().fetchProyectos();
      return project;
    } catch (err) {
      set({ error: err.message });
      return null;
    }
  },

  deleteProyecto: async (id) => {
    const [error] = await deleteProjectRequest({ id });
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetchProyectos();
  },
}));
