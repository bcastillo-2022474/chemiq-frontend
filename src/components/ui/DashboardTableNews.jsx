import { Edit, Trash2 } from "lucide-react";
export const NewsTable = ({ news, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Contenido
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {news.map((newsItem) => (
            <tr key={newsItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <img src={newsItem.img || "/placeholder.svg"} alt={newsItem.titulo} className="w-[160px]  rounded-lg object-cover mr-4" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {newsItem.titulo}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900" style={{width: "140ch"}}>
                {newsItem.contenido}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(newsItem)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  title="Editar"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => onDelete(newsItem.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Eliminar"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};