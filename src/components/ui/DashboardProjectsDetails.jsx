"use client"

import { useState, useEffect } from "react"
import { useUsers } from "../../hooks/useUsers"

export function ProjectDetails({ project, onAddMember }) {
  const ownerDetails = project.dueno || null

  // Asegurarse de que integrantes sea un array, incluso si es null o undefined
  const integrantes = Array.isArray(project.integrantes) ? project.integrantes : []

  return (
    <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-64">
        <img src={project.proyecto_img || "/placeholder.svg"} alt={project.proyecto_nombre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-white">{project.proyecto_nombre}</h2>
          {ownerDetails && (
            <div className="mt-2 px-3 py-1 bg-indigo-600 rounded-full text-white text-sm font-medium flex items-center">
              {ownerDetails.img && (
                <img
                  src={ownerDetails.img || "/placeholder.svg"}
                  alt={ownerDetails.nombre}
                  className="w-5 h-5 rounded-full mr-2 object-cover"
                />
              )}
              Owner: {ownerDetails.nombre}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Information</h3>
          {ownerDetails && (
            <div className="mb-2 flex items-center">
              <span className="font-semibold text-indigo-600 mr-2">Project Owner:</span>
              <div className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md">
                {ownerDetails.img && (
                  <img
                    src={ownerDetails.img || "/placeholder.svg"}
                    alt={ownerDetails.nombre}
                    className="w-5 h-5 rounded-full mr-2 object-cover"
                  />
                )}
                <span>{ownerDetails.nombre}</span>
                <span className="text-xs ml-1 text-indigo-600">({ownerDetails.carne})</span>
              </div>
            </div>
          )}
          <p className="text-gray-600">{project.informacion}</p>
        </div>
        {project.youtube && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">YouTube Video</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${project.youtube.split("v=")[1] || project.youtube}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Team Members</h3>
          {integrantes.length > 0 ? (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {integrantes.map((integrante) => (
                <li key={integrante} className="flex items-center space-x-2">
                  {/* Aquí necesitarías otra fuente de datos o un hook adicional si quieres mostrar imágenes de cada miembro */}
                  <img
                    src="/placeholder.svg"
                    alt={`Team member ${integrante}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-600">{`Member ${integrante}`}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No team members added yet.</p>
          )}
          <button
            onClick={onAddMember}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  )
}
