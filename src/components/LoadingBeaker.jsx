import { useState, useEffect } from "react"
import "./LoadingBeaker.css"
import { getColors } from "@/actions/personalization"

export function LoadingBeaker() {
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  })

  const fetchColors = async () => {
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      return
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    )
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    console.log("Fetched colors:", formattedColors)
  }

  useEffect(() => {
    fetchColors()
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
    >
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Anillo de carga */}
        <svg
          className="absolute animate-spin-slow w-40 h-40"
          style={{ color: theme.colors.Primary || '#fc5000' }}
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
          className="w-24 h-24 relative z-10"
          style={{ color: theme.colors.Accent || '#505050' }}
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
            style={{ fill: theme.colors.Primary || '#fc5000', fillOpacity: 0.2 }}
          />
          
          {/* Marcas de medición */}
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 14h8" />
          <path d="M8 17h8" />
        </svg>
        
        {/* Texto de carga */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-medium"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
        >
          Cargando...
        </div>
      </div>
    </div>
  );
}