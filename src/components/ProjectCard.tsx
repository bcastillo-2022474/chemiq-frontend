import type { Project } from "@/types/dto";
import { formatDate } from "@/lib/utils";

export interface ProjectCardProps {
  proyecto: Project;
  onReadMore: () => void;
}

export const ProjectCard = ({ proyecto, onReadMore }: ProjectCardProps) => {
  return (
    <div 
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300 cursor-pointer group w-full h-64 mb-4"
      onClick={onReadMore}
    >
      <div className="md:w-2/5 relative">
        <img
          src={proyecto.img || "/placeholder.svg"}
          alt={proyecto.nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>
      <div className="p-6 md:w-3/5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1d896e] mb-2">{proyecto.nombre}</h2>
          <p className="text-gray-700 mt-2">
            {proyecto.informacion.length > 150
              ? `${proyecto.informacion.substring(0, 150)}...`
              : proyecto.informacion}
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            {/*OWNER GOES HERE*/}
            {/*<span className="text-gray-500 text-sm">{proyecto.integrantes[0]?.nombre}</span>*/}
            <span className="text-gray-400 text-xs block">{formatDate(proyecto.created_at)}</span>
          </div>
          <div className="bg-[#28bc98] text-white px-3 py-1 rounded-full group-hover:bg-[#1d896e] transition-colors duration-300 flex items-center">
            <span className="text-sm font-medium">Ver más</span>
          </div>
        </div>
      </div>
    </div>
  );
};