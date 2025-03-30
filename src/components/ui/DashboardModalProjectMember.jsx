import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { addMembersToProjectRequest } from "../../actions/members";

export function AddMemberModal({ projectId, onAddMember, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, error } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Track selected users

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

  // Handle user selection (toggle)
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Deselect
        : [...prev, userId] // Select
    );
  };

  const handleAddSelectedMembers = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to add.");
      return;
    }
  
    try {
      const responses = await Promise.all(
        selectedUsers.map(async (userId) => {
          const [error, data] = await addMembersToProjectRequest({
            user_id: userId,
            project_id: projectId,
          });

          return data;
        })
      );
  
      console.log("Users added successfully:", responses);
      setSelectedUsers([]); // Limpiar selección después de agregar
      onClose(); // Cerrar modal después de agregar
    } catch (error) {
      console.error("Error adding members:", error);
      alert("Hubo un error al agregar los miembros.");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

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
        <ul className="mt-4 max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user.carne}
              className="flex items-center justify-between p-2 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.carne)}
                  onChange={() => handleSelectUser(user.carne)}
                  className="mr-2"
                />
                <span>{user.nombre}</span>
              </div>
              <span className="text-gray-500 text-sm">{user.carne}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleAddSelectedMembers}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
          >
            Add Selected Members
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}