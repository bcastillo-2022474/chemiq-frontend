import { useState, useEffect } from 'react';
import { getColors } from "@/actions/personalization";

export function CreateNewsForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    img: '',
    tipo: 'general' 
  });
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  });

  const fetchColors = async () => {
    const [error, colors] = await getColors();
    if (error) {
      console.error("Error fetching colors:", error);
      return;
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    );
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }));
    console.log("Fetched colors:", formattedColors);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
          Título
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
      </div>

      <div>
        <label htmlFor="contenido" className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
          Contenido
        </label>
        <textarea
          id="contenido"
          name="contenido"
          value={formData.contenido}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
      </div>

      <div>
        <label htmlFor="img" className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
          URL de la imagen
        </label>
        <input
          type="url"
          id="img"
          name="img"
          value={formData.img}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
      </div>

      <div>
        <label htmlFor="tipo" className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        >
          <option value="general">General</option>
          <option value="evento">Evento</option>
          <option value="noticia">Noticia</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md transition-all"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            color: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
          onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
          style={{
            backgroundColor: theme.colors.Primary || '#fc5000',
            color: theme.colors.Secondary || '#e4e4e4'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.Accent || '#505050';
            e.target.style.color = theme.colors.Secondary || '#e4e4e4';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.Primary || '#fc5000';
            e.target.style.color = theme.colors.Secondary || '#e4e4e4';
          }}
        >
          Crear Noticia
        </button>
      </div>
    </form>
  );
}