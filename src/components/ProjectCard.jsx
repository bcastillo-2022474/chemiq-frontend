"use client"

import { Calendar, Users, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"

export function ProjectCard({ proyecto, onClick, theme }) {

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card
      className="group overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
      style={{
        borderColor: theme?.Primary ? `${theme.Primary}33` : undefined,
      }}
      onClick={onClick}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={proyecto.img || "/placeholder.svg"}
          alt={proyecto.proyecto_nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Badge en la esquina superior */}
        <div className="absolute top-3 left-3">
          <span
            className="text-white text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${theme?.Primary || '#28BC98'}E6` }} // /90 en hex = E6
          >
            Proyecto
          </span>
        </div>

        <h3
          className="absolute bottom-4 left-4 text-xl font-bold text-white group-hover:transition-colors transition-colors duration-300 pr-4"
          style={{
            color: theme?.Primary || undefined,
          }}
        >
          {proyecto.proyecto_nombre}
        </h3>
      </div>

      <div className="p-5 space-y-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
            <Calendar
              className="h-4 w-4 mr-1.5"
              style={{ color: theme?.Primary || '#28BC98' }}
            />
            {formatDate(proyecto.created_at)}
          </span>

          {proyecto.count_members && (
            <span className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
              <Users
                className="h-4 w-4 mr-1.5"
                style={{ color: theme?.Primary || '#28BC98' }}
              />
              {proyecto.count_members} {proyecto.count_members === 1 ? "miembro" : "miembros"}
            </span>
          )}
        </div>

        <p className="text-gray-700 line-clamp-3 text-sm flex-grow">{proyecto.informacion}</p>

        <div className="pt-3 mt-auto">
          <button
            className="text-sm font-medium transition-colors flex items-center group-hover:underline"
            style={{
              color: theme?.Primary || '#28BC98',
            }}
          >
            Ver detalles
            <ExternalLink
              className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5"
              style={{
                color: theme?.Primary || '#28BC98',
              }}
            />
          </button>
        </div>
      </div>
    </Card>
  )
}
