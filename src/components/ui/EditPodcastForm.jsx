import { useState, useEffect } from 'react';
import { getColors } from "@/actions/personalization";

export function EditPodcastForm({ podcast, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    link: ''
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

  useEffect(() => {
    if (podcast) {
      setFormData({
        nombre: podcast.nombre || '',
        link: podcast.link || ''
      });
    }
  }, [podcast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: podcast.id,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
          Nombre del Podcast
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
          Link de YouTube
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc5000] transition-all"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
      </div>

      {formData.link && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
            Vista previa
          </label>
          <iframe
            width="100%"
            height="315"
            src={formData.link}
            title="Vista previa"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-sm font-medium transition-all"
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
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}