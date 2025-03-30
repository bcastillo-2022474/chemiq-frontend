import { useState, useEffect } from "react";
import { ProjectList } from "@/components/ui/DashboardProjectList";
import { ProjectDetails } from "@/components/ui/DashboardProjectsDetails";
import { AddMemberModal } from "@/components/ui/DashboardModalProjectMember";
import { AddProjectModal } from "@/components/ui/DashboardModalAddProject";
import { useProyectos } from "@/hooks/useProjects";
import { getMembersByProjectIdRequest } from "../actions/members";
import { deleteProjectRequest } from "../actions/projects";
import { useUsers } from "@/hooks/useUsers";
import { EditProjectModal } from "../components/ui/DashboardProjectsEdit";

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

  useEffect(() => {
    if (selectedProject) {
      fetchMembers(selectedProject.id);
      findProjectOwner(selectedProject.dueno_id);
    }
  }, [selectedProject, users]);

  const fetchMembers = async (projectId) => {
    try {
      const [error, data] = await getMembersByProjectIdRequest({ id: projectId });
      if (!error && Array.isArray(data)) {
        setMembers(data);
        // Optional: Extract the owner for special handling
        const owner = data.find(member => member.is_owner);
        console.log("Project owner:", owner?.user.name || "No owner found");
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
      const proyectoActual = proyectos.find((p) => p.id === projectId);
      if (!proyectoActual) {
        console.error("Proyecto no encontrado:", projectId);
        return;
      }
  
      // Asegurarse de que integrantes sea un array
      const currentIntegrantes = Array.isArray(proyectoActual.integrantes)
        ? proyectoActual.integrantes
        : [];
  
      // Evitar duplicados
      if (currentIntegrantes.includes(userId)) {
        console.log(`Usuario ${userId} ya es miembro del proyecto`);
        return;
      }
  
      const nuevosIntegrantes = [...currentIntegrantes, userId];
  
      await updateProyecto(projectId, {
        ...proyectoActual,
        integrantes: nuevosIntegrantes,
      });
  
      setSelectedProject({
        ...proyectoActual,
        integrantes: nuevosIntegrantes,
        dueno: projectOwner,
      });
  
      fetchMembers(projectId);
    } catch (error) {
      console.error("Error al agregar miembro:", error);
    }
  };

  const handleAddProject = async (newProject) => {
    try {
      await createProyecto(newProject);
      await fetchProyectos();
      setSelectedProject(null);
      setIsAddProjectModalOpen(false);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este proyecto?")) {
      try {
        await deleteProjectRequest({ id: projectId });
        await fetchProyectos();
        setSelectedProject(null);
      } catch (error) {
        console.error("Error al eliminar proyecto:", error);
      }
    }
  };
  
  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setIsEditProjectModalOpen(true);
  };
  
  const handleUpdateProject = async (projectId, updatedProject) => {
    try {
      await updateProyecto(projectId, updatedProject);
      await fetchProyectos();
      
      // Actualizar el proyecto seleccionado si es el mismo que se editó
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject({
          ...updatedProject,
          id: projectId,
          dueno: projectOwner
        });
      }
      
      setIsEditProjectModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    }
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>Error: {error}</p>;

  // Actualiza el proyecto seleccionado con la información del propietario
  const enrichedSelectedProject = selectedProject && {
    ...selectedProject,
    dueno: projectOwner
  };

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
          onAddProject={handleAddProject} 
          onClose={() => setIsAddProjectModalOpen(false)} 
        />
      )}
      {isEditProjectModalOpen && projectToEdit && (
        <EditProjectModal 
          project={projectToEdit}
          projectOwner={projectOwner}
          onUpdateProject={(updatedProject) => handleUpdateProject(projectToEdit.id, updatedProject)}
          onClose={() => setIsEditProjectModalOpen(false)} 
        />
      )}
    </main>
  );
}