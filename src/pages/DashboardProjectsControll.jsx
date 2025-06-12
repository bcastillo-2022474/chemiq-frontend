import { useState, useEffect } from "react";
import { ProjectList } from "@/components/ui/DashboardProjectList";
import { ProjectDetails } from "@/components/ui/DashboardProjectsDetails";
import { AddMemberModal } from "@/components/ui/DashboardModalProjectMember";
import { useProyectos } from "@/hooks/useProjects";
import { getMembersByProjectIdRequest } from "../actions/members";
import { deleteProjectRequest } from "../actions/projects";
import { useUsers } from "@/hooks/useUsers";
import LoaderCustom from "../components/ui/LoaderCustom";
import { AddProjectModal } from "@/components/modals/project/ProjectModal.jsx";

export function Projects() {
  const { proyectos, loading, error, createProyecto, updateProyecto, fetchProyectos } = useProyectos();
  const { users } = useUsers();

  const [selectedProject, setSelectedProject] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [members, setMembers] = useState([]);
  const [projectOwner, setProjectOwner] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      void fetchMembers(selectedProject.id);
      findProjectOwner(selectedProject.dueno_id);
    }
  }, [selectedProject, users]);


  useEffect(() => {
    if (!isUpdating) return;

    const updateData = async () => {
      await fetchProyectos();
      setIsUpdating(false);
    };

    void updateData();
  }, [isUpdating, fetchProyectos]);

  const fetchMembers = async (projectId) => {
    try {
      const [error, data] = await getMembersByProjectIdRequest({ id: projectId });
      if (!error && Array.isArray(data)) {
        setMembers(data);
        const owner = data.find(member => member.is_owner);
        setProjectOwner(owner?.user);
      } else {
        console.error("Error fetching members or invalid data:", error || "Data is not an array");
        setMembers([]);
      }
    } catch (unexpectedError) {
      console.error("Unexpected error fetching members:", unexpectedError);
      setMembers([]);
    }
  };

  const findProjectOwner = (ownerId) => {
    if (users && ownerId) {
      const owner = users.find(user => user.carne === ownerId || user.carne === Number(ownerId));
      setProjectOwner(owner || null);
    } else {
      setProjectOwner(null);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject({
      ...project,
      dueno: projectOwner
    });
  };

  const handleAddMember = async (projectId, userId) => {
    try {
      setIsUpdating(true);
      const proyectoActual = proyectos.find((p) => p.id === projectId);
      if (!proyectoActual) {
        throw new Error("Proyecto no encontrado");
      }

      const currentIntegrantes = Array.isArray(proyectoActual.integrantes)
        ? proyectoActual.integrantes
        : [];

      if (currentIntegrantes.includes(userId)) {
        console.log(`Usuario ${userId} ya es miembro del proyecto`);
        return;
      }

      const nuevosIntegrantes = [...currentIntegrantes, userId];

      const updatedProject = await updateProyecto(projectId, {
        ...proyectoActual,
        integrantes: nuevosIntegrantes,
      });

      if (updatedProject) {
        setSelectedProject({
          ...proyectoActual,
          integrantes: nuevosIntegrantes,
          dueno: projectOwner,
        });
        await fetchMembers(projectId);
        await fetchProyectos();
      }
    } catch (error) {
      console.error("Error al agregar miembro:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este proyecto?")) {
      try {
        setIsUpdating(true);
        await deleteProjectRequest({ id: projectId });
        await fetchProyectos();
        setSelectedProject(null);
      } catch (error) {
        console.error("Error al eliminar proyecto:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setIsEditProjectModalOpen(true);
  };

  const handleUpdateProject = async (projectId, updatedProject) => {
    try {
      setIsUpdating(true);
      const result = await updateProyecto(projectId, updatedProject);

      if (result) {
        await fetchProyectos();

        if (selectedProject && selectedProject.id === projectId) {
          const updatedSelectedProject = {
            ...updatedProject,
            id: projectId,
            dueno: projectOwner
          };
          setSelectedProject(updatedSelectedProject);
          await fetchMembers(projectId);
        }

        setIsEditProjectModalOpen(false);
      }
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || isUpdating) return <LoaderCustom/>;
  if (error) return <p>Error: {error}</p>;

  const enrichedSelectedProject = selectedProject && {
    ...selectedProject,
    dueno: projectOwner
  };

  const createProject = async (data) => {
    const newProject = {
      nombre: data.nombre,
      informacion: data.informacion,
      img: data.img || null,
      youtube: data.youtube || null,
      dueno_id: Number.parseInt(data.dueno_id, 10),
      integrantes: [],
    }

    return createProyecto(newProject)
  }

  return (
    <main className="flex-1 overflow-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Project Management</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <ProjectList
          projects={proyectos}
          onProjectClick={handleProjectClick}
          onAddProject={() => setIsAddProjectModalOpen(true)}
        />
        {enrichedSelectedProject && (
          <ProjectDetails
            project={enrichedSelectedProject}
            projectOwner={projectOwner}
            members={members}
            onAddMember={() => setIsAddMemberModalOpen(true)}
            onDeleteProject={handleDeleteProject}
            onEditProject={handleEditProject}
          />
        )}
      </div>
      {isAddMemberModalOpen && (
        <AddMemberModal
          projectId={selectedProject?.id ?? 0}
          onAddMember={handleAddMember}
          onClose={() => setIsAddMemberModalOpen(false)}
        />
      )}
      {isAddProjectModalOpen && (
        <AddProjectModal
          defaultValues={null}
          onSubmit={createProject}
          onClose={() => setIsAddProjectModalOpen(false)}
        />
      )}
      {isEditProjectModalOpen && projectToEdit && (
        <>
          <AddProjectModal
            defaultValues={{ ...projectToEdit, dueno_id: projectToEdit.dueno?.carne || "" }}
            onSubmit={async (updatedProject) => handleUpdateProject(projectToEdit.id, updatedProject)}
            onClose={() => setIsEditProjectModalOpen(false)}
          />
        </>
      )}
    </main>
  );
}