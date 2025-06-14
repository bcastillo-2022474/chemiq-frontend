import { useEffect, useState } from "react";
import { ProjectList } from "@/components/ui/DashboardProjectList.jsx";
import { AddProjectModal } from "@/components/modals/project/ProjectModal.jsx";
import { useProyectosStore } from "@/hooks/useProjects.js";
import LoaderCustom from "@/components/ui/LoaderCustom.jsx";
import { Outlet } from "react-router-dom";

export function Projects() {
  const { proyectos, loading, error, createProyecto, fetchProyectos } = useProyectosStore();
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  console.log({
    proyectos,
    loading,
    error,
  })

  const handleCreateProject = async (data) => {
    const newProject = {
      nombre: data.nombre,
      informacion: data.informacion,
      img: data.img || null,
      youtube: data.youtube || null,
      dueno_id: Number.parseInt(data.dueno_id, 10),
      integrantes: [],
    };
    return createProyecto(newProject);
  };

  useEffect(() => {
    void fetchProyectos()
  }, []);


  if (loading && proyectos.length === 0) return <LoaderCustom/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex-1 overflow-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Project Management</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <ProjectList
          projects={proyectos}
          onAddProject={() => setIsAddProjectModalOpen(true)}
        />

        <Outlet/>
      </div>

      {isAddProjectModalOpen && (
        <AddProjectModal
          defaultValues={null}
          onSubmit={handleCreateProject}
          onClose={() => setIsAddProjectModalOpen(false)}
        />
      )}
    </main>
  );
}