import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { addMembersToProjectRequest } from "../../actions/members";

export function AddMemberModal({ projectId, onAddMember, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, error } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (users) {
      const filtered = users.filter(
        (user) =>
          user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.carne.toString().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddSelectedMembers = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to add.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Agregar cada miembro seleccionado
      await Promise.all(
        selectedUsers.map(async (userId) => {
          const [error, data] = await addMembersToProjectRequest({
            user_id: userId,
            project_id: projectId,
          });
          if (error) throw error;
          return data;
        })
      );

      // Llamar a onAddMember para cada usuario seleccionado
      await Promise.all(
        selectedUsers.map(userId => onAddMember(projectId, userId))
      );

      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Error adding members:", error);
      alert("Error al agregar los miembros.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p className="text-center">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p className="text-center text-red-600">Error: {error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Team Members</h2>
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="mt-4 max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No users found</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <li
                  key={user.carne}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.carne)}
                      onChange={() => handleSelectUser(user.carne)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-900">{user.nombre}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{user.carne}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleAddSelectedMembers}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out disabled:bg-indigo-400"
            disabled={isSubmitting || selectedUsers.length === 0}
          >
            {isSubmitting ? "Adding..." : "Add Selected Members"}
          </button>
        </div>
      </div>
    </div>
  );
}