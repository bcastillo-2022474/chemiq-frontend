
import { useState, useEffect } from 'react';

export function EditPodcastForm({ podcast, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    link: ''
  });

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
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre del Podcast
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700">
          Link de YouTube
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      {formData.link && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}