import "./LoadingBeaker.css"

export function LoadingBeaker() {
  return (
    <div className="fixed inset-0 bg-[#FFF8F0] flex items-center justify-center z-50">
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Anillo de carga */}
        <svg
          className="absolute animate-spin-slow w-40 h-40 text-[#28BC98]"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-20"
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            d="M50 5 A 45 45 0 0 1 95 50"
          />
        </svg>

        {/* Beaker estático */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-[#0B2F33] relative z-10"
        >
          {/* Beaker base */}
          <path d="M4.5 3h15" />
          <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
          
          {/* Contenido estático */}
          <rect
            x="6"
            y="11"
            width="12"
            height="10"
            fill="#28BC98"
            fillOpacity="0.2"
          />
          
          {/* Marcas de medición */}
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 14h8" />
          <path d="M8 17h8" />
        </svg>
        
        {/* Texto de carga */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[#0B2F33] font-medium">
          Cargando...
        </div>
      </div>
    </div>
  );
}
