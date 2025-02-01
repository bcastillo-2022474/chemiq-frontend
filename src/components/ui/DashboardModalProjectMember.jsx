import React, { useState, useEffect } from "react";
import { useUsers } from "../../hooks/useUsers";


export function AddMemberModal({ projectId, onAddMember, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, error } = useUsers(); // Usa el customHook para obtener usuarios
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Filtrar usuarios basado en el término de búsqueda
  useEffect(() => {
    if (users) {
      const filtered = users.filter(
        (user) =>
          user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.carne.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Manejar la adición de un miembro
  const handleAddMember = (userId) => {
    onAddMember(projectId, userId);
  };

  // Mostrar un mensaje de carga o error si es necesario
  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Team Member</h2>
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <ul className="mt-4 max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user.carne}
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAddMember(user.carne)}
            >
              <span>{user.nombre}</span>
              <span className="text-gray-500 text-sm">{user.carne}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}