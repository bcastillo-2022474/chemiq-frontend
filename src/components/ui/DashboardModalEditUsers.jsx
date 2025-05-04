import { useState, useEffect } from "react"
import { getColors } from "@/actions/personalization"

export function Modal({ isOpen, onClose, children, title }) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backgroundColor: 'rgba(95, 95, 95, 0.5)' }}>
      <div className="relative rounded-2xl shadow-xl w-full max-w-lg p-8" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-all"
          aria-label="Close"
          style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
          onMouseEnter={(e) => e.target.style.color = theme.colors.Accent || '#505050'}
          onMouseLeave={(e) => e.target.style.color = theme.colors.Tertiary || '#5f5f5f'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Título del modal */}
        {title && (
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: theme.colors.Accent || '#505050' }}>
            {title}
          </h2>
        )}

        {/* Contenido del modal */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}