import React from 'react';



export function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-all"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título del modal */}
        {title && <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">{title}</h2>}

        {/* Contenido del modal */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
