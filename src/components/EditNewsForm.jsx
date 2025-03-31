
import { useState, useEffect } from 'react';

export function EditNewsForm({ news, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    img: '',
    tipo: ''
  });

  useEffect(() => {
    if (news) {
      setFormData({
        titulo: news.titulo || '',
        contenido: news.contenido || '',
        img: news.img || '',
        tipo: news.tipo || 'general'
      });
    }
  }, [news]);

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
      id: news.id,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div>
        <label htmlFor="contenido" className="block text-sm font-medium text-gray-700">
          Contenido
        </label>
        <textarea
          id="contenido"
          name="contenido"
          value={formData.contenido}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div>
        <label htmlFor="img" className="block text-sm font-medium text-gray-700">
          URL de la imagen
        </label>
        <input
          type="url"
          id="img"
          name="img"
          value={formData.img}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        >
          <option value="general">General</option>
          <option value="evento">Evento</option>
          <option value="noticia">Noticia</option>
        </select>
      </div>

      {/* Vista previa de la imagen */}
      {formData.img && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista previa de la imagen
          </label>
          <img
            src={formData.img}
            alt="Vista previa"
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400?text=Error+al+cargar+imagen';
            }}
          />
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}