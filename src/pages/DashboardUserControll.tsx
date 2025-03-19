import { useState } from 'react';
import Swal from 'sweetalert2';
import { Modal } from '../components/ui/DashboardModalEditUsers.js';
import { UserTable } from '../components/ui/DashboardTableUsers.js';
import { useUsers } from '../hooks/useUsers';


export default function Home() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleEdit = (user) => {
    console.log("soy el usuario a editar " + user);
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId) => {
    console.log("Usuario a eliminar: " + userId);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId);
        Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
      }
    });
  };

  const handleSave = (updatedUser) => {
    updateUser(updatedUser.carne, updatedUser);
    setIsModalOpen(false);
    Swal.fire("Guardado!", "La información del usuario ha sido actualizada.", "success");
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex-1 overflow-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
      {loading ? (
        <div>Cargando..</div>

      ) : (
        // Muestra la tabla cuando la data está lista
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete}/>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Editar Usuario">
        {editingUser && (
          <EditUserForm
            user={editingUser}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </main>
  );
}

function EditUserForm({ user, onSave, onCancel }) {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={editedUser.nombre || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div>
        <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={editedUser.correo || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div>
        <label htmlFor="rol_id" className="block text-sm font-medium text-gray-700">Rol</label>
        <input
          id="rol_id"
          name="rol_id"
          value={editedUser.rol_id || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      <div className="flex justify-end space-x-4">
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