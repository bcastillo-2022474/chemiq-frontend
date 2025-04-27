import { Calendar, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ProjectCard({ proyecto, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card 
      className="group overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border-none cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={proyecto.img || "/placeholder.svg"}
          alt={proyecto.proyecto_nombre}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
          {proyecto.proyecto_nombre}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-[#28BC98]" />
            {formatDate(proyecto.created_at)}
          </span>
          {proyecto.count_members && (
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-[#28BC98]" />
              {proyecto.count_members}
            </span>
          )}
        </div>
        <p className="text-gray-700 line-clamp-3">{proyecto.informacion}</p>
      </div>
    </Card>
  );
}