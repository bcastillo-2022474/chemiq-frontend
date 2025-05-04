import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { addMembersToProjectRequest } from "../../actions/members";
import { getColors } from "@/actions/personalization";

export function AddMemberModal({ projectId, onAddMember, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, error } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(95, 95, 95, 0.5)' }}>
        <div className="rounded-lg p-6" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
          <p className="text-center" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
            Cargando usuarios...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(95, 95, 95, 0.5)' }}>
        <div className="rounded-lg p-6" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
          <p className="text-center" style={{ color: theme.colors.Primary || '#fc5000' }}>
            Error: {error}
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded-md transition duration-150 ease-in-out"
            style={{
              backgroundColor: theme.colors.Background || '#fff8f0',
              color: theme.colors.Tertiary || '#5f5f5f'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(95, 95, 95, 0.5)' }}>
      <div className="rounded-lg p-6 w-full max-w-md" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.Accent || '#505050' }}>
          Add Team Members
        </h2>
        <input
          type="text"
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#fc5000]"
          style={{
            borderColor: theme.colors.Tertiary || '#5f5f5f',
            backgroundColor: theme.colors.Background || '#fff8f0',
            color: theme.colors.Tertiary || '#5f5f5f'
          }}
        />
        <div className="mt-4 max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-center py-4" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
              No users found
            </p>
          ) : (
            <ul style={{ borderColor: theme.colors.Tertiary || '#5f5f5f' }} className="divide-y">
              {filteredUsers.map((user) => (
                <li
                  key={user.carne}
                  className="flex items-center justify-between p-3 transition-colors"
                  style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.carne)}
                      onChange={() => handleSelectUser(user.carne)}
                      className="h-4 w-4 focus:ring-[#fc5000] rounded"
                      style={{
                        color: theme.colors.Primary || '#fc5000',
                        borderColor: theme.colors.Tertiary || '#5f5f5f'
                      }}
                    />
                    <span style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                      {user.nombre}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>
                    {user.carne}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md transition duration-150 ease-in-out"
            style={{
              backgroundColor: theme.colors.Background || '#fff8f0',
              color: theme.colors.Tertiary || '#5f5f5f'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e8df'}
            onMouseLeave={(e) => e.target.style.backgroundColor = theme.colors.Background || '#fff8f0'}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleAddSelectedMembers}
            className="px-4 py-2 rounded-md transition duration-150 ease-in-out"
            style={{
              backgroundColor: selectedUsers.length === 0 || isSubmitting ? '#ffac7f' : theme.colors.Primary || '#fc5000',
              color: theme.colors.Secondary || '#e4e4e4'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && selectedUsers.length > 0) {
                e.target.style.backgroundColor = theme.colors.Accent || '#505050';
                e.target.style.color = theme.colors.Secondary || '#e4e4e4';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting && selectedUsers.length > 0) {
                e.target.style.backgroundColor = theme.colors.Primary || '#fc5000';
                e.target.style.color = theme.colors.Secondary || '#e4e4e4';
              }
            }}
            disabled={isSubmitting || selectedUsers.length === 0}
          >
            {isSubmitting ? "Adding..." : "Add Selected Members"}
          </button>
        </div>
      </div>
    </div>
  );
}