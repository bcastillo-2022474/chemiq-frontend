import React, { useState } from "react"
import { ProjectList } from "../components/ui/DashboardProjectList"
import { ProjectDetails } from "../components/ui/DashboardProjectsDetails"
import { AddMemberModal } from "../components/ui/DashboardModalProjectMember"
import { Sidebar } from "../components/ui/SideBarDashboard"
import { useProyectos } from "../hooks/useProjects"
import { AddProjectModal } from "../components/ui/DashboardModalAddProject"

export function Projects() {
  const { proyectos, loading, error, createProyecto, updateProyecto, deleteProyecto } = useProyectos()

  const [selectedProject, setSelectedProject] = useState(null)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)

  const handleProjectClick = (project) => {
    setSelectedProject(project)
  }

  const handleAddMember = async (projectId, userId) => {
    try {
      const proyectoActual = proyectos.find((p) => p.id === projectId)
      const nuevosIntegrantes = [...proyectoActual.integrantes, userId]
      await updateProyecto(projectId, {
        ...proyectoActual,
        integrantes: nuevosIntegrantes,
      })
      setSelectedProject({
        ...proyectoActual,
        integrantes: nuevosIntegrantes,
      })
      setIsAddMemberModalOpen(false)
    } catch (error) {
      console.error("Error al agregar miembro:", error)
    }
  }

  const handleAddProject = async (newProject) => {
    try {
      await createProyecto(newProject)
      setIsAddProjectModalOpen(false)
    } catch (error) {
      console.error("Error al crear proyecto:", error)
    }
  }

  if (loading) return <p>Cargando proyectos...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Project Management</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <ProjectList
            projects={proyectos}
            onProjectClick={handleProjectClick}
            onAddProject={() => setIsAddProjectModalOpen(true)}
          />
          {selectedProject && (
            <ProjectDetails project={selectedProject} onAddMember={() => setIsAddMemberModalOpen(true)} />
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
          <AddProjectModal onAddProject={handleAddProject} onClose={() => setIsAddProjectModalOpen(false)} />
        )}
      </main>
    </div>
  )
}

