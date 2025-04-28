// utils/colors.js

// Genera un color RGB aleatorio con opacidad específica
export function generateRandomColor(opacity = 1) {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  
  // Genera un array de colores aleatorios
  export function generateRandomColors(count, opacity = 1) {
    return Array.from({ length: count }, () => generateRandomColor(opacity))
  }