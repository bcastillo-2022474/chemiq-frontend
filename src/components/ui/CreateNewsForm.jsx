import { useState } from 'react';

export function CreateNewsForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    img: '',
    tipo: 'general' 
  });

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
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
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
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
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
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
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
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
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
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Crear Noticia
        </button>
      </div>
    </form>
  );
}