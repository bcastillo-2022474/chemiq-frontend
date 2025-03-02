import React from "react";
import PropTypes from "prop-types";

const ProjectCard = ({ proyecto, onReadMore }) => {
  return (
    <div 
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300 cursor-pointer group w-full h-64 mb-4"
      onClick={onReadMore}
    >
      <div className="md:w-2/5 relative">
        <img
          src={proyecto.proyecto_img || "/placeholder.svg"}
          alt={proyecto.proyecto_nombre}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>
      <div className="p-6 md:w-3/5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1d896e] mb-2">{proyecto.proyecto_nombre}</h2>
          <p className="text-gray-700 mt-2">
            {proyecto.informacion.length > 150
              ? `${proyecto.informacion.substring(0, 150)}...`
              : proyecto.informacion}
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-gray-500 space-x-4">
            <div className="flex items-center">
              <span>{proyecto.integrantes[0]?.nombre}</span>
            </div>
          </div>
          <div className="bg-[#28bc98] text-white px-3 py-1 rounded-full group-hover:bg-[#1d896e] transition-colors duration-300 flex items-center">
            <span className="text-sm font-medium">Ver más</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  proyecto: PropTypes.object.isRequired,
  onReadMore: PropTypes.func.isRequired,
};

export default ProjectCard;
