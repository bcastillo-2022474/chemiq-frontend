import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectDetails } from "@/components/ui/DashboardProjectsDetails";
import { AddMemberModal } from "@/components/ui/DashboardModalProjectMember";
import { AddProjectModal } from "@/components/modals/project/ProjectModal.jsx";
import { useProyectosStore } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import { getMembersByProjectIdRequest } from "@/actions/members";
import LoaderCustom from "@/components/ui/LoaderCustom";

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { updateProyecto, fetchProyectoById, deleteProyecto } = useProyectosStore();
  const { users } = useUsers();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modals, setModals] = useState({
    addMember: false,
    editProject: false
  });

  useEffect(() => {
    async function fetchProject() {
      const currentProject = await fetchProyectoById(projectId)
      if (currentProject) {
        setProject(currentProject);
        fetchMembers(currentProject.id);
      }
    }

    void fetchProject();
  }, [projectId, users, isUpdating]);

  const fetchMembers = async (id) => {
    try {
      const [error, data] = await getMembersByProjectIdRequest({ id });
      if (!error && Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    }
  };

  const toggleModal = (modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  };

  const handleAddMember = async (projectId, userId) => {
    try {
      setIsUpdating(true);
      const currentIntegrantes = Array.isArray(project.integrantes)
        ? project.integrantes
        : [];

      if (currentIntegrantes.includes(userId)) return;

      await updateProyecto(projectId, {
        ...project,
        integrantes: [...currentIntegrantes, userId],
      });

      await fetchMembers(projectId);
      setIsUpdating(false);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar este proyecto?")) return;

    try {
      setIsUpdating(true);
      await deleteProyecto(projectId);
      navigate('../');
      // do not set isUpdating to false here, as it will be set after the project is deleted
      // and a bug occurs
      // setIsUpdating(false);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleUpdateProject = async (projectId, updatedProject) => {
    try {
      setIsUpdating(true);
      await updateProyecto(projectId, updatedProject);
      toggleModal('editProject', false);
      setIsUpdating(false);
      setProject({ ...updatedProject, id: projectId });
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  if (isUpdating) return <LoaderCustom/>;
  if (!project) return <div>Project not found</div>;

  return (
    <>
      <ProjectDetails
        project={{ ...project, dueno: project.owner }}
        projectOwner={project.owner}
        members={members}
        onAddMember={() => toggleModal('addMember', true)}
        onDeleteProject={handleDeleteProject}
        onEditProject={() => toggleModal('editProject', true)}
      />

      {modals.addMember && (
        <AddMemberModal
          projectId={project.id}
          onAddMember={handleAddMember}
          onClose={() => toggleModal('addMember', false)}
        />
      )}

      {modals.editProject && (
        <AddProjectModal
          defaultValues={{
            ...project,
            dueno_id: project.owner?.carne || ""
          }}
          onSubmit={(updatedProject) => handleUpdateProject(project.id, updatedProject)}
          onClose={() => toggleModal('editProject', false)}
        />
      )}
    </>
  );
}